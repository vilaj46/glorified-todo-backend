import express from "express";
import jwt_decode from "jwt-decode";

import User from "../../models/User";

import validateAuthentication from "../../middleware/validateAuthentication";

const router = express.Router({ mergeParams: true });

router.use(validateAuthentication, async (req, res) => {
  const { id } = req.params;
  const profile = req.body;

  User.findByIdAndUpdate(id, { profile }, (err, doc) => {
    if (err) return res.sendStatus(500); // Not sure, something went wrong. Could not find user.
  })
    .then(async (updatedDoc) => {
      const newToken = await updatedDoc.createJWT();
      return res.status(200).send({ token: newToken });
    })
    .catch((err) => {
      // User not found.
      return res.sendStatus(500);
    });
});

export default router;
