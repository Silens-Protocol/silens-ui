"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

const approvedModelsData = [
  {
    id: 1,
    name: "SafeGuard AI v3.0",
    submitter: "0x1234...5678",
    submitterAvatar: "/images/client/01.jpg",
    summary: "Enterprise-grade content moderation with 99.9% accuracy",
    status: 1,
    category: "safety",
    ipfsHash: "QmXxx...",
    approvalDate: "2025-01-10",
    totalReviews: 45,
    averageSeverity: 1.2,
    governanceVotes: { for: 89, against: 11 },
    usageCount: 1250,
    verifiedBadges: ["Safety Certified", "Low Risk"],
    tags: ["content-moderation", "enterprise", "safety"],
    communityScore: 9.2,
  },
  {
    id: 2,
    name: "FairRank Algorithm",
    submitter: "0xabcd...efgh",
    submitterAvatar: "/images/client/02.jpg",
    summary: "Bias-free ranking system for recommendation engines",
    status: 1,
    category: "fairness",
    ipfsHash: "QmYyy...",
    approvalDate: "2025-01-08",
    totalReviews: 38,
    averageSeverity: 1.5,
    governanceVotes: { for: 76, against: 24 },
    usageCount: 890,
    verifiedBadges: ["Fairness Verified", "Transparent"],
    tags: ["fairness", "ranking", "bias-prevention"],
    communityScore: 8.8,
  },
  {
    id: 3,
    name: "PrivacyShield LLM",
    submitter: "0x9876...5432",
    submitterAvatar: "/images/client/03.jpg",
    summary: "Privacy-preserving language model with differential privacy",
    status: 1,
    category: "privacy",
    ipfsHash: "QmZzz...",
    approvalDate: "2025-01-12",
    totalReviews: 52,
    averageSeverity: 1.1,
    governanceVotes: { for: 94, against: 6 },
    usageCount: 2100,
    verifiedBadges: ["Privacy First", "GDPR Compliant"],
    tags: ["privacy", "llm", "differential-privacy"],
    communityScore: 9.5,
  },
  {
    id: 4,
    name: "EthicsCheck Pro",
    submitter: "0x5555...6666",
    submitterAvatar: "/images/client/04.jpg",
    summary: "Comprehensive ethical evaluation for AI outputs",
    status: 1,
    category: "ethics",
    ipfsHash: "QmAaa...",
    approvalDate: "2025-01-09",
    totalReviews: 41,
    averageSeverity: 1.3,
    governanceVotes: { for: 82, against: 18 },
    usageCount: 1580,
    verifiedBadges: ["Ethics Approved", "Community Choice"],
    tags: ["ethics", "evaluation", "ai-safety"],
    communityScore: 9.0,
  },
  {
    id: 5,
    name: "TransparencyNet",
    submitter: "0x7777...8888",
    submitterAvatar: "/images/client/05.jpg",
    summary: "Explainable AI framework for model interpretability",
    status: 1,
    category: "transparency",
    ipfsHash: "QmBbb...",
    approvalDate: "2025-01-11",
    totalReviews: 35,
    averageSeverity: 1.4,
    governanceVotes: { for: 71, against: 29 },
    usageCount: 750,
    verifiedBadges: ["Transparent AI", "Explainable"],
    tags: ["transparency", "interpretability", "explainable-ai"],
    communityScore: 8.5,
  },
  {
    id: 6,
    name: "BiasDetector 2.0",
    submitter: "0x9999...0000",
    submitterAvatar: "/images/client/06.jpg",
    summary: "Advanced bias detection across multiple dimensions",
    status: 1,
    category: "fairness",
    ipfsHash: "QmCcc...",
    approvalDate: "2025-01-07",
    totalReviews: 48,
    averageSeverity: 1.2,
    governanceVotes: { for: 88, against: 12 },
    usageCount: 1920,
    verifiedBadges: ["Bias-Free", "Multi-dimensional"],
    tags: ["bias-detection", "fairness", "inclusive-ai"],
    communityScore: 9.1,
  },
];

export default function ApprovedModels({ filter = true, limit = 12 }) {
  const [modelData, setModelData] = useState(approvedModelsData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  const filteredData = selectedCategory
    ? modelData.filter((item) => item.category === selectedCategory)
    : modelData;

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.usageCount - a.usageCount;
      case "score":
        return b.communityScore - a.communityScore;
      case "recent":
      default:
        return new Date(b.approvalDate) - new Date(a.approvalDate);
    }
  });

  const matchCategory = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      safety: <FiShield className="me-1" />,
      fairness: <FiUsers className="me-1" />,
      privacy: <FiEye className="me-1" />,
      ethics: <FiAward className="me-1" />,
      transparency: <FiCheckCircle className="me-1" />,
    };
    return icons[category] || <PiBrowsers className="me-1" />;
  };

  return (
    <>
      {filter && (
        <>
          {/* Category Filter */}
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

          {/* Sort Options */}
          <div className="row justify-content-end mb-4">
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recently Approved</option>
                <option value="popular">Most Used</option>
                <option value="score">Highest Score</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div
        className="row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4"
        id="grid"
      >
        {sortedData.slice(0, limit).map((model, index) => {
          return (
            <div className="col model-item" key={index}>
              <div className="card model-card approved-model rounded-md shadow overflow-hidden mb-1 p-3 h-100 d-flex flex-column">
                {/* Header with submitter and verified badge */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Link
                      href={`/profile/${model.submitter}`}
                      className="user-avatar"
                    >
                      <Image
                        src={model.submitterAvatar}
                        width={36}
                        height={36}
                        alt="submitter"
                        className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                      />
                    </Link>
                    <div className="ms-2">
                      <small className="text-muted d-block">Submitted by</small>
                      <small className="fw-bold">{model.submitter}</small>
                    </div>
                  </div>

                  <span className="badge bg-soft-success text-success rounded-pill">
                    <FiCheckCircle className="me-1" /> Approved
                  </span>
                </div>

                {/* Model Preview Card */}
                <div className="model-preview rounded-md mt-3 position-relative overflow-hidden bg-light p-4 flex-grow-1">
                  <div className="text-center">
                    <div className="icon-xl rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                      {getCategoryIcon(model.category)}
                    </div>
                    <h6 className="mb-1">{model.name}</h6>
                    <p className="text-muted small mb-0">{model.summary}</p>
                  </div>

                  {/* Community Score Badge */}
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-primary rounded-pill">
                      Score: {model.communityScore}/10
                    </span>
                  </div>

                  {/* Usage Count */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-soft-secondary rounded-pill">
                      <FiTrendingUp className="me-1" /> {model.usageCount} uses
                    </span>
                  </div>
                </div>

                {/* Model Details */}
                <div className="card-body content position-relative p-0 mt-3 mt-auto">
                  {/* Verified Badges */}
                  <div className="mb-3 mt-3">
                    {model.verifiedBadges.map((badge, i) => (
                      <span
                        key={i}
                        className="badge text-primary rounded-pill me-1 small"
                      >
                        <FiAward
                          className="me-1"
                          style={{ fontSize: "10px" }}
                        />{" "}
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <div className="text-center">
                      <small className="text-muted d-block">Reviews</small>
                      <span className="fw-bold">{model.totalReviews}</span>
                    </div>
                    <div className="text-center">
                      <small className="text-muted d-block">Governance</small>
                      <span className="fw-bold text-success">
                        {model.governanceVotes.for}%
                      </span>
                    </div>
                    <div className="text-center">
                      <small className="text-muted d-block">Risk</small>
                      <span
                        className={`fw-bold text-${
                          model.averageSeverity < 2 ? "success" : "warning"
                        }`}
                      >
                        Low
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 d-grid">
                    <Link
                      href={`/model/${model.id}`}
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
    </>
  );
}
