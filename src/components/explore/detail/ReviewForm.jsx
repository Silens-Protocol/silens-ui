"use client"

import { useState } from "react"
import { FaRegCommentDots as CommentIcon } from "react-icons/fa"
import { FaTimes as CloseIcon } from "react-icons/fa"
import { FaImage as ImageIcon } from "react-icons/fa"

export default function ReviewForm({ onSubmit, onCancel }) {
  const [reviewData, setReviewData] = useState({
    prompt: "",
    output: "",
    comment: "",
    screenshot: null
  })
  const [screenshotPreview, setScreenshotPreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Screenshot is too large. Maximum size is 5MB.")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }

      setReviewData(prev => ({
        ...prev,
        screenshot: file
      }))

      const reader = new FileReader()
      reader.onload = (e) => setScreenshotPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeScreenshot = () => {
    setReviewData(prev => ({
      ...prev,
      screenshot: null
    }))
    setScreenshotPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(reviewData)
  }

  const handleCancel = () => {
    setReviewData({
      prompt: "",
      output: "",
      comment: "",
      screenshot: null
    })
    setScreenshotPreview(null)
    onCancel()
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">
            <CommentIcon className="me-2 text-primary" />
            Submit Your Review
          </h5>
        </div>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label fw-semibold text-dark mb-2">
                Prompt <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control border-2"
                name="prompt"
                value={reviewData.prompt}
                onChange={handleInputChange}
                placeholder="Enter the prompt you used to test the model..."
                rows="3"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark mb-2">
                Model Output <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control border-2"
                name="output"
                value={reviewData.output}
                onChange={handleInputChange}
                placeholder="Enter the output/response from the model..."
                rows="4"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark mb-2">
                Screenshot
              </label>
              {!screenshotPreview ? (
                <div className="screenshot-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="file-input"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="upload-label">
                    <div className="upload-content">
                      <ImageIcon className="upload-icon" />
                      <h6 className="upload-title">Upload Screenshot</h6>
                      <p className="upload-description">
                        Click to browse or drag and drop an image
                      </p>
                      <small className="text-muted">Max size: 5MB</small>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="screenshot-preview">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-screenshot"
                    onClick={removeScreenshot}
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark mb-2">
                Comment <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control border-2"
                name="comment"
                value={reviewData.comment}
                onChange={handleInputChange}
                placeholder="Share your thoughts about the model's performance, safety, and any concerns..."
                rows="4"
                required
              />
            </div>

            <div className="col-12 d-flex justify-content-end">
              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
                >
                  <CommentIcon className="me-2" />
                  Submit Review
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .screenshot-upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(247, 250, 252, 0.5);
          position: relative;
        }
        
        .screenshot-upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        
        .file-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        
        .upload-label {
          cursor: pointer;
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .upload-icon {
          font-size: 2rem;
          color: #a0aec0;
        }
        
        .upload-title {
          color: #2d3748;
          font-weight: 600;
          margin: 0;
        }
        
        .upload-description {
          color: #718096;
          margin: 0;
          font-size: 0.9rem;
        }
        
        .screenshot-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .preview-image {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .remove-screenshot {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .remove-screenshot:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }
        
        .form-control {
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </div>
  )
}
