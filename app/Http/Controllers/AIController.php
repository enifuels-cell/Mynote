<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class AIController extends Controller
{
    /**
     * Generate summary for a note
     */
    public function summarize(Request $request)
    {
        try {
            $noteId = $request->input('noteId');
            $note = Note::find($noteId);

            if (!$note) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            // Placeholder for AI summarization
            // In production, this would call an AI service like OpenAI
            $summary = $this->generateSummary($note->content);

            $note->update(['ai_summary' => $summary]);

            return response()->json([
                'noteId' => $note->id,
                'summary' => $summary,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Auto-organize notes by tags and categories
     */
    public function autoOrganize(Request $request)
    {
        try {
            $userId = $request->input('userId');
            
            $notes = \App\Models\Note::forUser($userId)->active()->get();

            foreach ($notes as $note) {
                // Generate AI tags and category
                $aiTags = $this->generateTags($note->title, $note->content);
                $category = $this->categorizeNote($note->title, $note->content);

                $note->update([
                    'ai_tags' => $aiTags,
                    'ai_category' => $category,
                ]);
            }

            return response()->json([
                'message' => 'Notes organized successfully',
                'notesProcessed' => count($notes),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate flashcards from note
     */
    public function generateFlashcards(Request $request)
    {
        try {
            $noteId = $request->input('noteId');
            $note = Note::find($noteId);

            if (!$note) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            // Placeholder for flashcard generation
            $flashcards = $this->generateFlashcardsFromContent($note->content);

            return response()->json([
                'noteId' => $note->id,
                'flashcards' => $flashcards,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Detect and create reminders from note content
     */
    public function detectReminders(Request $request)
    {
        try {
            $noteId = $request->input('noteId');
            $note = Note::find($noteId);

            if (!$note) {
                return response()->json(['error' => 'Note not found'], 404);
            }

            // Placeholder for reminder detection
            $reminders = $this->extractReminders($note->content);

            foreach ($reminders as $reminder) {
                $note->update([
                    'reminder_date' => $reminder['date'],
                    'reminder_message' => $reminder['message'],
                ]);
            }

            return response()->json([
                'noteId' => $note->id,
                'reminders' => $reminders,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Extract text from image (OCR)
     */
    public function extractImageText(Request $request)
    {
        try {
            if (!$request->hasFile('image')) {
                return response()->json(['error' => 'No image provided'], 400);
            }

            $file = $request->file('image');
            
            // Placeholder for OCR processing
            $extractedText = "Image processing placeholder. Extracted text would appear here.";

            return response()->json([
                'extractedText' => $extractedText,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Helper: Generate summary
     */
    private function generateSummary(string $content): string
    {
        // Placeholder implementation
        $sentences = preg_split('/[.!?]+/', $content);
        $summary = implode('. ', array_slice(array_filter($sentences), 0, 3)) . '.';
        return strlen($summary) > 500 ? substr($summary, 0, 500) . '...' : $summary;
    }

    /**
     * Helper: Generate tags
     */
    private function generateTags(string $title, string $content): array
    {
        // Placeholder implementation
        $text = strtolower($title . ' ' . $content);
        $commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
        
        $words = preg_split('/\s+/', $text);
        $tags = array_filter(array_unique($words), function($word) use ($commonWords) {
            return strlen($word) > 3 && !in_array($word, $commonWords);
        });

        return array_slice(array_values($tags), 0, 5);
    }

    /**
     * Helper: Categorize note
     */
    private function categorizeNote(string $title, string $content): string
    {
        // Placeholder implementation
        $text = strtolower($title . ' ' . $content);
        
        if (preg_match('/(personal|diary|life|day)/i', $text)) {
            return 'personal';
        } elseif (preg_match('/(work|project|task|deadline)/i', $text)) {
            return 'work';
        } elseif (preg_match('/(study|learn|education|course)/i', $text)) {
            return 'study';
        } else {
            return 'general';
        }
    }

    /**
     * Helper: Generate flashcards
     */
    private function generateFlashcardsFromContent(string $content): array
    {
        // Placeholder implementation
        $sentences = preg_split('/[.!?]+/', $content);
        $flashcards = [];

        foreach (array_slice($sentences, 0, 5) as $sentence) {
            $sentence = trim($sentence);
            if (strlen($sentence) > 10) {
                $flashcards[] = [
                    'question' => 'What do you know about: ' . substr($sentence, 0, 30) . '?',
                    'answer' => $sentence,
                ];
            }
        }

        return $flashcards;
    }

    /**
     * Helper: Extract reminders
     */
    private function extractReminders(string $content): array
    {
        // Placeholder implementation
        $reminders = [];

        if (preg_match_all('/(?:remind|remember|due|deadline|todo|task)[^.]*?(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i', $content, $matches)) {
            foreach ($matches[1] as $date) {
                $reminders[] = [
                    'date' => $date,
                    'message' => 'Reminder from note',
                ];
            }
        }

        return $reminders;
    }
}
