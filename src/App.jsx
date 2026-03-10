import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookGrid from './components/BookGrid';
import ReviewForm from './components/ReviewForm';
import RecentReviews from './components/RecentReviews';
import AuthModal from './components/AuthModal';

export default function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginRedirect = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsUserOpen(true);
  };

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        setCurrentUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse user data from local storage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
      }
    }

    fetch('http://127.0.0.1:8000/api/books/')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  return (
    <div id="top" className="min-h-screen selection:bg-brand selection:text-white bg-background-pure">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        books={books}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isUserOpen={isUserOpen}
        setIsUserOpen={setIsUserOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        currentUser={currentUser}
      />
      <main>
        <Hero />
        <BookGrid
          books={books}
          setBooks={setBooks}
          searchQuery={searchQuery}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
        />
        <ReviewForm setBooks={setBooks} isLoggedIn={isLoggedIn} onLoginRedirect={handleLoginRedirect} />
        <RecentReviews isLoggedIn={isLoggedIn} books={books} currentUser={currentUser} />
      </main>

      {isAuthModalOpen && (
        <AuthModal
          setIsAuthModalOpen={setIsAuthModalOpen}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentUser={setCurrentUser}
        />
      )}

      {/* Footer */}
      <footer className="bg-background-pure border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <p className="font-heading font-medium tracking-wide">© 2026 BiblioMind. A specialized Book Review Platform.</p>
        <p className="mt-2 text-brand font-medium">Dark Luxury Academia Edition</p>
      </footer>
    </div>
  );
}
