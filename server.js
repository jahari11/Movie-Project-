const express = require('express'),
  dotEnv = require('dotenv').config(),
  axios = require('axios'),
  port = process.env.PORT,
  api = process.env.API_URL,
  key = process.env.API_KEY,
  image_path = process.env.IMAGE_URL,
  app = express();

app.use(express.static('public'));

const getRelevantInfoFromMoviesList = moviesList => {
  return [
    ...moviesList.map(function ({ original_title, overview, poster_path }) {
      return {
        original_title: original_title ?? 'Unknown Title',
        overview: overview ?? 'No Overview Avaliable',
        poster_path: `${image_path}${
          poster_path ?? 'sH6030EbSzOUTFFZrpnTdSpeNP0.jpg'
        }`,
      };
    }),
  ];
};

app.get('/api/trending', (_, res) => {
  axios
    .get(`${api}trending/movie/week?api_key=${key}`)
    .then(r => {
      const trendingMovies = getRelevantInfoFromMoviesList(r.data.results);
      res.status(200).json(trendingMovies);
    })
    .catch(e => res.status(500).json(e));
});

app.get('/api/search/:movieSearchQuery', (req, res) => {
  axios
    .get(
      `${api}search/movie?api_key=${key}&language=en-US&query=${req.params.movieSearchQuery}`
    )
    .then(r => {
      const searchResults = getRelevantInfoFromMoviesList(r.data.results);
      res.status(200).json(searchResults);
    })
    .catch(e => res.status(500).json(e));
});

app.get('/', (req, res) => res.sendFile('./public/index.html'));

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
