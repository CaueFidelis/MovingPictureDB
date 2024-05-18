const axios = require('axios');

// Get a IMDB Movie Details
async function getIMDBMovieDetails(imdbId) {
  const url = 'https://imdb146.p.rapidapi.com/v1/title/';
  const options = {
    method: 'GET',
    url: 'https://imdb146.p.rapidapi.com/v1/title/',
    params: { id: imdbId },
    headers: {
      'X-RapidAPI-Key': '8b3f6ec49amsh7476e6db136a9b9p1f7c42jsna55643d87194',
      'X-RapidAPI-Host': 'imdb146.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.get(url, options);
    const imdbData = response.data;

    const awards =
      imdbData.prestigiousAwardSummary === null
        ? 0
        : imdbData.prestigiousAwardSummary.award.text;
    const diretor =
      imdbData.directorsPageTitle[0].credits[0].name.nameText.text;
    const elenco = imdbData.castPageTitle.edges
      .map((currentActor) => currentActor.node.name.nameText.text)
      .join(', ');

    return { awards, diretor, elenco };
  } catch (error) {
    throw error;
  }
}

// Get a Movie Details
async function getMovieDetails(id) {
  const requestUrl = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmVlNzE3Y2MxNGM5NjM2ZWRjNDYxZjgwM2M3YmY5MSIsInN1YiI6IjY1ZmYwOWNkMTk3ZGU0MDE2MzE2Yzg5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q5s093nw_ti1Ee_Vrrj2TJzmfyJxBz6stuDugLUM2dI',
    },
  };

  return axios
    .get(requestUrl, options)
    .then(async (response) => {
      const data = response.data;

      const currentMovieDetails = {
        id_do_filme: data.id,
        id_do_imdb: data.imdb_id ? data.imdb_id : '',
        nome_do_filme: data.original_title,
        rating: data.vote_average,
        ano_lancamento: data.release_date,
        url_image: `https://image.tmdb.org/t/p/w500/${data.poster_path}`,
        genero: data.genres
          .map((genre) => `${genre.id}-${genre.name}`)
          .join(', '),
        data_insercao: new Date(),
      };

      // Obter informações adicionais do filme da API IMDb
      const imdbData = await getIMDBMovieDetails(
        currentMovieDetails.id_do_imdb,
      );

      // Mesclar os novos dados com o objeto existente
      const mergedMovieDetails = { ...currentMovieDetails, ...imdbData };

      // Retornar os detalhes do filme mesclados
      return mergedMovieDetails;
    })
    .catch((error) => {
      throw error;
    });
}

// Per Year
async function searchMoviesPerYear({ page, year, pageLimit }) {
  let allMovies = [];
  let promises = [];

  for (let currentPage = 1; currentPage <= pageLimit; currentPage++) {
    const requestUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=${currentPage}&sort_by=popularity.desc&year=${year}`;
    const options = {
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmVlNzE3Y2MxNGM5NjM2ZWRjNDYxZjgwM2M3YmY5MSIsInN1YiI6IjY1ZmYwOWNkMTk3ZGU0MDE2MzE2Yzg5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q5s093nw_ti1Ee_Vrrj2TJzmfyJxBz6stuDugLUM2dI',
      },
    };

    const promise = axios
      .get(requestUrl, options)
      .then((response) => {
        const data = response.data.results;

        data.forEach((specificMovie) => {
          const currentMovieDetails = {
            Id_do_filme: specificMovie.id,
            Id_do_imdb: specificMovie.imdb_id ? specificMovie.imdb_id : '',
            Nome_do_filme: specificMovie.original_title,
            rating: specificMovie.vote_average,
            ano_lancamento: specificMovie.release_date,
            url_image: `https://image.tmdb.org/t/p/w500/${specificMovie.poster_path}`,
            genero: specificMovie.genre_ids.map((id) => id).join(', '),
            Data_insersão: new Date(),
          };

          allMovies.push(currentMovieDetails);
        });
      })
      .catch((error) => {
        throw error;
      });

    promises.push(promise);
  }

  // Aguarda todas as promessas serem resolvidas
  await Promise.all(promises);

  return allMovies;
}

// Top Rated
async function topRatedMovies({ page }) {
  const requestUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmVlNzE3Y2MxNGM5NjM2ZWRjNDYxZjgwM2M3YmY5MSIsInN1YiI6IjY1ZmYwOWNkMTk3ZGU0MDE2MzE2Yzg5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q5s093nw_ti1Ee_Vrrj2TJzmfyJxBz6stuDugLUM2dI',
    },
  };
  let allMovies = [];
  let promises = [];

  const promise = axios
    .get(requestUrl, options)
    .then((response) => {
      const data = response.data.results;

      data.forEach((specificMovie) => {
        const currentMovieDetails = {
          id_do_filme: specificMovie.id,
          Id_do_imdb: specificMovie.imdb_id ? specificMovie.imdb_id : '',
          nome_do_filme: specificMovie.original_title,
          rating: specificMovie.vote_average,
          ano_lancamento: specificMovie.release_date,
          url_image: `https://image.tmdb.org/t/p/w500/${specificMovie.poster_path}`,
          genero: specificMovie.genre_ids.map((id) => id).join(', '),
          data_insercao: new Date(),
        };

        allMovies.push(currentMovieDetails);
      });
    })
    .catch((error) => {
      throw error;
    });

  promises.push(promise);

  // Aguarda todas as promessas serem resolvidas
  await Promise.all(promises);

  return allMovies;
}

// All Genres
async function allGenres(language) {
  const requestUrl = `https://api.themoviedb.org/3/genre/movie/list?language=${
    language ? language : 'pt-BR'
  }`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmVlNzE3Y2MxNGM5NjM2ZWRjNDYxZjgwM2M3YmY5MSIsInN1YiI6IjY1ZmYwOWNkMTk3ZGU0MDE2MzE2Yzg5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q5s093nw_ti1Ee_Vrrj2TJzmfyJxBz6stuDugLUM2dI',
    },
  };
  let allGenres = [];
  let promises = [];

  const promise = axios
    .get(requestUrl, options)
    .then((response) => {
      response.data.genres.forEach((genre) => {
        allGenres.push(genre);
      });
    })
    .catch((error) => {
      throw error;
    });

  promises.push(promise);

  // Aguarda todas as promessas serem resolvidas
  await Promise.all(promises);

  return allGenres;
}

// Cast of the specific movie
async function getMovieCast({ movieTMBDId, language, limit }) {
  const requestUrl = `https://api.themoviedb.org/3/movie/${movieTMBDId}/credits?language=${
    language ? language : 'pt-BR'
  }`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmVlNzE3Y2MxNGM5NjM2ZWRjNDYxZjgwM2M3YmY5MSIsInN1YiI6IjY1ZmYwOWNkMTk3ZGU0MDE2MzE2Yzg5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q5s093nw_ti1Ee_Vrrj2TJzmfyJxBz6stuDugLUM2dI',
    },
  };
  let cast = [];
  let promises = [];

  const promise = axios
    .get(requestUrl, options)
    .then((response) => {
      const result = response.data.cast;

      for (let i = 0; i < result.length && i < limit; i++) {
        cast.push(result[i]);
      }
    })
    .catch((error) => {
      throw error;
    });

  promises.push(promise);

  // Aguarda todas as promessas serem resolvidas
  await Promise.all(promises);

  return cast;
}

async function getMovieDirectors({ movieTMBDId, language, limit }) {
  const requestUrl = `https://api.themoviedb.org/3/movie/${movieTMBDId}/credits?language=${
    language ? language : 'pt-BR'
  }`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmVlNzE3Y2MxNGM5NjM2ZWRjNDYxZjgwM2M3YmY5MSIsInN1YiI6IjY1ZmYwOWNkMTk3ZGU0MDE2MzE2Yzg5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q5s093nw_ti1Ee_Vrrj2TJzmfyJxBz6stuDugLUM2dI',
    },
  };
  let directors = [];
  let promises = [];

  const promise = axios
    .get(requestUrl, options)
    .then((response) => {
      const result = response.data.crew;

      for (let i = 0; i < result.length && i < limit; i++) {
        if (
          result[i].department === 'Directing' ||
          result[i].department === 'Writing'
        ) {
          const departmentPtBr = {
            Directing: 'Diretor',
            Writing: 'Escritor',
          };
          directors.push(
            `${result[i].name} (${departmentPtBr[result[i].department]})`,
          );
        }
      }
    })
    .catch((error) => {
      throw error;
    });

  promises.push(promise);

  // Aguarda todas as promessas serem resolvidas
  await Promise.all(promises);

  return directors;
}

module.exports = {
  getMovieDetails,
  searchMoviesPerYear,
  topRatedMovies,
  allGenres,
  getMovieCast,
  getMovieDirectors,
};
