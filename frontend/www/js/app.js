/*
VARIABLES
*/

var AJAX_HOST = "http://8e405a4b.ngrok.io/";
var KEY = "AIzaSyCbbew5zS0asgUNBmz4WU5oDsuh-AgWjWM";
var CATEGORIES = ["Hygiene", "Bedding", "Food", "Clothing", "Misc."];
var currentLat = 23;
var currentLong = 34;
var currentRadius = 5;
var currentCard;
var selectedCard;
var $cardContainer = $("#cardContainer");
var $cardView = $('#cardView');
var $submissionForm = $('#submissionForm');
var $newButton = $('#newButton');
var $submitNeed = $('#submitNeed');
var $previewCard = $('#previewCard');
var $backBtn = $('#back');
var viewPortPosition;
var onHomeFeed = true;
setLocation(getAndUpdateCards);
var checkTimer = setInterval(getAndUpdateCards, 10000);
var setLocationInterval = setInterval(setLocation, 120000);


/*
EVENT LISTENERS
*/

$(document).on('click', '.info-card', function() {
  hideEverything();
  var id = $(this).attr('id');
  var selectedCard = currentCards[' ' + id];
  currentCard = selectedCard;
  $cardContainer.hide();
  $cardView.empty().show();
  $(this).clone().appendTo($cardView);
  $backBtn.show();
  $cardView.append(templateCardView({
    item: selectedCard['item_description'],
    locationDescription: selectedCard['location_description'],
    lookFor: selectedCard['person_description'],
    name: selectedCard['first_name'],
    latitude: selectedCard['latitude'],
    longitude: selectedCard['longitude']
  }));
});


$(document).on('click', '#haveHelpedButton', function() {
  if (confirm("Are you sure you've met this need?")) {
    $.post(AJAX_HOST + "/completed.php", {
      id: currentCard.id
    }).done(function() {
      onHomeFeed = true;
      $cardView.empty();
      $cardContainer.show();
      $newButton.show();
      getAndUpdateCards();
      alert("Thank you for your generosity!");
    })
  }
});

$(document).on('click', '#submitNeed', function() {
  hideEverything();
  $previewCard.show();
  $backBtn.show();
  $previewCard.append(templatePreview({
    item: $('#itemDescription').val(),
    locationDescription: $('#locationDescription').val(),
    lookFor: $('#lookFor').val(),
    name: $('#firstName').val(),
    latitude: currentLat,
    longitude: currentLong,
    KEY: KEY,
    category: $('#category').val()
  }));
});

$(document).on('click', '#backToSubmission', function() {
  hideEverything();
  $backBtn.show();
  $previewCard.empty();
  $submissionForm.show();
});

$(document).on('click', '#confirm', function() {
  $.post(AJAX_HOST + "/submit.php", {
    name: $('#firstName').val(),
    user_id: null,
    item_desc: $('#itemDescription').val(),
    category_id: $('#category').val(),
    location_desc: $('#locationDescription').val(),
    person_desc: $('#lookFor').val(),
    long: currentLong,
    lat: currentLat
  })
  .done(function(response) {
    hideEverything();
    $newButton.show();
    document.getElementById('submissionForm').reset();
    $previewCard.empty();
    $cardContainer.show();
    onHomeFeed = true;
    getAndUpdateCards();
    if (!response.success)
      alert('There was an error: ' + response.error);
  });

});


$newButton.click(function() {
  hideEverything();
  $submissionForm.show();
  $backBtn.show();
});

$backBtn.click(back);
document.addEventListener("backbutton", back, false);

/*
FUNCTIONS
*/

function back() {
  if($previewCard.is(':visible')) {
    $previewCard.hide().empty();
    $submissionForm.show();
    $backBtn.show();
  }
  else {
    hideEverything();
    $cardContainer.show();
    $newButton.show();
    onHomeFeed = true;
  }
}
function hideEverything() {
  onHomeFeed = false;
  $cardContainer.hide();
  $cardView.hide();
  $submissionForm.hide();
  $newButton.hide();
  $previewCard.hide();
  $backBtn.hide();
}
function getAndUpdateCards() {
  if (!onHomeFeed)
    return;
  $.ajax(AJAX_HOST + "/get_cards.php", {
    jsonp: false,
    method: "GET",
    dataType: "jsonp",
    jsonpCallback: "cb",
    data: {
      lat: currentLat,
      long: currentLong,
      radius: currentRadius
    },
    success: function(response) {
      currentCards = response.cards;
      updateCards();
    }
  });
}

function updateCards() {
  viewPortPosition = $(window).scrollTop();
  $cardContainer.empty();
  for (var card in currentCards) {

    $cardContainer.append(templateCard({
        id: currentCards[card]["id"],
        latitude: currentCards[card]["latitude"],
        longitude: currentCards[card]["longitude"],
        KEY: KEY,
        category: currentCards[card]["category_id"],
        time: currentCards[card]["time"],
        name: currentCards[card]["first_name"],
        distance: currentCards[card]["distance"]
    }).trim());
  }
  $(window).scrollTop(viewPortPosition);
}

function setLocation(callback) {
  tempVar = this;
  navigator.geolocation.getCurrentPosition(function(position) {
    tempVar.currentLat = position.coords.latitude;
    tempVar.currentLong = position.coords.longitude;
    if (callback != undefined) {
      callback();
    }
  });
}

function adjust_textarea(h) {
  h.style.height = "20px";
  h.style.height = (h.scrollHeight)+"px";
}