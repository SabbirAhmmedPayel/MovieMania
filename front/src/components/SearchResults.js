import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from './shared/MovieCard';
import LoadingComponent from './shared/LoadingComponent';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get('text') || '';
  const searchType = query.get('searchType') || 'movie';

  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [genres, setGenres] = useState('');
  const [actors, setActors] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page] = useState(1);

  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1, limit: 120, total: 0, totalPages: 1,
    hasNext: false, hasPrevious: false, nextPage: null, previousPage: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [persons, setPersons] = useState([]);
  const [moviePersons] = useState([]);

  const buildApiUrl = () => {
    const params = new URLSearchParams();
    params.append('text', searchTerm);
    params.append('searchType', searchType);
    if (startYear) params.append('startYear', startYear);
    if (endYear) params.append('endYear', endYear);
    if (minRating) params.append('minRating', minRating);
    if (maxRating) params.append('maxRating', maxRating);
    if (genres) params.append('genres', genres);
    if (actors) params.append('actors', actors);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (page !== 1) params.append('page', page);
    params.append('limit', 1200);

    return `http://localhost:3000/api/movies/search?${params.toString()}`;
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(buildApiUrl())
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => {
        setMovies(data.results || []);
        setPagination(data.pagination);
      })
      .catch(() => setError('Failed to load search results'))
      .finally(() => setLoading(false));
  }, [searchTerm, searchType, startYear, endYear, minRating, maxRating, genres, actors, sortBy, sortOrder, page]);

  useEffect(() => {
    fetch('http://localhost:3000/api/genres')
      .then(res => res.json())
      .then(data => setAllGenres(data.genres || []))
      .catch(() => setAllGenres([]));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/movie-persons/persons')
      .then(res => res.json())
      .then(data => setPersons(data))
      .catch(() => setPersons([]));
  }, []);

  const selectedGenres = genres ? genres.split(',') : [];
  const selectedActors = actors ? actors.split(',') : [];
  const allActors = persons.filter(p => ['actor', 'actress'].includes(p.role?.toLowerCase()));

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setStartYear(value);
  };

  const handleActorChange = (e) => {
    const value = e.target.value;
    setEndYear(value);
  };

  const getActorsForMovie = (movieId) => {
    const actorIds = moviePersons.filter(mp => mp.movie_id === movieId).map(mp => mp.person_id);
    return persons
      .filter(p => actorIds.includes(p.id) && p.role === 'actor')
      .map(p => p.name)
      .join(', ');
  };

  const filteredMovies = movies.filter(movie => {
    const movieActorNames = movie.actors ? movie.actors.split(',').map(a => a.trim()) : [];
    return selectedActors.every(actor => movieActorNames.includes(actor));
  });

  const filterBar = (
    <div className="flex flex-wrap gap-4 items-start mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
      <input type="text" value={startYear} onChange={e => setStartYear(e.target.value)} placeholder="Start Year" className="input input-sm bg-white text-black border border-gray-400" />
      <input type="text" value={endYear} onChange={e => setEndYear(e.target.value)} placeholder="End Year" className="input input-sm bg-white text-black border border-gray-400" />

      <select value={minRating} onChange={e => setMinRating(e.target.value)} className="select select-sm bg-slate-800 text-white">
        <option value="">Min Rating</option>
        {[...Array(11).keys()].map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <select value={maxRating} onChange={e => setMaxRating(e.target.value)} className="select select-sm bg-slate-800 text-white">
        <option value="">Max Rating</option>
        {[...Array(11).keys()].map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      {/* Genres */}
      <div className="flex flex-col">
        <label className="text-xs text-white-700 font-semibold mb-1">Genres</label>
        <div className="border border-green-600 rounded bg-white text-gray-800 p-2 space-y-1 h-32 overflow-y-auto">
          {allGenres.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <label
                key={genre}
                className={`flex items-center gap-2 text-sm px-1 py-0.5 rounded cursor-pointer ${
                  isSelected ? 'bg-green-100 text-green-800' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    const updated = isSelected
                      ? selectedGenres.filter((g) => g !== genre)
                      : [...selectedGenres, genre];
                    setGenres(updated.join(','));
                  }}
                />
                {genre}
              </label>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setGenres(allGenres.join(','))} className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">Select All</button>
          <button onClick={() => setGenres('')} className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200">Clear</button>
        </div>
      </div>

      {/* Actors */}
      <div className="flex flex-col">
        <label className="text-xs text-white-700 font-semibold mb-1">Actors</label>
        <div className="border border-blue-600 rounded bg-white text-gray-800 p-2 space-y-1 h-32 overflow-y-auto">
          {allActors.map((actor) => {
            const isSelected = selectedActors.includes(actor.name);
            return (
              <label
                key={actor.id}
                className={`flex items-center gap-2 text-sm px-1 py-0.5 rounded cursor-pointer ${
                  isSelected ? 'bg-blue-100 text-blue-800' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    const updated = isSelected
                      ? selectedActors.filter((a) => a !== actor.name)
                      : [...selectedActors, actor.name];
                    setActors(updated.join(','));
                  }}
                />
                {actor.name}
              </label>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setActors(allActors.map(a => a.name).join(','))} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">Select All</button>
          <button onClick={() => setActors('')} className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200">Clear</button>
        </div>
      </div>

      <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select select-sm bg-slate-800 text-white">
        <option value="title">Title</option>
        <option value="rating">Rating</option>
        <option value="votes">Votes</option>
        <option value="year">Year</option>
        <option value="boxoffice">Box Office</option>
      </select>
      <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="select select-sm bg-slate-800 text-white">
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );

  if (loading) return <LoadingComponent type="grid" title="Searching movies..." />;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Search Results for: <span className="text-yellow-400">"{searchTerm}"</span> <span className="text-sm text-gray-400">({searchType})</span>
      </h2>
      {filterBar}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            extra={
              <div className="mt-2 text-xs text-gray-300">
                <div>Year: <span className="font-semibold">{movie.year || '-'}</span></div>
                <div>Rating: <span className="font-semibold">{movie.rating || '-'}</span></div>
                <div>Actors: <span className="font-semibold">{getActorsForMovie(movie.id) || '-'}</span></div>
                <div>Genres: <span className="font-semibold">{movie.genre || '-'}</span></div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
