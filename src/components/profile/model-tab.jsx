"use client";

import React from "react";
import { useAccount } from 'wagmi';
import { useUserModels } from '../../hooks/useUser';
import { getStatusText, formatDate, formatAddress } from '../../utils/utils';
import { CiCalendar as CalendarIcon } from "react-icons/ci";
import { FaThumbsUp as ThumbsUpIcon } from "react-icons/fa";
import { FaThumbsDown as ThumbsDownIcon } from "react-icons/fa";
import { FaRegCommentDots as CommentIcon } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ModelTab() {
  const { address } = useAccount();
  const { data: modelsData, isLoading, error } = useUserModels(address);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="tab-pane fade show active">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your models...</p>
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
          <h4 className="text-danger mb-2">Error Loading Models</h4>
          <p className="text-muted">
            Failed to load your models. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const models = modelsData?.models || [];

  if (models.length === 0) {
    return (
      <div className="tab-pane fade show active">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 text-center">
            <div className="content">
              <h5 className="mb-4">No Models</h5>
              <p className="text-muted">
                You haven't submitted any AI models yet. Start contributing to the
                community by submitting your first model.
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
        {models.map((model) => (
          <div key={model.id} className="col-12">
            <div className="card border-0 shadow-sm h-100 bg-light">
              <div className="card-body p-4">
                {/* Model Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3" style={{ width: 64, height: 64 }}>
                      {model.metadata?.imageUrl ? (
                        <Image
                          src={model.metadata.imageUrl}
                          width={128}
                          height={128}
                          className="rounded-3"
                          alt=""
                          style={{ objectFit: 'contain', width: '64px', height: '64px', background: '#fff' }}
                          unoptimized={true}
                          quality={100}
                        />
                      ) : (
                        <div className="bg-white rounded-3 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                          <CommentIcon className="text-muted" size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="mb-1 fw-bold text-dark" onClick={() => router.push(`/explore/${model.id}`)}>
                        {model.metadata?.name || `Model #${model.id}`}
                      </h5>
                      <p className="mb-2 text-muted small">
                        {model.metadata?.summary || 'No description available'}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary px-2 py-1 rounded-pill small">
                          {model.metadata?.category || 'Uncategorized'}
                        </span>
                        <span className={`badge px-2 py-1 rounded-pill small ${
                          getStatusText(model.status, model.proposals) === "Approved" ? "bg-success" :
                          getStatusText(model.status, model.proposals) === "Under Review" ? "bg-warning" :
                          getStatusText(model.status, model.proposals) === "Flagged" ? "bg-danger" :
                          "bg-secondary"
                        }`}>
                          {getStatusText(model.status, model.proposals)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Stats */}
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-primary">{model.stats?.totalReviews || 0}</h6>
                      <small className="text-muted">Reviews</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-success">{model.stats?.approvalRate || 0}%</h6>
                      <small className="text-muted">Approval Rate</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-warning">{model.stats?.averageSeverity || 0}</h6>
                      <small className="text-muted">Avg Severity</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-info">{model.stats?.activeProposals || 0}</h6>
                      <small className="text-muted">Active Proposals</small>
                    </div>
                  </div>
                </div>

                {/* Recent Reviews */}
                {model.reviews && model.reviews.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-3 text-dark">Recent Reviews</h6>
                    <div className="space-y-2">
                      {model.reviews.slice(0, 3).map((review, index) => (
                        <div key={review.id} className="d-flex align-items-center p-2 bg-white rounded-3">
                          <div className="position-relative me-2" style={{ width: 32, height: 32 }}>
                            {review.reviewer?.profile?.profilePictureUrl ? (
                              <Image
                                src={review.reviewer.profile.profilePictureUrl}
                                width={64}
                                height={64}
                                className="rounded-circle"
                                alt=""
                                style={{ objectFit: 'cover', width: '32px', height: '32px' }}
                                unoptimized={true}
                              />
                            ) : (
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <small className="text-muted">{review.reviewer?.owner?.slice(2, 4).toUpperCase()}</small>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <small className="fw-semibold text-dark">
                              {review.reviewer?.profile?.name || formatAddress(review.reviewer?.owner)}
                            </small>
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge ${
                                review.reviewType === 0 ? "bg-success" : "bg-danger"
                              } px-2 py-1 rounded-pill small`}>
                                {review.reviewType === 0 ? (
                                  <ThumbsUpIcon className="me-1" size={10} />
                                ) : (
                                  <ThumbsDownIcon className="me-1" size={10} />
                                )}
                                {review.reviewType === 0 ? "Positive" : "Negative"}
                              </span>
                              <small className="text-muted">
                                {formatDate(review.timestamp)}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Details */}
                <div className="mb-3">
                  <h6 className="fw-bold mb-2 text-dark">Model Details</h6>
                  <div className="row g-2">
                    {model.metadata?.tags && model.metadata.tags.length > 0 && (
                      <div className="col-12">
                        <small className="text-muted">Tags: </small>
                        {model.metadata.tags.map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 px-2 py-1 small">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {model.metadata?.link && (
                      <div className="col-12">
                        <small className="text-muted">Link: </small>
                        <a href={model.metadata.link} target="_blank" rel="noopener noreferrer" className="text-primary small">
                          {model.metadata.link}
                        </a>
                      </div>
                    )}
                    <div className="col-12">
                      <small className="text-muted d-flex align-items-center">
                        <CalendarIcon className="me-1" />
                        Submitted: {formatDate(model.submissionTime)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
