"use client";

import React from "react";
import { useAccount } from 'wagmi';
import { useUserReviews } from '../../hooks/useUser';
import { getReviewTypeText, getSeverityText, getSeverityBadge, formatDate, formatAddress } from '../../utils/utils';
import { CiCalendar as CalendarIcon } from "react-icons/ci";
import { FaThumbsUp as ThumbsUpIcon } from "react-icons/fa";
import { FaThumbsDown as ThumbsDownIcon } from "react-icons/fa";
import { FaRegCommentDots as CommentIcon } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReviewTab() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: reviewsData, isLoading, error } = useUserReviews(address);

  const handleViewModel = (modelId) => {
    router.push(`/explore/${modelId}`);
  };

  if (isLoading) {
    return (
      <div className="tab-pane fade show active">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-pane fade show active">
        <div className="text-center py-5">
          <div className="bg-light rounded-circle p-4 d-inline-flex mb-4">
            <CommentIcon className="text-danger" />
          </div>
          <h4 className="text-danger mb-2">Error Loading Reviews</h4>
          <p className="text-muted">
            Failed to load your reviews. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="tab-pane fade show active">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 text-center">
            <div className="content">
              <h5 className="mb-4">No Reviews</h5>
              <p className="text-muted">
                You haven't reviewed any AI models yet. Start building your
                reputation by reviewing models in the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active">
      <div className="row g-4">
        {reviews.map((review) => (
          <div key={review.id} className="col-12">
            <div className="card border-0 shadow-sm h-100 bg-light">
              <div className="card-body p-4">
                {/* Model Information */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    {review.model?.metadata?.imageUrl && (
                      <div className="position-relative me-3" style={{ width: 48, height: 48 }}>
                        <Image
                          src={review.model.metadata.imageUrl}
                          width={96}
                          height={96}
                          className="rounded-3"
                          alt=""
                          style={{ objectFit: 'contain', width: '48px', height: '48px', background: '#fff' }}
                          unoptimized={true}
                          quality={100}
                        />
                      </div>
                    )}
                    <div>
                      <h6 className="mb-1 fw-bold text-dark" onClick={() => handleViewModel(review.model?.id)} style={{ cursor: 'pointer' }}>
                        {review.model?.metadata?.name || `Model #${review.model?.id}`}
                      </h6>
                      <small className="text-muted">
                        {review.model?.metadata?.category || 'Uncategorized'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Review Details */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-flex align-items-center">
                      <CalendarIcon className="me-1" />
                      {formatDate(review.timestamp)}
                    </small>
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

                {/* Review Content */}
                {review.metadata && (
                  <div>
                    {review.metadata.comment && (
                      <p className="mb-3 lead text-dark lh-lg">
                        {review.metadata.comment}
                      </p>
                    )}
                    
                    {(review.metadata.prompt || review.metadata.output) && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2 text-dark">Test Details</h6>
                        
                        {review.metadata.prompt && (
                          <div className="mb-2">
                            <label className="form-label fw-semibold text-muted mb-1 small">Prompt:</label>
                            <div className="bg-white p-2 rounded-3 border">
                              <p className="mb-0 text-dark small">{review.metadata.prompt}</p>
                            </div>
                          </div>
                        )}
                        
                        {review.metadata.output && (
                          <div className="mb-2">
                            <label className="form-label fw-semibold text-muted mb-1 small">Model Output:</label>
                            <div className="bg-white p-2 rounded-3 border">
                              <p className="mb-0 text-dark small">{review.metadata.output}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!review.metadata && (
                  <p className="text-muted mb-0">
                    No additional review details available.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
