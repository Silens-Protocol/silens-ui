"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useModelsUnderReview } from "../../hooks/useModelData";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "tiny-slider/dist/tiny-slider.css";

import {
  FiArrowRight,
  FiShield,
  FiUsers,
  FiClock,
  FiSearch,
} from "../../assets/icons/vander";

const ModelReviewSkeleton = () => (
  <div className="tiny-slide">
    <div className="card model-review-card rounded-md shadow overflow-hidden mx-2 my-3">
      <div className="bg-soft-primary text-center py-2">
        <div className="animate-pulse bg-gray-300 h-4 w-24 mx-auto rounded"></div>
      </div>

      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="animate-pulse bg-gray-300 rounded-circle" style={{ width: "40px", height: "40px" }}></div>
          <div className="ms-3 flex-1">
            <div className="animate-pulse bg-gray-300 h-4 w-32 mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-24 rounded"></div>
          </div>
        </div>

        <div className="mb-3">
          <div className="animate-pulse bg-gray-300 h-3 w-full mb-1 rounded"></div>
          <div className="animate-pulse bg-gray-300 h-3 w-3/4 rounded"></div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <div className="animate-pulse bg-gray-300 h-3 w-20 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-8 rounded"></div>
          </div>
          <div className="animate-pulse bg-gray-300 h-1 w-full rounded"></div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="bg-soft-primary rounded p-2 text-center">
              <div className="animate-pulse bg-gray-300 h-4 w-4 mx-auto mb-1 rounded"></div>
              <div className="animate-pulse bg-gray-300 h-4 w-6 mx-auto mb-1 rounded"></div>
              <div className="animate-pulse bg-gray-300 h-3 w-12 mx-auto rounded"></div>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-soft-primary rounded p-2 text-center">
              <div className="animate-pulse bg-gray-300 h-4 w-4 mx-auto mb-1 rounded"></div>
              <div className="animate-pulse bg-gray-300 h-4 w-8 mx-auto mb-1 rounded"></div>
              <div className="animate-pulse bg-gray-300 h-3 w-16 mx-auto rounded"></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-3">
          <div className="animate-pulse bg-gray-300 h-6 w-20 mx-auto rounded-pill"></div>
        </div>

        <div>
          <div className="animate-pulse bg-gray-300 h-8 w-full rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-12">
    <div className="text-center py-5">
      <div className="mb-4">
        <FiSearch className="text-muted" style={{ fontSize: "4rem" }} />
      </div>
      <h5 className="text-muted mb-2">No Active Model Reviews</h5>
      <p className="text-muted mb-4">
        There are currently no AI models under community review. Check back later for new models that need your evaluation.
      </p>
      <Link href="/explore" className="btn btn-primary">
        Explore Models
      </Link>
    </div>
  </div>
);

export default function ActiveModelReviews() {
  const { data, isLoading, error } = useModelsUnderReview({ limit: 6 });

  const shouldEnableAutoplay = () => {
    if (!data?.models) return false;
    
    const itemsPerView = 3;
    return data.models.length > itemsPerView;
  };

  const settings = {
    container: ".tiny-model-review-slider",
    controls: true,
    mouseDrag: true,
    loop: shouldEnableAutoplay(),
    rewind: shouldEnableAutoplay(),
    autoplay: shouldEnableAutoplay(),
    autoplayButtonOutput: false,
    autoplayTimeout: 4000,
    navPosition: "bottom",
    controlsText: [
      '<i class="mdi mdi-chevron-left "></i>',
      '<i class="mdi mdi-chevron-right"></i>',
    ],
    nav: false,
    speed: 400,
    gutter: 20,
    responsive: {
      992: {
        items: 3,
      },
      767: {
        items: 2,
      },
      320: {
        items: 1,
      },
    },
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return "success";
    if (severity <= 3) return "warning";
    return "danger";
  };

  const getSeverityLabel = (severity) => {
    if (severity <= 2) return "Low Risk";
    if (severity <= 3) return "Medium Risk";
    return "High Risk";
  };

  const formatTimeLeft = (reviewEndTime) => {
    try {
      const now = Date.now();
      const endTime = parseInt(reviewEndTime) * 1000;
      const timeLeft = endTime - now;
      
      if (timeLeft <= 0) return "Review Period Ended";
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } catch (error) {
      console.error('Error formatting time left:', error);
      return "Unknown";
    }
  };

  const calculateProgress = (model) => {
    try {
      const now = Date.now();
      const submissionTime = parseInt(model.submissionTime) * 1000;
      const reviewEndTime = parseInt(model.reviewEndTime) * 1000;
      const totalDuration = reviewEndTime - submissionTime;
      const elapsed = now - submissionTime;
      
      if (elapsed <= 0) return 0;
      if (elapsed >= totalDuration) return 100;
      
      return Math.round((elapsed / totalDuration) * 100);
    } catch (error) {
      console.error('Error calculating progress:', error);
      return 0;
    }
  };



  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Failed to load active model reviews. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row align-items-end mb-4 pb-2">
        <div className="col-md-8">
          <div className="section-title">
            <h4 className="title mb-2">Active Model Reviews</h4>
            <p className="text-muted mb-0">
              AI models currently under community review
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="text-end d-md-block d-none">
            <Link
              href="/models/under-review"
              className="btn btn-link primary text-dark"
            >
              View All <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="row">
          <div className="col-12 mt-3">
            <div className="tiny-model-review-slider">
              <TinySlider settings={settings}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <ModelReviewSkeleton key={index} />
                ))}
              </TinySlider>
            </div>
          </div>
        </div>
      ) : data?.models?.length > 0 ? (
        <div className="row">
          <div className="col-12 mt-3">
            <div className="tiny-model-review-slider">
              <TinySlider settings={settings}>
                {data.models.map((model, index) => {
                  const progress = calculateProgress(model);
                  const timeLeft = formatTimeLeft(model.reviewEndTime);
                  const averageSeverity = model.stats?.averageSeverity || 0;
                  const reviewCount = model.stats?.totalReviews || 0;
                  
                  return (
                    <div className="tiny-slide" key={index}>
                      <div className="card model-review-card rounded-md shadow overflow-hidden mx-2 my-3">
                        <div className="bg-soft-primary text-center py-2">
                          <small className="text-primary fw-bold">
                            <FiClock className="me-1" /> {timeLeft === "Review Period Ended" ? timeLeft : `${timeLeft} left`}
                          </small>
                        </div>

                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <Image
                              src={model.submitter?.profile?.profilePictureUrl || "/images/client/01.jpg"}
                              width={40}
                              height={40}
                              className="avatar avatar-sm rounded-circle shadow"
                              alt="submitter"
                              style={{ objectFit: 'cover' }}
                            />
                            <div className="ms-3 flex-1">
                              <h6 className="mb-0">
                                <Link
                                  href={`/model/${model.id}`}
                                  className="text-dark"
                                >
                                  {model.metadata?.name || "Unnamed Model"}
                                </Link>
                              </h6>
                              <small className="text-muted">
                                by {model.submitter?.owner?.slice(0, 6) + "..." + model.submitter?.owner?.slice(-4)}
                              </small>
                            </div>
                          </div>

                          <p
                            className="text-muted small mb-3 text-truncate-2-lines"
                            style={{ minHeight: "48px" }}
                          >
                            {model.metadata?.summary || "No description available"}
                          </p>

                          {/* Category and Tags */}
                          <div className="mb-3">
                            {model.metadata?.category && (
                              <div className="mb-2">
                                <span className="badge bg-soft-info text-info rounded-pill px-2 py-1">
                                  {model.metadata.category}
                                </span>
                              </div>
                            )}
                            {model.metadata?.tags && model.metadata.tags.length > 0 && (
                              <div className="d-flex flex-wrap gap-1">
                                {model.metadata.tags.slice(0, 2).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="badge bg-soft-secondary text-secondary rounded-pill px-2 py-1">
                                    {tag}
                                  </span>
                                ))}
                                {model.metadata.tags.length > 2 && (
                                  <span className="badge bg-soft-secondary text-secondary rounded-pill px-2 py-1">
                                    +{model.metadata.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">
                                Review Progress
                              </small>
                              <small className="text-dark fw-bold">
                                {progress}%
                              </small>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <div className="bg-soft-primary rounded p-2 text-center">
                                <FiUsers className="text-primary mb-1" />
                                <p className="mb-0 fw-bold">
                                  {reviewCount}
                                </p>
                                <small className="text-muted">Reviews</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div
                                className={`bg-soft-${getSeverityColor(
                                  averageSeverity
                                )} rounded p-2 text-center`}
                              >
                                <FiShield
                                  className={`text-${getSeverityColor(
                                    averageSeverity
                                  )} mb-1`}
                                />
                                <p className="mb-0 fw-bold">
                                  {averageSeverity.toFixed(1)}
                                </p>
                                <small className="text-muted">Risk Score</small>
                              </div>
                            </div>
                          </div>

                          <div className="text-center mb-3">
                            <span
                              className={`badge bg-soft-${getSeverityColor(
                                averageSeverity
                              )} text-${getSeverityColor(
                                averageSeverity
                              )} rounded-pill px-3`}
                            >
                              {getSeverityLabel(averageSeverity)}
                            </span>
                          </div>

                          <div style={{ display: "grid", gap: "0.5rem" }}>
                            <Link
                              href={`/explore/${model.id}`}
                              style={{
                                backgroundColor: "#e7f1ff",
                                color: "#2d6cdf",
                                border: "none",
                                borderRadius: "0.25rem",
                                padding: "0.375rem 0.75rem",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                textAlign: "center",
                                textDecoration: "none",
                                transition: "background 0.2s, color 0.2s",
                                cursor: "pointer",
                                display: "inline-block"
                              }}
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </TinySlider>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <EmptyState />
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <div className="text-center d-md-none d-block">
            <Link
              href="/models/under-review"
              className="btn btn-link primary text-dark"
            >
              View All <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
