import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import MyShiftWidget from '../components/MyShiftWidget';

const Dashboard = () => {
    const { user } = useAuth();

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
