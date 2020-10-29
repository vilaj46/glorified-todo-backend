import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  console.log(passport);
  console.log(Strategy);
});

export default router;
