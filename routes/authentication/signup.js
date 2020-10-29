import bcrypt from "bcrypt";
import express from "express";

import User, { defaultValues } from "../../models/User";

const router = express.Router();

router.use(async (req, res) => {
  const { username, email, password } = req.body;

  // Search if username or email is in use.
  const foundByUsername = await User.findOne({ username });
  const foundByEmail = await User.findOne({ email });

  if (foundByUsername === null && foundByEmail === null) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        // Internal Server Error.
        return res.status(500).send("Something went wrong with encryption.");
      } else {
        // Create new user.
        const userData = defaultValues({ username, hash, email });
        const newUser = new User(userData);

        newUser.save(async (err) => {
          if (err) {
            // Internal Server Error.
            return res.status(500).send("Could not save new user.");
          } else {
            // return jwt and data.
            const token = await newUser.createJWT();
            const cookie = await newUser.createCookie();
            res.cookie("session_id", cookie.data, {
              maxAge: cookie.maxAge,
              httpOnly: true,
            });
            return res.json(token);
          }
        });
      }
    });
  } else {
    // Already an account with that username or email.
    let userInUse = false;
    let emailInUse = false;
    if (foundByUsername !== null) {
      userInUse = true;
    }

    if (foundByEmail !== null) {
      emailInUse = true;
    }

    if (userInUse && emailInUse) {
      return res.status(406).send("username email");
    } else if (userInUse) {
      return res.status(406).send("username");
    } else if (emailInUse) {
      return res.status(406).send("email");
    } else {
      return res.status(400);
    }
  }
});

export default router;
