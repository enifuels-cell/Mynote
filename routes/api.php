<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\EmailController;

// Health check
Route::get('/api/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'Mynote API is running']);
});

// Auth routes
Route::post('/api/auth/register', [AuthController::class, 'register']);
Route::post('/api/auth/login', [AuthController::class, 'login']);
Route::get('/api/auth/user', [AuthController::class, 'currentUser']);
Route::put('/api/auth/preferences', [AuthController::class, 'updatePreferences']);
Route::post('/api/auth/biometric/register-options', [AuthController::class, 'biometricRegisterOptions']);
Route::post('/api/auth/biometric/register-verify', [AuthController::class, 'biometricRegisterVerify']);
Route::post('/api/auth/biometric/auth-options', [AuthController::class, 'biometricAuthOptions']);
Route::post('/api/auth/biometric/auth-verify', [AuthController::class, 'biometricAuthVerify']);

// Notes routes
Route::get('/api/notes', [NotesController::class, 'index']);
Route::get('/api/notes/search', [NotesController::class, 'search']);
Route::get('/api/notes/tags', [NotesController::class, 'getByTag']);
Route::get('/api/notes/archived', [NotesController::class, 'archived']);
Route::get('/api/notes/pinned', [NotesController::class, 'pinned']);
Route::get('/api/notes/{id}', [NotesController::class, 'show']);
Route::post('/api/notes', [NotesController::class, 'store']);
Route::put('/api/notes/{id}', [NotesController::class, 'update']);
Route::delete('/api/notes/{id}', [NotesController::class, 'destroy']);

// Sync routes
Route::post('/api/sync', [SyncController::class, 'sync']);
Route::get('/api/sync/status', [SyncController::class, 'status']);
Route::get('/api/sync/devices', [SyncController::class, 'devices']);
Route::post('/api/sync/device/register', [SyncController::class, 'registerDevice']);
Route::post('/api/sync/clipboard', [SyncController::class, 'clipboard']);

// AI routes
Route::post('/api/ai/summarize', [AIController::class, 'summarize']);
Route::post('/api/ai/auto-organize', [AIController::class, 'autoOrganize']);
Route::post('/api/ai/flashcards', [AIController::class, 'generateFlashcards']);
Route::post('/api/ai/detect-reminders', [AIController::class, 'detectReminders']);
Route::post('/api/ai/extract-image-text', [AIController::class, 'extractImageText']);

// Email routes
Route::post('/api/email/send', [EmailController::class, 'sendNote']);
Route::post('/api/email/to-note', [EmailController::class, 'emailToNote']);
Route::post('/api/email/subscribe', [EmailController::class, 'subscribeNotifications']);
Route::post('/api/email/share', [EmailController::class, 'shareNote']);
