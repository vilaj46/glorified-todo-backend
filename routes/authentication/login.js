import express from "express";

import User from "../../models/User";

const router = express.Router();

router.use(async (req, res, next) => {
  const { username, password } = req.body;
  // Search if username exists.
  const foundByUsername = await User.findOne({ username });

  if (foundByUsername !== null) {
    const isValidPassword = await foundByUsername.checkPassword(password);
    if (isValidPassword) {
      const token = await foundByUsername.createJWT();
      const cookie = await foundByUsername.createCookie();
      res.cookie("session_id", cookie.data, {
        maxAge: cookie.maxAge,
        httpOnly: true,
      });
      res.json(token);
    } else {
      res.status(406).send("password");
    }
  } else if (foundByUsername === null) {
    // Username was not found.
    res.status(406).send("username");
  } else {
    // Something else went wrong.
    res.status(400);
  }
  next();
});

export default router;
