import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MODEL_REGISTRY_CONTRACT } from "@/constants";
import { pinata } from "@/utils/pinata";
import { config } from "@/wagmi";
import TagInput from "./TagInput";
import ImageUpload from "./ImageUpload";

export default function ModelForm() {
  const { isConnected, address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    category: "",
    tags: [],
    link: "",
    modelDetails: "",
  });

  const [modelImage, setModelImage] = useState(null);

  const categories = [
    "Safety & Security",
    "Fairness & Bias", 
    "Privacy Protection",
    "Ethics & Values",
    "Transparency"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  const handleTagsChange = (tags) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleImageChange = (image) => {
    setModelImage(image);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Model name is required");
      return;
    }

    if (!formData.summary.trim()) {
      toast.error("Summary is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    const promise = async () => {
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();

      let imageHash = null;
      if (modelImage) {
        const imageUpload = await pinata.upload.file(modelImage).key(keyData.JWT);
        if (!imageUpload.IpfsHash) {
          throw new Error("Failed to upload model image");
        }
        imageHash = imageUpload.IpfsHash;
      }

      const modelMetadata = {
        name: formData.name,
        summary: formData.summary,
        category: formData.category,
        tags: formData.tags,
        link: formData.link,
        modelDetails: formData.modelDetails,
        imageHash: imageHash,
        timestamp: Date.now(),
        submitter: address
      };

      const keyRequest2 = await fetch("/api/key");
      const keyData2 = await keyRequest2.json();

      const metadataUpload = await pinata.upload.json(modelMetadata).key(keyData2.JWT);
      if (!metadataUpload.IpfsHash) {
        throw new Error("Failed to upload model metadata");
      }

      const ipfsHash = metadataUpload.IpfsHash;

      const result = await writeContractAsync({
        ...MODEL_REGISTRY_CONTRACT,
        functionName: 'submitModel',
        args: [ipfsHash],
        account: address,
      });

      await waitForTransactionReceipt(config, {
        hash: result,
      });

      router.push('/profile');
      return result;
    };

    toast.promise(promise(), {
      loading: 'Submitting your model...',
      success: 'Model submitted successfully! Redirecting to explore page...',
      error: (err) => {
        console.error("Model submission error:", err);
        return `Error: ${err.message || 'Something went wrong'}`;
      }
    });
  };

  return (
    <div className="model-form-container">
      <div className="form-card">
        <div className="form-header">
          <div className="header-icon">
            <i className="mdi mdi-robot"></i>
          </div>
          <h4 className="form-title">Submit AI Model</h4>
          <p className="form-subtitle">Share your AI model with the community for review</p>
        </div>

        <form onSubmit={onSubmit} className="model-form">
          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-information me-2"></i>
              Basic Information
            </h6>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Model Name <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-robot input-icon"></i>
                <input
                  type="text"
                  className="form-input"
                  id="name"
                  name="name"
                  placeholder="Enter your model name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="summary" className="form-label">
                Summary <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-text input-icon"></i>
                <textarea
                  className="form-input"
                  id="summary"
                  name="summary"
                  placeholder="Brief description of your model..."
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-tag input-icon"></i>
                <select
                  className="form-input"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Tags (up to 3)
              </label>
              <TagInput 
                tags={formData.tags} 
                onChange={handleTagsChange}
                maxTags={3}
              />
            </div>
          </div>

          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-image me-2"></i>
              Model Image
            </h6>
            
            <div className="form-group">
              <ImageUpload 
                onImageChange={handleImageChange}
                acceptedTypes="image/*"
                maxSize={5}
              />
            </div>
          </div>

          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-link me-2"></i>
              Model Link
            </h6>
            
            <div className="form-group">
              <label htmlFor="link" className="form-label">
                Model Deployment Link
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-link input-icon"></i>
                <input
                  type="url"
                  className="form-input"
                  id="link"
                  name="link"
                  placeholder="https://huggingface.co/username/model-name"
                  value={formData.link}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-file-document me-2"></i>
              Model Details
            </h6>
            
            <div className="form-group">
              <label htmlFor="modelDetails" className="form-label">
                Detailed Description
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-text input-icon"></i>
                <textarea
                  className="form-input"
                  id="modelDetails"
                  name="modelDetails"
                  placeholder="Provide detailed information about your model, its architecture, training data, use cases, etc..."
                  value={formData.modelDetails}
                  onChange={handleInputChange}
                  rows="6"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="submit-button"
              type="submit"
              disabled={isPending || !isConnected}
            >
              {isPending ? (
                <>
                  <span className="spinner"></span>
                  Submitting Model...
                </>
              ) : (
                <>
                  <i className="mdi mdi-upload me-2"></i>
                  Submit Model
                </>
              )}
            </button>
          </div>

          {!isConnected && (
            <div className="wallet-warning">
              <i className="mdi mdi-wallet-outline"></i>
              <span>Please connect your wallet to continue</span>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .model-form-container {
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .header-icon i {
          font-size: 24px;
          color: white;
        }
        
        .form-title {
          color: #2d3748;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
        }
        
        .form-subtitle {
          color: #718096;
          font-size: 0.95rem;
          margin: 0;
        }
        
        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(247, 250, 252, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.5);
        }
        
        .section-title {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 1.25rem;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }
        
        .section-title i {
          color: #667eea;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-label {
          display: block;
          color: #4a5568;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .required {
          color: #e53e3e;
          font-weight: 600;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 12px;
          color: #a0aec0;
          font-size: 18px;
          z-index: 1;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
          color: #2d3748;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-input::placeholder {
          color: #a0aec0;
        }
        
        textarea.form-input {
          resize: vertical;
          min-height: 80px;
        }
        
        select.form-input {
          cursor: pointer;
        }
        
        .form-actions {
          margin-top: 2rem;
          text-align: center;
        }
        
        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 200px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .wallet-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(245, 101, 101, 0.1);
          border: 1px solid rgba(245, 101, 101, 0.2);
          border-radius: 8px;
          color: #e53e3e;
          font-size: 0.9rem;
        }
        
        .wallet-warning i {
          font-size: 18px;
        }
        
        @media (max-width: 768px) {
          .form-card {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          
          .form-section {
            padding: 1rem;
          }
          
          .submit-button {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
} 