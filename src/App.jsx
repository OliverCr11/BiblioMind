import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookGrid from './components/BookGrid';
import ReviewForm from './components/ReviewForm';
import RecentReviews from './components/RecentReviews';

export default function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/books/')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand selection:text-white bg-background-pure">
      <Navbar />
      <main>
        <Hero />
        <BookGrid books={books} setBooks={setBooks} />
        <ReviewForm setBooks={setBooks} />
        <RecentReviews />
      </main>

      {/* Footer */}
      <footer className="bg-background-pure border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <p className="font-heading font-medium tracking-wide">© 2026 BiblioMind. A specialized Book Review Platform.</p>
        <p className="mt-2 text-brand font-medium">Dark Luxury Academia Edition</p>
      </footer>
    </div>
  );
}
