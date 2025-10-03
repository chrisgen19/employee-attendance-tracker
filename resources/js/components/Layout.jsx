import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center mr-8">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Employee Attendance Tracker
                                </h1>
                            </div>
                            <div className="flex space-x-4">
                                <Link
                                    to="/dashboard"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                                        isActive('/dashboard')
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/attendance"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                                        isActive('/attendance')
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    Attendance
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/employees"
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                                            isActive('/employees')
                                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        Employees
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                {user?.name} ({user?.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
