// Query Selectors
var searchButton = document.querySelector(".search-button");
var resetButton = document.querySelector('.reset-button');
var historyList = document.querySelector(".favorite-container");
var cardList = document.querySelector(".chart");

// Global Variables
var lon = "0";
var lat = "0";
var temp;
var wind;
var humidity;
var recents = [];


// Functions for fetching lat/lon and weather information
const searchAPI = (requestURL) => {
    fetch(requestURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("fetch Retrieved");
            console.log(data);
        })
}

const getLonLat = (requestURL) => {
    fetch(requestURL)
        .then((response) => {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            lat = data[0].lat;
            lon = data[0].lon;
        })
}

// Creates day card
function createCard() {
    // Generate 5 day forecast cards
    for(var i = 0; i <= 4; i++){
        card = document.createElement('div');
        card.setAttribute('id', 'card');

        cardHeader = document.createElement('h5');

        cardTable = document.createElement('table');
        // Switches based on day
        switch(i){
            case 0:

                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
        }

        cardRow = document.createElement('tr');

        tempData = document.createElement('td');
        windData = document.createElement('td');
        humidityData = document.createElement('td');


    }
}

// Simply re-renders recents when called
function renderRecents() {
    recentsPulled = JSON.parse(localStorage.getItem('recent-searches'));
    recents = recentsPulled;

    if(recentsPulled == null){
        return;
    }

    while(historyList.firstChild){
        historyList.removeChild(historyList.firstChild);
    }

    for(var i = 0; i < recents.length; i++){
        var button = document.createElement('button');
        var text = recents[i];

        button.setAttribute('class', 'history-button');
        button.textContent = text;

        historyList.appendChild(button);
    }

    var historyButtons = document.querySelectorAll(".history-button");
    for(let i = 0; i < historyButtons.length; i++){
        historyButtons[i].addEventListener('click', function() {
            createCoords(this.textContent);
        });
    }
}

// Adds to recent list, stores in local storage
function addRecent(input) {
    // Checks if input is already in recents
    for(let i = 0; i < recents.length; i++){
        if(input == recents[i]){
            return;
        }
    }

    // Push the input to the favorites array to be locally stored
    // If it is full (5 Recents), dequeue earliest
    if(recents.length < 4){
        recents.push(input);
        console.log("The recents is not full yet, pushed input");
        localStorage.setItem("recent-searches", JSON.stringify(recents));
    }else{
        recents.push(input);
        recents.shift();
        localStorage.setItem("recent-searches", JSON.stringify(recents));
    }

    renderRecents();
}

// Function to retrieve input and call fetch functions
function createCoords(input) {
    inputCity = input.split(",")[0];
    console.log("The input city is: " + inputCity);
    inputState = input.split(", ")[1]
    console.log("The input state is: " + inputState);
    console.log("http://api.openweathermap.org/geo/1.0/direct?q=" + inputCity + "," + inputState + ",US&appid=a39b53f09dc5424eec6bd8285d58ffe7");

    if(inputCity == null || inputState == null){
        // Tell user to input right, then leave function early
        alert('Please enter in a city, followed by a state. \n Example: "Creswell, OR"');
        return;
    }else{
        getLonLat("http://api.openweathermap.org/geo/1.0/direct?q=" + inputCity + "," + inputState + ",US&appid=a39b53f09dc5424eec6bd8285d58ffe7");
        searchAPI("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=a39b53f09dc5424eec6bd8285d58ffe7");
        addRecent(input);
    }

    // IF data is present, get rid of it, otherwise place new cards
    if(cardList.firstChild){
        while(cardList.firstChild){
            cardList.removeChild(cardList.firstChild);
        }
    }

    //createCards();
}

// Listener for Search Button
searchButton.addEventListener("click", function(){
    inputResult = document.getElementById('cityname').value;
    console.log(inputResult);
    createCoords(inputResult);
});

resetButton.addEventListener("click", function(){
    recents = [];
    localStorage.setItem("recent-searches", JSON.stringify(recents));
    renderRecents();
});

renderRecents();

//5 Day Weather API
//http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=a39b53f09dc5424eec6bd8285d58ffe7

//Geocoding API
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&appid=a39b53f09dc5424eec6bd8285d58ffe7

//Example of what needs to be made.
//http://api.openweathermap.org/geo/1.0/direct?q=Creswell,Oregon,US&appid=a39b53f09dc5424eec6bd8285d58ffe7
//Then
//http://api.openweathermap.org/data/2.5/forecast?lat=43.9179023&lon=-123.0245261&appid=a39b53f09dc5424eec6bd8285d58ffe7