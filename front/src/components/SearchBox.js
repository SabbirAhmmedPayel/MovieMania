import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();

  // Query থেকে initial value নিন
  const params = new URLSearchParams(location.search);
  const initialText = params.get('text') || '';
  const initialType = params.get('searchType') || 'movie';

  const [searchTerm, setSearchTerm] = useState(initialText);
  const [searchType, setSearchType] = useState(initialType);

  // যদি URL query param change হয়, input update করুন
  useEffect(() => {
    setSearchTerm(params.get('text') || '');
    setSearchType(params.get('searchType') || 'movie');
    // eslint-disable-next-line
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?text=${encodeURIComponent(searchTerm)}&searchType=${encodeURIComponent(searchType)}`);
  };

  return (
    <form onSubmit={handleSearch} className="search-box">
      <input
        type="text"
        placeholder="Search movies, actors, genres..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={searchType} onChange={e => setSearchType(e.target.value)}>
        <option value="movie">Movie</option>
        <option value="actor">Actor</option>
        <option value="genre">Genre</option>
      </select>
      <button type="submit">🔍</button>
    </form>
  );
}

export default SearchBox;
