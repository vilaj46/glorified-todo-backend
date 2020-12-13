import express from "express";
import jwt_decode from "jwt-decode";

const router = express.Router();

router.use((req, res, next) => {
  const authorization = req.get("Authorization");
  const token = authorization.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // console.log(req.cookies);
  console.log(req);

  const { session_id } = req.cookies;

  if (session_id === undefined) {
    return res.sendStatus(403);
  }

  const decodedCookie = jwt_decode(session_id);

  if (
    Date.now() >= decodedToken.exp * 1000 ||
    Date.now() >= decodedCookie * 1000
  ) {
    return res.sendStatus(401);
  } else {
    next();
  }
});

export default router;
