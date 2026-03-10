import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ setIsAuthModalOpen, setIsLoggedIn, setCurrentUser }) {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!isLoginTab && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const endpoint = isLoginTab ? 'http://127.0.0.1:8000/api/login/' : 'http://127.0.0.1:8000/api/register/';
        const payload = isLoginTab ? { username, password } : { username, email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                if (isLoginTab) {
                    const userData = {
                        username: data.username,
                        is_staff: data.is_staff
                    };
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user_data', JSON.stringify(userData));
                    setCurrentUser(userData);
                    setIsLoggedIn(true);
                    setIsAuthModalOpen(false);
                } else {
                    setSuccessMsg("Account created successfully! Please log in.");
                    setIsLoginTab(true);
                    setPassword('');
                    setConfirmPassword('');
                }
            } else {
                setError(data.non_field_errors?.[0] || data.username?.[0] || "Authentication failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Cannot connect to server.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAuthModalOpen(false)}></div>

            <div className="relative w-[95%] sm:w-full max-w-md mx-auto bg-background-pure/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glassmorphism animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>

                <div className="flex justify-between items-center p-6 border-b border-white/10 relative">
                    <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                        {isLoginTab ? <LogIn className="text-brand h-6 w-6" /> : <UserPlus className="text-brand h-6 w-6" />}
                        {isLoginTab ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <button onClick={() => setIsAuthModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => { setIsLoginTab(true); setError(''); setSuccessMsg(''); }}
                        className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all ${isLoginTab ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        LOG IN
                    </button>
                    <button
                        onClick={() => { setIsLoginTab(false); setError(''); setSuccessMsg(''); }}
                        className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all ${!isLoginTab ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        SIGN UP
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                    {successMsg && <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-brand text-sm">{successMsg}</div>}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-background-zinc/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                placeholder="Academic pseudonym"
                                required
                            />
                        </div>
                    </div>

                    {!isLoginTab && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background-zinc/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                    placeholder="scholar@university.edu"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background-zinc/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {!isLoginTab && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-background-zinc/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-4 bg-brand hover:bg-brand/90 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-0.5"
                    >
                        {isLoginTab ? 'Authenticate' : 'Register Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
