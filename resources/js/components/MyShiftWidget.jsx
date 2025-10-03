import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MyShiftWidget = () => {
    const [attendance, setAttendance] = useState(null);
    const [shiftInfo, setShiftInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeInProgress, setTimeInProgress] = useState(false);

    useEffect(() => {
        fetchTodayAttendance();
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchTodayAttendance = async () => {
        try {
            const response = await api.get('/attendance/today');
            setAttendance(response.data.attendance);
            setShiftInfo(response.data.user);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setLoading(false);
        }
    };

    const handleTimeIn = async () => {
        setTimeInProgress(true);
        try {
            const response = await api.post('/attendance/time-in');
            setAttendance(response.data.attendance);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to time in');
        } finally {
            setTimeInProgress(false);
        }
    };

    const handleTimeOut = async () => {
        if (!window.confirm('Are you sure you want to time out?')) {
            return;
        }

        try {
            const response = await api.post('/attendance/time-out');
            setAttendance(response.data.attendance);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to time out');
        }
    };

    const formatTime = (time) => {
        if (!time) return '--:--';
        // Handle both time string formats (HH:mm:ss or full datetime)
        let timeStr = time;
        if (time.includes('T') || time.includes(' ')) {
            // It's a full datetime, extract time part
            timeStr = time.split('T')[1]?.split('.')[0] || time.split(' ')[1];
        }

        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;

        return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
    };

    const getCurrentTime12Hour = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTimeZone = () => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Extract city name from timezone (e.g., "Asia/Manila" -> "Manila")
        const parts = tz.split('/');
        return parts.length > 1 ? parts[parts.length - 1].replace('_', ' ') : 'PHT';
    };

    const isShiftInProgress = attendance?.time_in && !attendance?.time_out;
    const hasTimedIn = !!attendance?.time_in;
    const hasTimedOut = !!attendance?.time_out;

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-800';
            case 'late':
                return 'bg-yellow-100 text-yellow-800';
            case 'half_day':
                return 'bg-orange-100 text-orange-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg shadow-lg p-6 text-white">
                <div className="animate-pulse">
                    <div className="h-4 bg-teal-600 rounded w-20 mb-4"></div>
                    <div className="h-8 bg-teal-600 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-teal-600 rounded w-16"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg shadow-lg text-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-teal-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">My Shift</h3>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                {isShiftInProgress && (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full animate-pulse">
                        In Progress
                    </span>
                )}
            </div>

            {/* Current Time Display */}
            <div className="px-6 py-5 text-center">
                <div className="text-4xl font-bold mb-1">
                    {getCurrentTime12Hour()}
                </div>
                <div className="text-sm text-teal-200">
                    {getTimeZone()}
                </div>
            </div>

            {/* Shift Status */}
            {isShiftInProgress && (
                <div className="px-6 py-4 bg-teal-800 bg-opacity-50">
                    <div className="text-sm text-teal-200 mb-1">Your shift is in progress</div>
                    <div className="text-xs text-teal-300">
                        Timebound: {formatTime(shiftInfo?.shift_start)} - {formatTime(shiftInfo?.shift_end)}
                    </div>
                </div>
            )}

            {/* Time In/Out Info */}
            {hasTimedIn && (
                <div className="px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-teal-200">CLOCK IN:</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{formatTime(attendance.time_in)}</span>
                            {attendance.status && (
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(attendance.status)}`}>
                                    {attendance.status.replace('_', ' ').toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {hasTimedOut && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-teal-200">CLOCK OUT:</span>
                            <span className="text-lg font-semibold">{formatTime(attendance.time_out)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="px-6 py-4 space-y-3">
                {!hasTimedIn && (
                    <button
                        onClick={handleTimeIn}
                        disabled={timeInProgress}
                        className="w-full bg-white text-teal-800 font-semibold py-3 px-4 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{timeInProgress ? 'Timing In...' : 'Time In'}</span>
                    </button>
                )}

                {isShiftInProgress && (
                    <>
                        {/* Mini Time Out button (for early timeout) */}
                        <button
                            onClick={handleTimeOut}
                            className="w-full bg-teal-800 text-white text-xs font-medium py-2 px-3 rounded hover:bg-teal-700 transition-colors flex items-center justify-center space-x-1"
                            title="Time out early"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Time Out Early</span>
                        </button>
                    </>
                )}

                {hasTimedOut && (
                    <div className="text-center py-2">
                        <div className="text-sm text-teal-200">Shift completed for today</div>
                    </div>
                )}

                {!hasTimedIn && (
                    <div className="text-center text-xs text-teal-300">
                        Shift: {formatTime(shiftInfo?.shift_start)} - {formatTime(shiftInfo?.shift_end)}
                    </div>
                )}
            </div>

            {/* Settings Icon */}
            <div className="px-6 py-3 border-t border-teal-600 flex justify-end">
                <button className="text-teal-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MyShiftWidget;
