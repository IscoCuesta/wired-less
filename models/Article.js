var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  isSaved: {
    type: Boolean,
    required: true,
    default: false
  },
  img: {
    type: String,
    required: true,
    default: "https://is4-ssl.mzstatic.com/image/thumb/Purple115/v4/81/e3/8d/81e38de3-ff0e-6c24-30c2-890cf0903138/mzl.fuiytfht.png/246x0w.jpg"
    },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
