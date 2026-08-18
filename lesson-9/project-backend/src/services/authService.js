import {randomUUID} from "node:crypto";

import Session from "../db/models/Session.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/authConstants.js";


export const createSession = async userId => Session.create({
    userId,
    accessToken: randomUUID(),
    refreshToken: randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
  });

  export const setSessionCookies = (res, session) => {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie("accessToken", session.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: accessTokenLifeTime,
    });

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: refreshTokenLifeTime,
    });

        res.cookie("sessionId", session._id, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: refreshTokenLifeTime,
    });
  }
