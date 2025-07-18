"use client"

import { useState } from "react"
import Image from "next/image"
import { getReviewTypeText, getSeverityText, getSeverityBadge, formatDate, formatAddress, getStatusText } from "../../../utils/utils"
import { CiCalendar as CalendarIcon } from "react-icons/ci"
import { FaThumbsUp as ThumbsUpIcon } from "react-icons/fa"
import { FaThumbsDown as ThumbsDownIcon } from "react-icons/fa"
import { FaRegCommentDots as CommentIcon } from "react-icons/fa"
import { FaPlus as PlusIcon } from "react-icons/fa"
import ReviewForm from "./ReviewForm"

export default function ReviewTab({ modelData }) {
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Check if model is under review
  const isUnderReview = getStatusText(modelData.status, modelData.proposals) === "Under Review"

  const handleSubmitReview = (reviewData) => {
    // TODO: Implement review submission logic
    alert("Review submission will be implemented later!")
    setShowReviewForm(false)
  }

  const handleCancelReview = () => {
    setShowReviewForm(false)
  }

  return (
    <div className="tab-pane fade show active">
      {/* Add Review Button - Now visible for all model statuses */}
      <div className="mb-4 d-flex justify-content-end">
        {!showReviewForm ? (
          <button
            className="btn btn-primary px-3 py-2 rounded-pill shadow-sm fw-semibold d-flex align-items-center"
            onClick={() => setShowReviewForm(true)}
          >
            <PlusIcon className="me-2" />
            Add Your Review
          </button>
        ) : (
          <ReviewForm 
            onSubmit={handleSubmitReview}
            onCancel={handleCancelReview}
          />
        )}
      </div>

      {/* Existing Reviews */}
      {modelData.reviews && modelData.reviews.length > 0 ? (
        <div className="row g-4">
          {modelData.reviews.map((review, index) => (
            <div key={review.id} className="col-12">
              <div className="card border-0 shadow-sm h-100 bg-light">
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
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">
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
                            ? "bg-success"
                            : "bg-danger"
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
                      <p className="mb-4 lead text-dark lh-lg">
                        {review.metadata.comment || "No comment provided"}
                      </p>
                      
                      {(review.metadata.prompt || review.metadata.output) && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3 text-dark">Test Details</h6>
                          
                          {review.metadata.prompt && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold text-muted mb-2">Prompt:</label>
                              <div className="bg-light p-3 rounded-3 border">
                                <p className="mb-0 text-dark">{review.metadata.prompt}</p>
                              </div>
                            </div>
                          )}
                          
                          {review.metadata.output && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold text-muted mb-2">Model Output:</label>
                              <div className="bg-light p-3 rounded-3 border">
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
                            <Image
                              src={review.metadata.screenshotUrl}
                              width={500}
                              height={300}
                              className="img-fluid rounded-4 shadow-sm border"
                              alt="Review screenshot"
                            />
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
            <CommentIcon className="text-muted" />
          </div>
          <h4 className="text-muted mb-2">No Reviews Yet</h4>
          <p className="text-muted">
            This model hasn't received any reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  )
}
