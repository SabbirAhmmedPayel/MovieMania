import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, index,  rankStyle = 'default' }) => {
  const displayRating = movie.rating || movie.weighted_rating || movie.avg_rating || 0;
  const displayVotes = movie.votes || movie.total_votes || 0;

  const renderStars = (rating) => {
    const stars = [];
    const normalizedRating = Math.min(Math.max(rating, 0), 10);
    const fullStars = Math.floor(normalizedRating / 2);
    const hasHalfStar = (normalizedRating % 2) >= 1;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400 text-xs">★</span>);
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(<span key="half" className="text-yellow-400 opacity-60 text-xs">★</span>);
    }

    const emptyStars = 5 - Math.ceil(normalizedRating / 2);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-600 text-xs">☆</span>);
    }

    return stars;
  };

  const formatBoxOffice = (boxoffice) => {
    if (!boxoffice) return null;
    const amount = parseInt(boxoffice);
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  const getRankBadgeStyle = () => {
    switch (rankStyle) {
      case 'grossing':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black';
      case 'rated':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'voted':
        return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
      default:
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-orange-400/30 transition-all duration-300 group overflow-hidden h-full w-full relative">

      {/* Box Office Badge for grossing movies */}
      {rankStyle === 'grossing' && movie.boxoffice && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          {formatBoxOffice(movie.boxoffice)}
        </div>
      )}

      {/* Movie Poster */}
      <Link to={`/movies/${movie.id}`} className="block">
        <div className={`relative rounded-lg overflow-hidden aspect-[3/4] mb-2`}>
          <img 
            src={movie.poster_url || '/images/placeholder.jpg'} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            <span className="bg-black/70 backdrop-blur-sm px-1 py-0.5 rounded text-white text-xs font-medium">
              {movie.year}
            </span>
            {movie.runtime && (
              <span className="bg-black/70 backdrop-blur-sm px-1 py-0.5 rounded text-white text-xs font-medium">
                {movie.runtime}m
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Movie Info */}
      <div className="space-y-2">
        {/* Movie Title */}
        <Link to={`/movies/${movie.id}`}>
          <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-orange-400 transition-colors cursor-pointer hover:text-orange-300 leading-tight min-h-[2.5rem]">
            {movie.title}
          </h4>
        </Link>
        
        {/* Rating Section */}
        <div className="bg-gray-800/50 rounded-lg p-2 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-orange-400">{displayRating.toFixed(1)}</span>
              <span className="text-xs text-gray-400 font-medium">/10</span>
              <div className="flex ml-1">
                {renderStars(displayRating)}
              </div>
            </div>
            <span className="text-xs text-gray-400">{displayVotes.toLocaleString()} votes</span>
          </div>
          
          {/* Rating Category */}
          <div className="text-center">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              displayRating >= 8 ? 'bg-green-800/30 text-green-400' :
              displayRating >= 6 ? 'bg-yellow-800/30 text-yellow-400' :
              displayRating >= 4 ? 'bg-orange-800/30 text-orange-400' :
              'bg-red-800/30 text-red-400'
            }`}>
              {displayRating >= 8 ? 'Excellent' :
               displayRating >= 6 ? 'Good' :
               displayRating >= 4 ? 'Fair' : 'Poor'}
            </span>
          </div>
        </div>

        {/* Movie Details */}
        <div className="flex flex-wrap gap-1">
          {movie.rating_label && (
            <span className="px-1 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
              {movie.rating_label}
            </span>
          )}
          {movie.budget && parseInt(movie.budget) > 0 && (
            <span className="px-1 py-0.5 bg-green-800/30 text-green-400 rounded text-xs">
              ${(parseInt(movie.budget) / 1000000).toFixed(1)}M
            </span>
          )}
          {movie.boxoffice && parseInt(movie.boxoffice) > 0 && rankStyle !== 'grossing' && (
            <span className="px-1 py-0.5 bg-blue-800/30 text-blue-400 rounded text-xs">
              Box: {formatBoxOffice(movie.boxoffice)}
            </span>
          )}
        </div>

        {/* Genre Tags */}
        {movie.genre && (
          <div className="flex flex-wrap gap-1">
            {movie.genre.split(',').slice(0, 2).map((genre, index) => (
              <span key={index} className="px-1 py-0.5 bg-purple-800/30 text-purple-400 rounded text-xs">
                {genre.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Plot */}
        {movie.plot && (
          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
            {movie.plot.length > 60 
              ? `${movie.plot.substring(0, 60)}...` 
              : movie.plot
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;