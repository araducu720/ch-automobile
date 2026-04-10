"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BrandConfig } from "@/lib/brandConfig";

interface DocumentUploadProps {
  label: string;
  onFileSelect: (file: File) => void;
  brandConfig: BrandConfig;
  required?: boolean;
  accept?: string;
}

export default function DocumentUpload({
  label,
  onFileSelect,
  brandConfig,
  required,
}: DocumentUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
        setFileName(file.name);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => setPreview(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: brandConfig.textPrimary }}
      >
        {label} {required && <span style={{ color: brandConfig.error }}>*</span>}
      </label>
      <div
        {...getRootProps()}
        className="cursor-pointer transition-all"
        style={{
          border: `2px dashed ${isDragActive ? brandConfig.primaryColor : brandConfig.inputBorder}`,
          borderRadius: brandConfig.buttonRadius,
          backgroundColor: isDragActive ? `${brandConfig.primaryColor}08` : brandConfig.bgLight,
          padding: "24px",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 mx-auto object-contain"
              style={{ borderRadius: brandConfig.buttonRadius }}
            />
            <p className="text-sm font-medium" style={{ color: brandConfig.textPrimary }}>
              {fileName}
            </p>
            <p className="text-xs" style={{ color: brandConfig.textSecondary }}>
              Click or drag to replace
            </p>
          </div>
        ) : fileName ? (
          <div className="space-y-2">
            <div
              className="w-12 h-12 mx-auto flex items-center justify-center"
              style={{
                backgroundColor: `${brandConfig.primaryColor}15`,
                borderRadius: brandConfig.buttonRadius === "0px" ? "4px" : "12px",
              }}
            >
              <svg className="w-6 h-6" style={{ color: brandConfig.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: brandConfig.textPrimary }}>
              {fileName}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className="w-14 h-14 mx-auto flex items-center justify-center"
              style={{
                backgroundColor: `${brandConfig.primaryColor}10`,
                borderRadius: brandConfig.buttonRadius === "0px" ? "4px" : "50%",
              }}
            >
              <svg className="w-7 h-7" style={{ color: brandConfig.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: brandConfig.textPrimary }}>
                {isDragActive ? "Drop file here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs mt-1" style={{ color: brandConfig.textSecondary }}>
                JPG, PNG or PDF (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
