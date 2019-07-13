require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios


  // db.Article.drop();
  // db.dropCollection("Article", drop => console.log(drop) );


  axios.get("https://www.wired.com/").then(function(response) {

    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $(".post-listing-list-item__post").each(function(i, element) {

      // console.log($(element).text());
  
      // var title = $(element).children().text();
      // var title = $(element).text();
      var link = "https://www.wired.com"+$(element).find("a.post-listing-list-item__link").attr("href");
      var title = $(element).find("h5.post-listing-list-item__title").text().split(": ")[0];
      var img = $(element).find("a.post-listing-list-item__link").find("div.post-listing-list-item__image--small").find("div.aspect-ratio-component").find("div.image-group-component").find("img").attr("src");
  
      // Save these results in an object that we'll push into the results array we defined earlier
      var result = {};
      result.title = title;
      result.link = link;
      result.img = img;
      db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        // console.log(dbArticle);
        // res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err.body);
        res.json(err);
      });
    });

    // Send a message to the client
    // res.JSON();
    db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });
});

// Route for getting all Articles from the db
// app.get("/", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Route for getting all Saved Articles from the db
app.get("/articles/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({isSaved: true})
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/", function(req, res) {
  // Grab every document in the Articles collection
  res.sendFile(path.join(__dirname+'/public/index.html'))
});
app.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  res.sendFile(path.join(__dirname+'/public/Saved.html'))
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true }, { new: true })
    // .then(function(dbNote) {
    //   // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    //   // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //   // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    //   // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    // })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/unsave/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false }, { new: true })
    // .then(function(dbNote) {
    //   // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    //   // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //   // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    //   // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    // })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
