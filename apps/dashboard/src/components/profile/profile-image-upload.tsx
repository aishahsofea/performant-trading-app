"use client";

import { useState, useRef } from "react";

type ProfileImageUploadProps = {
  currentImageUrl?: string;
  onImageChange?: (file: File | null, previewUrl: string | null) => void;
  disabled?: boolean;
};

export const ProfileImageUpload = ({
  currentImageUrl,
  onImageChange,
  disabled = false,
}: ProfileImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Image must be smaller than 5MB");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (onImageChange) {
      onImageChange(file, url);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(null, null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-200">
        Profile Picture
      </label>

      {/* Current/Preview Image */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex-1">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
              ${
                isDragOver
                  ? "border-purple-500 bg-purple-900/20"
                  : "border-gray-600 hover:border-gray-500"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <div className="space-y-2">
              <svg
                className="w-8 h-8 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="text-sm text-gray-300">
                <span className="font-medium text-purple-400">
                  Click to upload
                </span>{" "}
                or drag and drop
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex space-x-3">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={disabled}
              className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Choose File
            </button>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
};
