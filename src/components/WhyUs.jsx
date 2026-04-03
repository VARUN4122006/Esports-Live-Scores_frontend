import { Zap, BarChart3, Gamepad2, Globe } from 'lucide-react';

const features = [
    {
        icon: <Zap className="w-8 h-8 text-gold" />,
        title: "Real-Time Updates",
        description: "Instant score updates with zero latency. Stay ahead of every play."
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-amber" />,
        title: "Detailed Statistics",
        description: "Deep dive into player performance, map control, and economy stats."
    },
    {
        icon: <Globe className="w-8 h-8 text-gold" />,
        title: "Global Coverage",
        description: "From local tournaments to world championships, we cover it all."
    },
    {
        icon: <Gamepad2 className="w-8 h-8 text-amber" />,
        title: "Multi-Game Support",
        description: "All your favorite competitive titles in one seamless platform."
    }
];

const WhyUs = () => {
    return (
        <section id="why-us" className="py-20 bg-bg-dark relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-amber/5 blur-[100px]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tight">
                        Why <span className="text-gold">EsportsBuzz?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-body">
                        Built for the competitive gamer who demands speed, accuracy, and depth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 bg-card border border-gray-800 rounded-2xl hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-300 group card-lift"
                        >
                            <div className="mb-6 p-4 bg-gray-900/50 rounded-full inline-block group-hover:bg-gray-800 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-3 text-white group-hover:text-gold transition-colors uppercase tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-body">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
