<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    /**
     * Send note via email
     */
    public function sendNote(Request $request)
    {
        try {
            $noteId = $request->input('noteId');
            $recipientEmail = $request->input('recipientEmail');
            $message = $request->input('message', '');

            $note = Note::find($noteId);

            if (!$note) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            // Placeholder for email sending
            // In production, use Laravel's Mail facade
            // Mail::send('emails.note', ['note' => $note, 'message' => $message], function($mail) use ($recipientEmail, $note) {
            //     $mail->to($recipientEmail)->subject('Shared Note: ' . $note->title);
            // });

            return response()->json([
                'message' => 'Note sent successfully',
                'noteId' => $noteId,
                'sentTo' => $recipientEmail,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Convert email to note
     */
    public function emailToNote(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $emailSubject = $request->input('emailSubject');
            $emailBody = $request->input('emailBody');

            $note = Note::create([
                'user_id' => $userId,
                'title' => $emailSubject,
                'content' => $emailBody,
                'tags' => ['email'],
            ]);

            return response()->json([
                'message' => 'Email converted to note successfully',
                'noteId' => $note->id,
                'title' => $note->title,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Subscribe to email notifications
     */
    public function subscribeNotifications(Request $request)
    {
        try {
            $userId = $request->input('userId');
            $email = $request->input('email');
            $notifyOn = $request->input('notifyOn', []);

            // Store subscription preferences
            // This would typically be stored in a subscriptions table

            return response()->json([
                'message' => 'Notification subscription updated',
                'email' => $email,
                'notifyOn' => $notifyOn,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Share note via email
     */
    public function shareNote(Request $request)
    {
        try {
            $noteId = $request->input('noteId');
            $recipients = $request->input('recipients', []);
            $accessLevel = $request->input('accessLevel', 'view');

            $note = Note::find($noteId);

            if (!$note) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            // Placeholder for sharing logic
            // In production, this would create share tokens and send emails

            return response()->json([
                'message' => 'Note shared successfully',
                'noteId' => $noteId,
                'sharedWith' => count($recipients),
                'accessLevel' => $accessLevel,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
