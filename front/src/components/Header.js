import React from 'react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import useNotifications from '../hooks/useNotifications';
import '../styles/Header.css';

let imglink = "./logo192.png";

function Header({ loggedInUser }) {

    console.log("loggedInUser:", loggedInUser);
  const {
    notifications,
    unreadCount,
    isConnected,
    connectionStatus,
    connectionStatusColor,
    connectedUsers,
    markAsRead,
    clearAllNotifications,
    manualReconnect,
    deleteNotification
  } = useNotifications(loggedInUser);

  return (

   
    <header>
      <div className="logo-container">
        <img src={imglink} alt="Moviemania Logo" className="logo" />
      </div>

      <nav className="main-nav" style={{ textAlign: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/upcoming">Upcoming</Link>
        <Link to="/trending">Trending</Link>

        <Link to="/news">News</Link>
      {loggedInUser && (loggedInUser.iseditor === true || loggedInUser.iseditor === "true" || loggedInUser.iseditor === 1 || loggedInUser.iseditor === "1") && (
  <Link to="/editor">Edit Site</Link>
)}

      </nav>

      <div className="header-right">
        {loggedInUser && connectedUsers.length > 0 && (
          <div className="connected-users" title={`${connectedUsers.length} users online`}>
            <div className="connection-indicator">
              <div
                className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}
                onClick={!isConnected ? manualReconnect : undefined}
                style={{
                  backgroundColor: connectionStatusColor,
                  cursor: !isConnected ? 'pointer' : 'default'
                }}
                title={connectionStatus}
              ></div>
            </div>
            <span className="users-icon">👥</span>
            <span className="users-count">{connectedUsers.length}</span>
          </div>
        )}

        {loggedInUser && (
          <div className="header-notifications">
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              isConnected={isConnected}
              connectionStatus={connectionStatus}
              markAsRead={markAsRead}
              clearAllNotifications={clearAllNotifications}
              deleteNotification={deleteNotification}
              user={loggedInUser}
            />
          </div>
        )}

        {loggedInUser ? (
          <div className="user-section">
            <Link to="/user" className="loggeduser">
              <span className="user-avatar">👤</span>
              <span className="username">{loggedInUser.username}</span>
            </Link>
          </div>
        ) : (
          <span style={{ color: "white" }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: "#ffcc00" }}>Sign in</Link> or{" "}
            <Link to="/signup" style={{ color: "#ffcc00" }}>Sign up</Link>
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
