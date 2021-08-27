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

router.put("/:todoIDs/:todoIndexes", (req, res) => {
  const { userID, todoIDs, todoIndexes } = req.params;
  const todo1IDNumber = todoIDs.split("-")[0];
  const todo1Index = todoIndexes.split("-")[0];
  const todo2IDNumber = todoIDs.split("-")[1];
  const todo2Index = todoIndexes.split("-")[1];
  User.findById(userID, async (err, doc) => {
    if (err) return res.sendStatus(500); // Not sure, something went wrong. Could not find user.

    const { todos } = doc;
    if (
      todos[todo1Index].IDNumber === todo1IDNumber &&
      todos[todo2Index].IDNumber === todo2IDNumber
    ) {
      // All good
      const temp = todos[todo2Index];
      todos[todo2Index] = todos[todo1Index];
      todos[todo1Index] = temp;
      doc.todos = [...todos];
      doc.markModified("todos");
      doc.save();
      const token = await doc.createJWT();
      return res.json(token);
    } else {
      // Messy needs to be cleaned up.
      let found1 = "undefined";
      let found1Index = -1;
      if (todos[todo1Index].IDNumber !== todo1IDNumber) {
        for (let i = 0; i < todos.length; i++) {
          const currentTodo = todos[i];
          if (currentTodo.IDNumber === todo1IDNumber) {
            found1 = currentTodo;
            found1Index = i;
          }
        }
      }

      let found2 = "undefined";
      let found2Index = -1;
      if (todos[todo2Index].IDNumber === todo2IDNumber) {
        // Find item2 index

        for (let i = 0; i < todos.length; i++) {
          const currentTodo = todos[i];
          if (currentTodo.IDNumber === todo1IDNumber) {
            found2 = currentTodo;
            found2Index = i;
          }
        }
      }

      let found1Length = 0;
      let found2Length = 0;

      if (found1 !== "undefined") {
        found1Length = Object.keys(found1).length;
      }

      if (found2 !== "undefined") {
        found2Length = Object.keys(found2).length;
      }

      if (found1 === "undefined" && found2 === "undefined") {
        return res.sendStatus(500);
      } else if (found1Length > 0 && found2Length > 0) {
        // Use both founds
        todos[found1Index] = found2;
        todos[found2Index] = found1;
        doc.todos = [...todos];
        doc.markModified("todos");
        doc.save();
        const token = await doc.createJWT();
        return res.json(token);
      } else if (found1Length > 0 && found2 === "undefined") {
        // Use found1 and use todo2
        todos[found1Index] = todos[todo2Index];
        todos[todo2Index] = found1;
        doc.todos = [...todos];
        doc.markModified("todos");
        doc.save();
        const token = await doc.createJWT();
        return res.json(token);
      } else if (found2Length > 0 && found1 === "undefined") {
        // Use found2 and use todo1
        todos[found2Index] = todos[todo1Index];
        todos[todo1Index] = found2;
        doc.todos = [...todos];
        doc.markModified("todos");
        doc.save();
        const token = await doc.createJWT();
        return res.json(token);
      } else {
        return res.sendStatus(500);
      }
    }
  }).catch((err) => {
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
