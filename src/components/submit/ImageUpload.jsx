import React, { useState, useRef } from "react";

export default function ImageUpload({ onImageChange, acceptedTypes = "image/*", maxSize = 5 }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (selectedFile) => {
    const file = selectedFile[0];
    
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      alert(`Image is too large. Maximum size is ${maxSize}MB.`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    
    onImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleImageSelect(droppedFiles);
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    onImageChange(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-upload-container">
      {!image ? (
        <div 
          className={`image-upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-content">
            <i className="mdi mdi-image upload-icon"></i>
            <h5 className="upload-title">Upload Model Image</h5>
            <p className="upload-description">
              Drag and drop an image here, or click to browse
            </p>
            <div className="upload-requirements">
              <span>Accepted formats: JPG, PNG, GIF</span>
              <span>Max size: {maxSize}MB</span>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={(e) => handleImageSelect(e.target.files)}
            className="file-input"
          />
        </div>
      ) : (
        <div className="image-preview-container">
          <div className="image-preview">
            <img 
              src={previewUrl} 
              alt="Model Preview" 
              className="preview-image"
            />
            <div className="image-overlay">
              <div className="image-info">
                <div className="image-name">{image.name}</div>
                <div className="image-size">{formatFileSize(image.size)}</div>
              </div>
              <button
                type="button"
                className="image-remove"
                onClick={removeImage}
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
          </div>
          <div className="image-actions">
            <button
              type="button"
              className="change-image-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="mdi mdi-image-edit me-2"></i>
              Change Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={(e) => handleImageSelect(e.target.files)}
              className="hidden-input"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          width: 100%;
        }
        
        .image-upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(247, 250, 252, 0.5);
          position: relative;
        }
        
        .image-upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        
        .image-upload-area.drag-over {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.02);
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .upload-icon {
          font-size: 3rem;
          color: #a0aec0;
          transition: all 0.3s ease;
        }
        
        .image-upload-area:hover .upload-icon {
          color: #667eea;
        }
        
        .upload-title {
          color: #2d3748;
          font-weight: 600;
          margin: 0;
          font-size: 1.25rem;
        }
        
        .upload-description {
          color: #718096;
          margin: 0;
          font-size: 0.95rem;
        }
        
        .upload-requirements {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #a0aec0;
        }
        
        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        .hidden-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .image-preview-container {
          width: 100%;
        }
        
        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: white;
        }
        
        .preview-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, 0.3) 100%
          );
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .image-preview:hover .image-overlay {
          opacity: 1;
        }
        
        .image-info {
          color: white;
        }
        
        .image-name {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .image-size {
          font-size: 0.8rem;
          opacity: 0.9;
        }
        
        .image-remove {
          background: rgba(229, 62, 62, 0.9);
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        
        .image-remove:hover {
          background: rgba(229, 62, 62, 1);
          transform: scale(1.1);
        }
        
        .image-remove i {
          font-size: 16px;
        }
        
        .image-actions {
          margin-top: 1rem;
          text-align: center;
        }
        
        .change-image-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }
        
        .change-image-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        @media (max-width: 768px) {
          .image-upload-area {
            padding: 1.5rem;
          }
          
          .upload-icon {
            font-size: 2.5rem;
          }
          
          .upload-title {
            font-size: 1.1rem;
          }
          
          .upload-requirements {
            font-size: 0.75rem;
          }
          
          .preview-image {
            height: 200px;
          }
          
          .image-overlay {
            padding: 0.75rem;
          }
          
          .image-name {
            font-size: 0.8rem;
          }
          
          .image-size {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
} 