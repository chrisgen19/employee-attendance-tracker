<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Employee management (admin only)
    Route::apiResource('employees', EmployeeController::class);

    // Attendance routes
    Route::get('/attendance/today', [App\Http\Controllers\Api\AttendanceController::class, 'today']);
    Route::post('/attendance/time-in', [App\Http\Controllers\Api\AttendanceController::class, 'timeIn']);
    Route::post('/attendance/time-out', [App\Http\Controllers\Api\AttendanceController::class, 'timeOut']);
    Route::get('/attendance/history', [App\Http\Controllers\Api\AttendanceController::class, 'history']);
    Route::get('/attendance', [App\Http\Controllers\Api\AttendanceController::class, 'index']);
});
