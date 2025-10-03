<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        // Only admins can view employees
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employees = User::where('organization_id', $request->user()->organization_id)
            ->where('role', 'employee')
            ->get();

        return response()->json(['employees' => $employees]);
    }

    public function store(Request $request)
    {
        // Only admins can create employees
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'shift_start' => 'sometimes|date_format:H:i',
            'shift_end' => 'sometimes|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create employee under the admin's organization
        $employee = User::create([
            'organization_id' => $request->user()->organization_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'employee',
            'is_active' => true,
            'shift_start' => $request->shift_start ?? '08:00:00',
            'shift_end' => $request->shift_end ?? '17:00:00',
        ]);

        return response()->json([
            'message' => 'Employee created successfully',
            'employee' => $employee,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employee = User::where('organization_id', $request->user()->organization_id)
            ->where('id', $id)
            ->where('role', 'employee')
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'is_active' => 'sometimes|boolean',
            'shift_start' => 'sometimes|date_format:H:i',
            'shift_end' => 'sometimes|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = array_filter([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : null,
            'is_active' => $request->has('is_active') ? $request->is_active : $employee->is_active,
            'shift_start' => $request->shift_start,
            'shift_end' => $request->shift_end,
        ], function($value) {
            return $value !== null;
        });

        $employee->update($updateData);

        return response()->json([
            'message' => 'Employee updated successfully',
            'employee' => $employee,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employee = User::where('organization_id', $request->user()->organization_id)
            ->where('id', $id)
            ->where('role', 'employee')
            ->firstOrFail();

        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully',
        ]);
    }
}
