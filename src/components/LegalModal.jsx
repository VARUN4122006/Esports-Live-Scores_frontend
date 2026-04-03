import { useState, useEffect } from 'react';
import { X, Shield, FileText } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, type }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const content = type === 'terms' ? {
        title: "Terms & Services",
        icon: FileText,
        sections: [
            {
                title: "1. Introduction",
                text: "Welcome to EsportsBuzz, the ultimate platform for real-time esports analytics and live scores. By accessing or using our website, you agree to be bound by these Terms & Services. If you do not agree, please refrain from using the platform."
            },
            {
                title: "2. Eligibility",
                text: "You must be at least 13 years old to use this platform. By using the website, you represent and warrant that you fulfill this age requirement. Users are solely responsible for maintaining the security and confidentiality of their account credentials."
            },
            {
                title: "3. User Accounts",
                text: "Users may log in via Google authentication or a traditional username/password combination. Sharing accounts with other individuals is strictly prohibited and may result in account termination."
            },
            {
                title: "4. Acceptable Use",
                text: "Users agree not to engage in cheating, hacking, spamming, or any form of abuse towards other users or the platform itself. All community members must respect fair-play rules and maintain a professional conduct."
            },
            {
                title: "5. Intellectual Property",
                text: "All platform content, user interface designs, and aggregated data belong exclusively to EsportsBuzz. No copying, redistribution, or modification of these materials is permitted without explicit written permission."
            },
            {
                title: "6. Third-Party Services",
                text: "Our platform integrates with external services such as Google login and various game-specific APIs. EsportsBuzz is not responsible for the uptime, data accuracy, or privacy practices of these third-party providers."
            },
            {
                title: "7. Termination",
                text: "EsportsBuzz reserves the right to suspend or terminate accounts at any time, without prior notice, if a violation of these terms is detected or for any other reasonable cause."
            },
            {
                title: "8. Limitation of Liability",
                text: "EsportsBuzz is provided 'as is' without warranties. We are not liable for any losses, service interruptions, or inaccuracies in data resulting from your use of the platform."
            },
            {
                title: "9. Changes to Terms",
                text: "These terms may be updated periodically. Continued use of the website following any changes constitutes your acceptance of the new Terms & Services."
            },
            {
                title: "10. Contact Information",
                text: "For any questions or support regarding these terms, please reach out to us at support@esportsbuzz.com or visit our dedicated contact page."
            }
        ],
        footer: "Last Updated: February 2026"
    } : {
        title: "Privacy Policy",
        icon: Shield,
        sections: [
            {
                title: "1. Introduction",
                text: "At EsportsBuzz, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information."
            },
            {
                title: "2. Information We Collect",
                text: "We collect information you provide directly to us, including your name, email address, and login credentials. We also collect game preferences, usage data, and device/browser information for optimization."
            },
            {
                title: "3. How We Use Data",
                text: "Your data is used primarily for account authentication, improving website performance, providing analytics, and displaying personalized content such as your favorite game hubs."
            },
            {
                title: "4. Cookies & Tracking",
                text: "We use cookies to manage active sessions and gather analytical data. You can manage your cookie preferences through your browser settings, though some features may be limited if cookies are disabled."
            },
            {
                title: "5. Third-Party Services",
                text: "We use trusted third-party services like Google for authentication and analytics. We do not sell your personal data to any third parties for marketing purposes."
            },
            {
                title: "6. Data Security",
                text: "We implement industry-standard security measures, including secure storage and encrypted authentication protocols, to protect your data from unauthorized access."
            },
            {
                title: "7. User Rights",
                text: "You have the right to access, update, or request the deletion of your personal data at any time. You may also opt out of non-essential communications from our platform."
            },
            {
                title: "8. Children’s Privacy",
                text: "EsportsBuzz does not knowingly collect data from children under the age of 13. If we become aware of such data collection, we will take immediate steps to delete it."
            },
            {
                title: "9. Policy Updates",
                text: "This Privacy Policy may be updated periodically to reflect changes in our practices. We will notify users of significant changes through the platform."
            },
            {
                title: "10. Contact Us",
                text: "If you have questions about our privacy practices, please contact us via the support section or email us at privacy@esportsbuzz.com."
            }
        ],
        footer: "Last Updated: February 2026"
    };

    const Icon = content.icon;

    return (
        <div className={`fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-10 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <div
                className={`relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
                    }`}
            >
                {/* Header */}
                <div className="p-6 md:p-8 bg-black/40 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-crimson/10 rounded-xl border border-crimson/20 shadow-[0_0_15px_rgba(225,6,0,0.2)]">
                            <Icon className="w-6 h-6 text-crimson" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">{content.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group text-gray-500 hover:text-white"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    <div className="space-y-10">
                        {content.sections.map((section, idx) => (
                            <div key={idx} className="group">
                                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-3 group-hover:text-crimson transition-colors italic">
                                    {section.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                                    {section.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-600 italic">
                            {content.footer}
                        </p>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 bg-black/40 border-t border-white/5 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-crimson hover:text-white transition-all transform active:scale-95 shadow-lg"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
