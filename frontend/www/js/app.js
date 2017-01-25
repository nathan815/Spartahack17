/**
 * Determine whether the file loaded from PhoneGap or not
 */
function isPhoneGap() {
    return (window.cordova || window.PhoneGap || window.phonegap) 
    && /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

/*
VARIABLES
*/

var AJAX_HOST = "http://8e405a4b.ngrok.io/";
var KEY = "AIzaSyCbbew5zS0asgUNBmz4WU5oDsuh-AgWjWM";
var CATEGORIES = ["Hygiene", "Bedding", "Food", "Clothing", "Misc."];
var currentLat = 23.007;
var currentLong = 34;
var currentRadius = 500;
var currentCard;
var selectedCard;
var $mainView = $('#mainView');
var $cardContainer = $("#cardContainer");
var $cardView = $('#cardView');
var $submissionForm = $('#submissionForm');
var $newButton = $('#newButton');
var $submitNeed = $('#submitNeed');
var $previewCard = $('#previewCard');
var $backBtn = $('#back');
var viewPortPosition;
var onHomeFeed = true;

var checkTimer;
var setLocationInterval;

// Get device location and then init the app
if(isPhoneGap()) {
  setLocation(init);
}
else {
  init();
}


/*
EVENT LISTENERS
*/

$(document).on('click', '.info-card', function() {
  hideEverything();
  var id = $(this).attr('id');
  var selectedCard = currentCards[' ' + id];
  currentCard = selectedCard;
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

$(document).on('focus', '.info-card', function() {
  $(this).toggleClass('focus');
});

$(document).on('click', '#haveHelpedButton', function() {
  if (confirm("Are you sure you've met this need?")) {
    $.post(AJAX_HOST + "/completed.php", {
      id: currentCard.id
    }).done(function() {
      onHomeFeed = true;
      $cardView.empty().hide();
      $mainView.show();
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
    document.getElementById('submissionForm').reset();
    $previewCard.empty();
    $mainView.show();
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

function init() {
  getAndUpdateCards();
  checkTimer = setInterval(getAndUpdateCards, 10000);
  if(isPhoneGap()) {
    setLocationInterval = setInterval(setLocation, 120000);
  }
}

function back() {
  if($previewCard.is(':visible')) {
    $previewCard.hide().empty();
    $submissionForm.show();
    $backBtn.show();
  }
  else {
    hideEverything();
    $mainView.show();
    onHomeFeed = true;
  }
}
function hideEverything() {
  onHomeFeed = false;
  $mainView.hide();
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
      currentCards = response.data.cards;
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
        distance: currentCards[card]["distance_with_label"]
    }).trim());
  }
  $(window).scrollTop(viewPortPosition);
}

function setLocation(callback) {
  if(!isPhoneGap()) return;
  _this = this;
  navigator.geolocation.getCurrentPosition(function(position) {
    _this.currentLat = position.coords.latitude;
    _this.currentLong = position.coords.longitude;
    if (callback != undefined) {
      callback();
    }
  }, function() {
    hideEverything();
    $('#locationError').show();
  });
}

function adjust_textarea(h) {
  h.style.height = "20px";
  h.style.height = (h.scrollHeight)+"px";
}