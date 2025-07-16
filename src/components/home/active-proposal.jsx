"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FiClock,
  FiThumbsUp,
  FiThumbsDown,
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "../../assets/icons/vander";

const activeProposalsData = [
  {
    id: 1,
    modelId: 10,
    modelName: "SentimentAnalyzer Pro",
    modelSummary: "Advanced sentiment analysis with emotion detection",
    submitter: "0x1234...5678",
    submitterAvatar: "/images/client/01.jpg",
    proposalType: 0,
    status: 0, 
    forVotes: 67,
    againstVotes: 23,
    totalPossibleVoters: 120,
    startTime: new Date("2025-01-15T10:00:00"),
    endTime: new Date("2025-01-18T10:00:00"),
    quorumPercentage: 20,
    currentQuorum: 75,
    modelStats: {
      totalReviews: 28,
      averageSeverity: 1.8,
      criticalReviews: 0,
    },
  },
  {
    id: 2,
    modelId: 11,
    modelName: "DeepFake Detector AI",
    modelSummary: "Identifies AI-generated deepfake content",
    submitter: "0xabcd...efgh",
    submitterAvatar: "/images/client/02.jpg",
    proposalType: 0,
    status: 0,
    forVotes: 45,
    againstVotes: 12,
    totalPossibleVoters: 120,
    startTime: new Date("2025-01-14T14:00:00"),
    endTime: new Date("2025-01-17T14:00:00"),
    quorumPercentage: 20,
    currentQuorum: 47.5,
    modelStats: {
      totalReviews: 35,
      averageSeverity: 1.5,
      criticalReviews: 0,
    },
  },
  {
    id: 3,
    modelId: 12,
    modelName: "BiasedGPT Model",
    modelSummary: "Text generation model with known bias issues",
    submitter: "0x9876...5432",
    submitterAvatar: "/images/client/03.jpg",
    proposalType: 2,
    status: 0,
    forVotes: 82,
    againstVotes: 15,
    totalPossibleVoters: 120,
    startTime: new Date("2025-01-16T09:00:00"),
    endTime: new Date("2025-01-19T09:00:00"),
    quorumPercentage: 20,
    currentQuorum: 80.8,
    modelStats: {
      totalReviews: 42,
      averageSeverity: 4.2,
      criticalReviews: 18,
    },
  },
  {
    id: 4,
    modelId: 13,
    modelName: "ContentGuard v2",
    modelSummary: "Content moderation with potential over-censorship",
    submitter: "0x5555...6666",
    submitterAvatar: "/images/client/04.jpg",
    proposalType: 1,
    status: 0,
    forVotes: 38,
    againstVotes: 29,
    totalPossibleVoters: 120,
    startTime: new Date("2025-01-15T16:00:00"),
    endTime: new Date("2025-01-18T16:00:00"),
    quorumPercentage: 20,
    currentQuorum: 55.8,
    modelStats: {
      totalReviews: 31,
      averageSeverity: 3.1,
      criticalReviews: 8,
    },
  },
];

export default function ActiveGovernanceProposals() {
  const [proposalsData, setProposalsData] = useState(activeProposalsData);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRemainingTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateRemainingTime = () => {
    const updatedData = activeProposalsData.map((proposal) => ({
      ...proposal,
      remaining: calculateTimeRemaining(proposal.endTime),
      votingProgress: calculateVotingProgress(proposal),
    }));
    setProposalsData(updatedData);
  };

  const calculateTimeRemaining = (endTime) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, expired: false };
  };

  const calculateVotingProgress = (proposal) => {
    const totalVotes = proposal.forVotes + proposal.againstVotes;
    const forPercentage =
      totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;
    const againstPercentage =
      totalVotes > 0 ? (proposal.againstVotes / totalVotes) * 100 : 0;
    return { forPercentage, againstPercentage, totalVotes };
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
    return proposal.currentQuorum >= proposal.quorumPercentage;
  };

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

      <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
        {proposalsData.map((proposal, index) => {
          const proposalType = getProposalTypeInfo(proposal.proposalType);
          const votingProgress =
            proposal.votingProgress || calculateVotingProgress(proposal);
          const quorumMet = isQuorumMet(proposal);

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
                      src={proposal.submitterAvatar}
                      width={36}
                      height={36}
                      alt="submitter"
                      className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                    />
                    <div className="ms-2">
                      <Link
                        href={`/model/${proposal.modelId}`}
                        className="text-dark small h6 mb-0"
                      >
                        {proposal.modelName}
                      </Link>
                      <small className="text-muted d-block">
                        {proposal.submitter}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="proposal-preview rounded-md position-relative overflow-hidden bg-light p-3">
                  <p className="text-muted small mb-2">
                    {proposal.modelSummary}
                  </p>

                  <div className="row g-2 text-center">
                    <div className="col-4">
                      <small className="text-muted d-block">Reviews</small>
                      <span className="fw-bold">
                        {proposal.modelStats.totalReviews}
                      </span>
                    </div>
                    <div className="col-4">
                      <small className="text-muted d-block">Risk</small>
                      <span
                        className={`fw-bold text-${
                          proposal.modelStats.averageSeverity > 3
                            ? "danger"
                            : "success"
                        }`}
                      >
                        {proposal.modelStats.averageSeverity.toFixed(1)}
                      </span>
                    </div>
                    <div className="col-4">
                      <small className="text-muted d-block">Critical</small>
                      <span className="fw-bold text-danger">
                        {proposal.modelStats.criticalReviews}
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
                        <FiThumbsUp className="me-1" /> For: {proposal.forVotes}
                      </small>
                      <small className="text-danger">
                        Against: {proposal.againstVotes}{" "}
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
                        {proposal.currentQuorum.toFixed(1)}% /{" "}
                        {proposal.quorumPercentage}%
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
                      href={`/governance/proposal/${proposal.id}`}
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
    </>
  );
}
