import { Facebook, Instagram, Zap } from 'lucide-react';

const Footer = ({ onLegalClick }) => {
    return (
        <footer className="bg-bg-dark border-t border-gray-900 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-2xl font-heading font-bold tracking-tighter text-white mb-4">
                            <Zap className="w-8 h-8 text-gold" />
                            <span>EsportsBuzz</span>
                        </div>
                        <p className="text-gray-500 max-w-sm font-body">
                            The ultimate platform for championship-level esports analytics and live scores.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/esports_buzz_/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Instagram"
                            className="group relative p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(253,29,29,0.4)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Instagram className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors relative z-10" />
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Facebook"
                            className="group relative p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(24,119,242,0.4)]"
                        >
                            <div className="absolute inset-0 bg-[#1877F2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Facebook className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors relative z-10" />
                        </a>

                        {/* X (Twitter) */}
                        <a
                            href="https://x.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="X"
                            className="group relative p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <p>&copy; 2026 EsportsBuzz. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <button
                            onClick={() => onLegalClick?.('privacy')}
                            className="hover:text-gold transition-colors cursor-pointer font-button font-black uppercase tracking-widest text-[10px]"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => onLegalClick?.('terms')}
                            className="hover:text-gold transition-colors cursor-pointer font-button font-black uppercase tracking-widest text-[10px]"
                        >
                            Terms & Services
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
