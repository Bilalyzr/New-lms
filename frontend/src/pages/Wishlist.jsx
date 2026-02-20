import React, { useState } from 'react';
import { Heart, Trash2, ShoppingCart, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Wishlist.css';

export default function Wishlist() {
    const navigate = useNavigate();

    // Mock Data
    const [wishlistItems, setWishlistItems] = useState([
        { id: 1, title: 'Complete Web Developer Bootcamp', category: 'Development', instructor: 'Dr. Angela Yu', price: 89.99, rating: 4.8 },
        { id: 3, title: 'The Complete Digital Marketing Course', category: 'Marketing', instructor: 'Rob Percival', price: 79.99, rating: 4.6 }
    ]);

    const handleRemove = (id) => {
        // Basic collapse animation simulation state change
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    return (
        <div className="wishlist-page container animate-fade-up">
            <div className="page-header">
                <h1 className="page-title flex items-center gap-2">
                    <Heart size={32} className="text-primary" /> My Wishlist
                </h1>
                <p className="text-muted">{wishlistItems.length} items to save for later</p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="empty-state card text-center p-5">
                    <Heart size={48} className="text-muted mx-auto mb-3" />
                    <h2 className="text-dark">Your wishlist is empty</h2>
                    <p className="text-muted mb-4">Explore our courses and find something to learn!</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((item, idx) => (
                        <div className="wishlist-card card animate-slide-up" key={item.id} style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="wishlist-img-box relative">
                                <div className="wishlist-img"></div>
                                <button
                                    className="icon-btn remove-wishlist-btn hover-red"
                                    onClick={() => handleRemove(item.id)}
                                    title="Remove"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="wishlist-body">
                                <span className="course-category text-accent">{item.category}</span>
                                <h3 className="course-title mt-1 mb-1">{item.title}</h3>
                                <p className="course-instructor mb-2">{item.instructor}</p>

                                <div className="wishlist-footer">
                                    <span className="price font-bold text-primary">${item.price}</span>
                                    <button className="btn btn-secondary btn-sm flex items-center gap-2" onClick={() => navigate('/cart')}>
                                        <ShoppingCart size={16} /> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
