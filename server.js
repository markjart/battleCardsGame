var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var db = require("./models");
var PORT = process.env.PORT || 3000;

// Method override for RESTFul form submissions
app.use(methodOverride("_method"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, "public")));

// Handlebars config -----------------
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

// Route config -----------------
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

// Starting the server, syncing our models -----------------
db.sequelize.sync().then(function() {
  server.listen(PORT, function() {
    console.info(
      "==> Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});

// Chatroom
var numUsers = 0;

io.on("connection", function (socket) {
  var addedUser = false;
  // when the client emits "new message", this listens and executes
  socket.on("new message", function (data) {
    // we tell the client to execute "new message"
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data
    }); //console.log(socket.username + ": " + data)
  });
  // when the client emits "add user", this listens and executes
  socket.on("add user", function (username) {
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers
    });
  });
  // when the client emits "typing", we broadcast it to others
  socket.on("typing", function () {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });
  // when the client emits "stop typing", we broadcast it to others
  socket.on("stop typing", function () {
    socket.broadcast.emit("stop typing", {
      username: socket.username
    });
  });
  // when the user disconnects.. perform this
  socket.on("disconnect", function () {
    if (addedUser) {
      --numUsers;
      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});








