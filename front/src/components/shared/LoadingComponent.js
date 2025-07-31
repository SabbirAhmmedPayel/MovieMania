import React from 'react';

const LoadingComponent = ({ 
  type = 'page', // 'page', 'grid', 'slider'
  count = 10,
  title = 'Loading...',
  message = 'Finding the best movies for you'
}) => {
  if (type === 'page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-white">Loading Cinema Magic...</h3>
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-3 ">
            <div className="aspect-[3/4] bg-gray-700/50 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
            <div className="h-3 bg-gray-700/50 rounded mb-1"></div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 bg-gray-700/50 rounded flex-1"></div>
              <div className="h-3 bg-gray-700/50 rounded flex-1"></div>
            </div>
            <div className="h-6 bg-gray-700/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'slider') {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl p-3 animate-pulse">
              <div className="aspect-[3/4] bg-gray-700/50 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
              <div className="h-3 bg-gray-700/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default section loading
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-gray-400">{title}</span>
      </div>
    </div>
  );
};

export default LoadingComponent;