const imdbApi = require("./lib/imdb-node-api");

// Movie Details
imdbApi
  .getMovieDetails(949697)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log("erro", error);
  });

// Per Year
imdbApi
  .searchMoviesPerYear({ page: 1, year: 2022 })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// Top Rated
imdbApi
  .topRatedMovies({ page: 1 })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
