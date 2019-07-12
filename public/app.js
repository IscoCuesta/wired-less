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
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='waves-effect waves-light btn blue-grey darken-2'>Save Article</button>");

    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
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
