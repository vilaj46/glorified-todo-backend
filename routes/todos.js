import express from "express";

import User from "../models/User";
import validateAuthentication from "../middleware/validateAuthentication.js";

const router = express.Router({ mergeParams: true });

router.use(validateAuthentication);

router.post("/", (req, res) => {
  const { userID } = req.params;
  const newItem = req.body;

  User.findById(userID, async (err, doc) => {
    if (err) return res.sendStatus(500); // Not sure, something went wrong. Could not find user.

    const { todos } = doc;
    todos.push(newItem);
    doc.todos = todos;
    await doc.save();
    const token = await doc.createJWT();
    return res.json(token);
  }).catch((err) => {
    // User not found.
    return res.sendStatus(500);
  });
});

router.put("/:todoID", (req, res) => {
  const { userID, todoID } = req.params;
  const newItem = req.body;
  User.findById(userID, async (err, doc) => {
    if (err) return res.sendStatus(500); // Not sure, something went wrong. Could not find user.

    const { todos } = doc;
    const { index } = newItem;
    delete newItem.index;

    if (todos[index].IDNumber === todoID) {
      todos[index] = { ...newItem };
      doc.todos = [...todos];
      doc.markModified("todos");
      doc.save();
      const token = await doc.createJWT();
      return res.json(token);
    } else {
      return res.sendStatus(500);
    }
  }).catch((err) => {
    // User not found.
    return res.sendStatus(500);
  });
});

router.delete("/:todoID/:index", (req, res) => {
  const { userID, index, todoID } = req.params;

  User.findById(userID, async (err, doc) => {
    if (err) return res.sendStatus(500); // Not sure, something went wrong. Could not find user.

    const { todos } = doc;

    if (todos[index].IDNumber === todoID) {
      todos.splice(index, 1);
      doc.todos = [...todos];
      doc.markModified("todos");
      doc.save();
      const token = await doc.createJWT();
      return res.json(token);
    } else {
      let searchedIndex = undefined;
      for (let i = 0; i < todos.length; i++) {
        const currentTodo = todos[i];
        if (currentTodo.IDNumber === todoID) {
          searchedIndex = i;
          break;
        }
      }
      if (searchedIndex >= 0 && searchedIndex != undefined) {
        todos.splice(searchedIndex, 1);
        doc.todos = [...todos];
        doc.markModified("todos");
        doc.save();
        const token = await doc.createJWT();
        return res.json(token);
      }
    }
  }).catch((err) => {
    // User not found.
    return res.sendStatus(500);
  });
});

export default router;
