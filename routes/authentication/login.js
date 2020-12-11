import express from "express";

import User from "../../models/User";

const router = express.Router();

router.use(async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Search if username exists.
  const foundByUsername = await User.findOne({ username });

  console.log(foundByUsername);

  if (foundByUsername !== null) {
    console.log("Found username");
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
    console.log("Did not find username");
    // Username was not found.
    res.status(406).send("username");
  } else {
    // Something else went wrong.
    console.log("Did not find username 2");
    res.status(400);
  }
  next();
});

export default router;
