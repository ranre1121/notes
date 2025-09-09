import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../data/users.js";

const SECRET_KEY = "your_secret_key"; // later: process.env.JWT_SECRET

// Register
export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    password: hashedPassword,
    notes: [],
  };
  users.push(newUser);
  res.json({ message: "User registered successfully" });
};

// Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
};

// Protected
export const getProtected = (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected` });
};

export const getUsers = (req, res) => {
  res.json({ users: users });
};

export const authVerify = (req, res) => {
  res.json({
    valid: true,
    username: req.user.username,
  });
};
