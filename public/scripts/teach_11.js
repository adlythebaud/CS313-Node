console.log('teach_11');

var resultsContainer = document.querySelector('#results');
var submit = document.querySelector('#submit');

submit.addEventListener("click", sendPost);

function getMoreDetails(imdbID) {
    
    var moreDetailsContainer = document.querySelector('#' + imdbID);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           
            var results = JSON.parse(this.responseText);
            
            console.log(results);
            
            moreDetailsContainer.innerHTML += '<div>' + '<img src=' + "\'" + results.Poster + "\'" + '></div>';
            moreDetailsContainer.innerHTML += '<div>' + results.Year + '</div>';
            moreDetailsContainer.innerHTML += '<div>' + results.Rated + '</div>';
            moreDetailsContainer.innerHTML += '<div>' + results.Plot + '</div>';
            
        }
    };

    xhttp.open("get", "https://www.omdbapi.com/?apikey=a6a64cc5&i="+imdbID, true);
    xhttp.send();
}

function sendPost() {
    var search = document.querySelector('#search').value;
    console.log(search);
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           
            var results = JSON.parse(this.responseText);
            console.log(results.Search[0].Title);
            console.log(results);
            
            for (var i = 0; i < results.Search.length; i++) {
                                 
                var movie = "<p>" + results.Search[i].Title + "</p>";
               
                var moreDetailsButton = '<button onclick="getMoreDetails(\'' + results.Search[i].imdbID + '\')" class="moreDetails">View More Details</button>';

                var moreDetailsContainer = '<div id="' + results.Search[i].imdbID + '"></div>';
                resultsContainer.innerHTML += movie;
                resultsContainer.innerHTML += moreDetailsButton;
                resultsContainer.innerHTML += moreDetailsContainer;

            }
        }
    };


    xhttp.open("get", "http://www.omdbapi.com/?apikey=a6a64cc5&s="+search, true);
    xhttp.send();
}

