# Neighborhood Map Project
Udacity Front End Web Development - Project 5: Neighborhood Map

![Application Screenshot](https://raw.githubusercontent.com/ferristocrat/udacity_frontend_p5_neighborhood-map/master/images/screenshot.PNG "Application Screenshot")

## Synopsis

This is my fifth of a series of projects through Udacity's **Front End Web Development** course, through which I have been reviewing web fundamentals including HTML5, CSS and JavaScript.  This project incorporates the use of JavaScript libraries such as JQuery and Knockout to build a clean map application.  The website uses API calls to display the [Google Maps](https://developers.google.com/maps/ "Google Maps") as well as restaurant information from [Zomato](https://developers.zomato.com/documentation "Zomato").

## Functionality

* **Main map page:** A map is displayed that shows the users current location by default. If no location information is available, the map defaults to Washington, DC. The map will show the top 20 restaurants according to Zomato. Clicking a map marker will open an info window about the restaurant.
* **Search:** Search icon is located in the upper-right corner of the main page, and when clicked a search box appears.  When pressing "Enter" an API call to Zomato is fired that returns the top result of a location search using the entered string as the query.  If nothing is returned, nothing will happen.  To test this out, try typing "Boston" and pressing "Enter". The map should pan to Boston, MA and show the top 20 restaurants.
* **Menu:** Menu icon is located in the upper-left corner of the main page, and when clicked opens a menu that lists all the restaurants, which can be filtered.  Clicking on a restaurant will open the info window for that restaurant.

## Files

* **index.html:** Main page
* **jquery-2.2.1.min:** JQuery
* **knockout-3.4.0.js:** Knockout JavaScript library
* **style.css:** Styles
* **app.js:** Code for the main application models, view, viewmodel and api connection details (currently using Google Maps and Zomato)

## Instructions

1. Since the app requires a user's geolocation, it must be run on a server to work. The instruction to run index.html is not applicable for your app.  If you have python installed you can run a [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html "SimpleHTTPServer") by running `python -m SimpleHTTPServer`
2. Open index.html in a browser

* If you can't run a local server, you can just open index.html, and the location should be defaulted to Washington, DC
=======
1. Open index.html in a browser
>>>>>>> origin/master
