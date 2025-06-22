import express from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from '../Models/db.js';
//import User from "../Models/User"

function createPersonalPageRoutes(io) {

const PersonalPageRoutes = express.Router();

/*
AuthorizationRoutes.get('/test', (req, res) => {
  res.send('GET route working!');
});*/

PersonalPageRoutes.get("/:Id/:contact_Id", (req, res) => {
const userId = parseInt(req.params.Id);
const contact_Id = parseInt(req.params.contact_Id);
  console.log("User ID:", userId);
  console.log("Contact ID:", contact_Id);

  const query = `
    SELECT 
    c.*,
    sender.name AS sender_name,
    receiver.name AS receiver_name
    FROM chat c
    JOIN users sender ON sender.id = c.sender_id
    JOIN users receiver ON receiver.id = c.reciever_id
    WHERE 
        (c.sender_id = ? AND c.reciever_id = ?) 
        OR 
        (c.sender_id = ? AND c.reciever_id = ?)
    ORDER BY c.timing ASC;`;

  db.query(query, [userId, contact_Id, contact_Id,userId], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ msg: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "No chats found" });
    }

    res.json({ msg: "Latest chats fetched", chats: results }); // chats have all the chat and info
  });
});
//
PersonalPageRoutes.post("/", (req, res) => {
  const data = req.body;
  console.log("New chat received:", [data.sender_id, data.reciever_id, data.timing, data.chatstr]);

  const query = `INSERT INTO chat (sender_id, reciever_id, timing, chatstr) VALUES (?, ?, ?, ?)`;

  db.query(query, [data.sender_id, data.reciever_id, data.timing, data.chatstr], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ msg: "Server error" });
    }

    res.json({ 
      msg: "Message sent successfully", 
      chat_id: result.insertId // optionally return the inserted message ID
    });
  });
});



return PersonalPageRoutes;

}

export default createPersonalPageRoutes;