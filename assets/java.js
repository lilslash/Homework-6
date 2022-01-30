var searches = JSON.parse(localStorage.getItem('savedSearches'))|| [];
var cityInfo = $('#citySearch').val()


var getCurrentWeather = function (cityInfo) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityInfo +'&units=imperial&appid=1a8a2995ad784f8a7341c66784cf53f7'

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                uvi(data)
            })
        } else {
            console.log('failed to grab currentWeather')
        }
    })
}

var storeSearches = () => {
    var cityInfo = $('#citySearch').val()
    searches.push(cityInfo)
    var unique = []
    $.each(searches,function(i,el){
        if($.inArray(el, unique)=== -1) unique.push(el)
    })
    searches = unique
    localStorage.setItem("savedSearches", JSON.stringify(searches))
}

var populateSearches = () => {
    for(i = 0; i < searches.length; i++) {
        $('.button-factory').append(` <button class='prev weatherBox btn btn-primary m-1'>${searches[i]}</button>
        `)
    }
}

var uvi = (latLonData) => {
    var lat = latLonData.coord.lat
    var lon =  latLonData.coord.lon

    var latLonApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&units=imperial&exclude=hourly,minutely&appid=1a8a2995ad784f8a7341c66784cf53f7';

    fetch(latLonApi)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                displayCurrent(data, cityInfo);
                weekDisplay(data);
            })
        } else {
            console.log('failed to grab lat and lon')
        }
    })
    
}

var displayCurrent = (info, cityInfo) => {
    $('.jumbotron-fluid').append(`
            <div class= 'weatherBox ml-1'>
            <h2 class= 'text-center head2'>${cityInfo}</h2>
            <p class='text-center main-text'>${info.current.weather[0].main}<img src ='http://openweathermap.org/img/wn/${info.current.weather[0].icon}.png'></p>
            <h3>${moment().format('dddd M / D')}</h3>
            <p class= 'main-text'>Current Temp: ${parseInt(info.current.temp)}°F</p>
            <p class= 'main-text'>Humidity: ${info.current.humidity}%</p>
            <p class= 'main-text'>Wind Speed: ${info.current.wind_speed}mph</p>
            </div>
    `);

};

var weekDisplay = (upcoming) =>{
    for(i = 1; i < 6; i++){
        $('#5-day-display').append(`
        <div class='d-flex flex-column col-12 col-md-5 col-xl-3 weatherBox card m-1 rounded text-center'>
            <h3 class='card-header rounded-bottom head2'>${moment().add(i, 'days').format('dddd M/D')} <img src='http://openweathermap.org/img/wn/${upcoming.daily[i].weather[0].icon}.png'></h3>
            <div class='card-body'>
                <p class= 'card-text main-text day'>Temp: ${parseInt(upcoming.daily[i].temp.max)}°F / ${parseInt(upcoming.daily[i].temp.min)}°F</p>
                <p class= 'card-text main-text day'>Wind Speed: ${upcoming.daily[i].wind_speed}mph</p>
                <p class= 'card-text main-text day'>Humidity: ${upcoming.daily[i].humidity}%</p>
            </div>
        </div>
        `)
    }
}

var prevButtonHandler = function(event) {
    cityInfo = $(this).text();
    getCurrentWeather(cityInfo);
    $('.weatherBox').remove();
    populateSearches();
};


var clickEventHandler = (event) => {
    event.preventDefault();
    cityInfo = $('#citySearch').val();
    if (cityInfo === "") {
        alert('Please enter the name of a city');
        return;
    }
    $('.weatherBox').remove();
    getCurrentWeather(cityInfo);
    storeSearches();
    populateSearches();
    console.log(searches)
};




$('.btn').on('click', clickEventHandler)
$('.button-factory').on('click', '.prev', prevButtonHandler);
