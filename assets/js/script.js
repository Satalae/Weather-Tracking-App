// Query Selectors
var searchButton = document.querySelector(".search-button");
var resetButton = document.querySelector('.reset-button');
var historyList = document.querySelector(".favorite-container");
var cityTitle = document.querySelector("#select-city");
var tempDisplay = document.querySelector("#temp-display");
var windDisplay = document.querySelector("#wind-display");
var humDisplay = document.querySelector("#humidity-display");
var cardList = document.querySelector(".chart");

// Global Variables
var lon = "0";
var lat = "0";
var temp = [];
var wind = [];
var humidity = [];
var recents = [];

// Date/Formatting
var date = new Date().toLocaleDateString('en-us', { month: "long", day: "numeric", year: "numeric" });

// Functions for fetching lat/lon and weather information
const searchAPI = (requestURL) => {
    fetch(requestURL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            for(let i = 0; i <= 5; i++){
                iter = i * 8;
                if(iter == 40){
                    iter = iter - 1;
                }
                temp.push(data.list[iter].main.temp);
                wind.push(data.list[iter].wind.speed);
                humidity.push(data.list[iter].main.humidity);
            }
        })
        .then(() =>{
            createCards();
        })
}

const getLonLat = (requestURL) => {
    fetch(requestURL)
        .then((response) => {
            return response.json();
        })
        .then(function (data) {
            lat = data[0].lat;
            lon = data[0].lon;
        })
}

// Creates day card
function createCards() {
    // Generate 5 day forecast cards
    for(var i = 0; i <= 5; i++){
        tempGiven = temp[i] + "f \n";
        windGiven = wind[i] + " MPH \n";
        humGiven = humidity[i] + "% \n";

        // This is for the main display
        if(i == 0){
            tempDisplay.textContent = tempGiven
            windDisplay.textContent = windGiven;
            humDisplay.textContent = humGiven;
        }else{
            // Creates all the elements
            var genDate = new Date()
            genDate.setDate(genDate.getDate() + i);
            genDate = genDate.toLocaleDateString('en-us', { month: "long", day: "numeric", year: "numeric" });

            card = document.createElement('div');
            card.setAttribute('id', 'card');

            cardHeader = document.createElement('h5');
            cardHeader.textContent = genDate;

            cardTable = document.createElement('table');

            tempRow = document.createElement('tr');
            windRow = document.createElement('tr');
            humidityRow = document.createElement('tr');

            tempData = document.createElement('tr');
            windData = document.createElement('tr');
            humidityData = document.createElement('tr');

            tempData.setAttribute('id', 'table-row');
            windData.setAttribute('id', 'table-row');
            humidityData.setAttribute('id', 'table-row');
            
            // Populates the elements
            tempData.textContent = "Tempurature is: " + tempGiven;
            windData.textContent = "Wind Speed is: " + windGiven;
            humidityData.textContent = "Humidity is: " + humGiven;

            // Assembles and appends the card
            tempRow.appendChild(tempData);
            windRow.appendChild(windData);
            humidityRow.appendChild(humidityData);

            cardTable.appendChild(cardHeader);
            cardTable.appendChild(tempRow);
            cardTable.appendChild(windRow);
            cardTable.appendChild(humidityRow);

            card.appendChild(cardTable);
            
            cardList.appendChild(card);
        }
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
    // Dump previous stats for next set
    temp = [];
    wind = [];
    humidity = [];

    inputCity = input.split(",")[0];
    inputState = input.split(", ")[1]
    cityTitle.textContent = inputCity + " " + date;

    // IF data is present, get rid of it, otherwise place new cards
    if(cardList.firstChild){
        while(cardList.firstChild){
            cardList.removeChild(cardList.firstChild);
        }
    }

    if(inputCity == null || inputState == null){
        // Tell user to input right, then leave function early
        alert('Please enter in a city, followed by a state. \n Example: "Creswell, OR"');
        return;
    }else{
        getLonLat("http://api.openweathermap.org/geo/1.0/direct?q=" + inputCity + "," + inputState + ",US&appid=a39b53f09dc5424eec6bd8285d58ffe7");
        searchAPI("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=a39b53f09dc5424eec6bd8285d58ffe7");
        addRecent(input);
    }
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

// Loads recent list from memory
renderRecents();