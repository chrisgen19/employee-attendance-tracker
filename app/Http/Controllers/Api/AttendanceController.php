<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Get today's attendance for the authenticated user
     */
    public function today(Request $request)
    {
        $user = $request->user();

        $attendance = Attendance::with('user:id,name,shift_start,shift_end')
            ->where('user_id', $user->id)
            ->whereDate('date', today())
            ->first();

        return response()->json([
            'attendance' => $attendance,
            'user' => [
                'shift_start' => $user->shift_start,
                'shift_end' => $user->shift_end,
            ]
        ]);
    }

    /**
     * Time in
     */
    public function timeIn(Request $request)
    {
        $user = $request->user();

        // Check if already timed in today
        $existing = Attendance::where('user_id', $user->id)
            ->whereDate('date', today())
            ->first();

        if ($existing && $existing->time_in) {
            return response()->json([
                'message' => 'You have already timed in today',
                'attendance' => $existing
            ], 400);
        }

        $timeIn = now()->format('H:i:s');

        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $user->id,
                'date' => today(),
            ],
            [
                'organization_id' => $user->organization_id,
                'time_in' => $timeIn,
                'status' => 'present',
            ]
        );

        // Calculate status
        $attendance->status = $attendance->calculateStatus();
        $attendance->save();

        return response()->json([
            'message' => 'Successfully timed in',
            'attendance' => $attendance->fresh()
        ]);
    }

    /**
     * Time out
     */
    public function timeOut(Request $request)
    {
        $user = $request->user();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', today())
            ->first();

        if (!$attendance || !$attendance->time_in) {
            return response()->json([
                'message' => 'You need to time in first'
            ], 400);
        }

        if ($attendance->time_out) {
            return response()->json([
                'message' => 'You have already timed out today',
                'attendance' => $attendance
            ], 400);
        }

        $attendance->time_out = now()->format('H:i:s');
        $attendance->status = $attendance->calculateStatus();
        $attendance->save();

        return response()->json([
            'message' => 'Successfully timed out',
            'attendance' => $attendance
        ]);
    }

    /**
     * Get attendance history for the authenticated user
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $attendances = Attendance::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->paginate(15);

        return response()->json($attendances);
    }

    /**
     * Get all attendances (admin only)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Attendance::with('user:id,name,email')
            ->where('organization_id', $user->organization_id);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $attendances = $query->orderBy('date', 'desc')
            ->orderBy('time_in', 'desc')
            ->paginate(20);

        return response()->json($attendances);
    }
}
