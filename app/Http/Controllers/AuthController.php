<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'username' => 'required|unique:users|min:3',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $user = User::create([
                'email' => $request->email,
                'username' => $request->username,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'userId' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $user = User::where('username', $request->username)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            $user->update(['last_login' => now()]);

            return response()->json([
                'userId' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'preferences' => [
                    'theme' => $user->theme,
                    'defaultView' => $user->default_view,
                    'aiAutoOrganize' => $user->ai_auto_organize,
                    'autoSync' => $user->auto_sync,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get current user
     */
    public function currentUser(Request $request)
    {
        try {
            $userId = $request->query('userId');
            $user = User::find($userId);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json([
                'userId' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'preferences' => [
                    'theme' => $user->theme,
                    'defaultView' => $user->default_view,
                    'aiAutoOrganize' => $user->ai_auto_organize,
                    'autoSync' => $user->auto_sync,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $user = User::find($userId);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $user->update([
                'theme' => $request->input('theme', $user->theme),
                'default_view' => $request->input('default_view', $user->default_view),
                'ai_auto_organize' => $request->input('ai_auto_organize', $user->ai_auto_organize),
                'auto_sync' => $request->input('auto_sync', $user->auto_sync),
            ]);

            return response()->json(['message' => 'Preferences updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Generate biometric registration options
     */
    public function biometricRegisterOptions(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $user = User::find($userId);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json([
                'userId' => $user->id,
                'userName' => $user->username,
                'challenge' => bin2hex(random_bytes(32)),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify biometric registration
     */
    public function biometricRegisterVerify(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $user = User::find($userId);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $user->biometricCredentials()->create([
                'credential_id' => $request->input('credential.id'),
                'public_key' => json_encode($request->input('credential.publicKey')),
                'counter' => 0,
                'device_type' => $request->input('credential.deviceType', 'unknown'),
                'backed_up' => false,
            ]);

            return response()->json(['message' => 'Biometric registered successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Generate biometric authentication options
     */
    public function biometricAuthOptions(Request $request)
    {
        try {
            return response()->json([
                'challenge' => bin2hex(random_bytes(32)),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify biometric authentication
     */
    public function biometricAuthVerify(Request $request)
    {
        try {
            $credentialId = $request->input('credential.id');
            $credential = \App\Models\BiometricCredential::where('credential_id', $credentialId)->first();

            if (!$credential) {
                return response()->json(['error' => 'Credential not found'], 404);
            }

            $user = $credential->user;
            $user->update(['last_login' => now()]);

            return response()->json([
                'userId' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
