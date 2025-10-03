import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../utils/api';

const Attendance = () => {
    const { user } = useAuth();
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendanceHistory();
    }, []);

    const fetchAttendanceHistory = async () => {
        try {
            const response = await api.get('/attendance/history');
            setAttendances(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
            day: days[date.getDay()],
            date: date.getDate().toString().padStart(2, '0')
        };
    };

    const formatTime = (time) => {
        if (!time) return '--';

        let timeStr = time;
        if (time.includes('T') || time.includes(' ')) {
            timeStr = time.split('T')[1]?.split('.')[0] || time.split(' ')[1];
        }

        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;

        return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
    };

    const formatDuration = (timeIn, timeOut) => {
        if (!timeIn || !timeOut) return '--';

        try {
            const parseTime = (timeStr) => {
                if (timeStr.includes('T') || timeStr.includes(' ')) {
                    timeStr = timeStr.split('T')[1]?.split('.')[0] || timeStr.split(' ')[1];
                }
                const [hours, minutes] = timeStr.split(':');
                return parseInt(hours) * 60 + parseInt(minutes);
            };

            const inMinutes = parseTime(timeIn);
            const outMinutes = parseTime(timeOut);
            const totalMinutes = outMinutes - inMinutes;

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return `${hours}h ${minutes}m`;
        } catch (error) {
            return '--';
        }
    };

    const getStatusBadge = (attendance) => {
        if (!attendance.time_out) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Started
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
            </span>
        );
    };

    const getTimeStatus = (timeIn, shiftStart) => {
        if (!timeIn || !shiftStart) return null;

        try {
            const parseTime = (timeStr) => {
                if (timeStr.includes('T') || timeStr.includes(' ')) {
                    timeStr = timeStr.split('T')[1]?.split('.')[0] || timeStr.split(' ')[1];
                }
                const [hours, minutes] = timeStr.split(':');
                return parseInt(hours) * 60 + parseInt(minutes);
            };

            const inMinutes = parseTime(timeIn);
            const shiftMinutes = parseTime(shiftStart);

            if (inMinutes <= shiftMinutes + 15) {
                return <span className="text-green-600 text-sm font-medium">(On time)</span>;
            } else {
                return <span className="text-red-600 text-sm font-medium">(Late)</span>;
            }
        } catch (error) {
            return null;
        }
    };

    const getClockOutStatus = (timeOut, shiftEnd) => {
        if (!timeOut) return null;

        try {
            const parseTime = (timeStr) => {
                if (timeStr.includes('T') || timeStr.includes(' ')) {
                    timeStr = timeStr.split('T')[1]?.split('.')[0] || timeStr.split(' ')[1];
                }
                const [hours, minutes] = timeStr.split(':');
                return parseInt(hours) * 60 + parseInt(minutes);
            };

            const outMinutes = parseTime(timeOut);
            const shiftMinutes = parseTime(shiftEnd);

            if (outMinutes < shiftMinutes) {
                return <span className="text-orange-600 text-sm font-medium">(Shift ended)</span>;
            }
        } catch (error) {
            return null;
        }
        return null;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                </div>

                {/* Attendance List */}
                <div className="space-y-4">
                    {attendances.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                            <p className="mt-1 text-sm text-gray-500">Start tracking your attendance by clocking in.</p>
                        </div>
                    ) : (
                        attendances.map((attendance) => {
                            const dateInfo = formatDate(attendance.date);
                            return (
                                <div key={attendance.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start">
                                            {/* Date */}
                                            <div className="flex-shrink-0 mr-6 text-center">
                                                <div className="text-sm text-gray-500 uppercase">{dateInfo.day}</div>
                                                <div className="text-3xl font-bold text-gray-900">{dateInfo.date}</div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <span className="text-sm font-semibold text-cyan-600 uppercase">Timebound:</span>
                                                        <span className="ml-2 text-gray-700">
                                                            {formatTime(user?.shift_start)} - {formatTime(user?.shift_end)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusBadge(attendance)}
                                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    {/* Clock In */}
                                                    <div>
                                                        <div className="text-sm text-gray-500 mb-1">CLOCK IN:</div>
                                                        <div className="flex items-baseline space-x-2">
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                {attendance.date} at {formatTime(attendance.time_in)}
                                                            </span>
                                                            {getTimeStatus(attendance.time_in, user?.shift_start)}
                                                        </div>
                                                    </div>

                                                    {/* Clock Out */}
                                                    <div>
                                                        <div className="text-sm text-gray-500 mb-1">CLOCK OUT:</div>
                                                        <div className="flex items-baseline space-x-2">
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                {attendance.time_out ? `${attendance.date} at ${formatTime(attendance.time_out)}` : '--'}
                                                            </span>
                                                            {getClockOutStatus(attendance.time_out, user?.shift_end)}
                                                        </div>
                                                    </div>

                                                    {/* Duration */}
                                                    <div>
                                                        <div className="text-sm text-gray-500 mb-1">DURATION:</div>
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {formatDuration(attendance.time_in, attendance.time_out)}
                                                        </div>
                                                    </div>

                                                    {/* Excess */}
                                                    <div>
                                                        <div className="text-sm text-gray-500 mb-1">EXCESS:</div>
                                                        <div className="text-lg font-semibold text-gray-900">--</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Attendance;
