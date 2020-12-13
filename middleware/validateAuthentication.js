import express from "express";
import jwt_decode from "jwt-decode";

const router = express.Router();

router.use((req, res, next) => {
  const authorization = req.get("Authorization");
  const token = authorization.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // const { session_id } = req.cookies;
  // const { authorization } = req.headers;

  // if (
  //   session_id === undefined &&
  //   (uthorization.length === 0 || authorization === undefined)
  // ) {
  //   return res.sendStatus(403);
  // }

  // let decodedCookie;

  // const decodedCookie = jwt_decode(session_id);

  // if (session_id) {
  //   decodedCookie = jwt_decode(session_id);
  // } else if (authorization) {
  //   console.log(authorization.split(" ")[1]);
  //   decodedCookie = jwt_decode(authorization.split(" ")[1]);
  // }

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
