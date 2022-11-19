var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
var fs = require("fs");

var conString = "mongodb+srv://jancy:jancy@cluster0.h3tx5gi.mongodb.net/?retryWrites=true&w=majority";
var app = express();
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(express.static(__dirname + "./ui"));

app.post("/loginUser", (req, res) => {
  const userObj = {
    Email: req.body.Email,
    Password: req.body.Password,
  };
  mongoClient.connect(conString, (err, clientObject) => {
    let statusCode, message;
    if (!err) {
      const database = clientObject.db("cointabcustomers");

      database
        .collection("customers")
        .findOne(userObj, (collectionErr, result) => {
          if (!collectionErr) {
            if (!!result) {
              const { attempts } = result;
              if (attempts > 4) {
                res.status(400).send({
                  statusCode: 400,
                  message: "User has been locked!!",
                });
              } else {
                database
                  .collection("customers")
                  .updateOne(
                    { Email: userObj.Email },
                    { $set: { attempts: 0 } },
                    (collectionErr, result) => {
                      res
                        .status(200)
                        .send({ statusCode: 200, message: "Login Successful" });
                    }
                  );
              }
            } else {
              const Email = userObj.Email;
              database
                .collection("customers")
                .findOne({ Email }, (collectionErr, result) => {
                  if (result) {
                    const { attempts = 0 } = result;
                    if (attempts > 4) {
                      console.log("Attempts Reached");
                      res.status(400).send({
                        statusCode: 400,
                        message: "User has been locked!!",
                      });
                      return;
                    } else {
                      const nextAttempts = attempts + 1;
                      database
                        .collection("customers")
                        .updateOne(
                          { Email },
                          { $set: { attempts: nextAttempts } },
                          (collectionErr, result) => {}
                        );
                      console.log("Increasing Attempts");
                      res.status(400).send({
                        statusCode: 400,
                        message: "Username and password are invalid",
                      });
                    }
                  } else {
                    res.status(400).send({
                      statusCode: 400,
                      message: "Username and password are invalid",
                    });
                  }
                });
            }
          } else {
            res.sendStatus(500);
          }
        });
    } else {
    }
  });
});

app.get("/users", (req, res) => {
  mongoClient.connect(conString, (err, clientObject) => {
    if (!err) {
      var database = clientObject.db("cointabcustomers");
      database
        .collection("customers")
        .find({})
        .toArray((err, users) => {
          if (!err) {
            res.send(users);
            res.end();
          }
        });
    }
  });
});

app.get("/userDetails/:Email", (req, res) => {
  const Email = req.params.Email;
  mongoClient.connect(conString, (err, clientObject) => {
    if (!err) {
      var database = clientObject.db("cointabcustomers");
      database.collection("customers").findOne({ Email }, (err, document) => {
        if (!err) {
          console.log(document);
          res.send(document);
          res.end();
        }
      });
    }
  });
});

app.put("/updateUser/:Email", (req, res) => {
  const Email = req.params.Email;
  const Name = req.body.Name;
  const Password = req.body.Password;
  mongoClient.connect(conString, (err, clientObject) => {
    if (!err) {
      var database = clientObject.db("cointabcustomers");
      database.collection("customers").updateOne(
        { Email },
        {
          $set: {
            Name,
            Email,
            Password,
          },
        },
        (err, document) => {
          if (!err) {
            console.log(document);
            res.send(document);
            res.end();
          }
        }
      );
    }
  });
});

app.delete("/deleteUser/:Email", (req, res) => {
  const Email = req.params.Email;
  mongoClient.connect(conString, (err, clientObject) => {
    if (!err) {
      var database = clientObject.db("cointabcustomers");
      database.collection("customers").deleteOne({ Email }, (err, document) => {
        if (!err) {
          console.log(document);
          res.send(document);
          res.end();
        }
      });
    }
  });
});

app.post("/addUser", (req, res) => {
  const Email = req.body.Email;
  const Name = req.body.Name;
  const Password = req.body.Password;
  mongoClient.connect(conString, (err, clientObject) => {
    if (!err) {
      var database = clientObject.db("cointabcustomers");
      database.collection("customers").insertOne(
        {
          Name,
          Email,
          Password,
        },
        (err, document) => {
          if (!err) {
            console.log(document);
            res.send(document);
            res.end();
          }
        }
      );
    }
  });
});

app.get("**", (req, res) => {
  res.send("NotFound - Requested API path not Available");
});
app.listen(8080);
console.log("Server Started: http://127.0.0.1:8080");
