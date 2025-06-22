import express from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from '../Models/db.js';
//import User from "../Models/User"

function createAuthorizationRoutes(io) {

const AuthorizationRoutes = express.Router();

/*
AuthorizationRoutes.get('/test', (req, res) => {
  res.send('GET route working!');
});*/

AuthorizationRoutes.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ msg: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ msg: "Login successful", user });
  });
});
//
AuthorizationRoutes.post("/signup", (req, res) => {
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


return AuthorizationRoutes;
}

export default createAuthorizationRoutes;
