"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { readContract } from '@wagmi/core'
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "react-hot-toast";
import { IDENTITY_REGISTRY_CONTRACT } from "@/constants";
import { pinata } from "@/utils/pinata";
import { config } from "@/wagmi";

export default function StepOne({ onNext, setTokenId }) {
  const { isConnected, address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: null,
    links: {
      github: "",
      twitter: "",
      linkedin: "",
      discord: ""
    }
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('link-')) {
      const linkType = name.replace('link-', '');
      setFormData(prev => ({
        ...prev,
        links: {
          ...prev.links,
          [linkType]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const promise = async () => {
      const profileData = {
        name: formData.name,
        bio: formData.bio,
        links: formData.links,
        timestamp: Date.now(),
        address: address
      };

      if (formData.profilePicture) {
        const keyRequest = await fetch("/api/key");
        const keyData = await keyRequest.json();
        
        const imageUpload = await pinata.upload.file(formData.profilePicture).key(keyData.JWT);
        if (!imageUpload.IpfsHash) {
          throw new Error("Failed to upload profile picture");
        }
        profileData.profilePicture = `${imageUpload.IpfsHash}`;
      }

      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      
      const upload = await pinata.upload.json(profileData).key(keyData.JWT);
      if (!upload.IpfsHash) {
        throw new Error("Failed to upload profile data");
      }

      const ipfsUri = `${upload.IpfsHash}`;

      const result = await writeContractAsync({
        ...IDENTITY_REGISTRY_CONTRACT,
        functionName: 'mintIdentity',
        args: [ipfsUri],
        account: address,
      });

     await waitForTransactionReceipt(config, {
        hash: result,
      });

      try {
        const tokenId = await readContract(config, {
          ...IDENTITY_REGISTRY_CONTRACT,
          functionName: 'getTokenIdByAddress',
          args: [address],
        });
        setTokenId(tokenId);
        onNext();
      } catch (error) {
        console.log(error, "error");
        throw new Error("Failed to get token ID from transaction");
      }

      return result;
    };

    toast.promise(promise(), {
      loading: 'Creating your identity...',
      success: 'Identity created successfully! Moving to verification...',
      error: (err) => `Error: ${err.message || 'Something went wrong'}`
    });
  };

  return (
    <div className="signup-form-container">
      <div className="form-card">
        <div className="form-header">
          <div className="header-icon">
            <i className="mdi mdi-account-plus"></i>
          </div>
          <h4 className="form-title">Create Your Identity</h4>
          <p className="form-subtitle">Step 1: Set up your profile information</p>
        </div>

        <form onSubmit={onSubmit} className="signup-form">
          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-account me-2"></i>
              Basic Information
            </h6>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-account input-icon"></i>
                <input
                  type="text"
                  className="form-input"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <div className="input-wrapper">
                <i className="mdi mdi-text input-icon"></i>
                <textarea
                  className="form-input"
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-image me-2"></i>
              Profile Picture
            </h6>
            
            <div className="form-group">
              <div className="file-upload-container">
                <input
                  type="file"
                  className="file-input"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="profilePicture" className="file-upload-label">
                  <div className="upload-content">
                    <i className="mdi mdi-camera upload-icon"></i>
                    <span className="upload-text">Choose Profile Picture</span>
                    <span className="upload-hint">JPG, PNG or GIF (max 5MB)</span>
                  </div>
                </label>
              </div>
              
              {previewImage && (
                <div className="image-preview">
                  <img 
                    src={previewImage} 
                    alt="Profile Preview" 
                    className="preview-image"
                  />
                  <div className="preview-overlay">
                    <i className="mdi mdi-check-circle"></i>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h6 className="section-title">
              <i className="mdi mdi-link me-2"></i>
              Social Links
            </h6>
            
            <div className="social-links-grid">
              <div className="form-group">
                <label htmlFor="link-github" className="form-label">
                  <i className="mdi mdi-github me-1"></i>
                  GitHub Profile
                </label>
                <div className="input-wrapper">
                  <i className="mdi mdi-github input-icon"></i>
                  <input
                    type="url"
                    className="form-input"
                    id="link-github"
                    name="link-github"
                    placeholder="https://github.com/username"
                    value={formData.links.github}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="link-twitter" className="form-label">
                  <i className="mdi mdi-twitter me-1"></i>
                  Twitter Profile
                </label>
                <div className="input-wrapper">
                  <i className="mdi mdi-twitter input-icon"></i>
                  <input
                    type="url"
                    className="form-input"
                    id="link-twitter"
                    name="link-twitter"
                    placeholder="https://twitter.com/username"
                    value={formData.links.twitter}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="link-linkedin" className="form-label">
                  <i className="mdi mdi-linkedin me-1"></i>
                  LinkedIn Profile
                </label>
                <div className="input-wrapper">
                  <i className="mdi mdi-linkedin input-icon"></i>
                  <input
                    type="url"
                    className="form-input"
                    id="link-linkedin"
                    name="link-linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.links.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="link-discord" className="form-label">
                  <i className="mdi mdi-discord me-1"></i>
                  Discord Username
                </label>
                <div className="input-wrapper">
                  <i className="mdi mdi-discord input-icon"></i>
                  <input
                    type="text"
                    className="form-input"
                    id="link-discord"
                    name="link-discord"
                    placeholder="username#1234"
                    value={formData.links.discord}
                    onChange={handleInputChange}
                  />
                </div>
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
                  Creating Identity...
                </>
              ) : (
                <>
                  <i className="mdi mdi-arrow-right me-2"></i>
                  Create Identity
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
        .signup-form-container {
          max-width: 600px;
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
        
        .file-upload-container {
          position: relative;
        }
        
        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        .file-upload-label {
          display: block;
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(247, 250, 252, 0.5);
        }
        
        .file-upload-label:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .upload-icon {
          font-size: 2rem;
          color: #a0aec0;
        }
        
        .upload-text {
          font-weight: 500;
          color: #4a5568;
        }
        
        .upload-hint {
          font-size: 0.8rem;
          color: #a0aec0;
        }
        
        .image-preview {
          position: relative;
          display: inline-block;
          margin-top: 1rem;
        }
        
        .preview-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        
        .preview-overlay {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 30px;
          height: 30px;
          background: #48bb78;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
        }
        
        .social-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
          
          .social-links-grid {
            grid-template-columns: 1fr;
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
