"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiFilter,
} from "../../assets/icons/vander";
import { FaArrowsSpin } from "react-icons/fa6";

const aiModelsData = [
  {
    id: 1,
    name: "SafeGuard AI v3.0",
    submitter: "0x1234...5678",
    submitterAvatar: "/images/client/01.jpg",
    summary: "Enterprise-grade content moderation with 99.9% accuracy",
    status: 1,
    category: "safety",
    ipfsHash: "QmXxx...",
    approvalDate: new Date("2025-01-10"),
    totalReviews: 45,
    averageSeverity: 1.2,
    governanceVotes: { for: 89, against: 11 },
    usageCount: 1250,
    verifiedBadges: ["Safety Certified", "Low Risk"],
    tags: ["content-moderation", "enterprise"],
    communityScore: 9.2,
    lastUpdated: new Date("2025-01-15"),
  },
  {
    id: 2,
    name: "BiasDetector Pro",
    submitter: "0xabcd...efgh",
    submitterAvatar: "/images/client/02.jpg",
    summary: "Advanced bias detection across multiple dimensions",
    status: 2,
    category: "fairness",
    ipfsHash: "QmYyy...",
    approvalDate: new Date("2025-01-08"),
    totalReviews: 38,
    averageSeverity: 3.2,
    governanceVotes: { for: 52, against: 48 },
    usageCount: 890,
    verifiedBadges: ["Under Review", "Medium Risk"],
    tags: ["bias-detection", "fairness"],
    communityScore: 6.8,
    lastUpdated: new Date("2025-01-14"),
    flagReason: "Potential false positives in edge cases",
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
    approvalDate: new Date("2025-01-12"),
    totalReviews: 52,
    averageSeverity: 1.1,
    governanceVotes: { for: 94, against: 6 },
    usageCount: 2100,
    verifiedBadges: ["Privacy First", "GDPR Compliant"],
    tags: ["privacy", "llm", "differential-privacy"],
    communityScore: 9.5,
    lastUpdated: new Date("2025-01-16"),
  },
];

export default function ExploreModels({ filters }) {
  const [modelData, setModelData] = useState(aiModelsData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let filtered = [...aiModelsData];

    if (filters?.status !== "all") {
      filtered = filtered.filter((model) => {
        if (filters.status === "approved") return model.status === 1;
        if (filters.status === "flagged") return model.status === 2;
        return true;
      });
    }

    if (filters?.category && filters.category !== "all") {
      filtered = filtered.filter(
        (model) => model.category === filters.category
      );
    }

    if (filters?.search) {
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          model.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
          model.tags.some((tag) => tag.includes(filters.search.toLowerCase()))
      );
    }

    if (filters?.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "score":
            return b.communityScore - a.communityScore;
          case "usage":
            return b.usageCount - a.usageCount;
          case "recent":
            return new Date(b.approvalDate) - new Date(a.approvalDate);
          default:
            return 0;
        }
      });
    }

    setModelData(filtered);
  }, [filters]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(page + 1);
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return (
          <span className="badge bg-soft-success text-success rounded-pill">
            <FiCheckCircle className="me-1" style={{ fontSize: "12px" }} />{" "}
            Approved
          </span>
        );
      case 2:
        return (
          <span className="badge bg-soft-warning text-warning rounded-pill">
            <FiAlertTriangle className="me-1" style={{ fontSize: "12px" }} />{" "}
            Flagged
          </span>
        );
      default:
        return null;
    }
  };

  const getRiskColor = (severity) => {
    if (severity <= 2) return "success";
    if (severity <= 3) return "warning";
    return "danger";
  };

  const displayedModels = modelData.slice(0, page * itemsPerPage);

  return (
    <>
      <div className="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-1">
        {displayedModels.map((model, index) => {
          return (
            <div className="col mt-4 pt-2" key={index}>
              <div className="model-card h-100">
                <div className="status-header">
                  {getStatusBadge(model.status)}
                  <div className="score-badge">
                    <FiAward />
                    <span>{model.communityScore}</span>
                  </div>
                </div>

                <div className="model-content">
                  <div className="submitter-info">
                    <Image
                      src={model.submitterAvatar}
                      width={40}
                      height={40}
                      alt="submitter"
                      className="submitter-avatar"
                    />
                    <div className="submitter-details">
                      <Link href={`/model/${model.id}`} className="model-name">
                        {model.name}
                      </Link>
                      <span className="submitter-address">
                        {model.submitter}
                      </span>
                    </div>
                  </div>

                  <p className="model-summary">{model.summary}</p>

                  <div className="tags-container">
                    {model.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag-badge">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="stats-grid">
                    <div className="stat">
                      <FiUsers className="stat-icon" />
                      <div>
                        <span className="stat-value">{model.totalReviews}</span>
                        <span className="stat-label">Reviews</span>
                      </div>
                    </div>
                    <div className="stat">
                      <FiShield
                        className={`stat-icon text-${getRiskColor(
                          model.averageSeverity
                        )}`}
                      />
                      <div>
                        <span
                          className={`stat-value text-${getRiskColor(
                            model.averageSeverity
                          )}`}
                        >
                          {model.averageSeverity.toFixed(1)}
                        </span>
                        <span className="stat-label">Risk</span>
                      </div>
                    </div>
                    <div className="stat">
                      <FiTrendingUp className="stat-icon" />
                      <div>
                        <span className="stat-value">{model.usageCount}</span>
                        <span className="stat-label">Uses</span>
                      </div>
                    </div>
                  </div>

                  <div className="verified-badges">
                    {model.verifiedBadges.map((badge, i) => (
                      <span
                        key={i}
                        className={`verified-badge ${
                          model.status === 2 ? "warning" : ""
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="governance-result">
                    <div className="vote-bar">
                      <div
                        className="vote-fill"
                        style={{
                          width: `${
                            (model.governanceVotes.for /
                              (model.governanceVotes.for +
                                model.governanceVotes.against)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="vote-text">
                      {model.governanceVotes.for}% approval
                    </span>
                  </div>

                  {model.status === 2 && model.flagReason && (
                    <div className="flag-reason">
                      <FiAlertTriangle />
                      <span>{model.flagReason}</span>
                    </div>
                  )}
                </div>

                <div className="model-footer">
                  <FiClock />
                  <span>
                    Updated {new Date(model.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayedModels.length < modelData.length && (
        <div className="row justify-content-center mt-4">
          <div className="col">
            <div className="text-center">
              <button
                onClick={loadMore}
                className="btn btn-primary rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaArrowsSpin className="mdi-spin me-1" /> Loading...
                  </>
                ) : (
                  <>
                    <FiFilter className="me-1" /> Load More Models
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .model-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          min-width: 320px;
          margin: 0 auto;
          cursor: pointer;
        }

        .model-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .status-header {
          padding: 16px 20px;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e9ecef;
        }

        .score-badge {
          display: flex;
          align-items: center;
          background: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          color: #667eea;
          font-size: 14px;
        }

        .score-badge svg {
          margin-right: 4px;
          font-size: 16px;
        }

        .model-content {
          padding: 20px;
          flex: 1;
        }

        .submitter-info {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          gap: 12px;
        }

        .submitter-avatar {
          border-radius: 50%;
          border: 2px solid #f0f0f0;
          margin-right: 12px;
        }

        .submitter-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .model-name {
          display: block;
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          text-decoration: none;
          margin-bottom: 2px;
        }

        .model-name:hover {
          color: #667eea;
        }

        .submitter-address {
          font-size: 13px;
          color: #7f8c8d;
        }

        .model-summary {
          color: #5a6c7d;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .tag-badge {
          background: #e9ecef;
          color: #5a6c7d;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-icon {
          font-size: 20px;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-label {
          font-size: 11px;
          color: #6c757d;
        }

        .verified-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .verified-badge {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .verified-badge.warning {
          background: rgba(255, 193, 7, 0.1);
          color: #ff9800;
        }

        .governance-result {
          margin-bottom: 16px;
        }

        .vote-bar {
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .vote-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
          transition: width 0.3s ease;
        }

        .vote-text {
          font-size: 12px;
          color: #6c757d;
        }

        .flag-reason {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: #856404;
        }

        .flag-reason svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .model-footer {
          padding: 12px 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: #6c757d;
        }

        .model-footer svg {
          font-size: 14px;
        }

        .view-button {
          display: block;
          padding: 16px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 0 0 16px 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .view-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .view-button:hover::before {
          left: 100%;
        }

        .view-button:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .stats-grid {
            gap: 8px;
          }

          .stat-value {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
