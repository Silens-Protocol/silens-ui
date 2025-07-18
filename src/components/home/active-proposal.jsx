"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useActiveProposals } from "../../hooks/useModelData";

import {
  FiClock,
  FiThumbsUp,
  FiThumbsDown,
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "../../assets/icons/vander";

const ProposalCardSkeleton = () => (
  <div className="col">
    <div className="card governance-proposal-card rounded-md shadow overflow-hidden mb-1 p-3 h-100 d-flex flex-column"> 
      <div className="text-center py-2 mb-2 rounded bg-soft-secondary">
        <div className="animate-pulse bg-gray-300 h-6 w-32 mx-auto rounded-pill"></div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div className="animate-pulse bg-gray-300 rounded-circle" style={{ width: "36px", height: "36px" }}></div>
          <div className="ms-2">
            <div className="animate-pulse bg-gray-300 h-4 w-24 mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-20 rounded"></div>
          </div>
        </div>
      </div>

      <div className="proposal-preview rounded-md position-relative overflow-hidden bg-light p-3">
        <div className="animate-pulse bg-gray-300 h-3 w-full mb-2 rounded"></div>
        <div className="animate-pulse bg-gray-300 h-3 w-3/4 mb-3 rounded"></div>

        <div className="row g-2 text-center">
          <div className="col-4">
            <div className="animate-pulse bg-gray-300 h-3 w-12 mx-auto mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-8 mx-auto rounded"></div>
          </div>
          <div className="col-4">
            <div className="animate-pulse bg-gray-300 h-3 w-8 mx-auto mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-10 mx-auto rounded"></div>
          </div>
          <div className="col-4">
            <div className="animate-pulse bg-gray-300 h-3 w-12 mx-auto mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-6 mx-auto rounded"></div>
          </div>
        </div>

        <div className="position-absolute bottom-0 start-0 m-2">
          <div className="animate-pulse bg-gray-300 h-6 w-20 rounded-pill"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="card-body content position-relative p-0 mt-3 flex-grow-1 d-flex flex-column">
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <div className="animate-pulse bg-gray-300 h-3 w-16 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-3 w-20 rounded"></div>
          </div>
          <div className="animate-pulse bg-gray-300 h-2 w-full rounded"></div>
          <div className="text-center mt-1">
            <div className="animate-pulse bg-gray-300 h-3 w-20 mx-auto rounded"></div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="animate-pulse bg-gray-300 h-3 w-12 mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
          </div>
          <div className="animate-pulse bg-gray-300 h-6 w-20 rounded-pill"></div>
        </div>

        <div className="d-grid mt-auto">
          <div className="animate-pulse bg-gray-300 h-10 w-full rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-12">
    <div className="text-center py-5">
      <div className="mb-4">
        <FiUsers className="text-muted" style={{ fontSize: "4rem" }} />
      </div>
      <h5 className="text-muted mb-2">No Active Governance Proposals</h5>
      <p className="text-muted mb-4">
        There are currently no active governance proposals. Check back later for new proposals that need community voting.
      </p>
      <Link href="/governance" className="btn btn-primary">
        View All Proposals
      </Link>
    </div>
  </div>
);

export default function ActiveGovernanceProposals() {
  const { data, isLoading, error } = useActiveProposals({ limit: 4 });
  const [proposalsData, setProposalsData] = useState([]);

  useEffect(() => {
    if (data?.proposals) {
      const updatedData = data.proposals.map((proposal) => ({
        ...proposal,
        remaining: calculateTimeRemaining(proposal.endTime),
        votingProgress: calculateVotingProgress(proposal),
      }));
      setProposalsData(updatedData);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data?.proposals) {
        const updatedData = data.proposals.map((proposal) => ({
          ...proposal,
          remaining: calculateTimeRemaining(proposal.endTime),
          votingProgress: calculateVotingProgress(proposal),
        }));
        setProposalsData(updatedData);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const calculateTimeRemaining = (endTime) => {
    try {
      const now = new Date();
      const end = new Date(parseInt(endTime) * 1000); // Convert from seconds to milliseconds
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds, expired: false };
    } catch (error) {
      console.error('Error calculating time remaining:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
  };

  const calculateVotingProgress = (proposal) => {
    try {
      const totalVotes = (proposal.forVotes || 0) + (proposal.againstVotes || 0);
      const forPercentage = totalVotes > 0 ? ((proposal.forVotes || 0) / totalVotes) * 100 : 0;
      const againstPercentage = totalVotes > 0 ? ((proposal.againstVotes || 0) / totalVotes) * 100 : 0;
      return { forPercentage, againstPercentage, totalVotes };
    } catch (error) {
      console.error('Error calculating voting progress:', error);
      return { forPercentage: 0, againstPercentage: 0, totalVotes: 0 };
    }
  };

  const getProposalTypeInfo = (type) => {
    switch (type) {
      case 0:
        return {
          label: "Approve",
          color: "success",
          icon: <FiCheckCircle className="me-1" />,
          description: "Vote to approve this model",
        };
      case 1:
        return {
          label: "Flag",
          color: "warning",
          icon: <FiAlertTriangle className="me-1" />,
          description: "Vote to flag this model with warnings",
        };
      case 2:
        return {
          label: "Delist",
          color: "danger",
          icon: <FiXCircle className="me-1" />,
          description: "Vote to remove this model",
        };
      default:
        return { label: "Unknown", color: "secondary", icon: null };
    }
  };

  const isQuorumMet = (proposal) => {
    try {
      const currentQuorum = proposal.quorumMet ? 100 : 0;
      const requiredQuorum = 20;
      return currentQuorum >= requiredQuorum;
    } catch (error) {
      console.error('Error checking quorum:', error);
      return false;
    }
  };

  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              Failed to load active governance proposals. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row justify-content-center">
        <div className="col">
          <div className="section-title text-center mb-5 pb-3">
            <h4 className="title mb-4">Active Governance Proposals</h4>
            <p className="text-muted para-desc mb-0 mx-auto">
              Community members with governance rights are voting on these AI
              models. Cast your vote to shape the future of safe and fair AI.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProposalCardSkeleton key={index} />
          ))}
        </div>
      ) : proposalsData.length > 0 ? (
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
          {proposalsData.map((proposal, index) => {
            const proposalType = getProposalTypeInfo(proposal.proposalType);
            const votingProgress = proposal.votingProgress || calculateVotingProgress(proposal);
            const quorumMet = isQuorumMet(proposal);
            const model = proposal.model;
            const modelStats = model?.stats || {};

            return (
              <div className="col" key={index}>
                <div className="card governance-proposal-card rounded-md shadow overflow-hidden mb-1 p-3 h-100 d-flex flex-column">
                  <div
                    className={`text-center py-2 mb-2 rounded bg-soft-${proposalType.color}`}
                  >
                    <span
                      className={`badge bg-${proposalType.color} rounded-pill px-3`}
                    >
                      {proposalType.icon}
                      {proposalType.label} Proposal
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <Image
                        src={model?.submitter?.profile?.profilePictureUrl || "/images/client/01.jpg"}
                        width={36}
                        height={36}
                        alt="submitter"
                        className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="ms-2">
                        <Link
                          href={`/explore/${proposal.modelId}`}
                          className="text-dark small h6 mb-0"
                        >
                          {model?.metadata?.name || "Unnamed Model"}
                        </Link>
                        <small className="text-muted d-block">
                          {model?.submitter?.owner?.slice(0, 6) + "..." + model?.submitter?.owner?.slice(-4)}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="proposal-preview rounded-md position-relative overflow-hidden bg-light p-3">
                    <p className="text-muted small mb-2 text-truncate-2-lines" style={{ minHeight: "48px" }}>
                      {model?.metadata?.summary || "No description available"}
                    </p>

                    <div className="row g-2 text-center">
                      <div className="col-4">
                        <small className="text-muted d-block">Reviews</small>
                        <span className="fw-bold">
                          {modelStats.totalReviews || 0}
                        </span>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">Risk</small>
                        <span
                          className={`fw-bold text-${
                            (modelStats.averageSeverity || 0) > 3 ? "danger" : "success"
                          }`}
                        >
                          {(modelStats.averageSeverity || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">Critical</small>
                        <span className="fw-bold text-danger">
                          {modelStats.criticalReviewsCount || 0}
                        </span>
                      </div>
                    </div>

                    {proposal.remaining && !proposal.remaining.expired && (
                      <div className="position-absolute bottom-0 start-0 m-2 bg-gradient-primary text-white title-dark rounded-pill px-3 d-inline-flex align-items-center py-1">
                        <FiClock className="me-1" />
                        <small className="fw-bold">
                          {proposal.remaining.days}d {proposal.remaining.hours}h{" "}
                          {proposal.remaining.minutes}m
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="card-body content position-relative p-0 mt-3 flex-grow-1 d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-success">
                          <FiThumbsUp className="me-1" /> For: {proposal.forVotes || 0}
                        </small>
                        <small className="text-danger">
                          Against: {proposal.againstVotes || 0}{" "}
                          <FiThumbsDown className="ms-1" />
                        </small>
                      </div>

                      <div className="progress" style={{ height: "8px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${votingProgress.forPercentage}%` }}
                        />
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                          style={{
                            width: `${votingProgress.againstPercentage}%`,
                          }}
                        />
                      </div>

                      <div className="text-center mt-1">
                        <small className="text-muted">
                          {votingProgress.totalVotes} votes cast
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <small className="text-muted d-block">Quorum</small>
                        <span
                          className={`fw-bold text-${
                            quorumMet ? "success" : "warning"
                          }`}
                        >
                          {quorumMet ? "100.0" : "0.0"}% / 10%
                        </span>
                      </div>
                      <div className="text-end">
                        <span
                          className={`badge bg-soft-${
                            quorumMet ? "success" : "warning"
                          } rounded-pill`}
                        >
                          {quorumMet ? "Quorum Met" : "Needs Votes"}
                        </span>
                      </div>
                    </div>

                    <div className="d-grid mt-auto">
                      <Link
                        href={`/explore/${proposal.modelId}`}
                        className={`btn btn-${proposalType.color}`}
                      >
                        <FiUsers className="me-1" /> Cast Your Vote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
