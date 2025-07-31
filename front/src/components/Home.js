import { Link } from "react-router-dom";
import "../styles/Home.css"; // Make sure you have this CSS file
import TopUsers from './TopUsers';


function Home() {
  return (
     
    <div className="home-wrapper">
      <section className="intro">
        <h2>Your source for everything movies</h2>
        <p>
          Discover reviews, trailers, and ratings for your favorite films.
          <br />
          
        </p>
      </section>

      <div className="center-link">
        <Link to="/allmovies">View All Movies →</Link>
      </div>

      <div className="sidebar">
        <small>
          Are you an editor?{" "}
          <a href="/editor" className="editor-link">
            Click here
          </a>
        </small>

       
 <TopUsers></TopUsers>
      
        
       
      </div>
    </div>
  );
}

export default Home;
