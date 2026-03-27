import React, { useState } from "react";
import { X, Send } from "lucide-react";

interface Props {
  // no props needed
}

/**
 * Floating "Submit a Layoff" button + modal form.
 * Uses Tally.so embed for zero-backend data collection.
 * Replace TALLY_FORM_ID with your actual Tally form ID.
 *
 * To set up:
 *  1. Create a free form at https://tally.so
 *  2. Add fields: Company, Date, # Laid Off, Location, Source URL
 *  3. Copy the form ID from the embed URL (e.g. "wA9z3K" from tally.so/r/wA9z3K)
 *  4. Replace TALLY_FORM_ID below
 */
const TALLY_FORM_ID = "YOUR_TALLY_FORM_ID"; // ← replace this

const SubmitLayoffForm: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
        aria-label="Submit a layoff"
      >
        <Send className="h-4 w-4" />
        Submit a Layoff
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-white"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Submit a Layoff Event
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {TALLY_FORM_ID === "YOUR_TALLY_FORM_ID" ? (
              // Placeholder until Tally form is configured
              <div className="p-6 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-700 font-medium mb-2">
                  Submission form coming soon
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Help us keep the data fresh! Once the form is live you'll be able to
                  submit layoff events directly here.
                </p>
                <p className="text-xs text-gray-400">
                  In the meantime, open a GitHub issue or PR to add data.
                </p>
                <a
                  href="https://github.com/data-insider-nyc/layoffstracker/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Open GitHub issue
                </a>
              </div>
            ) : (
              <iframe
                src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1`}
                width="100%"
                height="420"
                frameBorder={0}
                title="Submit a layoff"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitLayoffForm;
