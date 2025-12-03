// ClinicalNotes component for Patient Detail page
// like a note memoir for doctors that they can leave about their patients, it shows previously uploaded notes

import { useState } from "react";

// Type for a clinical note
interface Note {
  id: number;
  date: string;
  text: string;
}

// Mock data for previous notes
const mockNotes: Note[] = [
  {
    id: 1,
    date: "Nov 12, 2024",
    text: "Patient reports improved sleep after starting magnesium supplementation. Continue current protocol and follow up in 4 weeks.",
  },
];

function ClinicalNotes() {
  // State for the new note text
  const [newNote, setNewNote] = useState("");

  // State for notes list (would come from API in real app)
  const [notes] = useState<Note[]>(mockNotes);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-sage-800">Clinical Notes</h2>
        <button className="text-sage-600 hover:text-sage-800 text-sm font-medium">
          + Add Note
        </button>
      </div>

      {/* New note text area */}
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add SOAP notes, observations, or follow-up reminders..."
        className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-24 mb-4 focus:outline-none focus:border-sage-400"
      />

      {/* Previous notes list */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
          >
            {/* Note header with date and actions */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs">{note.date}</span>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600 text-xs">
                  Edit
                </button>
                <button className="text-gray-400 hover:text-danger-500 text-xs">
                  Delete
                </button>
              </div>
            </div>
            {/* Note text */}
            <p className="text-gray-700 text-sm">{note.text}</p>
          </div>
        ))}
      </div>

      {/* Show message if no notes */}
      {notes.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No clinical notes yet.
        </p>
      )}
    </div>
  );
}

export default ClinicalNotes;
