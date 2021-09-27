'use strict';

const searchForm = document.getElementById('search-form'),
  listToCreate = document.getElementById('body-listing');

const createListOfMovies = moviesList => {
  listToCreate.innerHTML = '';

  moviesList.map(({ poster_path, original_title, overview }) => {
    const movieBanner = document.createElement('div'),
      image = document.createElement('img'),
      title = document.createElement('div'),
      movieOverview = document.createElement('span');

    image.src = poster_path;
    title.innerText = original_title;
    movieOverview.innerText = overview.toString().slice(0, 100).concat('...');
    movieBanner.className = 'movie-banner';

    movieBanner.appendChild(image);
    movieBanner.appendChild(title);
    movieBanner.appendChild(movieOverview);

    listToCreate.appendChild(movieBanner);
  });
};

window.addEventListener('load', () => {
  fetch('/api/trending')
    .then(r => r.json())
    .then(j => createListOfMovies(j))
    .catch(e => console.error(e));
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const searchQuery = e.target[0].value;
  fetch(`/api/search/${searchQuery}`)
    .then(r => r.json())
    .then(j => {
      const bodyHeading = document.getElementById('body-heading');
      bodyHeading.innerText = `Search results for ${searchQuery}`;
      createListOfMovies(j);
    })
    .catch(e => console.error(e));
});
