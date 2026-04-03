import { Gamepad2, Trophy, Crosshair, Sword } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-bg-dark pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#14141c_0%,_#0b0b0f_100%)] opacity-80"></div>

                {/* Animated Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(to right, #ffffff1a 1px, transparent 1px), linear-gradient(to bottom, #ffffff1a 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                ></div>

                {/* Static Glow Elements (Replaces heavy floating blurs) */}
                <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-gold/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-amber/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-5xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl mb-8 card-lift cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
                        <span className="text-gray-300 text-[10px] font-body font-bold tracking-[0.3em] uppercase">
                            Experience the Evolution
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black mb-8 leading-[0.9] tracking-wide uppercase">
                        <span className="block text-white mb-2">
                            DOMINATE
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber to-gold bg-[length:200%_auto] animate-gradient">
                            THE ARENA
                        </span>
                    </h1>

                    {/* Floating Gaming Icons */}
                    {/* Floating Gaming Icons */}
                    <Gamepad2 className="absolute top-[-40px] left-[-60px] md:left-[-100px] w-16 h-16 md:w-24 md:h-24 text-gold/30 -rotate-12 animate-float-slow opacity-80 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                    <Trophy className="absolute bottom-[-10px] right-[-30px] md:right-[-60px] w-12 h-12 md:w-20 md:h-20 text-amber/30 rotate-12 animate-float-delayed opacity-80 drop-shadow-[0_0_15px_rgba(255,181,71,0.5)]" />
                    <Crosshair className="absolute top-[30%] right-[-90px] md:right-[-160px] w-8 h-8 md:w-14 md:h-14 text-white/50 animate-spin-slow opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                    <Sword className="absolute bottom-[-30px] left-[-30px] md:left-[-80px] w-12 h-12 md:w-20 md:h-20 text-gold/40 -rotate-[115deg] animate-pulse opacity-80 drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]" />

                    <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-body font-normal">
                        Real-time analytics and live insights for the <span className="text-white font-semibold">elite esports competitor</span>.
                        Every frame matters. Every stat counts.
                    </p>

                    {/* Buttons removed */}
                </div>
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-gold/10 blur-[60px] rounded-full pointer-events-none"></div>
        </section>
    );
};

export default Hero;
