import React from 'react';

const ErrorComponent = ({ 
  type = 'page', // 'page', 'section', 'inline'
  title = 'Oops! Something went wrong',
  message = 'Unable to load content',
  onRetry,
  retryText = 'Try Again'
}) => {
  if (type === 'page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="text-6xl animate-bounce">🎭</div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1 mx-auto"
            >
              <span>🔄</span>
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'section') {
    return (
      <div className="text-center py-12 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-600/50">
        <div className="text-4xl mb-3 opacity-60">😔</div>
        <h3 className="text-lg font-semibold text-red-400 mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            {retryText}
          </button>
        )}
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="text-center py-8 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-600/50">
        <div className="text-3xl mb-2 opacity-60">😔</div>
        <p className="text-gray-400 text-sm">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            {retryText}
          </button>
        )}
      </div>
    );
  }

  // Default error display
  return (
    <div className="text-center py-4">
      <span className="text-red-400 text-sm">⚠️ {message}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="ml-2 text-xs text-blue-400 hover:text-blue-300 underline"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorComponent;