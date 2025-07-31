import React, { useState } from "react";
import { Link } from "react-router-dom";

function MovieList({ movies }) {
  const [sortField, setSortField] = useState("default");
  const [sortOrder, setSortOrder] = useState("desc");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");

  if (!movies || movies.length === 0) {
    return <div className="text-center text-red-400 py-10">No movies found.</div>;
  }

  const filteredMovies = movies.filter((movie) => {
    const year = parseInt(movie.year);
    const min = parseInt(yearMin) || 0;
    const max = parseInt(yearMax) || 9999;
    return year >= min && year <= max;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let valA = a[sortField] || 0;
    let valB = b[sortField] || 0;

    if (["runtime", "votes", "rating", "year"].includes(sortField)) {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    }

    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    if (sortOrder === "desc") return valA < valB ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Movie List</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex flex-col">
          <label className="text-white text-sm font-medium">Sort By</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="select select-sm bg-slate-800 text-white"
          >
            <option value="default">None</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
            <option value="runtime">Runtime</option>
            <option value="votes">Votes</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-white text-sm font-medium">Order</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-sm bg-slate-800 text-white"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-white text-sm font-medium">From Year</label>
          <input
            type="number"
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
            placeholder="Start"
            className="input input-sm bg-white text-black border border-gray-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white text-sm font-medium">To Year</label>
          <input
            type="number"
            value={yearMax}
            onChange={(e) => setYearMax(e.target.value)}
            placeholder="End"
            className="input input-sm bg-white text-black border border-gray-400"
          />
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-lg shadow-md overflow-hidden p-3"
          >
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
            ) : (
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-300">
                No Image
              </div>
            )}

            <h3 className="text-lg font-bold text-yellow-400 mt-3">
              <Link to={`/movies/${movie.id}`}>
                {movie.title} ({movie.year})
              </Link>
            </h3>

            <div className="text-sm text-gray-300 mt-2 space-y-1">
              <div>
                ⭐ Rating:{" "}
                <span className="font-semibold">
                  {typeof movie.rating === "number"
                    ? movie.rating % 1 === 0
                      ? movie.rating
                      : movie.rating.toFixed(2)
                    : "N/A"}
                  /10
                </span>
              </div>
              <div>Votes: {movie.votes || "N/A"}</div>
              <div>
                {movie.runtime || "?"} min • {movie.rating_label || "Unrated"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
