import { useEffect } from 'react';
import { useNavigate } from './hooks/useNavigate'; // You can create this or use inline

/**
 * Protected Route Component
 * Redirects to home and opens auth modal if user is not authenticated
 */
const ProtectedRoute = ({ user, children, onRedirect }) => {
    useEffect(() => {
        if (!user) {
            onRedirect();
        }
    }, [user, onRedirect]);

    if (!user) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 border-4 border-crimson border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 text-sm">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
