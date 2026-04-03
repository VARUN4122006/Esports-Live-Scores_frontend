import { Target, Trophy, Users, MonitorPlay } from 'lucide-react';

const featureList = [
    {
        icon: <MonitorPlay className="w-6 h-6" />,
        title: "Live Match Scores & Commentary",
        description: "Real-time feeds and professional commentary for every major tournament."
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: "Match Center & Map Stats",
        description: "Detailed round-by-round breakdown and map control analytics."
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Player Profiles & Careers",
        description: "Complete history, K/D ratios, and role performance for pro players."
    },
    {
        icon: <Trophy className="w-6 h-6" />,
        title: "Tournament Standings",
        description: "Up-to-date brackets, schedules, and prize pool information."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-20 bg-card">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8 animate-fade-in-up">
                        <h2 className="text-4xl font-heading font-black leading-tight uppercase tracking-tight">
                            Powerful <span className="text-gold">Features</span><br />
                            For The Serious Fan
                        </h2>
                        <p className="text-gray-400 text-lg font-body">
                            Everything you need to follow the professional scene, all in one place.
                        </p>

                        <div className="space-y-6">
                            {featureList.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-200 card-lift"
                                >
                                    <div className="p-3 bg-gold/10 text-gold rounded-lg mt-1">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-heading font-bold text-white mb-2 uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-gray-400 font-body">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[600px] w-full bg-gradient-to-br from-bg-mid to-bg-dark rounded-3xl border border-gray-800 p-8 shadow-2xl overflow-hidden flex flex-col justify-center animate-fade-in-up">
                        {/* Abstract UI representation */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1e1e2e_0%,_transparent_50%)]"></div>

                        <div className="relative z-10 space-y-4">
                            <div className="w-full h-12 bg-gray-800/50 rounded-lg animate-pulse"></div>
                            <div className="flex gap-4">
                                <div className="w-1/3 h-32 bg-gray-800/50 rounded-lg animate-pulse delay-75"></div>
                                <div className="w-2/3 h-32 bg-gray-800/50 rounded-lg animate-pulse delay-100"></div>
                            </div>
                            <div className="w-full h-48 bg-gray-800/30 rounded-lg border border-gray-700/50 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-24 h-6 bg-gold/20 rounded animate-pulse"></div>
                                    <div className="w-16 h-6 bg-amber/20 rounded animate-pulse"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-2 bg-gray-700 rounded-full"></div>
                                    <div className="w-3/4 h-2 bg-gray-700 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/20 blur-[80px] rounded-full"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;
