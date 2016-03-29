// 1.0 MISCELLANEOUS

function openNav() {
  var nav_width = '25%';
  if (window.innerWidth < 550) {
    nav_width = '100%';
  } else if (window.innerWidth < 1000) {
    nav_width = '50%';
  } else {
    nav_width = '25%';
  }
  document.getElementById('mySidenav').style.width = nav_width;
  document.getElementById('main').style.marginLeft = nav_width;
  document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
  $('#openButton').hide();
  $('#closeButton').show();
}

function closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginLeft= '0';
    document.body.style.backgroundColor = "white";
    $('#closeButton').hide();
    $('#openButton').show();
}

function searchFunction() {
  $('#top-layer').toggleClass('search');
  $('#search-box').toggle();
  $('#location').toggle();

  setTimeout(function() {
    $(document).click(function(event) {
      $('#top-layer').toggleClass('search');
      $('#search-box').toggle();
      $('#location').toggle();
      $(this).off(event);
    });
  }, 1);

  $('#search-input').on('click', function(event) {
    event.stopPropagation();
  });

  // Prevent the default form submission when "Enter" is pressed.  Instead run submitQuery()
  $('#search-input').keydown(function(e) {
    var key = e.which;
    if (key == 13) {
      e.preventDefault();
      $(this).off(e);
      submitQuery();
    }
  });
}

var infowindow;
var map;
var current_location = {
  map_center: {lat: 38.895222, lng: -77.036758},
  entity_type: "city",
  entity_id: 283,
  title: "Washington, DC"
};
var defaultRestaurantArray = [];

// Hide the sidebar "close" button by default
$('#closeButton').hide();
// END SECTION 1


// 2. MAP SECTION

// Load page with map load error indicated
function mapLoadError() {
  $('#loading').toggle();
  $('#location').empty();
  $('#location').append('<span style="color:white;-webkit-text-stroke: 2px #df1e93;">Failed to load map...<span>');
}

// Get a users location
var deferred = $.Deferred();
function getLocation() {
  changeLocation();
  $.when(deferred).done(function() {
    initMap();
  });
}

function changeLocation() {
  // If geolocation functionality exists in browser, request the geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, showError);
  } else {
    $('#location').empty();
    $('#location').append('Washington, DC');
    $('#loading').hide();
    deferred.resolve();
  }
}

// Update the map center based on the users location
function getPosition(position) {
    current_location.map_center.lat = position.coords.latitude;
    current_location.map_center.lng = position.coords.longitude;
    current_location.entity_id = 0;
    current_location.entity_type = 'city';
    current_location.title = '';

    $('#location').empty();
    $('#location').append('Current Location');
    $('#loading').hide();
    deferred.resolve();
    
}


// Error handler for when a users location can't be found
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }

    $('#location').empty();
    $('#location').append('Washington, DC');
    $('#loading').hide();
    deferred.resolve();
}

function initMap() {
  // Create map centered on users location or the Washington, DC by default
  createMap(current_location.map_center);
  infowindow = new google.maps.InfoWindow();
  initData();
}

function createMap(central_coordinates) {
  // Specify features and elements to define styles.
  var styleArray = [
    {
      featureType: 'all',
      stylers: [
       { hue: '#691d9b' },
       //{ saturation: 100 }
      ]
    },{
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: central_coordinates,
    scrollwheel: false,
    disableDefaultUI: true,
    // Apply the map style array to the map.
    styles: styleArray,
    zoom: 15
  });
}

var mapMarkerImage = 'images/light_purple_pin.png';
var selectMapMarkerImage = 'images/light_green_pin.png';
var markersArray = [];

// Adds a marker to the map and push to the array.
function addMapMarkers(restaurant) {

  var latitude = Number(restaurant.coordinates().lat);
  var longitude = Number(restaurant.coordinates().lng);
  var id = String(restaurant.id());
  var newMarker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map,
    icon: mapMarkerImage,
    title: id
  });
  markersArray.push(newMarker);
  mapListener(newMarker);
}

function mapListener(mark) {

  mark.addListener('click' ,function() {
    infoWindowOpen(mark);
  });
}

function infoWindowOpen(mark) {
  restaurantArray().forEach(function(restaurant) {
    if (mark.title == String(restaurant.id())) {
      var address = restaurant.address();
      var cuisines = restaurant.cuisines();
      var menuURL = restaurant.menuURL();
      var name = restaurant.name();
      var rating = restaurant.rating();


      var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
            '<div id="bodyContent">' +
            '<h3>' + cuisines+  '</h3>' +
            '<h3>Rating: ' + rating + '</h3>' +
            '<p>' + address + '</p>' +
            '<p><a href="' + menuURL + '" target="_blank">Click here for menu</a></p>' +
            '</div>' +
            '</div>';

      // turn selected mark green and others back to purple
      for (var i = 0; i < markersArray.length; i++) {
        if (mark == markersArray[i]) {
          markersArray[i].icon = selectMapMarkerImage;
        } else {
          markersArray[i].icon = mapMarkerImage;
        }
        markersArray[i].setMap(map);
      }

      infowindow.setContent(contentString);
      map.panTo(mark.getPosition());
      map.setZoom(15);
      infowindow.open(map, mark);
    }
  });
}

// Clears a single map marker from view
function clearOneMapMarker(i) {
  markersArray[i].setMap(null);
}

// Shows a single map marker
function showOneMapMarker(i) {
  markersArray[i].setMap(map);
}


// Removes the markers from the map, but keeps them in the array.
function clearAllMapMarkers() {
  for (var i = 0; i < markersArray.length; i++) {
    clearOneMapMarker(i);
  }
}

// Shows any markers currently in the array.
function showAllMapMarkers() {
  for (var i = 0; i < markersArray.length; i++) {
    showOneMapMarker(i);
  }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearAllMapMarkers();
  markersArray = [];
}
// END SECTION 2


// 3.0 ZOMATO RESTAURANT API
function restaurantAPIcall() {
  $('#top-layer').toggleClass('search');
  $('#loading').toggle();
  var lat = current_location.map_center.lat;
  var lng = current_location.map_center.lng;

  $.ajax({
    async: true,
    method: 'GET',
    url: 'https://developers.zomato.com/api/v2.1/search?apikey=1bdc7a9f5488e30c040d0be53e316511&radius=2000&count35&lat=' + lat + '&lon=' + lng + '&sort=rating&order=desc',

    success: function(data) {
      defaultRestaurantArray.length = 0;
      for (var i = 0; i < data.restaurants.length; i++) {
        var id = data.restaurants[i].restaurant.R.res_id;
        var name = data.restaurants[i].restaurant.name;
        var cuisines = data.restaurants[i].restaurant.cuisines;
        var rating = data.restaurants[i].restaurant.user_rating.aggregate_rating;
        var menuURL = data.restaurants[i].restaurant.menu_url;
        var address = data.restaurants[i].restaurant.location.address;
        var coordinates = {lat: data.restaurants[i].restaurant.location.latitude, lng: data.restaurants[i].restaurant.location.longitude};
        defaultRestaurantArray.push({
          id: id,
          name: name,
          cuisines: cuisines,
          rating: rating,
          menuURL: menuURL,
          address: address,
          coordinates: coordinates
        });
      }
    },

    complete: function() {
      restaurantArray.removeAll();
      deleteMarkers();
      for (var i = 0; i < defaultRestaurantArray.length; i++) {
        restaurantArray.push( new RestaurantEntry(defaultRestaurantArray[i]));
        addMapMarkers(restaurantArray()[i]);
      }
      $('#top-layer').toggleClass('search');
      $('#loading').toggle();
    }

  }).fail(function() {
    $('#location').empty();
    $('#location').append('<span style="color:white;-webkit-text-stroke: 2px #df1e93;">Could not load restaurants.  Please try refreshing...<span>');
    $('#top-layer').toggleClass('search');
    $('#loading').toggle();
  });
}

function RestaurantEntry(data) {
  var self = this;
  self.id = ko.observable(data.id);
  self.name = ko.observable(data.name);
  self.cuisines = ko.observable(data.cuisines);
  self.rating = ko.observable(data.rating);
  self.menuURL = ko.observable(data.menuURL);
  self.address = ko.observable(data.address);
  self.coordinates = ko.observable(data.coordinates);
  self.visibility = ko.observable(true);
}

// Queries the Zomato API based on user inputted text and returns a single location
function submitQuery() {
  $('#search-box').toggle();
  $('#loading').toggle();

  var search_text = $('#search-input').val();
  if (search_text !== '') {
    $('#search-form')[0].reset();

    $.ajax({
      async: true,
      method: 'GET',
      url: 'https://developers.zomato.com/api/v2.1/locations?apikey=1bdc7a9f5488e30c040d0be53e316511&count=1&query='+search_text,

      success: function(data) {
        $(document).off("click");

        if (data.location_suggestions.length !== 0) {
          var latitude = data.location_suggestions[0].latitude;
          var longitude = data.location_suggestions[0].longitude;
          var coordinates = {lat: latitude, lng: longitude};
          var entity_type = data.location_suggestions[0].entity_type;
          var entity_id = data.location_suggestions[0].entity_id;
          var title = data.location_suggestions[0].title;

          current_location.map_center = coordinates;
          current_location.entity_type = entity_type;
          current_location.entity_id = entity_id;
          current_location.title = title;

          var center = new google.maps.LatLng(latitude, longitude);
          map.panTo(center);

          $('#location').empty();
          $('#location').append(title);

          restaurantAPIcall();
          ViewModel();
        } else {
          console.log('string empty')
          alert('Could not find any locations with that query, please try again with different search terms');
        }
      },

      complete: function() {
        $('#top-layer').toggleClass('search');
        $('#loading').toggle();
        $('#location').toggle();
      }
    }).fail(function() {
      $('#location').empty();
      $('#location').append('<span style="color:white;-webkit-text-stroke: 2px #df1e93;">Could not connect to database...<span>');
    })
  } else {
    alert('text empty');
  }
  //$('#top-layer').toggleClass('search');
  //$('#loading').toggle();
  //$('#location').toggle();
}
// END SECTION 3


// 4.0 INITIALIZE THE PAGE
function initData() {

  restaurantAPIcall();

  ko.applyBindings( new ViewModel() );
}
// END SECTION 4


// 5.0 CONTROLLER / ViewModel
var restaurantArray = ko.observableArray([]);

function ViewModel() {
  var self = this;



  this.selectMapMarker = function(data) {
    markersArray.forEach(function(mark){
      if (String(data.id()) == mark.title) {
        var address = data.address();
        var cuisines = data.cuisines();
        var menuURL = data.menuURL();
        var name = data.name();
        var rating = data.rating();


        var contentString = '<div id="content">' +
              '<div id="siteNotice">' +
              '</div>' +
              '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
              '<div id="bodyContent">' +
              '<h3>' + cuisines+  '</h3>' +
              '<h3>Rating: ' + rating + '</h3>' +
              '<p>' + address + '</p>' +
              '<p><a href="' + menuURL + '" target="_blank">Click here for menu</a></p>' +
              '</div>' +
              '</div>';

        // turn selected mark green and others back to purple
        for (var i = 0; i < markersArray.length; i++) {
          if (mark == markersArray[i]) {
            markersArray[i].icon = selectMapMarkerImage;
          } else {
            markersArray[i].icon = mapMarkerImage;
          }
          markersArray[i].setMap(map);
        }

        infowindow.setContent(contentString);
        map.panTo(mark.getPosition());
        map.setZoom(15);
        infowindow.open(map, mark);
      } 
    })
    closeNav();
  };

  self.filterInput = ko.observable("");

  this.filterInput.subscribe(function(newValue) {
    for (var i = 0; i < restaurantArray().length; i++) {
      if (restaurantArray()[i].name().toLowerCase().indexOf(newValue.toLowerCase()) >= 0) {
        $( '#' + String(restaurantArray()[i].id())).show();
        showOneMapMarker(i);
      } else {
        $( '#' + String(restaurantArray()[i].id())).hide();
        clearOneMapMarker(i);
      }
    }
  })
}
//END SECTION 5