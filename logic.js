


$(".btn-secondary").on("click", function (event) {
    event.preventDefault();
    var term = $("#searchTerm").val();
    console.log(term);
    var queryURL = "api.openweathermap.org/data/2.5/forecast?q=" + term + "&appid=eaf6bb01cac6c92c0bc6a9beb7ad33a8"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

    });
});