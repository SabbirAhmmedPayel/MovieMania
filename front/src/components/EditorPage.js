import React, { useState, useEffect } from 'react';
import '../styles/EditorPage.css';
const API_URL = 'http://localhost:3000/api/editor';

function EditorPage({ loggedInUser }) {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: '', release_date: '', plot: '', budget: '', boxoffice: '', runtime: '', poster_url: '', trailer_link: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [searchMovie, setSearchMovie] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch users on mount and after ban
  const fetchUsers = () => {
    fetch('http://localhost:3000/api/editor/users')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : (data.users || [])));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Ban (delete) a user
  const handleBanUser = async username => {
    if (!window.confirm(`Are you sure you want to ban (delete) user '${username}'?`)) return;
    const res = await fetch(`${API_URL}/ban/${username}`, { method: 'DELETE' });
    const data = await res.json();
    setMessage(data.message || data.error);
    fetchUsers();
  };

  // Load movies on mount
useEffect(() => {
  fetch('http://localhost:3000/api/movies')
    .then(res => res.json())
    .then(data => setMovies(Array.isArray(data) ? data : (data.movies || [])));
    
}, []);
  // Reload movies after add/edit/delete
  const reloadMovies = () => {
    fetch('http://localhost:3000/api/movies')
      .then(res => res.json())
      .then(data => setMovies(Array.isArray(data) ? data : (data.movies || [])));
  };

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add or Edit movie
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/edit/${editId}` : `${API_URL}/add`;

    const payload = {
      title: form.title,
      release_date: form.release_date,
      plot: form.plot,
      budget: form.budget,
      boxoffice: form.boxoffice,
      runtime: form.runtime,
      poster_url: form.poster_url,
      trailer_link: form.trailer_link
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message || 'Success!');
      reloadMovies();
      setForm({
        title: '', release_date: '', plot: '', budget: '', boxoffice: '', runtime: '', poster_url: '', trailer_link: ''
      });
      setEditId(null);
      setShowForm(false);
    } else {
      setMessage(data.error || 'Error');
    }
  };

  // Delete movie
  const handleDelete = async id => {
    if (!window.confirm('Delete this movie?')) return;
    const res = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setMessage(data.message || data.error);
    reloadMovies();
  };

  // Edit movie
  const handleEdit = movie => {
    setEditId(movie.id);
    setForm({
      title: movie.title || '',
      release_date: movie.release_date ? movie.release_date.slice(0,10) : '',
      plot: movie.plot || '',
      budget: movie.budget || '',
      boxoffice: movie.boxoffice || '',
      runtime: movie.runtime || '',
      poster_url: movie.poster_url || '',
      trailer_link: movie.trailer_link || ''
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Filter movies for search
  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchMovie.toLowerCase())
  );

  // Filter users for search
  const filteredUsers = users.filter(
    u =>
      u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.Name && u.Name.toLowerCase().includes(searchUser.toLowerCase()))
  );

  return (
    <div className="editor-container">
      <h2>Editor Panel</h2>

      {/* Add Movie Button */}
      {!showForm && !editId && (
        <button
          className="editor-add-btn"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: 18 }}
        >
          Add Movie
        </button>
      )}

      {/* Movie Form */}
      {(showForm || editId) && (
        <form onSubmit={handleSubmit} className="editor-form">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="release_date" type="date" placeholder="Release Date" value={form.release_date} onChange={handleChange} required />
          <input name="plot" placeholder="Plot" value={form.plot} onChange={handleChange} />
          <input name="budget" placeholder="Budget" value={form.budget} onChange={handleChange} />
          <input name="boxoffice" placeholder="Box Office" value={form.boxoffice} onChange={handleChange} />
          <input name="runtime" placeholder="Runtime" value={form.runtime} onChange={handleChange} />
          <input name="poster_url" placeholder="Poster URL" value={form.poster_url} onChange={handleChange} />
          <input name="trailer_link" placeholder="Trailer Link" value={form.trailer_link} onChange={handleChange} />
          <button type="submit">{editId ? 'Update' : 'Add'}</button>
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setShowForm(false);
              setForm({
                title: '', release_date: '', plot: '', budget: '', boxoffice: '', runtime: '', poster_url: '', trailer_link: ''
              });
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {message && (
        <div className="editor-message" style={{ color: message.includes('error') ? 'red' : undefined }}>
          {message}
        </div>
      )}

      {/* Search User Box */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search user (for ban)..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 5, border: '1px solid #b0bec5', minWidth: 220, marginRight: 12 }}
        />
        {searchUser && (
          <ul style={{ background: '#fff', border: '1px solid #b0bec5', borderRadius: 5, marginTop: 4, maxHeight: 180, overflowY: 'auto', padding: 8 }}>
            {filteredUsers.length === 0 && <li style={{ color: '#888' }}>No users found</li>}
            {filteredUsers.map(user => (
              <li key={user.username} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>
                  <strong>{user.username}</strong>
                  {user.Name ? ` (${user.Name})` : ''}
                </span>
                <button onClick={() => handleBanUser(user.username)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', marginLeft: 8 }}>
                  Ban
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Movies Box */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search movies (for update/delete)..."
          value={searchMovie}
          onChange={e => setSearchMovie(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 5, border: '1px solid #b0bec5', minWidth: 220 }}
        />
        {searchMovie && (
          <ul style={{ background: '#fff', border: '1px solid #b0bec5', borderRadius: 5, marginTop: 4, maxHeight: 180, overflowY: 'auto', padding: 8 }}>
            {filteredMovies.length === 0 && <li style={{ color: '#888' }}>No movies found</li>}
            {filteredMovies.map(movie => (
              <li key={movie.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>
                  <strong>{movie.title}</strong>
                  {movie.year ? ` (${movie.year})` : ''}
                </span>
                <span>
                  <button onClick={() => handleEdit(movie)} style={{ marginRight: 8 }}>Update</button>
                  <button onClick={() => handleDelete(movie.id)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3>All Movies</h3>
      <table className="editor-table">
        <thead>
          <tr>
            <th>Title</th><th>Year</th><th>Release</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.year}</td>
              <td>{movie.release_date ? movie.release_date.slice(0,10) : ''}</td>
              <td>
                <button onClick={() => handleEdit(movie)}>Edit</button>
                <button onClick={() => handleDelete(movie.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditorPage;