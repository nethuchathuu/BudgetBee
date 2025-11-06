import React, { useState } from "react";
import { Upload } from "lucide-react";
import AfterUpload from "./AfterUpload";
import { useToast } from '../../context/ToastContext';

export default function UploadLeft({ onProcess }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  // Handle file select
  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Cancel upload
  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    setIsProcessing(false);
  };

  // Listen for clear requests (dispatched after successful save)
  React.useEffect(() => {
    const handler = () => handleCancel();
    window.addEventListener('budgetbee:clearImage', handler);
    return () => window.removeEventListener('budgetbee:clearImage', handler);
  }, []);

  // Handle OCR processing
  const handleProcess = async () => {
    if (!selectedFile) {
      toast.show('Please select an image first', 'error');
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Uploading image for OCR processing...');
      
      const response = await fetch('http://localhost:5000/api/ocr/extract', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('OCR result:', result);
      
      if (result.success) {
        // Pass the OCR results to parent component
        onProcess(result.billInfo, result.extractedText);
        toast.show('Image processed successfully!', 'success');
      } else {
        throw new Error(result.error || 'OCR processing failed');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.show('Cannot connect to server. Please make sure the backend server is running', 'error');
      } else if (error.message.includes('Server error')) {
        toast.show(`Server error: ${error.message}`, 'error');
      } else {
        toast.show(`Failed to process image: ${error.message}. Please try again.`, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-1/2 p-6 border-r border-emerald-400/20">
      {/* Upload Box */}
      {preview ? (
        <div className="flex flex-col min-h-[400px]">
          <AfterUpload
            preview={preview}
            onCancel={handleCancel}
            onRetake={handleFileChange}
          />
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-emerald-400/40 rounded-xl p-4 flex flex-col flex-grow min-h-[400px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleFileChange(file);
          }}
        >
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center flex-1 cursor-pointer text-gray-400 hover:text-emerald-500 transition"
          >
            <Upload className="h-12 w-12 mb-2" />
            <p className="text-center">
              Drag & drop a bill here <br /> or click to upload
            </p>
          </label>

          {/* Hidden file input */}
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {/* Camera input (only before upload) */}
          <input
            type="file"
            id="cameraInput"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {/* Take Photo Button */}
          <div className="mt-3 flex justify-center">
            <label
              htmlFor="cameraInput"
              className="flex items-center justify-center space-x-2 bg-emerald-400 text-[#0c111c] px-4 py-2 rounded-xl shadow hover:bg-emerald-500 transition cursor-pointer"
            >
              <span>Take Photo</span>
            </label>
          </div>
        </div>
      )}

      {/* Process button */}
      {preview && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              isProcessing 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-emerald-400 text-[#0c111c] hover:bg-emerald-500'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Process'}
          </button>
        </div>
      )}
    </div>
  );
}
