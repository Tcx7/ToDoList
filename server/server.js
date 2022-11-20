const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const bodyparser = require("body-parser"); //middleware
dotenv.config();
const dbService = require("./connection"); // connects to connection.js

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/api/insert", (req, res) => {
  // sanitization
  const ID = req.body.ID;
  const Task = req.body.Task;
  const isComplete = req.body.isComplete;
  console.log(ID);
  const sqlInsert = "INSERT INTO ToDoTable(ID, Task, isComplete) VALUES(?,?,?)";
  dbService.query(sqlInsert, [ID, Task, isComplete], (err, res) => {
    console.log(res);
  });
});
//read
//grab data when loaded
app.get("/api/getAll", (req, res) => {
  const sqlSelect = "SELECT * FROM ToDoTable";
  dbService.query(sqlSelect, (err, result) => {
    res.send(result);
    // console.log(res.result);
  });
});

//grab completed tasks
app.get("/api/getComp", (req, res) => {
  const compSelect =
    "SELECT ID,Task,isComplete FROM TodoTable WHERE isComplete =1";
  dbService.query(compSelect, (err, result) => {
    res.send(result);
  });
});

//update to DB
app.put("/api/updateComp", (req, res) => {
  const isCompleteID = req.body.ID;
  const updateComp = "UPDATE ToDoTable SET isComplete = 1 WHERE id = ?";
  dbService.query(updateComp, [isCompleteID], (err, res) => {
    console.log(res);
  });
});

//delete from DB
app.delete("/api/delete/:id", (req, res) => {
  // const isDeletedID = req.body;
  const deleteTask = "DELETE FROM TodoTable WHERE id =?";
  dbService.query(deleteTask, [req.params.id], (err, result) => {
    console.log(res.result);
  });
});

app.listen(process.env.PORT, () => {
  console.log("app is listening to port 3001");
});
