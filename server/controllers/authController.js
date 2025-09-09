import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.join(__dirname, "../data/users.json");

function loadUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register
export const registerUser = (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { username, password: hashedPassword, notes: [] };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "User registered" });
};

// Login
export const loginUser = (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "Invalid username" });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "1h" }
  );

  res.json({ token });
};

// Protected
export const getProtected = (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected` });
};

export const getUsers = (req, res) => {
  const users = loadUsers();
  res.json(users.map((u) => ({ username: u.username })));
};

export const authVerify = (req, res) => {
  res.json({
    valid: true,
    username: req.user.username,
  });
};
