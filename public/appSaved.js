function render (data) {
  // For each one
    $("#articles").empty();

  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var div = $("<div>").addClass("article l5 offset-l1 col");
    var title = $("<p>").text(data[i].title).attr("data-id", data[i]._id).addClass("title-article header");
    var Unsave = $("<a>").text("Unsave Article").attr("data-id", data[i]._id).addClass("waves-effect waves-light btn Unsave blue-grey darken-2");
    var img = $("<img>").attr("src", data[i].img).addClass("img-article");
    var link = $("<a>").attr("href",data[i].link).text("Go to Read it!").addClass("link");
    var card = $("<div>").addClass("card horizontal")
    var cardImg = $("<div>").addClass("card-image")
    var cardSta = $("<div>").addClass("card-stacked")
    var cardlink = $("<div>").addClass("card-action")
    var cardCont = $("<div>").addClass("card-content")
    cardImg.append(img);
    cardCont.append(title);
    cardlink.append(link);
    cardSta.append(cardCont, cardlink, Unsave);
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
    url: "/articles/saved",
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      render(data)
    });
});


// When you click the savenote button
$(document).on("click", ".Unsave", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/unsave/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log("post Unsaved ===",data);
      // Empty the notes section
      $("#notes").empty();
    });
});
