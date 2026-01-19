<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Device;
use Illuminate\Http\Request;

class SyncController extends Controller
{
    /**
     * Sync notes from device
     */
    public function sync(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $deviceId = $request->input('deviceId');
            $deviceName = $request->input('deviceName', 'Unknown Device');
            $notes = $request->input('notes', []);
            $lastSyncTime = $request->input('lastSyncTime');

            // Update or create device record
            Device::updateOrCreate(
                ['user_id' => $userId, 'device_id' => $deviceId],
                ['device_name' => $deviceName, 'last_synced' => now()]
            );

            // Process synced notes
            foreach ($notes as $noteData) {
                if (isset($noteData['id'])) {
                    // Update existing note
                    $note = Note::find($noteData['id']);
                    if ($note) {
                        $note->update($noteData);
                    }
                } else {
                    // Create new note
                    Note::create(array_merge($noteData, ['user_id' => $userId]));
                }
            }

            // Get notes updated since last sync
            $query = Note::forUser($userId)->active();
            if ($lastSyncTime) {
                $query->where('updated_at', '>', $lastSyncTime);
            }

            $syncedNotes = $query->get();

            return response()->json([
                'message' => 'Sync completed successfully',
                'notes' => $syncedNotes,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get sync status
     */
    public function status(Request $request)
    {
        try {
            $userId = $request->query('userId');
            $deviceId = $request->query('deviceId');

            $device = Device::where('user_id', $userId)
                ->where('device_id', $deviceId)
                ->first();

            if (!$device) {
                return response()->json(['error' => 'Device not found'], 404);
            }

            return response()->json([
                'deviceId' => $device->device_id,
                'lastSynced' => $device->last_synced,
                'isSynced' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get devices
     */
    public function devices(Request $request)
    {
        try {
            $userId = $request->query('userId');

            $devices = Device::where('user_id', $userId)->get();

            return response()->json($devices);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Register device
     */
    public function registerDevice(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $deviceId = $request->input('deviceId');
            $deviceName = $request->input('deviceName', 'Unknown Device');

            $device = Device::updateOrCreate(
                ['user_id' => $userId, 'device_id' => $deviceId],
                ['device_name' => $deviceName, 'last_synced' => now()]
            );

            return response()->json([
                'deviceId' => $device->device_id,
                'message' => 'Device registered successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Sync clipboard
     */
    public function clipboard(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $deviceId = $request->input('deviceId');
            $content = $request->input('content');

            \App\Models\ClipboardHistory::create([
                'user_id' => $userId,
                'device_id' => $deviceId,
                'content' => $content,
                'timestamp' => now(),
            ]);

            // Get recent clipboard entries from other devices
            $clipboardHistory = \App\Models\ClipboardHistory::where('user_id', $userId)
                ->where('device_id', '!=', $deviceId)
                ->orderBy('timestamp', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'message' => 'Clipboard synced',
                'history' => $clipboardHistory,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
