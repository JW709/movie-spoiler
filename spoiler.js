//global variables 
const request = require('request');
const cheerio = require('cheerio');
//input from user
let url = "https://www.google.ca/search?q=" + process.argv[2];
let movie = process.argv[2];
let time = parseInt(process.argv[3]);

function moviePlot(movie) {
    var options =
        {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie', //the search movie path
            qs:
                {
                    include_adult: 'false',
                    page: '1',
                    query: movie, //the variable you want to search for, in this case the user's movie choice
                    language: 'en-US',
                    api_key: '73ac886aa7271e9e437345d553ac3900'
                },
            body: '{}'
        };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let movieInfo = JSON.parse(body);
        if (movieInfo.total_results === 0) {
            console.log('Try again with a valid movie title')
        } else if (isNaN(process.argv[3]) || process.argv[3] < 0) {
            console.log('Please enter a valid time (in seconds)')
        } else {
            function spoilerWarning(movieTitle, time) {
                console.log('*******WARNING*******WARNING*******WARNING*******');
                console.log('The plot to *** ' + movieTitle + ' *** will be spoiled in *** ' + time + ' *** seconds.');
            }
            spoilerWarning(movie, time);

            function googleResults(movie) {
                request(url, function (err, response, body) {
                    let url = "https://www.google.ca/search?q=" + process.argv[2] + 'film';
                    console.log('*******Here are some headlines to catch up on while you wait*******');
                    if (!err) {
                        const $ = cheerio.load(body)
                        //h3.r >a = targets the h3 class with anchor tag in child element containing the link title text
                        $("h3.r>a").each(function (i, link) {
                            console.log($(this).text());
                        })
                    }
                });
            }
            googleResults(movie)
            setTimeout(() => {
                console.log('******SPOILER ALERT******SPOILER ALERT******')
                console.log(movieInfo.results[0].overview);
            }, time * 1000);     //plot is in the results object at position [0] with the id of 'overview
        }

    });
}
moviePlot(movie)


