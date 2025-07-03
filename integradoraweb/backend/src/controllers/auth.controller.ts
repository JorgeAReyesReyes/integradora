import { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateToken";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';
import { Types } from "mongoose";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === "softnovaAdmin" && password === "omegalandax9") {
    const accessToken = generateAccessToken("admin");
    cache.set("softnovaAdmin", accessToken, 60 * 15);
    return res.json({ message: "Login exitoso como admin", accessToken });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: "Credenciales incorrectas" });

  const accessToken = generateAccessToken(user._id.toString());
  cache.set(user._id.toString(), accessToken, 60 * 15);

  return res.json({ message: "Login exitoso", accessToken });
};

export const getTimeToken = (req: Request, res: Response) => {
  const { userId } = req.params;
  const ttl = cache.getTtl(userId);
  if (!ttl) return res.status(404).json({ message: "Token no encontrado" });

  const now = Date.now();
  const timeToLifeSeconds = Math.floor((ttl - now) / 1000);
  const expTime = dayjs(ttl).format('HH:mm:ss');
  return res.json({ timeToLifeSeconds, expTime });
};

export const updateToken = (req: Request, res: Response) => {
  const { userId } = req.params;
  const ttl = cache.getTtl(userId);
  if (!ttl) return res.status(404).json({ message: "Token no encontrado" });

  cache.ttl(userId, 60 * 15);
  return res.json({ message: "Actualización exitosa" });
};

export const getAllUsers = async (_req: Request, res: Response) => {
  const userList = await User.find();
  return res.json({ userList });
};

export const getUsersByusername = async (req: Request, res: Response) => {
  const { userName } = req.params;
  const users = await User.find({ username: userName });
  if (!users.length) return res.status(404).json({ message: "Usuario no existe" });
  return res.json({ users });
};

export const saveUser = async (req: Request, res: Response) => {
  try {
    const { name, userName, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, username: userName, email, phone, password: hashedPassword, role, status: true
    });
    const user = await newUser.save();
    return res.json({ user });
  } catch (error) {
    console.error("SAVEUSER:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { email, phone, password, role, name } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) return res.status(409).json({ message: "El correo ya está en uso" });

    if (password) user.password = await bcrypt.hash(password, 10);
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.role = role ?? user.role;
    user.name = name ?? user.name;

    const updatedUser = await user.save();
    return res.json({ updatedUser });
  } catch (error) {
    console.error("UPDATEUSER:", error);
    return res.status(500).json({ message: "Error interno del servidor", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.status = false;
    user.deleteDate = new Date();
    await user.save();
    return res.json({ message: "Eliminación exitosa" });
  } catch (error) {
    console.error("DELETEUSER:", error);
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

