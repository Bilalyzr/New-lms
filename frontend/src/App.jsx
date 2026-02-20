import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseListing from './pages/CourseListing';
import CourseBuilder from './pages/CourseBuilder';
import CourseDetails from './pages/CourseDetails';
import CoursePlayer from './pages/CoursePlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

// Placeholder standard pages
const PlaceholderPage = ({ title }) => (
  <div className="container p-5 text-center animate-fade-up mt-8">
    <div className="card max-w-lg mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted">This mapped route is under construction.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CourseListing />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/search" element={<PlaceholderPage title="Search Results" />} />

              {/* Student Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-courses" element={<PlaceholderPage title="My Courses" />} />
              <Route path="/certificates" element={<PlaceholderPage title="Certificates" />} />
              <Route path="/learn/:courseId/:lessonId" element={<CoursePlayer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Instructor Routes */}
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/build" element={<CourseBuilder />} />
              <Route path="/instructor/courses" element={<PlaceholderPage title="Instructor: My Courses" />} />
              <Route path="/instructor/students" element={<PlaceholderPage title="Instructor: Students" />} />
              <Route path="/instructor/earnings" element={<PlaceholderPage title="Instructor: Earnings" />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<PlaceholderPage title="Admin: Users" />} />
              <Route path="/admin/courses" element={<PlaceholderPage title="Admin: Courses" />} />
              <Route path="/admin/payments" element={<PlaceholderPage title="Admin: Payments" />} />
              <Route path="/admin/reports" element={<PlaceholderPage title="Admin: Reports" />} />

              {/* Shared Authed Routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
