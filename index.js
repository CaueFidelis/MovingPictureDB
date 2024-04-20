const imdbApi = require('./lib/imdb-node-api');
const { insertMoviesIntoDB } = require('./lib/mysql');

// SELECT
// db.query('', function(error, rows, fields){
//   if(!error) {
//     console.log('Resultado:', rows)
//   } else {
//     console.log('Erro', error)
//   }
// });

// Movie Details of a specific movie by ID
// imdbApi
//   .getMovieDetails(572802)
//   .then((result) => {
//     console.log('MOVIE DETAILS', result.length);
//   })
//   .catch((error) => {
//     console.log('erro', error);
//   });

// Movies Per Year - 20 movies per page
imdbApi
  .searchMoviesPerYear({ page: 1, year: 2023 })
  .then(async (result) => {
    // Insert no banco
    insertMoviesIntoDB({ movies: result });
  })
  .catch((error) => {
    console.error(error);
  });

// Top Rated Movies - 20 per page
// imdbApi
//   .topRatedMovies({ page: 1 })
//   .then((result) => {
//     console.log('Top Rated Movies', result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
