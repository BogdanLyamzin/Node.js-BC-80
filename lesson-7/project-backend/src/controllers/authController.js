import createHttpError from "http-errors";
import bcrypt from "bcrypt";


import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { createSession, setSessionCookies } from "../services/authService.js";

// const salt = await bcrypt.genSalt(10);
// console.log(salt);
// const hash = await bcrypt.hash("123456", 10);
// console.log(hash);
// const compareResult1 = await bcrypt.compare("123456", hash);
// console.log(compareResult1)
// const compareResult2 = await bcrypt.compare("123457", hash);
// console.log(compareResult2)

export const registerUser = async(req, res)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(user) throw createHttpError(400, "Email already in use");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({...req.body, password: hashPassword});

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
}

export const loginUser = async(req, res)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(!user) throw createHttpError(401, "Invalid email or password");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare) throw createHttpError(401, "Invalid email or password");

  await Session.deleteOne({userId: user._id});

  const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);

  res.json(user);
}
