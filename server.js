var exphbs = require("express-handlebars");
var express = require("express");
var mysql = require("mysql");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "tasks_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Serve index.handlebars to the root route.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM tasks;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { tasks: data });
  });
});

// Show the user the individual task_name and the form to update the task_name.
app.get("/:id", function(req, res) {
  connection.query("SELECT * FROM tasks where id = ?", [req.params.id], function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    console.log(data);
    res.render("single-task_name", data[0]);
  });
});

app.post("/api/tasks", function(req, res) {
  connection.query("INSERT INTO tasks (task_name, task_description,status, due_date) VALUES (?, ?, ?, ?)", [req.body.task_name, req.body.task_dec, req.body.status, req.body.due_date], function(
    err,
    result
  ) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }

    // Send back the ID of the new task_name
    res.json({ id: result.insertId });
  });
});

app.delete("/api/tasks/:id", function(req, res) {
  connection.query("DELETE FROM tasks WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();

  });
});

// Update a task_name by an id and then redirect to the root route.
app.put("/api/tasks/:id", function(req, res) {
  connection.query(
    "UPDATE tasks SET task_description = ?, task_name = ?, status = ?, due_date = ? WHERE id = ?",
    [req.body.task_desc, req.body.task_name, req.body.status,req.body.due_date,req.params.id],
    function(err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();

    }
  );
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
