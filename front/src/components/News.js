import React from 'react';
import '../styles/News.css';

function News() {
  const newsList = [
    {
      title: 'Iron Fist MCU Return Hinted By Jona Xiao’s Eyes Of Wakanda Role',
      link: 'https://screenrant.com/mcu-iron-fist-jona-xiao-eyes-of-wakanda/',
      image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2024/08/danny-rand-using-the-iron-fist-in-the-defenders.jpg?q=70&fit=crop&w=1140&h=&dpr=1', // use working image URL
    },
    {
      title: 'MCU Phase 6 Villain Rumors Spark Fan Theories',
      link: 'https://screenrant.com/how-to-train-your-dragon-2025-movie-606-million-global-box-office-milestone/',
      image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2025/07/hiccup-excitedly-holding-up-a-saddle-in-how-to-train-your-dragon-2025.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
    },
  ];

  return (
    <div className="news-container">
      <h2>📰 Movie & Series News</h2>
      <div className="news-grid">
        {newsList.map((news, index) => (
          <a
            href={news.link}
            key={index}
            className="news-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={news.image} alt={news.title} />
            <div className="news-info">
              <h3>{news.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default News;
