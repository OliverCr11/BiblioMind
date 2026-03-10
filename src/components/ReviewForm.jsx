import React, { useState } from 'react';
import { Star, Send, Lock } from 'lucide-react';

export default function ReviewForm({ setBooks, isLoggedIn, onLoginRedirect }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');

    // Kept generic rating interaction for the form UI
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !author.trim()) return;

        const newBook = {
            title,
            author,
            description,
            // Assigning a premium default cover image dynamically if it's empty
            cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/books/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBook),
            });

            if (response.ok) {
                const createdBook = await response.json();
                let finalBook = { ...createdBook, reviews: [] };

                if (rating > 0) {
                    const reviewPayload = {
                        book: createdBook.id,
                        reviewer_name: "Community Member",
                        rating: rating,
                        comment: description || "No written review."
                    };

                    const reviewResponse = await fetch('http://127.0.0.1:8000/api/reviews/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reviewPayload),
                    });

                    if (reviewResponse.ok) {
                        const createdReview = await reviewResponse.json();
                        finalBook.reviews = [createdReview];
                    }
                }

                // Immediately update local React state
                setBooks(prevBooks => [...prevBooks, finalBook]);

                // Reset form
                setTitle('');
                setAuthor('');
                setDescription('');
                setRating(0);
                setHoverRating(0);
            } else {
                console.error("Failed to submit book");
            }
        } catch (error) {
            console.error("Error submitting book:", error);
        }
    };

    return (
        <section id="publish-review" className="py-20 relative z-20 bg-background-pure border-t border-white/5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glassmorphism rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold mb-3">Publish a Review</h2>
                        <p className="text-gray-400">Share your analytical insights with the community.</p>
                    </div>

                    {!isLoggedIn ? (
                        <div className="py-12 text-center h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 mx-auto">
                                <Lock className="h-8 w-8 text-brand" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-white mb-2">Authentication Required</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-8">
                                Please Log In to share your thoughts, publish a review, and engage with the community's literary analysis.
                            </p>
                            <button
                                onClick={onLoginRedirect}
                                className="bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand px-8 py-3 rounded-xl font-medium transition-colors hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                            >
                                Log In via Top Menu
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Form Input Groups */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Book Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                        placeholder="The Midnight Library"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Author</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                        placeholder="Matt Haig"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Rating</label>
                                <div className="flex items-center gap-2 bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 w-max">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none focus:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`h-6 w-6 transition-colors ${star <= (hoverRating || rating)
                                                    ? 'text-brand fill-brand glow-primary scale-110'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Analysis / Review</label>
                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-background-zinc/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all resize-none"
                                    placeholder="Dive deep into the narrative structure, thematic elements, and character development..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand hover:bg-brand/90 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-1"
                            >
                                <Send className="h-5 w-5" /> Publish Review
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
