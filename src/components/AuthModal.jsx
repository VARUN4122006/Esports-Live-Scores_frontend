import { useState, useEffect } from 'react';
import { X, User, LogIn, Mail, Eye, EyeOff, Shield, AlertTriangle, Lock, Check } from 'lucide-react';
import apiClient from '../api/apiClient';

const AuthModal = ({ isOpen, onClose, onLoginSuccess, onLegalClick, allowClose = true }) => {
    const [activeTab, setActiveTab] = useState('existing'); // 'new', 'existing', or 'recovery'
    const [signupStep, setSignupStep] = useState(1); // 1: Email, 2: OTP
    const [recoveryStep, setRecoveryStep] = useState(1); // 1: Email, 2: Success
    const [formData, setFormData] = useState({ username: '', password: '', email: '', otp: '', fullName: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && allowClose) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Reset steps when tab changes
    useEffect(() => {
        setSignupStep(1);
        setRecoveryStep(1);
        setError('');
    }, [activeTab]);

    if (!isOpen && !isVisible) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);

        try {
            // Call real backend API
            const response = await apiClient.auth.login({
                email: formData.username, // Can be email or username
                password: formData.password
            });

            if (response.success && response.user) {
                // Store user data
                const userData = response.user;
                if (onLoginSuccess) {
                    onLoginSuccess(userData, rememberMe);
                }
                onClose();
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            // Call real backend API for registration
            const response = await apiClient.auth.register({
                name: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            if (response.success && response.user) {
                // Registration successful, log user in
                const userData = response.user;
                if (onLoginSuccess) {
                    onLoginSuccess(userData, true); // Auto remember on signup
                }
                onClose();
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = (e) => {
        // OTP verification is now handled directly in handleSendOTP
        // This function is kept for backwards compatibility but not used
        e.preventDefault();
    };

    const handlePasswordRecovery = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email) {
            setError('Please enter your email address.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|.*\.edu\.in)$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid Gmail (@gmail.com) or educational (@...edu.in) address.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setRecoveryStep(2);
            console.log('Recovery link sent to:', formData.email);
        }, 1000);
    };

    return (
        <div className={`fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-10 animate-fade-in overflow-y-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                onClick={() => allowClose && onClose()}
                className={`absolute inset-0 bg-black/90 backdrop-blur-md ${allowClose ? 'cursor-pointer' : 'cursor-default'}`}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-[10000] transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}
            >
                {/* Subtle Header Glow */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-crimson via-purple to-crimson"></div>

                {allowClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all cursor-pointer p-2 rounded-full hover:bg-white/5 hover:rotate-90 duration-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="text-center mb-8 mt-2">
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase italic">
                        {activeTab === 'new' ? 'Create Account' : activeTab === 'existing' ? 'Member Login' : 'Recover Access'}
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        {activeTab === 'recovery' ? 'Reset your credentials' : 'Enter the Esports Arena'}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1.5 bg-white/5 rounded-xl mb-8 border border-white/5 relative">
                    {['new', 'existing'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all relative z-10 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <span className="relative z-10">{tab === 'new' ? 'New Recruit' : 'Veteran Login'}</span>
                            {activeTab === tab && (
                                <div className="absolute inset-0 bg-crimson rounded-lg shadow-lg" style={{ zIndex: 0 }}></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative min-h-[300px]">
                    {activeTab === 'new' && (
                        <div className="space-y-6 animate-fade-in">
                            {signupStep === 1 ? (
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                                placeholder="FULL NAME"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                                placeholder="USERNAME"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                                placeholder="EMAIL ADDRESS"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                                placeholder="PASSWORD"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                                placeholder="CONFIRM PASSWORD"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 text-crimson text-xs font-bold bg-crimson/10 p-3 rounded-lg border border-crimson/20 animate-shake">
                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl transition-all hover:bg-crimson hover:text-white disabled:opacity-50 disabled:cursor-wait shadow-xl hover:shadow-[0_0_20px_rgba(225,6,0,0.4)] active:scale-95 duration-200"
                                    >
                                        {isLoading ? 'Processing...' : 'Verify Email'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-4">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Enter Verification Code</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength="6"
                                                value={formData.otp}
                                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-white text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:border-crimson transition-colors placeholder:text-white/10"
                                                placeholder="000000"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 text-center italic">Development Mode OTP: 123456</p>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 text-crimson text-xs font-bold bg-crimson/10 p-3 rounded-lg border border-crimson/20 animate-shake">
                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-crimson text-white font-black uppercase tracking-widest rounded-xl transition-all hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-wait shadow-[0_0_20px_rgba(225,6,0,0.4)] hover:shadow-xl active:scale-95 duration-200"
                                    >
                                        {isLoading ? 'Verifying...' : 'Confirm Identity'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSignupStep(1)}
                                        className="w-full text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest flex items-center justify-center gap-2"
                                    >
                                        Change Email Address
                                    </button>
                                </form>
                            )}

                            <p className="text-center text-[10px] font-bold text-gray-600 px-4 leading-relaxed">
                                By joining, you accept our <span onClick={() => onLegalClick && onLegalClick('terms')} className="text-white cursor-pointer hover:underline hover:text-crimson transition-colors">Terms of Service</span> and <span onClick={() => onLegalClick && onLegalClick('privacy')} className="text-white cursor-pointer hover:underline hover:text-crimson transition-colors">Privacy Policy</span>.
                            </p>
                        </div>
                    )}

                    {activeTab === 'existing' && (
                        <div className="animate-fade-in">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                            placeholder="USERNAME"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-end mb-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('recovery')}
                                            className="text-[9px] font-black uppercase tracking-widest text-crimson hover:text-white transition-colors"
                                        >
                                            Lost Access?
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                            placeholder="PASSWORD"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center ${rememberMe ? 'bg-crimson border-crimson shadow-[0_0_10px_rgba(225,6,0,0.3)]' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
                                                {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">Remember Me</span>
                                    </label>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-crimson text-xs font-bold bg-crimson/10 p-3 rounded-lg border border-crimson/20 animate-shake">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-crimson text-white font-black uppercase tracking-widest rounded-xl transition-all hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-wait shadow-[0_0_20px_rgba(225,6,0,0.4)] hover:shadow-white/20 active:scale-95 duration-200 mt-4"
                                >
                                    {isLoading ? 'Authenticating...' : 'Enter Arena'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'recovery' && (
                        <div className="space-y-6 animate-fade-in">
                            {recoveryStep === 1 ? (
                                <form onSubmit={handlePasswordRecovery} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-gray-700 text-sm font-bold"
                                                placeholder="EMAIL ADDRESS"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 text-crimson text-xs font-bold bg-crimson/10 p-3 rounded-lg border border-crimson/20 animate-shake">
                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl transition-all hover:bg-crimson hover:text-white disabled:opacity-50 disabled:cursor-wait shadow-xl active:scale-95 duration-200"
                                    >
                                        {isLoading ? 'Initiating...' : 'Reset Password'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('existing')}
                                        className="w-full text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest text-center"
                                    >
                                        Cancel Recovery
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8 space-y-6 animate-scale-in">
                                    <div className="w-20 h-20 bg-crimson/10 rounded-[2rem] flex items-center justify-center mx-auto border border-crimson/20 shadow-lg">
                                        <Mail className="w-8 h-8 text-crimson" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black uppercase italic text-white">Check Transmission</h3>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wide px-4 leading-relaxed">
                                            We've sent a recovery sequence to <span className="text-crimson">{formData.email}</span>.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('existing')}
                                        className="text-[10px] font-black uppercase tracking-widest text-crimson bg-crimson/10 border border-crimson/20 py-3 px-8 rounded-xl hover:bg-crimson hover:text-white transition-all shadow-lg"
                                    >
                                        Return to Login
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
