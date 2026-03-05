import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookGrid from './components/BookGrid';
import ReviewForm from './components/ReviewForm';
import RecentReviews from './components/RecentReviews';

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand selection:text-white bg-background-pure">
      <Navbar />
      <main>
        <Hero />
        <BookGrid />
        <ReviewForm />
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
