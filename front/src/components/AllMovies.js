//this directory /src/components/AllMovies.js

import React from 'react';
import SearchResults from './SearchResults';

function AllMovies() {
  // Render SearchResults with an empty search term to show all movies
  // We simulate the router location for SearchResults
  const search = '?text=&searchType=movie';
  window.history.replaceState({}, '', `/allmovies${search}`);
  return <SearchResults />;
}

export default AllMovies;
