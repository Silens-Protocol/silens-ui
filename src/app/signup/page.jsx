"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import StepOne from "../../components/signup/StepOne";
import StepTwo from "../../components/signup/StepTwo";
import { useUser, hasIdentityButNotVerified, hasIdentityAndVerified } from "../../hooks/useUser";
import { useAccount } from "wagmi";

export default function Signup() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenId, setTokenId] = useState(null);
  
  const { data: userData, isLoading, error } = useUser();

  useEffect(() => {
    if (isConnected && address && userData && !isLoading) {
      if (hasIdentityAndVerified(userData)) {
        router.push('/');
        return;
      }
      
      if (hasIdentityButNotVerified(userData)) {
        setCurrentStep(2);
        setTokenId(userData.user.identityTokenId);
      }
    }
  }, [isConnected, address, userData, isLoading, router]);

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  if (isConnected && isLoading) {
    return (
      <>
        <Navbar navlight={true} />
        <section className="bg-half-100 d-table w-100" style={{backgroundImage:`url("/images/bg/bg01.png")`, backgroundPosition:'center'}}>
          <div className="bg-overlay bg-gradient-primary opacity-8"></div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 p-0">
                <div className="d-flex flex-column min-vh-100 p-4">
                  <div className="title-heading text-center my-auto">
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Checking your identity status...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        
        <style jsx>{`
          .loading-container {
            text-align: center;
            color: white;
          }
          
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-text {
            font-size: 1.1rem;
            opacity: 0.9;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar navlight={true} />
      <section className="bg-half-100 d-table w-100" style={{backgroundImage:`url("/images/bg/bg01.png")`, backgroundPosition:'center'}}>
        <div className="bg-overlay bg-gradient-primary opacity-8"></div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 p-0">
              <div className="d-flex flex-column min-vh-100 p-4">
                <div className="title-heading text-center my-auto">
                  <div className="progress-container mb-5">
                    <div className="progress-wrapper">
                      <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <div className="progress-icon">
                          {currentStep > 1 ? (
                            <i className="mdi mdi-check"></i>
                          ) : (
                            <span>1</span>
                          )}
                        </div>
                        <div className="progress-label">Profile Setup</div>
                      </div>
                      
                      <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                      
                      <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="progress-icon">
                          <span>2</span>
                        </div>
                        <div className="progress-label">Verification</div>
                      </div>
                    </div>
                  </div>

                  <div className="step-content-wrapper">
                    {currentStep === 1 && (
                      <StepOne onNext={handleNext} setTokenId={setTokenId} />
                    )}
                    
                    {currentStep === 2 && (
                      <StepTwo tokenId={tokenId} onBack={handleBack} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      
      <style jsx>{`
        .progress-container {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .progress-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.6;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .progress-step.active {
          opacity: 1;
        }
        
        .progress-step.completed {
          opacity: 1;
        }
        
        .progress-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 12px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .progress-step.active .progress-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transform: scale(1.1);
        }
        
        .progress-step.completed .progress-icon {
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 25px rgba(74, 222, 128, 0.4);
        }
        
        .progress-step.completed .progress-icon i {
          font-size: 20px;
          animation: checkmark 0.3s ease-in-out;
        }
        
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .progress-label {
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .progress-step.active .progress-label {
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .progress-line {
          width: 80px;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .progress-line.active {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .progress-line.active::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        .step-content-wrapper {
          animation: fadeInUp 0.5s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .progress-wrapper {
            gap: 15px;
          }
          
          .progress-icon {
            width: 45px;
            height: 45px;
            font-size: 16px;
          }
          
          .progress-line {
            width: 60px;
          }
          
          .progress-label {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
