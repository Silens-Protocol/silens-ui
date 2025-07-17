import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useSignMessage } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IDENTITY_REGISTRY_CONTRACT, REPUTATION_SYSTEM_CONTRACT } from "@/constants";
import { config } from "@/wagmi";
import { encodeAbiParameters, keccak256 } from "viem";


export default function StepTwo({ tokenId }) {
  const { isConnected, address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const router = useRouter();

  const [githubUsername, setGithubUsername] = useState("");
  const [isVerifyingGithub, setIsVerifyingGithub] = useState(false);
  const [isVerifyingOwnership, setIsVerifyingOwnership] = useState(false);
  const [isMintingBadge, setIsMintingBadge] = useState(false);
  const [githubVerified, setGithubVerified] = useState(false);
  const [ownershipVerified, setOwnershipVerified] = useState(false);
  const [badgeMinted, setBadgeMinted] = useState(false);

  const handleGithubVerification = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!githubUsername.trim()) {
      toast.error("Please enter your GitHub username");
      return;
    }

    const promise = async () => {
      setIsVerifyingGithub(true);

      const authUrl = `/api/auth?username=${encodeURIComponent(githubUsername)}`;
      window.location.href = authUrl;
    };

    toast.promise(promise(), {
      loading: 'Redirecting to GitHub for verification...',
      success: 'GitHub verification initiated!',
      error: (err) => `Error: ${err.message || 'Something went wrong'}`
    });
  };

  const handleVerifyPlatformOwnership = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const promise = async () => {
      setIsVerifyingOwnership(true);

      const encodedData = encodeAbiParameters(
        [
          { type: 'uint256', name: 'tokenId' },
          { type: 'string', name: 'platform' },
          { type: 'string', name: 'username' },
          { type: 'string', name: 'message' }
        ],
        [
          BigInt(tokenId), 
          "github", 
          githubUsername, 
          "I verify ownership of this platform account for my Silens identity"
        ]
      );
      
      const messageHash = keccak256(encodedData);
      
      const signature = await signMessageAsync({ 
        message: { raw: messageHash }
      });

      const result = await writeContractAsync({
        ...IDENTITY_REGISTRY_CONTRACT,
        functionName: 'verifyPlatformOwnership',
        args: [tokenId, "github", githubUsername, signature],
        account: address,
      });

      await waitForTransactionReceipt(config, {
        hash: result,
      });

      setIsVerifyingOwnership(false);
      setOwnershipVerified(true);
      return result;
    };

    toast.promise(promise(), {
      loading: 'Signing message and verifying platform ownership...',
      success: 'Platform ownership verified successfully!',
      error: (err) => `Error: ${err.message || 'Something went wrong'}`
    });
  };

  const handleMintVerifiedBadge = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const promise = async () => {
      setIsMintingBadge(true);

      const badgeResult = await writeContractAsync({
        ...REPUTATION_SYSTEM_CONTRACT,
        functionName: 'checkAndAwardVerifiedBadge',
        args: [address],
        account: address,
      });

      await waitForTransactionReceipt(config, {
        hash: badgeResult,
      });

      setIsMintingBadge(false);
      setBadgeMinted(true);
      return badgeResult;
    };

    toast.promise(promise(), {
      loading: 'Minting Verified Reviewer Badge...',
      success: 'Badge minted successfully! Redirecting to home...',
      error: (err) => `Error: ${err.message || 'Something went wrong'}`
    }).then(() => {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  };

  const skipVerification = () => {
    toast.success("Skipping verification. Redirecting to home...");
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const username = urlParams.get('username');
    
    if (verified === 'true' && username) {
      setGithubVerified(true);
      setGithubUsername(username);
      toast.success('GitHub account verified successfully!');
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (verified === 'false') {
      const reason = urlParams.get('reason');
      let errorMessage = 'GitHub verification failed';
      
      if (reason === 'username_mismatch') {
        errorMessage = 'GitHub username does not match the provided username';
      } else if (reason === 'missing_params') {
        errorMessage = 'Missing required parameters for verification';
      } else if (reason === 'oauth_error') {
        errorMessage = 'OAuth authentication error';
      }
      
      toast.error(errorMessage);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <div className="header-icon">
            <i className="mdi mdi-shield-check"></i>
          </div>
          <h4 className="verification-title">Verify Your Identity</h4>
          <p className="verification-subtitle">Step 2: Verify your social accounts to earn badges</p>
        </div>

        <div className="verification-content">
          <div className="info-banner">
            <div className="info-content">
              <h6 className="info-title">Why verify?</h6>
              <p className="info-text">Verified accounts earn reputation badges and can participate in governance.</p>
            </div>
          </div>

          <div className="verification-options">
            <div className="verification-option active">
              <div className="option-header">
                <div className="platform-icon github">
                  <i className="mdi mdi-github"></i>
                </div>
                <div className="option-info">
                  <h6 className="option-title">GitHub Verification</h6>
                  <p className="option-description">Verify your GitHub account to prove your identity and earn the "Verified Reviewer" badge.</p>
                </div>
                <div className="option-status">
                  {githubVerified ? (
                    <span className="status-badge verified">Verified</span>
                  ) : (
                    <span className="status-badge available">Available</span>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleGithubVerification} className="verification-form">
                <div className="form-group">
                  <label htmlFor="githubUsername" className="form-label">
                    <i className="mdi mdi-github me-1"></i>
                    GitHub Username <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <i className="mdi mdi-github input-icon"></i>
                    <input
                      type="text"
                      className="form-input"
                      id="githubUsername"
                      placeholder="Enter your GitHub username"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      required
                      disabled={githubVerified}
                    />
                  </div>
                </div>

                <button
                  className="verify-button primary"
                  type="submit"
                  disabled={isVerifyingGithub || !isConnected || githubVerified}
                >
                  {isVerifyingGithub ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : githubVerified ? (
                    <>
                      <i className="mdi mdi-check me-2"></i>
                      GitHub Verified
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-github me-2"></i>
                      Verify GitHub Account
                    </>
                  )}
                </button>
              </form>

              {githubVerified && !ownershipVerified && (
                <div className="verification-step">
                  <div className="step-divider"></div>
                  <button
                    className="verify-button secondary"
                    onClick={handleVerifyPlatformOwnership}
                    disabled={isVerifyingOwnership || !isConnected}
                  >
                    {isVerifyingOwnership ? (
                      <>
                        <span className="spinner"></span>
                        Verifying Ownership...
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-shield-check me-2"></i>
                        Verify Platform Ownership
                      </>
                    )}
                  </button>
                </div>
              )}

              {ownershipVerified && (
                <div className="verification-step">
                  <div className="step-divider"></div>
                  <div className="ownership-verified">
                    <i className="mdi mdi-check-circle text-success me-2"></i>
                    <span>Platform ownership verified successfully!</span>
                  </div>
                </div>
              )}
            </div>

            <div className="verification-option disabled">
              <div className="option-header">
                <div className="platform-icon twitter">
                  <i className="mdi mdi-twitter"></i>
                </div>
                <div className="option-info">
                  <h6 className="option-title">Twitter Verification</h6>
                  <p className="option-description">Twitter verification coming soon...</p>
                </div>
                <div className="option-status">
                  <span className="status-badge coming-soon">Coming Soon</span>
                </div>
              </div>
              <button className="verify-button secondary" disabled>
                Coming Soon
              </button>
            </div>

            <div className="verification-option disabled">
              <div className="option-header">
                <div className="platform-icon linkedin">
                  <i className="mdi mdi-linkedin"></i>
                </div>
                <div className="option-info">
                  <h6 className="option-title">LinkedIn Verification</h6>
                  <p className="option-description">LinkedIn verification coming soon...</p>
                </div>
                <div className="option-status">
                  <span className="status-badge coming-soon">Coming Soon</span>
                </div>
              </div>
              <button className="verify-button secondary" disabled>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="verification-actions">
            <button
              type="button"
              className="action-button skip"
              onClick={skipVerification}
              disabled={isVerifyingGithub || isVerifyingOwnership || isMintingBadge}
            >
              <i className="mdi mdi-arrow-right me-2"></i>
              Skip for Now
            </button>

            {ownershipVerified && !badgeMinted && (
              <button
                type="button"
                className="action-button mint"
                onClick={handleMintVerifiedBadge}
                disabled={isMintingBadge || !isConnected}
              >
                {isMintingBadge ? (
                  <>
                    <span className="spinner"></span>
                    Minting Badge...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-medal me-2"></i>
                    Mint Verified Reviewer Badge
                  </>
                )}
              </button>
            )}
          </div>

          {!isConnected && (
            <div className="wallet-warning">
              <i className="mdi mdi-wallet-outline"></i>
              <span>Please connect your wallet to continue</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .verification-container {
          max-width: 700px;
          margin: 0 auto;
          width: 100%;
        }
        
        .verification-card {
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
        
        .verification-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
        }
        
        .header-icon i {
          font-size: 24px;
          color: white;
        }
        
        .verification-title {
          color: #2d3748;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
        }
        
        .verification-subtitle {
          color: #718096;
          font-size: 0.95rem;
          margin: 0;
        }
        
        .returning-user-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%);
          border: 1px solid rgba(72, 187, 120, 0.2);
          border-radius: 8px;
          color: #38a169;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .returning-user-banner i {
          font-size: 18px;
        }
        
        .info-banner {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        
        .info-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .info-icon i {
          color: white;
          font-size: 18px;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-title {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        
        .info-text {
          color: #4a5568;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.5;
        }
        
        .verification-options {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .verification-option {
          background: rgba(247, 250, 252, 0.5);
          border: 2px solid rgba(226, 232, 240, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .verification-option.active {
          border-color: rgba(102, 126, 234, 0.3);
          background: rgba(102, 126, 234, 0.02);
        }
        
        .verification-option.disabled {
          opacity: 0.6;
        }
        
        .option-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        
        .platform-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        }
        
        .platform-icon.github {
          background: linear-gradient(135deg, #24292e 0%, #586069 100%);
        }
        
        .platform-icon.twitter {
          background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
        }
        
        .platform-icon.linkedin {
          background: linear-gradient(135deg, #0077b5 0%, #005885 100%);
        }
        
        .option-info {
          flex: 1;
        }
        
        .option-title {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
        }
        
        .option-description {
          color: #718096;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.4;
        }
        
        .option-status {
          flex-shrink: 0;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-badge.available {
          background: rgba(72, 187, 120, 0.1);
          color: #38a169;
          border: 1px solid rgba(72, 187, 120, 0.2);
        }
        
        .status-badge.verified {
          background: rgba(72, 187, 120, 0.1);
          color: #38a169;
          border: 1px solid rgba(72, 187, 120, 0.2);
        }
        
        .status-badge.coming-soon {
          background: rgba(160, 174, 192, 0.1);
          color: #718096;
          border: 1px solid rgba(160, 174, 192, 0.2);
        }
        
        .verification-form {
          margin-top: 1rem;
        }
        
        .verification-step {
          margin-top: 1rem;
        }
        
        .step-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.2) 50%, transparent 100%);
          margin: 1rem 0;
        }
        
        .ownership-verified {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(72, 187, 120, 0.1);
          border: 1px solid rgba(72, 187, 120, 0.2);
          border-radius: 8px;
          color: #38a169;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .text-success {
          color: #38a169;
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
        
        .form-input:disabled {
          background: #f7fafc;
          color: #a0aec0;
          cursor: not-allowed;
        }
        
        .form-input::placeholder {
          color: #a0aec0;
        }
        
        .verify-button {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .verify-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .verify-button.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .verify-button.secondary {
          background: rgba(160, 174, 192, 0.1);
          color: #718096;
          border: 1px solid rgba(160, 174, 192, 0.2);
        }
        
        .verify-button.secondary:hover:not(:disabled) {
          background: rgba(160, 174, 192, 0.2);
          transform: translateY(-1px);
        }
        
        .verify-button:disabled {
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
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .verification-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .action-button {
          flex: 1;
          padding: 12px 24px;
          border: 2px solid;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: transparent;
        }
        
        .action-button.skip {
          border-color: #667eea;
          color: #667eea;
        }
        
        .action-button.skip:hover:not(:disabled) {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }
        
        .action-button.mint {
          border-color: #48bb78;
          color: #48bb78;
        }
        
        .action-button.mint:hover:not(:disabled) {
          background: #48bb78;
          color: white;
          transform: translateY(-1px);
        }
        
        .action-button.back {
          border-color: #a0aec0;
          color: #718096;
        }
        
        .action-button.back:hover:not(:disabled) {
          background: #a0aec0;
          color: white;
          transform: translateY(-1px);
        }
        
        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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
          .verification-card {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          
          .option-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .option-status {
            align-self: flex-start;
          }
          
          .verification-actions {
            flex-direction: column;
          }
          
          .info-banner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
