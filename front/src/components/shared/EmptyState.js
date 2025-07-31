import React from 'react';

const EmptyState = ({ 
  icon = '🎬',
  title = 'No content found',
  message = 'There is nothing to display at the moment.',
  actionText,
  onAction,
  type = 'default' // 'default', 'search', 'rating', 'voting'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'search':
        return {
          icon: '🔍',
          title: 'No movies found',
          message: 'Try adjusting your search criteria'
        };
      case 'rating':
        return {
          icon: '⭐',
          title: 'No rated movies yet',
          message: 'Be the first to rate and review movies!'
        };
      case 'voting':
        return {
          icon: '🗳️',
          title: 'No voted movies yet',
          message: 'Start voting to see the most popular movies!'
        };
      default:
        return { icon, title, message };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="text-center py-12 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-600/50">
      <div className="text-4xl mb-3 opacity-60">
        {styles.icon}
      </div>
      <h3 className="text-lg font-semibold text-orange-400 mb-1">
        {styles.title}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {styles.message}
      </p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;