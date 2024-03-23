const imdbApi = require("./lib/imdb-node-api");

// Movie Details of a specific movie by ID
imdbApi
  .getMovieDetails(572802)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log("erro", error);
  });

// Movies Per Year - 20 movies per page
imdbApi
  .searchMoviesPerYear({ page: 1, year: 2023 })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

// Top Rated Movies - 20 per page
imdbApi
  .topRatedMovies({ page: 1 })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
