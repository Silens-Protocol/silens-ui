"use client";

import React from "react";
import { useAccount } from 'wagmi';
import { useUserVotes } from '../../hooks/useUser';
import { getProposalTypeText, getProposalStatusText, getStatusText, formatDate, formatAddress } from '../../utils/utils';
import { CiCalendar as CalendarIcon } from "react-icons/ci";
import { FaVoteYea as VoteIcon } from "react-icons/fa";
import { FaCheckCircle as CheckIcon } from "react-icons/fa";
import { FaTimesCircle as TimesIcon } from "react-icons/fa";
import { FaRegCommentDots as CommentIcon } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function VoteTab() {
  const { address } = useAccount();
  const { data: votesData, isLoading, error } = useUserVotes(address);

  if (isLoading) {
    return (
      <div className="tab-pane fade show active">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your votes...</p>
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
          <h4 className="text-danger mb-2">Error Loading Votes</h4>
          <p className="text-muted">
            Failed to load your votes. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const votes = votesData?.votes || [];

  if (votes.length === 0) {
    return (
      <div className="tab-pane fade show active">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 text-center">
            <div className="content">
              <h5 className="mb-4">No Votes</h5>
              <p className="text-muted">
                You haven't participated in any governance votes yet. Get involved
                in community decisions by voting on proposals.
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
        {votes.map((vote) => (
          <div key={vote.id} className="col-12">
            <div className="card border-0 shadow-sm h-100 bg-light">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3" style={{ width: 64, height: 64 }}>
                      {vote.model?.metadata?.imageUrl ? (
                        <Image
                          src={vote.model.metadata.imageUrl}
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
                      <h5 className="mb-1 fw-bold text-dark">
                        {vote.model?.metadata?.name || `Model #${vote.model?.id}`}
                      </h5>
                      <p className="mb-2 text-muted small">
                        {vote.model?.metadata?.summary || 'No description available'}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary px-2 py-1 rounded-pill small">
                          {vote.model?.metadata?.category || 'Uncategorized'}
                        </span>
                        <span className={`badge px-2 py-1 rounded-pill small ${
                          getStatusText(vote.model?.status) === "Approved" ? "bg-success" :
                          getStatusText(vote.model?.status) === "Under Review" ? "bg-warning" :
                          getStatusText(vote.model?.status) === "Flagged" ? "bg-danger" :
                          "bg-secondary"
                        }`}>
                          {getStatusText(vote.model?.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/explore/${vote.model?.id}`} className="btn btn-outline-primary btn-sm">
                    <VoteIcon className="me-1" />
                    View Model
                  </Link>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {vote.support ? (
                          <CheckIcon className="text-success me-2" />
                        ) : (
                          <TimesIcon className="text-danger me-2" />
                        )}
                        <h6 className="mb-0 fw-bold">
                          {vote.support ? "For" : "Against"}
                        </h6>
                      </div>
                      <small className="text-muted">Your Vote</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-primary">{vote.proposal?.stats?.totalVotes || 0}</h6>
                      <small className="text-muted">Total Votes</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-success">{vote.proposal?.stats?.forVotes || 0}</h6>
                      <small className="text-muted">For Votes</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center p-3 bg-white rounded-3">
                      <h6 className="mb-1 fw-bold text-danger">{vote.proposal?.stats?.againstVotes || 0}</h6>
                      <small className="text-muted">Against Votes</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-3 text-dark">Proposal Details</h6>
                  <div className="row g-2">
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-info px-2 py-1 rounded-pill small">
                          {getProposalTypeText(vote.proposal?.proposalType)}
                        </span>
                        <span className={`badge px-2 py-1 rounded-pill small ${
                          getProposalStatusText(vote.proposal?.status) === "Active" ? "bg-warning" :
                          getProposalStatusText(vote.proposal?.status) === "Passed" ? "bg-success" :
                          getProposalStatusText(vote.proposal?.status) === "Failed" ? "bg-danger" :
                          "bg-secondary"
                        }`}>
                          {getProposalStatusText(vote.proposal?.status)}
                        </span>
                        {vote.proposal?.executed && (
                          <span className="badge bg-success px-2 py-1 rounded-pill small">
                            Executed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-flex align-items-center">
                        <CalendarIcon className="me-1" />
                        Start: {formatDate(vote.proposal?.startTime)}
                      </small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-flex align-items-center">
                        <CalendarIcon className="me-1" />
                        End: {formatDate(vote.proposal?.endTime)}
                      </small>
                    </div>
                    <div className="col-12">
                      <small className="text-muted d-flex align-items-center">
                        <CalendarIcon className="me-1" />
                        Voted: {formatDate(vote.timestamp)}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-2 text-dark">Model Details</h6>
                  <div className="row g-2">
                    {vote.model?.metadata?.tags && vote.model.metadata.tags.length > 0 && (
                      <div className="col-12">
                        <small className="text-muted">Tags: </small>
                        {vote.model.metadata.tags.map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 px-2 py-1 small">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {vote.model?.metadata?.link && (
                      <div className="col-12">
                        <small className="text-muted">Link: </small>
                        <a href={vote.model.metadata.link} target="_blank" rel="noopener noreferrer" className="text-primary small">
                          {vote.model.metadata.link}
                        </a>
                      </div>
                    )}
                    <div className="col-12">
                      <small className="text-muted d-flex align-items-center">
                        <CalendarIcon className="me-1" />
                        Submitted: {formatDate(vote.model?.submissionTime)}
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
