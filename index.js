const imdbApi = require('./lib/imdb-node-api');
const { insert, select, update } = require('./lib/mysql');

/* 
  Funções de consulta da API do TMDB
*/

// Movie Details of a specific movie by ID
async function showMovieDetails({ tmdbMovieId }) {
  imdbApi
    .getMovieDetails(tmdbMovieId)
    .then((result) => {
      console.log('MOVIE DETAILS', result);
    })
    .catch((error) => {
      console.log('erro', error);
    });
}

// Movies Per Year - 20 movies per page
async function showMoviesPerYear({ page, year, pageLimit }) {
  imdbApi
    .searchMoviesPerYear({ page, year, pageLimit })
    .then(async (result) => {
      console.log('Filmes', result);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Top Rated Movies - 20 per page
async function showTopRatedMovies(page) {
  imdbApi
    .topRatedMovies({ page })
    .then((result) => {
      console.log('Top Rated Movies', result);
    })
    .catch((error) => {
      console.error(error);
    });
}

// showMovieDetails({ tmdbMovieId: 597 });

// showMoviesPerYear({ page: 1, year: 2023, pageLimit: 1 });

// showTopRatedMovies(1);

 
/* 
  Funções que interagem com o banco de dados. No sentido de Insert ou Update
*/

// Populating the database with many movies
async function populateDatabaseWithMovies({ page, year, pageLimit }) {
  try {
    imdbApi
      .searchMoviesPerYear({ page, year, pageLimit })
      .then(async (result) => {
        for (const movie of result) {
          await insert({
            table: 'moving_picture.Integ_Filmes',
            data: movie,
            columns:
              'Id_do_filme, Id_do_imdb, Nome_do_filme, rating, ano_lancamento, url_image, genero, Data_insersão',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.error('Failed to populate the database with movies:', err);
  }
}

// Get All Genres and insert into db
async function insertAllGenresIntoDb() {
  try {
    imdbApi
      .allGenres()
      .then(async (result) => {
        for (const genre of result) {
          const data = { ID: genre.id, Categoria: genre.name };
          await insert({
            table: 'moving_picture.categoria',
            data,
            columns: 'ID, Categoria',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.error('Failed to insert all genres into db:', err);
  }
}

// Get the movie cast
async function updateCastOnAllMoviesIntoDB() {
  try {
    const allMovies = await select({
      query: 'SELECT * FROM moving_picture.Integ_Filmes',
    });

    for (const movie of allMovies) {
      const currentTMBDMovieID = movie.Id_do_filme;
      if (!movie.Elenco) {
        await imdbApi
          .getMovieCast({
            limit: 5,
            movieTMBDId: currentTMBDMovieID,
            languague: 'pt-BR',
          })
          .then(async (result) => {
            const castFormated = result
              .map((person) => `${person.original_name} (${person.character})`)
              .join(', ');

            const query =
              'UPDATE moving_picture.Integ_Filmes SET Elenco = ? WHERE Id_do_filme = ?';
            const params = [castFormated, currentTMBDMovieID];

            try {
              const result = await update({ query, params });
              console.log(
                'Rows affected:',
                result.affectedRows,
                'filme atual:',
                currentTMBDMovieID,
              );
            } catch (err) {
              console.error('Failed to update:', err);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  } catch (err) {
    console.error('Failed SELECT:', err);
  }
}

// Get the directors and writters of the movie and insert into db
async function updateDirectorsOnAllMoviesIntoDB() {
  try {
    const allMovies = await select({
      query: 'SELECT * FROM moving_picture.Integ_Filmes',
    });

    for (const movie of allMovies) {
      const currentTMBDMovieID = movie.Id_do_filme;
      if (!movie.diretor) {
        imdbApi
          .getMovieDirectors({
            limit: 5,
            movieTMBDId: currentTMBDMovieID,
            languague: 'pt-BR',
          })
          .then(async (directors) => {
            const directorsFormatted = directors.join(', ');
            const query =
              'UPDATE moving_picture.Integ_Filmes SET diretor = ? WHERE Id_do_filme = ?';
            const params = [directorsFormatted, currentTMBDMovieID];

            try {
              const result = await update({ query, params });
              console.log(
                'filme atual:',
                movie.Nome_do_filme,
                'Rows affected:',
                result.affectedRows,
              );
            } catch (err) {
              console.error('Failed to update:', err);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  } catch (err) {
    console.error('Failed SELECT:', err);
  }
}

// populateDatabaseWithMovies({ page: 1, year: 2023, pageLimit: 90 });

// updateCastOnAllMoviesAtDB();

// updateDirectorsOnAllMoviesAtDB();

// insertAllGenresIntoDb();
