import React, { useState } from 'react';
import { Bell, Check, Circle, AlertCircle, ShoppingBag } from 'lucide-react';
import './Notifications.css';

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'payment',
            title: 'Payment successful',
            message: 'Your purchase for Advanced Cloud Architecture was successful.',
            isRead: false,
            time: 'Just now',
            icon: ShoppingBag
        },
        {
            id: 2,
            type: 'course',
            title: 'Course published!',
            message: 'Your course Basic React Foundations is now live.',
            isRead: false,
            time: '2 hours ago',
            icon: Check
        },
        {
            id: 3,
            type: 'system',
            title: 'System update',
            message: 'Hexoria Academy will undergo scheduled maintenance at 3 AM.',
            isRead: true,
            time: 'Yesterday',
            icon: AlertCircle
        }
    ]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    return (
        <div className="notifications-page container animate-fade-up">
            <div className="notif-header card mb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="notif-icon-wrapper relative">
                            <Bell size={28} className="text-primary" />
                            {unreadCount > 0 && (
                                <span className="notif-badge">{unreadCount}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="page-title text-2xl m-0">Notifications</h1>
                            <p className="text-muted text-sm mt-1">You have {unreadCount} unread messages.</p>
                        </div>
                    </div>
                    <button className="btn-secondary btn-sm" onClick={markAllAsRead}>Mark all read</button>
                </div>
            </div>

            <div className="notif-list">
                {notifications.map((notif, idx) => {
                    const Icon = notif.icon;
                    return (
                        <div
                            key={notif.id}
                            className={`notif-card card transition-fade mb-3 ${!notif.isRead ? 'unread new-slide-down' : 'read'}`}
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex gap-4 p-2 items-start justify-between w-full">
                                <div className="flex gap-4">
                                    <div className={`notif-type-icon ${notif.isRead ? 'bg-light' : 'bg-primary-light'}`}>
                                        <Icon size={20} className={notif.isRead ? 'text-muted' : 'text-primary'} />
                                    </div>
                                    <div>
                                        <h3 className="notif-title m-0">{notif.title}</h3>
                                        <p className="notif-message text-muted mt-1">{notif.message}</p>
                                        <span className="notif-time text-xs text-gray mt-2 inline-block">{notif.time}</span>
                                    </div>
                                </div>

                                {!notif.isRead && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => markAsRead(notif.id)}
                                        title="Mark as read"
                                    >
                                        <Circle size={14} className="text-primary" fill="currentColor" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
