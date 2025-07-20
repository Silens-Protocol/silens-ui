"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiFilter,
  FiEye,
} from "../../assets/icons/vander";
import { FaArrowsSpin } from "react-icons/fa6";
import { useModels } from "../../hooks/useModelData";
import { isProposalActive, getLatestProposal, getProposalTimeRemaining } from "../../utils/utils";

export default function ExploreModels({ filters }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const router = useRouter();

  const getApiParams = () => {
    const params = {
      limit: page * itemsPerPage,
      offset: 0,
      includeRelated: true
    };

    if (filters?.status && filters.status !== "all") {
      switch (filters.status) {
        case "under_review":
          params.status = 0;
          break;
        case "approved":
          params.status = 1;
          break;
        case "flagged":
          params.status = 2;
          break;
        case "delisted":
          params.status = 3;
          break;
        default:
          break;
      }
    } else {
      params.excludeStatus = 3;
    }

    return params;
  };

  const { data, isLoading, error } = useModels(getApiParams());

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const loadMore = () => {
    setPage(page + 1);
  };

  const sortModelsByStatus = (models) => {
    return models.sort((a, b) => {
      if (filters?.status && filters.status !== "all") {
        return 0;
      }
      
      const statusPriority = { 1: 0, 0: 1, 2: 2 };
      const priorityA = statusPriority[a.status] ?? 3;
      const priorityB = statusPriority[b.status] ?? 3;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return new Date(parseInt(b.createdAt) * 1000) - new Date(parseInt(a.createdAt) * 1000);
    });
  };

  const getStatusBadge = (model) => {
    const latestProposal = getLatestProposal(model.proposals);
    if (latestProposal && isProposalActive(latestProposal)) {
      return (
        <span className="badge bg-soft-primary text-primary rounded-pill">
          <FiUsers className="me-1" style={{ fontSize: "12px" }} />{" "}
          Governance Active
        </span>
      );
    }

    if (latestProposal && !isProposalActive(latestProposal) && !latestProposal.executed) {
      return (
        <span className="badge bg-soft-warning text-warning rounded-pill">
          <FiClock className="me-1" style={{ fontSize: "12px" }} />{" "}
          Pending Execution
        </span>
      );
    }

    switch (model.status) {
      case 0:
        return (
          <span className="badge bg-soft-info text-info rounded-pill">
            <FiEye className="me-1" style={{ fontSize: "12px" }} />{" "}
            Under Review
          </span>
        );
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
      case 3:
        return (
          <span className="badge bg-soft-danger text-danger rounded-pill">
            <FiAlertTriangle className="me-1" style={{ fontSize: "12px" }} />{" "}
            Delisted
          </span>
        );
      default:
        return null;
    }
  };

  const getRiskColor = (severity) => {
    if (severity <= 1) return "success";
    if (severity <= 2) return "warning";
    return "danger";
  };

  if (isLoading && page === 1) {
    return (
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <FaArrowsSpin className="mdi-spin" style={{ fontSize: "2rem" }} />
          <p className="mt-3">Loading models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <p className="text-danger">Error loading models: {error.message}</p>
        </div>
      </div>
    );
  }

  const allModels = sortModelsByStatus(data?.models || []);
  const startIndex = (page - 1) * itemsPerPage;
  const models = allModels.slice(startIndex, startIndex + itemsPerPage);
  const hasMore = allModels.length >= page * itemsPerPage;

  return (
    <>
      <div className="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-1">
        {models.map((model, index) => {
          const submitterProfile = model.submitter?.profile;
          const metadata = model.metadata;
          const stats = model.stats;
          

          
          return (
            <div className="col mt-4 pt-2" key={model.id} onClick={() => router.push(`/explore/${model.id}`)}>
              <div className="model-card h-100">      
                <div className="status-header" style={{ zIndex: 1 }}>
                  {getStatusBadge(model)}
                  <div className="score-badge">
                    <FiAward />
                    <span>
                      {(() => {
                        const totalReviews = stats?.totalReviews || 0;
                        const avgSeverity = stats?.averageSeverity || 0;
                        
                        if (totalReviews === 0) {
                          return "5.0";
                        }
                        const score = Math.max(0, Math.min(10, 10 - avgSeverity));
                        return score.toFixed(1);
                      })()}
                    </span>
                  </div>
                </div>

                <div className="model-content">
                  <div className="submitter-info">
                    <div className="submitter-avatar-container">
                      <Image
                        src={submitterProfile?.profilePictureUrl || "/images/client/01.jpg"}
                        width={40}
                        height={40}
                        alt="submitter"
                        className="submitter-avatar"
                      />
                    </div>
                    <div className="submitter-details">
                      <Link href={`/explore/${model.id}`} className="model-name">
                        {metadata?.name || "Unnamed Model"}
                      </Link>
                      <span className="submitter-address">
                        {model.submitter?.owner ? 
                          `${model.submitter.owner.slice(0, 6)}...${model.submitter.owner.slice(-4)}` : 
                          "Unknown"
                        }
                      </span>
                    </div>
                  </div>

                  <p className="model-summary">{metadata?.summary || "No description available"}</p>

                  <div className="tags-container">
                    {metadata?.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag-badge">
                        {tag}
                      </span>
                    )) || []}
                  </div>

                  <div className="stats-grid">
                    <div className="stat">
                      <FiUsers className="stat-icon" />
                      <div>
                        <span className="stat-value">{stats?.totalReviews || 0}</span>
                        <span className="stat-label">Reviews</span>
                      </div>
                    </div>
                    <div className="stat">
                      <FiShield
                        className={`stat-icon text-${getRiskColor(
                          stats?.averageSeverity || 0
                        )}`}
                      />
                      <div>
                        <span
                          className={`stat-value text-${getRiskColor(
                            stats?.averageSeverity || 0
                          )}`}
                        >
                          {(stats?.averageSeverity || 0).toFixed(1)}
                        </span>
                        <span className="stat-label">Risk</span>
                      </div>
                    </div>
                    <div className="stat">
                      <FiTrendingUp className="stat-icon" />
                      <div>
                        <span className="stat-value">{metadata?.tags?.length || 0}</span>
                        <span className="stat-label">Tags</span>
                      </div>
                    </div>
                  </div>

                  <div className="verified-badges">
                    {metadata?.category && (
                      <span className="verified-badge">
                        {metadata.category}
                      </span>
                    )}
                    {stats?.totalReviews > 0 && (
                      <span className="verified-badge">
                        {stats.totalReviews} Reviews
                      </span>
                    )}
                  </div>

                  {model.proposals && model.proposals.length > 0 && (
                    <div className="governance-result">
                      <div className="vote-bar">
                        <div
                          className="vote-fill"
                          style={{
                            width: `${(() => {
                              const forVotes = model.proposals[0]?.forVotes || 0;
                              const againstVotes = model.proposals[0]?.againstVotes || 0;
                              const totalVotes = forVotes + againstVotes;
                              
                              if (totalVotes === 0) return 0;
                              return (forVotes / totalVotes) * 100;
                            })()}%`,
                          }}
                        />
                      </div>
                      <span className="vote-text">
                        {model.proposals[0]?.forVotes && model.proposals[0]?.againstVotes !== undefined 
                          ? Math.round((model.proposals[0].forVotes / (model.proposals[0].forVotes + model.proposals[0].againstVotes)) * 100)
                          : 0}% approval
                      </span>
                      {isProposalActive(model.proposals[0]) && (
                        <div className="active-voting-indicator">
                          <FiClock className="me-1" />
                          <span>{getProposalTimeRemaining(model.proposals[0])}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {model.status === 2 && (
                    <div className="flag-reason">
                      <FiAlertTriangle />
                      <span>Model has been flagged for review</span>
                    </div>
                  )}
                </div>

                <div className="model-footer">
                  <FiClock />
                  <span>
                    Updated {new Date(parseInt(model.submissionTime) * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="row justify-content-center mt-4">
          <div className="col">
            <div className="text-center">
              <button
                onClick={loadMore}
                className="btn btn-primary rounded-md"
                disabled={isLoading}
              >
                {isLoading ? (
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
          position: relative;
        }

        .model-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .governance-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 2px solid #667eea;
          border-radius: 16px;
          z-index: 1;
          pointer-events: none;
        }

        .governance-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
          }
          100% {
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
        }



        .status-header {
          padding: 16px 20px;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e9ecef;
          position: relative;
          z-index: 2;
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

        .submitter-avatar-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #f0f0f0;
          margin-right: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .submitter-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
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

        .active-voting-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 8px;
          animation: pulse 2s infinite;
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
