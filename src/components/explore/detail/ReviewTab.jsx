"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAccount, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "@wagmi/core"
import { toast } from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { getReviewTypeText, getSeverityText, getSeverityBadge, formatDate, formatAddress, getStatusText } from "../../../utils/utils"
import { CiCalendar as CalendarIcon } from "react-icons/ci"
import { FaThumbsUp as ThumbsUpIcon } from "react-icons/fa"
import { FaThumbsDown as ThumbsDownIcon } from "react-icons/fa"
import { FaRegCommentDots as CommentIcon } from "react-icons/fa"
import { FaPlus as PlusIcon } from "react-icons/fa"
import { FaCheck as CheckIcon } from "react-icons/fa"
import { FaTimes as CloseIcon } from "react-icons/fa"
import { FaExpand as ExpandIcon } from "react-icons/fa"
import ReviewForm from "./ReviewForm"
import { MODEL_REGISTRY_CONTRACT } from "../../../constants"
import { pinata } from "../../../utils/pinata"
import { config } from "../../../wagmi"

// Screenshot Modal Component
const ScreenshotModal = ({ isOpen, onClose, imageUrl, reviewerName }) => {
  if (!isOpen) return null

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header border-0 bg-gradient-primary text-white">
            <h5 className="modal-title fw-semibold">
              <ExpandIcon className="me-2" />
              Screenshot by {reviewerName}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body p-0">
            <div className="text-center p-4">
              <Image
                src={imageUrl}
                width={800}
                height={600}
                className="img-fluid rounded-3 shadow-sm"
                alt="Review screenshot"
                style={{ maxHeight: '70vh', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewTab({ modelData }) {
  const params = useParams()
  const modelId = params.id
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)
  const { isConnected, address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const queryClient = useQueryClient()

  const isUnderReview = getStatusText(modelData.status, modelData.proposals) === "Under Review"
  const isReviewPeriodActive = modelData.reviewEndTime && Date.now() < parseInt(modelData.reviewEndTime) * 1000

  const hasUserReviewed = modelData.reviews?.some(review => 
    review.reviewer?.owner?.toLowerCase() === address?.toLowerCase()
  )

  const canReview = isUnderReview && isReviewPeriodActive

  const handleScreenshotClick = (imageUrl, reviewerName) => {
    setSelectedScreenshot({ imageUrl, reviewerName })
  }

  const closeScreenshotModal = () => {
    setSelectedScreenshot(null)
  }

  const handleSubmitReview = async (reviewData) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!reviewData.prompt.trim()) {
      toast.error("Prompt is required")
      return
    }

    if (!reviewData.output.trim()) {
      toast.error("Model output is required")
      return
    }

    if (!reviewData.comment.trim()) {
      toast.error("Comment is required")
      return
    }

    if (reviewData.reviewType === 1 && !reviewData.severity) {
      toast.error("Severity level is required for negative reviews")
      return
    }

    setIsSubmitting(true)

    const promise = async () => {
      const keyRequest = await fetch("/api/key")
      const keyData = await keyRequest.json()

      let screenshotHash = null
      if (reviewData.screenshot) {
        const screenshotUpload = await pinata.upload.file(reviewData.screenshot).key(keyData.JWT)
        if (!screenshotUpload.IpfsHash) {
          throw new Error("Failed to upload screenshot")
        }
        screenshotHash = screenshotUpload.IpfsHash
      }

      const reviewMetadata = {
        prompt: reviewData.prompt,
        output: reviewData.output,
        comment: reviewData.comment,
        screenshotUrl: screenshotHash ? `https://gateway.pinata.cloud/ipfs/${screenshotHash}` : null,
        timestamp: Date.now(),
        reviewer: address
      }

      const keyRequest2 = await fetch("/api/key")
      const keyData2 = await keyRequest2.json()

      const metadataUpload = await pinata.upload.json(reviewMetadata).key(keyData2.JWT)
      if (!metadataUpload.IpfsHash) {
        throw new Error("Failed to upload review metadata")
      }

      const ipfsHash = metadataUpload.IpfsHash

      const result = await writeContractAsync({
        ...MODEL_REGISTRY_CONTRACT,
        functionName: 'submitReview',
        args: [
          modelId,
          ipfsHash,
          reviewData.reviewType, // 0 for positive, 1 for negative
          reviewData.severity // 0 for positive, 1-5 for negative
        ],
        account: address,
      })

      await waitForTransactionReceipt(config, {
        hash: result,
      })

      await queryClient.invalidateQueries(['model', modelId])
      
      setShowReviewForm(false)
      return result
    }

    toast.promise(promise(), {
      loading: 'Submitting your review...',
      success: 'Review submitted successfully!',
      error: (err) => {
        console.error("Review submission error:", err)
        return `Error: ${err.message || 'Something went wrong'}`
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const handleCancelReview = () => {
    setShowReviewForm(false)
  }

  return (
    <div className="tab-pane fade show active">
      {canReview && (
        <div className="mb-4 d-flex justify-content-end">
          {!showReviewForm ? (
            hasUserReviewed ? (
              <button
                className="btn btn-success px-4 py-3 rounded-pill shadow-sm fw-semibold d-flex align-items-center"
                disabled
              >
                <CheckIcon className="me-2" />
                Already Reviewed
              </button>
            ) : (
              <button
                className="btn btn-primary px-4 py-3 rounded-pill shadow-sm fw-semibold d-flex align-items-center"
                onClick={() => setShowReviewForm(true)}
                disabled={isSubmitting}
              >
                <PlusIcon className="me-2" />
                Add Your Review
              </button>
            )
          ) : (
            <ReviewForm 
              onSubmit={handleSubmitReview}
              onCancel={handleCancelReview}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}

      {modelData.reviews && modelData.reviews.length > 0 ? (
        <div className="row g-4">
          {modelData.reviews.map((review, index) => (
            <div key={review.id} className="col-12">
              <div className="card border-0 shadow-sm h-100 review-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        <Image
                          src={review.reviewer?.profile?.profilePictureUrl || "/images/client/01.jpg"}
                          width={56}
                          height={56}
                          className="rounded-circle shadow-sm border border-3 border-white"
                          alt=""
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                             style={{ width: '16px', height: '16px' }}></div>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">
                          {review.reviewer?.profile?.name || formatAddress(review.reviewer?.owner)}
                        </h6>
                        <small className="text-muted d-flex align-items-center">
                          <CalendarIcon className="me-1" />
                          {formatDate(review.timestamp)}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <span
                        className={`badge ${
                          getReviewTypeText(review.reviewType) === "Positive"
                            ? "bg-success bg-opacity-10 text-white"
                            : "bg-danger bg-opacity-10 text-white"
                        } me-2 px-3 py-2 rounded-pill fw-semibold`}
                      >
                        {getReviewTypeText(review.reviewType) === "Positive" ? (
                          <ThumbsUpIcon className="me-1" />
                        ) : (
                          <ThumbsDownIcon className="me-1" />
                        )}
                        {getReviewTypeText(review.reviewType)}
                      </span>
                      <span
                        className={`badge ${getSeverityBadge(review.severity)} px-3 py-2 rounded-pill fw-semibold`}
                      >
                        {getSeverityText(review.severity)}
                      </span>
                    </div>
                  </div>

                  {review.metadata && (
                    <div>
                      <div className="review-comment mb-4">
                        <p className="mb-0 lead text-dark lh-lg fw-normal">
                          {review.metadata.comment || "No comment provided"}
                        </p>
                      </div>
                      
                      {(review.metadata.prompt || review.metadata.output) && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3 text-dark d-flex align-items-center">
                            Test Details
                          </h6>
                          
                          {review.metadata.prompt && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold text-muted mb-2">Prompt:</label>
                              <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
                                <p className="mb-0 text-dark">{review.metadata.prompt}</p>
                              </div>
                            </div>
                          )}
                          
                          {review.metadata.output && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold text-muted mb-2">Model Output:</label>
                              <div className="bg-light p-3 rounded-3 border-start border-4 border-success">
                                <p className="mb-0 text-dark">{review.metadata.output}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {review.metadata.screenshotUrl && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-muted mb-2">Screenshot:</label>
                          <div className="text-center">
                            <div 
                              className="screenshot-container position-relative d-inline-block cursor-pointer"
                              onClick={() => handleScreenshotClick(
                                review.metadata.screenshotUrl, 
                                review.reviewer?.profile?.name || formatAddress(review.reviewer?.owner)
                              )}
                            >
                              <Image
                                src={review.metadata.screenshotUrl}
                                width={500}
                                height={300}
                                className="img-fluid rounded-4 shadow-sm border"
                                alt="Review screenshot"
                              />
                              <div className="screenshot-overlay">
                                <ExpandIcon className="text-white" size={24} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle p-4 d-inline-flex mb-4">
            <CommentIcon className="text-muted" size={32} />
          </div>
          <h4 className="text-muted mb-2">No Reviews Yet</h4>
          <p className="text-muted">
            This model hasn't received any reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      )}

      <ScreenshotModal
        isOpen={!!selectedScreenshot}
        onClose={closeScreenshotModal}
        imageUrl={selectedScreenshot?.imageUrl}
        reviewerName={selectedScreenshot?.reviewerName}
      />

      <style jsx>{`
        .review-card {
          transition: all 0.3s ease;
          border-radius: 16px;
        }

        .review-comment {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .screenshot-container {
          transition: all 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
        }

        .screenshot-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
        }

        .screenshot-container:hover .screenshot-overlay {
          opacity: 1;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </div>
  )
}
