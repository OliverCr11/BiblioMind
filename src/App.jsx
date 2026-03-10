import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookGrid from './components/BookGrid';
import ReviewForm from './components/ReviewForm';
import RecentReviews from './components/RecentReviews';

export default function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  // Mock current user to test ownership authorization for CRUD actions
  const currentUser = { username: 'Oliver C.' };

  const handleLoginRedirect = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsUserOpen(true);
  };

  useEffect(() => {
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
        <RecentReviews isLoggedIn={isLoggedIn} books={books} />
      </main>

      {/* Footer */}
      <footer className="bg-background-pure border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <p className="font-heading font-medium tracking-wide">© 2026 BiblioMind. A specialized Book Review Platform.</p>
        <p className="mt-2 text-brand font-medium">Dark Luxury Academia Edition</p>
      </footer>
    </div>
  );
}
