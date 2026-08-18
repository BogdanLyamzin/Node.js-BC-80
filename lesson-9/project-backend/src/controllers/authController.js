import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import Handlebars from "handlebars";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";

import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

import { createSession, setSessionCookies } from '../services/authService.js';
import sendEmail from "../services/sendEmail.js";

const {BASE_URL, JWT_SECRET} = process.env;

const verifyEmailPath = resolve("src", "templates", "verify-email.html");
const templateSource = await readFile(verifyEmailPath, "utf-8");

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw createHttpError(400, 'Email already in use');

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  const payload = {
    email
  };
  const verifyToken = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});

  const template = Handlebars.compile(templateSource);
  const html = template({
    username: newUser.username,
    link: `${BASE_URL}/verify?token=${verifyToken}`
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html,
  };
  await sendEmail(verifyEmail);

  res.status(201).json(newUser);
};

export const verifyUser = async(req, res)=> {
  const {token} = req.body;
  try {
    const {email} = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({email});
    if(!user) throw createHttpError(401, "User not found");
    user.verify = true;
    await user.save();
    res.json({
      message: "Email verify successfully"
    })
  }
  catch(error) {
    throw createHttpError(401, error.message);
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  if(!user.verify) throw createHttpError(401, 'Email not verified');

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createHttpError(401, 'Invalid email or password');

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId } = req.cookies;
  const session = await Session.findOne({ _id: sessionId });
  if (!session) throw createHttpError(401, 'Session not found');

  if (session.refreshTokenValidUntil < new Date())
    throw createHttpError(401, 'Session token expired');

  await Session.deleteOne({ _id: sessionId });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).send();
};
