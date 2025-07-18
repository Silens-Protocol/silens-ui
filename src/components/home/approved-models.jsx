"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApprovedModels } from "../../hooks/useModelData";

import {
  PiBrowsers,
  FiShield,
  FiCheckCircle,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiEye,
  FiArrowRight,
} from "../../assets/icons/vander";

const ModelCardSkeleton = () => (
  <div className="col model-item">
    <div className="card model-card approved-model rounded-md shadow overflow-hidden mb-1 p-3 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="animate-pulse bg-gray-300 rounded-circle" style={{ width: "36px", height: "36px" }}></div>
          <div className="ms-2">
            <div className="animate-pulse bg-gray-300 h-3 w-16 mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-20 rounded"></div>
          </div>
        </div>
        <div className="animate-pulse bg-gray-300 h-6 w-16 rounded-pill"></div>
      </div>

      <div className="model-preview rounded-md mt-3 position-relative overflow-hidden bg-light p-4 flex-grow-1">
        <div className="text-center">
          <div className="animate-pulse bg-gray-300 rounded-circle mx-auto mb-3" style={{ width: "48px", height: "48px" }}></div>
          <div className="animate-pulse bg-gray-300 h-4 w-32 mx-auto mb-2 rounded"></div>
          <div className="animate-pulse bg-gray-300 h-3 w-full mb-1 rounded"></div>
          <div className="animate-pulse bg-gray-300 h-3 w-3/4 mx-auto rounded"></div>
        </div>
        
        <div className="position-absolute top-0 start-0 m-2">
          <div className="animate-pulse bg-gray-300 h-5 w-16 rounded-pill"></div>
        </div>
        
        <div className="position-absolute top-0 end-0 m-2">
          <div className="animate-pulse bg-gray-300 h-5 w-20 rounded-pill"></div>
        </div>
      </div>

      <div className="card-body content position-relative p-0 mt-3 mt-auto">
        <div className="mb-3 mt-3">
          <div className="animate-pulse bg-gray-300 h-5 w-20 rounded-pill me-1 d-inline-block"></div>
          <div className="animate-pulse bg-gray-300 h-5 w-24 rounded-pill d-inline-block"></div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 h-3 w-12 mx-auto mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-8 mx-auto rounded"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 h-3 w-16 mx-auto mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-10 mx-auto rounded"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 h-3 w-8 mx-auto mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-10 mx-auto rounded"></div>
          </div>
        </div>

        <div className="mt-3">
          <div className="animate-pulse bg-gray-300 h-8 w-full rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = ({ selectedCategory }) => (
  <div className="col-12">
    <div className="text-center py-5">
      <div className="mb-4">
        <FiCheckCircle className="text-muted" style={{ fontSize: "4rem" }} />
      </div>
      <h5 className="text-muted mb-2">
        {selectedCategory 
          ? `No approved models in ${selectedCategory} category yet`
          : "No approved models yet"
        }
      </h5>
      <p className="text-muted mb-4">
        {selectedCategory
          ? "Models in this category are still under review or haven't been submitted yet."
          : "Models are currently under review. Check back soon for approved models!"
        }
      </p>
      <Link href="/submit" className="btn btn-primary">
        Submit Your Model
      </Link>
    </div>
  </div>
);

export default function ApprovedModels({ filter = true, limit = 12 }) {
  const { data, isLoading, error } = useApprovedModels({ limit });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  if (data?.models) {
    console.log('Approved Models Data:', data.models);
  }

  const filteredData = selectedCategory
    ? (data?.models || []).filter((item) => item.metadata?.category?.toLowerCase() === selectedCategory)
    : (data?.models || []);

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.stats?.totalReviews || 0) - (a.stats?.totalReviews || 0);
      case "score":
        return (a.stats?.averageSeverity || 0) - (b.stats?.averageSeverity || 0);
      case "recent":
      default:
        return parseInt(b.submissionTime || 0) - parseInt(a.submissionTime || 0);
    }
  });

  const matchCategory = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryIcon = (category) => {
    const categoryLower = category?.toLowerCase();
    const icons = {
      safety: <FiShield className="me-1" />,
      fairness: <FiUsers className="me-1" />,
      privacy: <FiEye className="me-1" />,
      ethics: <FiAward className="me-1" />,
      transparency: <FiCheckCircle className="me-1" />,
    };
    return icons[categoryLower] || <PiBrowsers className="me-1" />;
  };

  const getRiskLevel = (severity) => {
    if (severity <= 1.5) return { text: "Low", class: "success" };
    if (severity <= 2.5) return { text: "Medium", class: "warning" };
    return { text: "High", class: "danger" };
  };

  const calculateCommunityScore = (model) => {
    const totalReviews = model.stats?.totalReviews || 0;
    const avgSeverity = model.stats?.averageSeverity || 0;
    
    if (totalReviews === 0) return 7.0;
    
    let score = 10 - (avgSeverity * 1.5);
    
    const reviewBonus = Math.min(totalReviews / 10, 2);
    score += reviewBonus;
    
    return Math.max(0, Math.min(10, score)).toFixed(1);
  };

  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Failed to load approved models. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {filter && (
        <>
          <div className="row justify-content-center mt-4 mb-3">
            <div className="col filters-group-wrap">
              <div className="filters-group">
                <ul className="container-filter mb-0 categories-filter text-center list-unstyled filter-options">
                  <li
                    className={`list-inline-item categories position-relative text-dark d-inline-flex align-items-center ${
                      selectedCategory === null ? "active" : ""
                    }`}
                    onClick={() => matchCategory(null)}
                  >
                    <PiBrowsers className="me-1" /> All Models
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark d-inline-flex align-items-center ${
                      selectedCategory === "safety" ? "active" : ""
                    }`}
                    onClick={() => matchCategory("safety")}
                  >
                    <FiShield className="me-1" /> Safety
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark d-inline-flex align-items-center ${
                      selectedCategory === "fairness" ? "active" : ""
                    }`}
                    onClick={() => matchCategory("fairness")}
                  >
                    <FiUsers className="me-1" /> Fairness
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark d-inline-flex align-items-center ${
                      selectedCategory === "privacy" ? "active" : ""
                    }`}
                    onClick={() => matchCategory("privacy")}
                  >
                    <FiEye className="me-1" /> Privacy
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark d-inline-flex align-items-center ${
                      selectedCategory === "ethics" ? "active" : ""
                    }`}
                    onClick={() => matchCategory("ethics")}
                  >
                    <FiAward className="me-1" /> Ethics
                  </li>
                  <li
                    className={`list-inline-item categories position-relative text-dark d-inline-flex align-items-center ${
                      selectedCategory === "transparency" ? "active" : ""
                    }`}
                    onClick={() => matchCategory("transparency")}
                  >
                    <FiCheckCircle className="me-1" /> Transparency
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {isLoading ? (
        <div
          className="row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4"
          id="grid"
        >
          {Array.from({ length: limit }).map((_, index) => (
            <ModelCardSkeleton key={index} />
          ))}
        </div>
      ) : sortedData.length > 0 ? (
        <div
          className="row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4"
          id="grid"
        >
          {sortedData.slice(0, limit).map((model, index) => {
            const communityScore = calculateCommunityScore(model);
            const riskLevel = getRiskLevel(model.stats?.averageSeverity || 0);
            const totalReviews = model.stats?.totalReviews || 0;
            const avgSeverity = model.stats?.averageSeverity || 0;
            
            return (
              <div className="col model-item" key={index}>
                <div className="card model-card approved-model rounded-md shadow overflow-hidden mb-1 p-3 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Link
                        href={`/profile/${model.submitter?.owner}`}
                        className="user-avatar"
                      >
                        <Image
                          src={model.submitter?.profile?.profilePictureUrl || "/images/client/01.jpg"}
                          width={36}
                          height={36}
                          alt="submitter"
                          className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="ms-2">
                        <small className="text-muted d-block">Submitted by</small>
                        <small className="fw-bold">
                          {model.submitter?.owner?.slice(0, 6) + "..." + model.submitter?.owner?.slice(-4)}
                        </small>
                      </div>
                    </div>

                    <span className="badge bg-soft-success text-success rounded-pill">
                      <FiCheckCircle className="me-1" /> Approved
                    </span>
                  </div>

                  <div className="model-preview rounded-md mt-3 position-relative overflow-hidden bg-light p-4 flex-grow-1">
                    <div className="text-center">
                      <div className="icon-xl rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                        {getCategoryIcon(model.metadata?.category)}
                      </div>
                      <h6 className="mb-1">{model.metadata?.name || "Unnamed Model"}</h6>
                      <p className="text-muted small mb-0">
                        {model.metadata?.summary || "No description available"}
                      </p>
                    </div>

                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-primary rounded-pill">
                        Score: {communityScore}/10
                      </span>
                    </div>

                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-soft-secondary rounded-pill">
                        <FiTrendingUp className="me-1" /> {totalReviews} reviews
                      </span>
                    </div>
                  </div>

                  <div className="card-body content position-relative p-0 mt-3 mt-auto">
                    <div className="mb-3 mt-3">
                      {model.metadata?.category && (
                        <span className="badge bg-soft-info text-info rounded-pill me-1">
                          {model.metadata.category}
                        </span>
                      )}
                      {model.metadata?.tags && model.metadata.tags.length > 0 && (
                        <span className="badge bg-soft-secondary text-secondary rounded-pill">
                          {model.metadata.tags[0]}
                          {model.metadata.tags.length > 1 && ` +${model.metadata.tags.length - 1}`}
                        </span>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <div className="text-center">
                        <small className="text-muted d-block">Reviews</small>
                        <span className="fw-bold">{totalReviews}</span>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block">Avg Severity</small>
                        <span className="fw-bold text-success">
                          {avgSeverity.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-center">
                        <small className="text-muted d-block">Risk</small>
                        <span className={`fw-bold text-${riskLevel.class}`}>
                          {riskLevel.text}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 d-grid">
                      <Link
                        href={`/explore/${model.id}`}
                        className="btn btn-soft-primary btn-sm"
                      >
                        View Details <FiArrowRight className="ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState selectedCategory={selectedCategory} />
      )}
    </>
  );
}
