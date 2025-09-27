import React, { useState } from "react";
import { Camera } from "lucide-react";

export default function UploadLeft({ onProcess }) {
  const [preview, setPreview] = useState(null);

  // Handle file select and show preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col w-1/2  p-6 border-r border-emerald-400/20">
      {/* Upload Box */}
      <div className="border-2 border-dashed border-emerald-400/40 rounded-xl p-4 flex flex-col flex-grow">
        {/* Scrollable preview */}
        <div className="flex-1 w-full max-h-[300px] overflow-y-auto flex justify-center items-start">
          {preview ? (
            <img
              src={preview}
              alt="Bill Preview"
              className="w-full rounded-lg object-contain"
            />
          ) : (
            <p className="text-gray-400">Select a bill or drop it here</p>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="fileInput" className="cursor-pointer mt-3">
          <div className="flex items-center justify-center space-x-2 bg-emerald-400 text-[#0c111c] px-4 py-2 rounded-xl shadow hover:bg-emerald-500 transition">
            <Camera className="h-5 w-5" />
            <span>Take Photo</span>
          </div>
        </label>
      </div>

      {/* Process button (always visible at bottom) */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onProcess}
          className="bg-emerald-400 text-[#0c111c] px-6 py-2 rounded-xl font-semibold hover:bg-emerald-500 transition"
        >
          Process
        </button>
      </div>
    </div>
  );
}
