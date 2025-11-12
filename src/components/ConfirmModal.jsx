import React from "react"

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()} // prevent close on inner click
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title || "Are you sure?"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {message || "This action cannot be undone."}
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
