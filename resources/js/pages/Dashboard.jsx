import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import MyShiftWidget from '../components/MyShiftWidget';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Welcome, {user?.name}!
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>You are logged in as {user?.role === 'admin' ? 'an Administrator' : 'an Employee'}.</p>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Organization:</span> {user?.organization?.name}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Organization Code:</span> {user?.organization?.code}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Email:</span> {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* My Account Widget */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                                My Account
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Attendance */}
                                <div
                                    onClick={() => navigate('/attendance')}
                                    className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-center mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-1">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">Attendance</div>
                                    <div className="text-xs text-gray-500 mt-1">All good!</div>
                                </div>

                                {/* Requests */}
                                <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-1">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">Requests</div>
                                    <div className="text-xs text-gray-500 mt-1">All good!</div>
                                </div>

                                {/* Leaves */}
                                <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex justify-center mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center relative">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                                4.16
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">Leaves</div>
                                    <div className="text-xs text-gray-500 mt-1">Available credits</div>
                                    <div className="text-sm font-bold text-blue-600 mt-1">4.16 Days</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Employees
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    --
                                </dd>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Present Today
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    --
                                </dd>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Absent Today
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    --
                                </dd>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Late Today
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    --
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Info Message */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    Time tracking is now active! Use the My Shift widget to clock in and out.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - My Shift Widget */}
                <div className="lg:col-span-1">
                    <MyShiftWidget />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
