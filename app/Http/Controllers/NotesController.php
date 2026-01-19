<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Attachment;
use App\Models\VoiceNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotesController extends Controller
{
    /**
     * Get all notes for a user
     */
    public function index(Request $request)
    {
        try {
            $userId = $request->query('userId');
            $notes = Note::forUser($userId)
                ->active()
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function($note) {
                    return $this->formatNoteResponse($note);
                });

            return response()->json($notes);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single note
     */
    public function show($id)
    {
        try {
            $note = Note::find($id);

            if (!$note || $note->deleted_at) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            return response()->json($this->formatNoteResponse($note));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new note
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'required|exists:users,id',
            'title' => 'required|string',
            'content' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $note = Note::create([
                'user_id' => $request->input('userId'),
                'title' => $request->input('title'),
                'content' => $request->input('content', ''),
                'rich_content' => $request->input('richContent'),
                'tags' => $request->input('tags'),
                'color' => $request->input('color', '#ffffff'),
                'device_id' => $request->input('deviceId'),
                'version' => 1,
            ]);

            return response()->json($this->formatNoteResponse($note), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update a note
     */
    public function update(Request $request, $id)
    {
        try {
            $note = Note::find($id);

            if (!$note || $note->deleted_at) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            $note->update([
                'title' => $request->input('title', $note->title),
                'content' => $request->input('content', $note->content),
                'rich_content' => $request->input('richContent', $note->rich_content),
                'tags' => $request->input('tags', $note->tags),
                'ai_summary' => $request->input('aiSummary', $note->ai_summary),
                'ai_tags' => $request->input('aiTags', $note->ai_tags),
                'ai_category' => $request->input('aiCategory', $note->ai_category),
                'is_pinned' => $request->input('isPinned', $note->is_pinned),
                'is_archived' => $request->input('isArchived', $note->is_archived),
                'is_secure' => $request->input('isSecure', $note->is_secure),
                'color' => $request->input('color', $note->color),
                'reminder_date' => $request->input('reminder.date', $note->reminder_date),
                'reminder_message' => $request->input('reminder.message', $note->reminder_message),
                'is_reminder_recurring' => $request->input('reminder.isRecurring', $note->is_reminder_recurring),
                'reminder_pattern' => $request->input('reminder.recurringPattern', $note->reminder_pattern),
                'version' => $note->version + 1,
            ]);

            return response()->json($this->formatNoteResponse($note));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Delete a note (soft delete)
     */
    public function destroy($id)
    {
        try {
            $note = Note::find($id);

            if (!$note) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            $note->delete();

            return response()->json(['message' => 'Note deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Search notes
     */
    public function search(Request $request)
    {
        try {
            $userId = $request->query('userId');
            $searchTerm = $request->query('q', '');

            $notes = Note::forUser($userId)
                ->active()
                ->search($searchTerm)
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function($note) {
                    return $this->formatNoteResponse($note);
                });

            return response()->json($notes);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get notes by tag
     */
    public function getByTag(Request $request)
    {
        try {
            $userId = $request->query('userId');
            $tag = $request->query('tag');

            $notes = Note::forUser($userId)
                ->active()
                ->byTag($tag)
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function($note) {
                    return $this->formatNoteResponse($note);
                });

            return response()->json($notes);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get archived notes
     */
    public function archived(Request $request)
    {
        try {
            $userId = $request->query('userId');

            $notes = Note::forUser($userId)
                ->active()
                ->where('is_archived', true)
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function($note) {
                    return $this->formatNoteResponse($note);
                });

            return response()->json($notes);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get pinned notes
     */
    public function pinned(Request $request)
    {
        try {
            $userId = $request->query('userId');

            $notes = Note::forUser($userId)
                ->active()
                ->where('is_pinned', true)
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function($note) {
                    return $this->formatNoteResponse($note);
                });

            return response()->json($notes);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Format note response with relationships
     */
    private function formatNoteResponse(Note $note)
    {
        return [
            'id' => $note->id,
            'userId' => $note->user_id,
            'title' => $note->title,
            'content' => $note->content,
            'richContent' => $note->rich_content,
            'tags' => $note->tags ?? [],
            'aiSummary' => $note->ai_summary,
            'aiTags' => $note->ai_tags ?? [],
            'aiCategory' => $note->ai_category,
            'isPinned' => $note->is_pinned,
            'isArchived' => $note->is_archived,
            'isSecure' => $note->is_secure,
            'color' => $note->color,
            'reminder' => [
                'date' => $note->reminder_date,
                'message' => $note->reminder_message,
                'isRecurring' => $note->is_reminder_recurring,
                'recurringPattern' => $note->reminder_pattern,
            ],
            'attachments' => $note->attachments->toArray(),
            'voiceNote' => $note->voiceNote ? [
                'url' => $note->voiceNote->url,
                'duration' => $note->voiceNote->duration,
                'transcript' => $note->voiceNote->transcript,
            ] : null,
            'deviceId' => $note->device_id,
            'version' => $note->version,
            'createdAt' => $note->created_at,
            'updatedAt' => $note->updated_at,
        ];
    }
}
