import React, { useState, useRef, useEffect } from 'react';
import '../styles/NotificationDropdown.css';

const NotificationDropdown = ({ 
  notifications = [], 
  unreadCount = 0, 
  isConnected = false,
  connectionStatus = '',
  markAsRead, 
  clearAllNotifications,
  deleteNotification, // New prop for single delete
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    switch (activeTab) {
      case 'today':
        return notifications.filter(notification => {
          const notificationDate = new Date(notification.timestamp);
          const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());
          return notificationDay.getTime() === today.getTime();
        });
      
      case 'thisweek':
        return notifications.filter(notification => {
          const notificationDate = new Date(notification.timestamp);
          return notificationDate >= weekStart && notificationDate <= weekEnd;
        });
      
      case 'all':
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const limitedNotifications = filteredNotifications.slice(0, 10);

  // Get counts for each tab
  const getTabCounts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const todayCount = notifications.filter(notification => {
      const notificationDate = new Date(notification.timestamp);
      const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());
      return notificationDay.getTime() === today.getTime();
    }).length;

    const thisWeekCount = notifications.filter(notification => {
      const notificationDate = new Date(notification.timestamp);
      return notificationDate >= weekStart && notificationDate <= weekEnd;
    }).length;

    return {
      all: notifications.length,
      today: todayCount,
      thisweek: thisWeekCount
    };
  };

  const tabCounts = getTabCounts();

  const handleNotificationClick = (notification, event) => {
    // Prevent click when clicking delete button
    if (event.target.closest('.delete-notification-btn')) {
      return;
    }
    
    if (!notification.read && markAsRead) {
      markAsRead(notification.id);
    }
  };

  const handleDeleteNotification = (notificationId, event) => {
    event.stopPropagation(); // Prevent notification click
    if (deleteNotification) {
      deleteNotification(notificationId);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'today_release':
        return '🎉';
      case 'upcoming_release':
        return '📅';
      case 'future_release':
        return '🔮';
      default:
        return '🎬';
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'all':
        return '📱';
      case 'today':
        return '🗓️';
      case 'thisweek':
        return '📅';
      default:
        return '📱';
    }
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'all':
        return 'All';
      case 'today':
        return 'Today';
      case 'thisweek':
        return 'This Week';
      default:
        return 'All';
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className={`notification-trigger ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`${unreadCount} unread notifications`}
      >
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-content">
          <div className="notification-header">
            <div className="notification-title">
              <span>🎬 Notifications</span>
            </div>
            <div className="notification-actions">
              <button 
                className="clear-all-btn"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
                title="Clear all notifications"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>

          {/* Notification Tabs */}
          <div className="notification-tabs">
            {['all', 'today', 'thisweek'].map((tab) => (
              <button
                key={tab}
                className={`notification-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="tab-icon">{getTabIcon(tab)}</span>
                <span className="tab-label">{getTabLabel(tab)}</span>
                <span className="tab-count">({tabCounts[tab]})</span>
              </button>
            ))}
          </div>

          <div className="connection-status">
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {isConnected ? `Connected as ${user?.username}` : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="notification-list">
            {limitedNotifications.length === 0 ? (
              <div className="no-notifications">
                <div className="no-notifications-icon">
                  {activeTab === 'today' ? '🗓️' : activeTab === 'thisweek' ? '📅' : '📭'}
                </div>
                <div className="no-notifications-text">
                  <p>No {activeTab === 'all' ? '' : activeTab === 'today' ? 'today' : 'this week'} notifications</p>
                  <small>
                    {activeTab === 'today' && 'No notifications received today'}
                    {activeTab === 'thisweek' && 'No notifications received this week'}
                    {activeTab === 'all' && 'You\'ll see movie release notifications here'}
                  </small>
                </div>
              </div>
            ) : (
              limitedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={(e) => handleNotificationClick(notification, e)}
                >
                  <div className="notification-content">
                    <div className="notification-left">
                      <div className="notification-type-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      {notification.posterUrl && (
                        <img 
                          src={notification.posterUrl} 
                          alt={notification.title}
                          className="notification-poster"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="notification-text">
                      <div className="notification-movie-title">
                        {notification.title}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.daysUntil && (
                          <span className="notification-days">
                            • {notification.daysUntil} day{notification.daysUntil > 1 ? 's' : ''} left
                          </span>
                        )}
                        <span className="notification-type-badge">
                          {notification.type === 'today_release' && '🎉 Released'}
                          {notification.type === 'upcoming_release' && '📅 Upcoming'}
                          {notification.type === 'future_release' && '🔮 Future'}
                        </span>
                      </div>
                    </div>

                    <div className="notification-actions">
                      {!notification.read && (
                        <div className="unread-indicator"></div>
                      )}
                      
                      {/* Individual Delete Button */}
                      <button
                        className="delete-notification-btn"
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                        title="Delete this notification"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredNotifications.length > 10 && (
            <div className="notification-footer">
              <small className="more-notifications">
                +{filteredNotifications.length - 10} more {activeTab} notifications available
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;