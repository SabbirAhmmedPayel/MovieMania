import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from './MovieList';

function MoviesByGenrePage() {
  const { name } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/genres/genre/${name}`);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [name]);

  if (loading) return <p>Loading movies for genre "{name}"...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{name} : Movies</h1>
      <MovieList movies={movies} />
    </div>
  );
}

export default MoviesByGenrePage;
