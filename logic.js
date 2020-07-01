
var searches = [];
//create and populate search history
function searchHistory() {
    $('#searchHistory').empty();
    searchesSaved = JSON.parse(localStorage.getItem('searches'));
    if (searchesSaved) {
        searches = searchesSaved;
    }
    else {
        console.log("No saved info");
    }
    for (i = 0; i < searches.length; i++) {
        var search = $("<button>");
        search.text(searches[i])
        search.attr("class", "btn btn-danger mb-1 searchList");
        search.attr("type", "button");
        search.attr("data-term", searches[i]);
        search.attr("style", "width: 100%");
        $('#searchHistory').prepend(search)
    }
}

function currentWeather(term) {
    //runs search for the current weather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + term + "&appid=eaf6bb01cac6c92c0bc6a9beb7ad33a8"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        //save searches
        searches.push(response.name);
        var unique = [];
        $.each(searches, function (i, el) {
            if ($.inArray(el, unique) === -1) unique.push(el);
        });
        searches = unique;
        localStorage.setItem('searches', JSON.stringify(searches));
        searchHistory();
        //get todays date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = '(' + mm + '/' + dd + '/' + yyyy + ')';
        console.log(today);
        //get infor for current weather and display
        var temp = (response.main.temp - 273.15) * 1.80 + 32;
        console.log(temp);
        $("#title").text(response.name + " " + today);
        $("#temp").html("Temperature: " + temp.toFixed(2) + " &#176;F");
        $("#hum").text("Humidity: " + response.main.humidity + "%");
        $("#wind").text("Wind speed: " + response.wind.speed + "MPH");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log(lat);
        console.log(lon);
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=eaf6bb01cac6c92c0bc6a9beb7ad33a8&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $("#uv").text("UV Index: " + response.value);
        });
    });
}

function forecast(term) {
    //runs search for the current weather
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + term + "&appid=eaf6bb01cac6c92c0bc6a9beb7ad33a8"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var j = 0;
        for (i = 0; i < 36; i = i + 8) {
            var date = response.list[i].dt_txt;
            date = date.slice(0, 10);
            var temp = (response.list[i].main.temp - 273.15) * 1.80 + 32;;
            var hum = response.list[i].main.humidity;
            $("#temp" + j).html("Temp: " + temp.toFixed(2) + "&#176;F");
            $("#hum" + j).html("Humidity: " + hum + "%");
            $("#date" + j).html(date);
            j++;
        }

    });
}


$(".btn-secondary").on("click", function (event) {
    event.preventDefault();
    var term = $("#searchTerm").val();
    currentWeather(term);
    forecast(term);
    searchHistory();
});

$(".card-body").on("click", function () {
    console.log("hello");
    if (event.target.matches(".btn")) {
        var term = event.target;
        term = term.getAttribute("data-term");
        currentWeather(term);
        forecast(term);
        searchHistory();
    }

});

searchHistory();