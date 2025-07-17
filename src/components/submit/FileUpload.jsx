import React, { useState, useRef } from "react";

export default function FileUpload({ 
  onFilesChange, 
  acceptedTypes = "*", 
  maxFiles = 10, 
  maxSize = 50 // MB
}) {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      
      // Check file type if specified
      if (acceptedTypes !== "*") {
        const acceptedExtensions = acceptedTypes.split(',').map(type => type.trim());
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!acceptedExtensions.includes(fileExtension)) {
          alert(`File ${file.name} is not an accepted file type.`);
          return false;
        }
      }
      
      return true;
    });

    const newFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
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
    handleFileSelect(droppedFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      'py': 'mdi-language-python',
      'json': 'mdi-code-json',
      'txt': 'mdi-file-document',
      'md': 'mdi-language-markdown',
      'yaml': 'mdi-file-code',
      'yml': 'mdi-file-code',
      'pkl': 'mdi-database',
      'pt': 'mdi-database',
      'pth': 'mdi-database',
      'onnx': 'mdi-database',
      'pb': 'mdi-database',
      'tflite': 'mdi-database'
    };
    return iconMap[extension] || 'mdi-file';
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-content">
          <i className="mdi mdi-cloud-upload upload-icon"></i>
          <h5 className="upload-title">Upload Model Files</h5>
          <p className="upload-description">
            Drag and drop your model files here, or click to browse
          </p>
          <div className="upload-requirements">
            <span>Accepted formats: {acceptedTypes}</span>
            <span>Max files: {maxFiles}</span>
            <span>Max size per file: {maxSize}MB</span>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="file-input"
        />
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <h6 className="files-title">
            <i className="mdi mdi-file-multiple me-2"></i>
            Selected Files ({files.length}/{maxFiles})
          </h6>
          
          <div className="files-grid">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-icon">
                  <i className={`mdi ${getFileIcon(file.name)}`}></i>
                </div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
                <button
                  type="button"
                  className="file-remove"
                  onClick={() => removeFile(index)}
                >
                  <i className="mdi mdi-close"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload-container {
          width: 100%;
        }
        
        .file-upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(247, 250, 252, 0.5);
          position: relative;
        }
        
        .file-upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        
        .file-upload-area.drag-over {
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
        
        .file-upload-area:hover .upload-icon {
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
        
        .files-list {
          margin-top: 1.5rem;
        }
        
        .files-title {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1rem;
          display: flex;
          align-items: center;
        }
        
        .files-title i {
          color: #667eea;
        }
        
        .files-grid {
          display: grid;
          gap: 0.75rem;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .file-item:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }
        
        .file-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }
        
        .file-info {
          flex: 1;
          min-width: 0;
        }
        
        .file-name {
          color: #2d3748;
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .file-size {
          color: #718096;
          font-size: 0.8rem;
        }
        
        .file-remove {
          background: none;
          border: none;
          color: #e53e3e;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .file-remove:hover {
          background: rgba(229, 62, 62, 0.1);
        }
        
        .file-remove i {
          font-size: 16px;
        }
        
        @media (max-width: 768px) {
          .file-upload-area {
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
          
          .file-item {
            padding: 10px;
          }
          
          .file-icon {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
} 