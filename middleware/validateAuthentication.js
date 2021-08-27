import express from "express";
import jwt_decode from "jwt-decode";

const router = express.Router();

router.use((req, res, next) => {
  const authorization = req.get("Authorization");
  let token;
  let decodedToken;

  if (authorization === undefined) {
    // Authorization token was undefined in local machine.
    token = req.body.headers.Authorization.split(" ")[1];
  } else {
    token = authorization.split(" ")[1];
  }

  decodedToken = jwt_decode(token);

  if (
    Date.now() >=
    decodedToken.exp * 1000
    // || Date.now() >= decodedCookie * 1000
  ) {
    return res.sendStatus(401);
  } else {
    next();
  }
});

export default router;
