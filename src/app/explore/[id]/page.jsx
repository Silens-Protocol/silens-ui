"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAccount, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "@wagmi/core"
import { toast } from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useModel } from "../../../hooks/useModelData"
import { getStatusBadge, getStatusText, isProposalActive, getProposalTimeRemaining, getLatestProposal } from "../../../utils/utils"
import { SILENS_CONTRACT, VOTING_PROPOSAL_CONTRACT } from "../../../constants"
import { config } from "../../../wagmi"
import DetailTab from "../../../components/explore/detail/DetailTab"
import ReviewTab from "../../../components/explore/detail/ReviewTab"
import VotesTab from "../../../components/explore/detail/VotesTab"
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaComments,
  FaTachometerAlt,
  FaClipboardCheck,
  FaInfoCircle,
  FaRegCommentDots,
  FaThumbsUp,
  FaVoteYea
} from "react-icons/fa"

const ExclamationTriangleIcon = FaExclamationTriangle
const ShieldCheckIcon = FaShieldAlt
const ChatDotsIcon = FaComments
const TachometerIcon = FaTachometerAlt
const WarningIcon = FaExclamationTriangle
const ClipboardCheckIcon = FaClipboardCheck
const InfoCircleIcon = FaInfoCircle
const CommentSquareTextIcon = FaRegCommentDots
const ThumbsUpIcon = FaThumbsUp
const VoteYeaIcon = FaVoteYea

const ModelDetailSkeleton = () => (
  <>
    <Navbar navlight={true} />
    
    <section
      className="position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "60vh",
      }}
    >
      <div className="container position-relative d-flex align-items-center justify-content-center text-center"
           style={{ zIndex: 2, minHeight: "60vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="mb-4">
              <div className="skeleton-badge animate-pulse"></div>
            </div>
            
            <div className="skeleton-title animate-pulse mb-4"></div>
            
            <div className="skeleton-description animate-pulse mb-4"></div>
            
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <div className="skeleton-tag animate-pulse"></div>
              <div className="skeleton-tag animate-pulse"></div>
              <div className="skeleton-tag animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5" style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <div className="row g-4 mb-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="skeleton-icon animate-pulse mb-3"></div>
                      <div className="skeleton-stat-label animate-pulse mb-2"></div>
                      <div className="skeleton-stat-value animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                <div className="d-flex justify-content-center mb-3">
                  <div className="skeleton-tab animate-pulse mx-2"></div>
                  <div className="skeleton-tab animate-pulse mx-2"></div>
                  <div className="skeleton-tab animate-pulse mx-2"></div>
                </div>
              </div>

              <div className="card-body p-5">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="skeleton-content-line animate-pulse mb-3"></div>
                    <div className="skeleton-content-line animate-pulse mb-3"></div>
                    <div className="skeleton-content-line animate-pulse mb-3"></div>
                    <div className="skeleton-content-line animate-pulse mb-3 w-75"></div>
                  </div>
                  <div className="col-lg-4">
                    <div className="skeleton-sidebar animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />

    <style jsx>{`
      .skeleton-badge {
        width: 200px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        margin: 0 auto;
      }

      .skeleton-title {
        width: 80%;
        height: 60px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        margin: 0 auto;
      }

      .skeleton-description {
        width: 70%;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        margin: 0 auto;
      }

      .skeleton-tag {
        width: 80px;
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 16px;
      }

      .skeleton-icon {
        width: 48px;
        height: 48px;
        background: #e9ecef;
        border-radius: 50%;
        margin: 0 auto;
      }

      .skeleton-stat-label {
        width: 100px;
        height: 16px;
        background: #e9ecef;
        border-radius: 4px;
        margin: 0 auto;
      }

      .skeleton-stat-value {
        width: 60px;
        height: 32px;
        background: #e9ecef;
        border-radius: 4px;
        margin: 0 auto;
      }

      .skeleton-tab {
        width: 120px;
        height: 48px;
        background: #e9ecef;
        border-radius: 24px;
      }

      .skeleton-content-line {
        width: 100%;
        height: 16px;
        background: #e9ecef;
        border-radius: 4px;
      }

      .skeleton-sidebar {
        width: 100%;
        height: 200px;
        background: #e9ecef;
        border-radius: 8px;
      }
    `}</style>
  </>
)

export default function ModelDetail() {
  const params = useParams()
  const modelId = params.id
  const [activeTab, setActiveTab] = useState(1)
  const { isConnected, address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const queryClient = useQueryClient()
  const { data: modelData, isLoading, error } = useModel(modelId)
  const latestProposal = getLatestProposal(modelData?.proposals)

  const handleInitiateProposal = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    const promise = async () => {
      const result = await writeContractAsync({
        ...SILENS_CONTRACT,
        functionName: 'checkAndCreateProposal',
        args: [modelId],
        account: address,
      })

      await waitForTransactionReceipt(config, {
        hash: result,
      })

      await queryClient.invalidateQueries(['model', modelId])
      
      return result
    }

    toast.promise(promise(), {
      loading: 'Initiating proposal...',
      success: 'Proposal initiated successfully!',
      error: (err) => `Error: ${err.message || 'Something went wrong'}`
    })
  }

  const handleExecuteProposal = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!latestProposal) {
      toast.error("No proposal to execute")
      return
    }

    const promise = async () => {
      const result = await writeContractAsync({
        ...VOTING_PROPOSAL_CONTRACT,
        functionName: 'executeProposal',
        args: [latestProposal.id],
        account: address,
      })

      await waitForTransactionReceipt(config, {
        hash: result,
      })

      await queryClient.invalidateQueries(['model', modelId])
      
      return result
    }

    toast.promise(promise(), {
      loading: 'Executing proposal...',
      success: 'Proposal executed successfully!',
      error: (err) => `Error: ${err.message || 'Something went wrong'}`
    })
  }

  if (isLoading) {
    return <ModelDetailSkeleton />
  }

  if (error) {
    return (
      <>
        <Navbar navlight={true} />
        <div className="container" style={{ minHeight: "70vh" }}>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="alert alert-danger border-0 shadow-lg" role="alert">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3">
                    <ExclamationTriangleIcon className="text-danger" />
                  </div>
                  <div>
                    <h4 className="alert-heading mb-1">Oops! Something went wrong</h4>
                    <p className="mb-0">{error.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!modelData) {
    return (
      <>
        <Navbar navlight={true} />
        <div className="container" style={{ minHeight: "70vh" }}>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="alert alert-warning border-0 shadow-lg" role="alert">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                    <ExclamationTriangleIcon className="text-warning" />
                  </div>
                  <div>
                    <h4 className="alert-heading mb-1">Model Not Found</h4>
                    <p className="mb-0">The requested model could not be found in our database.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar navlight={true} />

      <section
        className="position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "60vh",
        }}
      >

        <div
          className="container position-relative d-flex align-items-center justify-content-center text-center"
          style={{ zIndex: 2, minHeight: "60vh" }}
        >
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mb-4">
                <span
                  className={`badge ${getStatusBadge(modelData.status, modelData.proposals)} fs-6 px-4 py-2 rounded-pill shadow-lg mb-4`}
                >
                  {getStatusText(modelData.status, modelData.proposals) === "Governance Active" ? (
                    <VoteYeaIcon className="me-2" />
                  ) : (
                    <ShieldCheckIcon className="me-2" />
                  )}
                  {getStatusText(modelData.status, modelData.proposals)}
                </span>
              </div>
              <h1 className="display-3 fw-bold mb-4 text-white text-shadow">
                {modelData.metadata?.name || "Unnamed Model"}
              </h1>
              <p className="lead text-white-50 mb-4 fs-5">
                {modelData.metadata?.summary || "Discover the capabilities and insights of this AI model"}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {modelData.metadata?.tags?.slice(0, 3).map((tag, index) => (
                  <span key={index} className="badge bg-white bg-opacity-20 text-black px-3 py-2 rounded-pill">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {latestProposal && isProposalActive(latestProposal) && (
                <div className="mt-4">
                  <div className="alert alert-info border-0 shadow-sm d-inline-flex align-items-center px-4 py-3 rounded-pill">
                    <VoteYeaIcon className="me-2" />
                    <span className="fw-semibold">Governance in Progress</span>
                    <span className="ms-2 text-white">• {getProposalTimeRemaining(latestProposal)}</span>
                  </div>
                </div>
              )}
              
              {latestProposal && 
               !isProposalActive(latestProposal) && 
               !latestProposal.executed && (
                <div className="mt-4">
                  <button 
                    className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow-lg fw-semibold"
                    onClick={handleExecuteProposal}
                    disabled={isPending || !isConnected}
                  >
                    {isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Executing...
                      </>
                    ) : (
                      <>
                        <FaClipboardCheck className="me-2" />
                        Execute Proposal
                      </>
                    )}
                  </button>
                  {!isConnected && (
                    <div className="mt-2">
                      <small className="text-white-50">
                        <i className="mdi mdi-wallet-outline me-1"></i>
                        Connect wallet to execute proposal
                      </small>
                    </div>
                  )}
                </div>
              )}
              
              {modelData.reviewEndTime && 
               Date.now() > parseInt(modelData.reviewEndTime) * 1000 && 
               !latestProposal && (
                <div className="mt-4">
                  <button 
                    className="btn btn-warning btn-lg px-5 py-3 rounded-pill shadow-lg fw-semibold"
                    onClick={handleInitiateProposal}
                    disabled={isPending || !isConnected}
                  >
                    {isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Initiating...
                      </>
                    ) : (
                      <>
                        <FaClipboardCheck className="me-2" />
                        Initiate Proposal
                      </>
                    )}
                  </button>
                  {!isConnected && (
                    <div className="mt-2">
                      <small className="text-white-50">
                        <i className="mdi mdi-wallet-outline me-1"></i>
                        Connect wallet to initiate proposal
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="row g-4 mb-5">
                <div className="col-lg-4 col-md-6">
                  <div
                    className="card border-0 shadow-sm h-100 bg-gradient"
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                  >
                    <div className="card-body text-center p-4">
                      <div className="bg-white bg-opacity-75 rounded-circle p-3 d-inline-flex mb-3">
                        <ChatDotsIcon size={24} color="#667eea" />
                      </div>
                      <h6 className="text-uppercase mb-2 fw-light text-black">Total Reviews</h6>
                      <h2 className="mb-0 fw-bold text-black">{modelData.stats?.totalReviews || 0}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div
                    className="card border-0 shadow-sm h-100 bg-gradient"
                    style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}
                  >
                    <div className="card-body text-center p-4">
                      <div className="bg-white bg-opacity-75 rounded-circle p-3 d-inline-flex mb-3">
                        <TachometerIcon size={24} color="#f5576c" />
                      </div>
                      <h6 className="text-uppercase mb-2 fw-light text-black">Avg Severity</h6>
                      <h2 className="mb-0 fw-bold text-black">{modelData.stats?.averageSeverity || 0}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div
                    className="card border-0 shadow-sm h-100 bg-gradient"
                    style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
                  >
                    <div className="card-body text-center p-4">
                      <div className="bg-white bg-opacity-75 rounded-circle p-3 d-inline-flex mb-3">
                        <WarningIcon size={24} color="#4facfe" />
                      </div>
                      <h6 className="text-uppercase mb-2 fw-light text-black">Critical Reviews</h6>
                      <h2 className="mb-0 fw-bold text-black">{modelData.stats?.criticalReviewsCount || 0}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                  <ul className="nav mb-3 justify-content-center border-0" id="myTab" role="tablist">
                    <li className="nav-item mx-2">
                      <button
                        className={`nav-link px-5 py-3 rounded-pill fw-semibold transition-all ${
                          activeTab === 1 ? "active text-white shadow-sm" : "text-muted bg-light"
                        }`}
                        style={
                          activeTab === 1 ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" } : {}
                        }
                        onClick={() => setActiveTab(1)}
                      >
                        <InfoCircleIcon className="me-2" />
                        Details
                      </button>
                    </li>
                    <li className="nav-item mx-2">
                      <button
                        className={`nav-link px-5 py-3 rounded-pill fw-semibold transition-all ${
                          activeTab === 2 ? "active text-white shadow-sm" : "text-muted bg-light"
                        }`}
                        style={
                          activeTab === 2 ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" } : {}
                        }
                        onClick={() => setActiveTab(2)}
                      >
                        <CommentSquareTextIcon className="me-2" />
                        Reviews
                      </button>
                    </li>
                    <li className="nav-item mx-2">
                      <button
                        className={`nav-link px-5 py-3 rounded-pill fw-semibold transition-all ${
                          activeTab === 3 ? "active text-white shadow-sm" : "text-muted bg-light"
                        }`}
                        style={
                          activeTab === 3 ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" } : {}
                        }
                        onClick={() => setActiveTab(3)}
                      >
                        <ThumbsUpIcon className="me-2" />
                        Votes
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="p-5">
                  <div className="tab-content">
                    {activeTab === 1 && (
                      <DetailTab modelData={modelData} />
                    )}

                    {activeTab === 2 && (
                      <ReviewTab modelData={modelData} />
                    )}

                    {activeTab === 3 && (
                      <VotesTab modelData={modelData} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
