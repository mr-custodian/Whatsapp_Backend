import express from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from '../Models/db.js';
//import User from "../Models/User"

function createFrontPageRoutes(io) {
const FrontPageRoutes = express.Router();

/*
AuthorizationRoutes.get('/test', (req, res) => {
  res.send('GET route working!');
});*/

FrontPageRoutes.get("/:id", (req, res) => {
    console.log("ggggg");
const userId = parseInt(req.params.id);
  console.log("User ID:", userId);

  const query = `
    SELECT 
    c.*,
    u.name AS other_user_name,
    u.dp AS other_user_dp,
    CASE 
        WHEN c.sender_id = ? THEN 'You : '
        ELSE ''
    END AS prefix,
    CASE 
        WHEN c.sender_id = ? THEN c.reciever_id
        ELSE c.sender_id
    END AS contact_id
FROM chat c
JOIN (
    SELECT 
        LEAST(sender_id, reciever_id) AS user1,
        GREATEST(sender_id, reciever_id) AS user2,
        MAX(timing) AS latest_time
    FROM chat
    WHERE sender_id = ? OR reciever_id = ?
    GROUP BY LEAST(sender_id, reciever_id), GREATEST(sender_id, reciever_id)
) latest_chats
ON (
    LEAST(c.sender_id, c.reciever_id) = latest_chats.user1 AND
    GREATEST(c.sender_id, c.reciever_id) = latest_chats.user2 AND
    c.timing = latest_chats.latest_time
)
JOIN users u ON (
    (u.id = c.sender_id AND c.sender_id != ?) OR 
    (u.id = c.reciever_id AND c.reciever_id != ?)
)
ORDER BY c.timing DESC;`;

  db.query(query, [userId, userId,userId, userId,userId, userId], (err, results) => {
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
FrontPageRoutes.post("/signup", (req, res) => {
  const { name,email,password, age, mobile, dp } = req.body;
  console.log({ name,email,password, age, mobile, dp });

  // 1. Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ msg: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2. Insert new user
    db.query('INSERT INTO users (name,email,password, age, mobile, dp) VALUES (?, ?,?, ?,?, ?)', [name,email,password, age, mobile, dp], (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ msg: "Failed to create user" });
      }

      res.status(201).json({ msg: "Signup successful", userId: result.insertId });
    });
  });
});


return FrontPageRoutes;

}

export default createFrontPageRoutes; // ✅ export as function now
