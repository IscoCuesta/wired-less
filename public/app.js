function render (data) {
  // For each one
    $("#articles").empty();

  for (var i = 0; i <= 20; i++) {
    // Display the apropos information on the page
    var div = $("<div>").addClass("article col");
    var title = $("<p>").text(data[i].title).attr("data-id", data[i]._id).addClass("title-article header");
    var img = $("<img>").attr("src", data[i].img).addClass("img-article");
    var link = $("<a>").attr("href",data[i].link).text("Go to Read it!").addClass("link");
    var card = $("<div>").addClass("card horizontal")
    var cardImg = $("<div>").addClass("card-image")
    var cardSta = $("<div>").addClass("card-stacked")
    var cardlink = $("<div>").addClass("card-action")
    var cardCont = $("<div>").addClass("card-content")
    var br = $("<br>")
    cardImg.append(img);
    cardCont.append(title);
    cardlink.append(link);
    cardSta.append(cardCont, cardlink);
    card.append(cardImg, cardSta);
    div.append(card);
    $("#articles").append(div);
    
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><img src="+data[i].img +"></img>" + data[i].link + "</p>");
  };
  console.log("inside render function")
};

// Grab the articles as a json

$(document).ready(function() {
  $.ajax({
    method: "GET",
    url: "/articles",
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      render(data)
    });
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<p>" + data.title + "</p>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='saveArticle' class='waves-effect waves-light btn blue-grey darken-2'>Save Article</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='saveNote' class='waves-effect waves-light btn amber darken-2'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#saveArticle", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log("post saved ===",data);
      // Empty the notes section
      $("#notes").empty();
    });
});

$(document).on("click", "#saveNote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/note/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".Scrape", function() {

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      render(data)
    });

});

$(document).on("click", ".Saved", function() {
  
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/saved",
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      render(data)
    });

});
