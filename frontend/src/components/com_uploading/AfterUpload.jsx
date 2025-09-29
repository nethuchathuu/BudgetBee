import React from "react";
import { Camera, XCircle } from "lucide-react";

export default function AfterUpload({ preview, onCancel, onRetake }) {
  return (
    <div className="flex flex-col h-full border-2 border-dashed border-emerald-400/40 rounded-xl p-4">
      {/* Preview Image */}
      <div className="flex-1 flex items-center justify-center mb-4 min-h-0">
        <img
          src={preview}
          alt="Bill Preview"
          className="max-w-full max-h-full rounded-lg object-contain"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 flex justify-center space-x-4">
        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
        >
          <XCircle className="h-5 w-5" />
          <span>Cancel</span>
        </button>

        {/* Retake Button */}
        <label
          htmlFor="cameraInput"
          className="flex items-center space-x-2 bg-emerald-400 text-[#0c111c] px-4 py-2 rounded-xl shadow hover:bg-emerald-500 transition cursor-pointer"
        >
          <Camera className="h-5 w-5" />
          <span>Retake</span>
        </label>

        {/* Hidden camera input for retake */}
        <input
          type="file"
          id="cameraInput"
          accept="image/*"
          capture="environment"
          onChange={(e) => onRetake(e.target.files[0])}
          className="hidden"
        />
      </div>
    </div>
  );
}
