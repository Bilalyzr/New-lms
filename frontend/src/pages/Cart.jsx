import React, { useState } from 'react';
import { Trash2, ShieldCheck, ArrowRight, CreditCard, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        { id: 1, title: 'Complete Web Developer Bootcamp', category: 'Development', instructor: 'Dr. Angela Yu', price: 89.99 },
        { id: 2, title: 'AWS Certified Solutions Architect', category: 'IT & Software', instructor: 'Stephane Maarek', price: 110.00 }
    ]);

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRemove = (id) => {
        // PRD: Item removal -> Smooth collapse 
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleCheckoutProcess = (e) => {
        e.preventDefault();
        setIsCheckingOut(true);
        // PRD: Payment processing -> Animated loading dots
        setTimeout(() => {
            setIsCheckingOut(false);
            setPaymentSuccess(true);
            // Fast forward redirect to dashboard after success
            setTimeout(() => navigate('/dashboard'), 2000);
        }, 2500);
    };

    const totalPrice = cartItems.reduce((acc, current) => acc + current.price, 0).toFixed(2);

    if (paymentSuccess) {
        return (
            <div className="cart-page container min-h-screen items-center justify-center animate-fade-up">
                <div className="card text-center payment-success-card">
                    <div className="success-icon-wrapper mb-4 mx-auto">
                        <ShieldCheck size={48} className="text-teal" />
                    </div>
                    <h1>Payment Successful!</h1>
                    <p className="text-muted mt-2">You now have access to your new courses.</p>
                    <div className="spinner-border text-primary mt-4" role="status"></div>
                    <p className="text-sm text-muted mt-2">Redirecting to learning dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page container flex gap-8 animate-fade-up">
            <div className="cart-list flex-1">
                <h1 className="page-title mb-4">Shopping Cart</h1>
                <p className="text-muted mb-6">{cartItems.length} Courses in Cart</p>

                {cartItems.length === 0 ? (
                    <div className="empty-cart card text-center p-5">
                        <h2 className="mb-2">Your cart is empty</h2>
                        <Link to="/courses" className="btn btn-primary mt-3">Keep Shopping</Link>
                    </div>
                ) : (
                    <div className="cart-items-container">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item card flex items-center justify-between mb-4 fade-out-transition">
                                <div className="flex items-center gap-4">
                                    <div className="cart-item-img"></div>
                                    <div>
                                        <h3 className="cart-item-title">{item.title}</h3>
                                        <span className="course-category text-accent">{item.category}</span>
                                        <p className="text-muted text-sm mt-1">{item.instructor}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="cart-item-price font-bold text-primary text-xl">
                                        ${item.price}
                                    </div>
                                    <button
                                        className="icon-btn hover-red subtle-red-btn"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="checkout-sidebar w-350 shrink-0">
                    <div className="card checkout-summary">
                        <h3 className="mb-4">Total:</h3>
                        <div className="total-price-display text-primary animate-quick-fade font-bold">
                            ${totalPrice}
                        </div>

                        <form onSubmit={handleCheckoutProcess} className="checkout-form mt-6">
                            <div className="form-group">
                                <label className="text-sm font-bold text-muted mb-2">Card Details</label>
                                <div className="input-with-icon border-glow-focus mb-3">
                                    <CreditCard className="input-icon text-muted" size={16} />
                                    <input type="text" required placeholder="0000 0000 0000 0000" className="form-control" />
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" required placeholder="MM/YY" className="form-control flex-1 border-glow-focus" />
                                    <input type="text" required placeholder="CVC" className="form-control flex-1 border-glow-focus" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full checkout-btn pulse-checkout mt-4 flex justify-center items-center gap-2"
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <span className="loading-dots">Processing</span>
                                ) : (
                                    <>Complete Checkout <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>

                        <div className="secure-badge mt-4 flex items-center justify-center gap-2 text-sm">
                            <Lock size={14} className="text-teal" />
                            <span className="text-muted">Secure Encrypted Payment</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
