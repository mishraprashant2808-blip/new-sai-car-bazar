"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  label = "Primary Cover Photo",
  helperText = "Drag & drop photos from your PC or tap to select from phone gallery (JPEG, PNG, WebP up to 10MB)",
}: ImageUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size exceeds 10MB. Please select a smaller photo.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to upload image.");
      }

      const uploadedUrl = json.url || json.data?.[0]?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error("Dropzone upload error:", err);
      setUploadError(err.message || "Upload failed. Please check connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    handleUploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    setUploadError("");
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <LinkIcon className="w-3 h-3 text-slate-400" />
          <span>{showUrlInput ? "Hide Direct URL" : "Paste Image URL"}</span>
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Optional URL input toggle */}
      {showUrlInput && (
        <div className="p-3 bg-[#162032] border border-[#273549] rounded-xl flex items-center gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... or cloud image URL"
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-slate-400 hover:text-red-400 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Dropzone Container */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 relative group ${
            isDragging
              ? "border-[#ED0000] bg-[#ED0000]/10 scale-[1.01]"
              : "border-[#273549] bg-[#0A0F1D]/80 hover:border-slate-500 hover:bg-[#162032]/60"
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center gap-2.5">
              <div className="w-9 h-9 border-3 border-[#ED0000] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-300">
                Uploading photo to Supabase Storage...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#162032] border border-[#273549] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-[#ED0000]/50 transition">
                <UploadCloud className="w-6 h-6 text-[#ED0000]" />
              </div>

              <div>
                <p className="text-sm font-bold text-white mb-1">
                  Click to choose photo or drag & drop here
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {helperText}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162032] border border-[#273549] text-[11px] font-semibold text-emerald-400 mt-1">
                <Sparkles className="w-3 h-3" />
                <span>Uploaded directly to Supabase CDN</span>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Image Preview Card with Quick Actions */
        <div className="relative group rounded-2xl overflow-hidden border border-[#273549] bg-[#0A0F1D] shadow-xl">
          <div className="aspect-video sm:aspect-21/9 w-full relative overflow-hidden bg-black flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Car Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-emerald-500/90 text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow">
                Primary Photo Ready
              </span>
            </div>

            {/* Remove / Replace Overlay Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#0F1827]/80 hover:bg-[#0F1827] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#273549] backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Change Photo</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg backdrop-blur-md transition cursor-pointer shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#162032]/80 border-t border-[#273549] flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-md font-mono text-[11px] text-slate-300">
              {value}
            </span>
            <span className="text-emerald-400 font-medium shrink-0 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          </div>
        </div>
      )}

      {/* Error / Success Feedback */}
      {uploadError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Photo uploaded directly to Supabase Storage!</span>
        </div>
      )}
    </div>
  );
}
