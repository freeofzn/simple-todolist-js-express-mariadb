const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const mybatisMapper = require("mybatis-mapper");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json()); // req.body parser !!

const dbconfig = {
  host: "localhost",
  user: "user1",
  password: "1234",
  database: "mydb",
};

const dbconn = mysql.createConnection(dbconfig);
mybatisMapper.createMapper(["./todolistMapper.xml"]);

// foo
app.get("/foo", (req, res) => {
  res.send("Hello World!");
});

// select test
app.get("/selectTest", (req, res) => {
  dbconn.query("SELECT * FROM TODO_LIST", (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

/**
 * TodoList 전체이력조회
 * @param
 * @return
 */
app.get("/selectTodoListHistory", (req, res) => {
  var param = {};
  var format = { language: "sql", indent: "  " };
  var query = mybatisMapper.getStatement("todolist", "selectTodoListHistory", param, format);
  dbconn.query(query, (error, rows) => {
    if (error) throw error;
    res.send(rows);
  });
});

/**
 * TodoList 조회
 * @param
 * @return
 */
app.get("/selectTodoList", (req, res) => {
  var param = { TL_DATE: req.query.TL_DATE };
  var format = { language: "sql", indent: "  " };
  var query = mybatisMapper.getStatement("todolist", "selectTodoList", param, format);
  dbconn.query(query, (error, rows) => {
    if (error) throw error;
    res.send(rows);
  });
});

/**
 * TodoList 저장
 * @param
 * @return
 */
app.post("/saveTodoList", function (req, res) {
  let row = req;
  let rstMst = "저장성공";

  req.body.TODO_LIST_ARR.forEach(function (row) {
    param = {
      TL_TITLE: row.title,
      ALT_USER: "loginid",
    };

    var format = { language: "sql", indent: "  " };
    var query = mybatisMapper.getStatement("todolist", "insertTodo", param, format);
    dbconn.query(query, function (err, result) {
      if (err) throw err;
    });
  });

  res.json(JSON.stringify({ RST_MSG: rstMst }));
});

/**
 *  TodoList 삭제
 * @param
 * @return
 */
app.post("/deleteTodoListHistory", function (req, res) {
  let rstMst = "저장성공";
  param = { TL_DATE: req.body.TL_DATE };
  var format = { language: "sql", indent: "  " };
  var query = mybatisMapper.getStatement("todolist", "deleteTodoList", param, format);
  dbconn.query(query, function (err, result) {
    if (err) throw err;
  });
  res.json(JSON.stringify({ RST_MSG: rstMst }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
