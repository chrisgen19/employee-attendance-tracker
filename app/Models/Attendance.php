<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_id',
        'date',
        'time_in',
        'time_out',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'time_in' => 'datetime:H:i:s',
        'time_out' => 'datetime:H:i:s',
    ];

    /**
     * Get the user that owns the attendance record
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the organization that owns the attendance record
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Calculate attendance status based on time in and shift times
     */
    public function calculateStatus()
    {
        if (!$this->time_in || !$this->user) {
            return 'absent';
        }

        $timeIn = Carbon::parse($this->time_in);
        $shiftStart = Carbon::parse($this->user->shift_start);
        $shiftEnd = Carbon::parse($this->user->shift_end);

        // Late if clocked in more than 15 minutes after shift start
        $minutesDifference = $timeIn->diffInMinutes($shiftStart, false);

        // If negative, means timeIn is after shiftStart (late)
        // If positive, means timeIn is before shiftStart (early/on-time)
        if ($minutesDifference < -15) {
            return 'late';
        }

        // Half day if no time out or time out is before 4 hours from shift start
        if ($this->time_out) {
            $timeOut = Carbon::parse($this->time_out);
            $hoursWorked = $timeOut->diffInHours($timeIn);

            $totalShiftHours = $shiftEnd->diffInHours($shiftStart);
            $halfShiftHours = $totalShiftHours / 2;

            if ($hoursWorked < $halfShiftHours) {
                return 'half_day';
            }
        }

        return 'present';
    }

    /**
     * Check if shift is completed
     */
    public function isShiftCompleted()
    {
        if (!$this->time_out || !$this->user) {
            return false;
        }

        $timeOut = Carbon::parse($this->time_out);
        $shiftEnd = Carbon::parse($this->user->shift_end);

        return $timeOut->greaterThanOrEqualTo($shiftEnd);
    }

    /**
     * Check if currently on shift
     */
    public function isOnShift()
    {
        return $this->time_in && !$this->time_out;
    }
}
