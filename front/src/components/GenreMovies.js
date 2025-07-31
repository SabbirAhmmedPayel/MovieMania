// GenreMovies.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function GenreMovies({ genre }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!genre) return;

    api.get(`/genres/genre/${genre}`)
      .then(res => setMovies(res.data.movies))
      .catch(err => console.error('Error fetching movies', err));
  }, [genre]);

  return (
    <div>
      <h4>Movies in "{genre}" Genre</h4>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default GenreMovies;
