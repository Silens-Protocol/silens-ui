import { useState } from "react"
import Image from "next/image"
import { useProposalVotes } from "../../../hooks/useModelData"
import { formatDate, formatAddress } from "../../../utils/utils"
import { 
  FaClipboardCheck as ClipboardCheckIcon,
  FaFileAlt as FileAltIcon,
  FaThumbsUp as ThumbsUpIcon,
  FaThumbsDown as ThumbsDownIcon,
  FaCheckCircle as CheckCircleIcon,
  FaTimesCircle as TimesCircleIcon,
  FaEye as EyeIcon,
  FaUsers as UsersIcon
} from "react-icons/fa"

export default function VotesTab({ modelData }) {
  const [selectedProposal, setSelectedProposal] = useState(null)
  const { data: votesData } = useProposalVotes(selectedProposal?.id, {
    enabled: !!selectedProposal?.id,
  })

  return (
    <div className="tab-pane fade show active">
      {modelData.proposals && modelData.proposals.length > 0 ? (
        <div>
          <div className="d-flex align-items-center mb-5">
            <h3 className="mb-0 fw-bold">Active Proposals</h3>
          </div>

          <div className="row g-4">
            {modelData.proposals.map((proposal, index) => (
              <div key={proposal.id} className="col-12">
                <div className="card border-0 shadow-sm bg-light">
                  <div className="card-header bg-transparent py-4 d-flex justify-content-between align-items-center border-bottom">
                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                      <FileAltIcon className="me-2 text-primary" />
                      Proposal #{proposal.id}
                    </h5>
                    <span
                      className={`badge ${
                        proposal.status === 0
                          ? "bg-warning text-white"
                          : proposal.status === 1
                            ? "bg-success text-white"
                            : "bg-danger text-white"
                      } px-4 py-2 rounded-pill fw-semibold`}
                    >
                      {proposal.status === 0 ? "Active" : proposal.status === 1 ? "Passed" : "Failed"}
                    </span>
                  </div>

                  <div className="card-body p-4">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <small className="text-muted d-block mb-1 text-uppercase fw-semibold">
                            Proposal Type
                          </small>
                          <p className="mb-0 fw-medium fs-6">
                            {proposal.proposalType === 0
                              ? "Approve"
                              : proposal.proposalType === 1
                                ? "Flag"
                                : "Delist"}
                          </p>
                        </div>

                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-center p-3 bg-success rounded-3">
                              <ThumbsUpIcon size={24} className="text-white mb-2" />
                              <small className="text-white d-block mb-1 text-uppercase fw-semibold">
                                For Votes
                              </small>
                              <h4 className="mb-0 fw-bold text-white">{proposal.forVotes}</h4>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-danger rounded-3">
                              <ThumbsDownIcon size={24} className="text-white mb-2" />
                              <small className="text-white d-block mb-1 text-uppercase fw-semibold">
                                Against Votes
                              </small>
                              <h4 className="mb-0 fw-bold text-white">{proposal.againstVotes}</h4>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 d-flex flex-column align-items-end">
                        <div className="mb-4 w-100" style={{ maxWidth: 320 }}>
                          <small className="text-muted d-block mb-1 text-uppercase fw-semibold">
                            Start Date
                          </small>
                          <p className="mb-0 fw-medium fs-6">{formatDate(proposal.startTime)}</p>
                        </div>
                        <div className="mb-4 w-100" style={{ maxWidth: 320 }}>
                          <small className="text-muted d-block mb-1 text-uppercase fw-semibold">
                            End Date
                          </small>
                          <p className="mb-0 fw-medium fs-6">{formatDate(proposal.endTime)}</p>
                        </div>
                        <div className="w-100" style={{ maxWidth: 320 }}>
                          <small className="text-muted d-block mb-1 text-uppercase fw-semibold">
                            Quorum Status
                          </small>
                          <p className="mb-0 fw-medium fs-6">
                            {proposal.quorumMet ? (
                              <span className="text-success d-flex align-items-center">
                                <CheckCircleIcon className="me-1" />
                                Quorum Met
                              </span>
                            ) : (
                              <span className="text-danger d-flex align-items-center">
                                <TimesCircleIcon className="me-1" />
                                Quorum Not Met
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        className={`btn ${
                          selectedProposal?.id === proposal.id ? "btn-outline-primary" : "btn-primary"
                        } rounded-pill px-4 fw-semibold`}
                        onClick={() =>
                          setSelectedProposal(selectedProposal?.id === proposal.id ? null : proposal)
                        }
                      >
                        <EyeIcon className="me-2" />
                        {selectedProposal?.id === proposal.id ? "Hide Votes" : "View Votes"}
                      </button>
                    </div>

                    {selectedProposal?.id === proposal.id && votesData && (
                      <div className="mt-4 pt-4 border-top">
                        <h6 className="fw-bold mb-4 d-flex align-items-center">
                          <UsersIcon className="me-2 text-primary" />
                          Individual Votes
                        </h6>

                        <div className="bg-white rounded-4 p-4 border">
                          {votesData.votes && votesData.votes.length > 0 ? (
                            <div className="row g-3">
                              {votesData.votes.map((vote, voteIndex) => (
                                <div key={vote.id} className="col-md-6">
                                  <div className="d-flex align-items-center p-3 bg-light rounded-3 border">
                                    <div className="position-relative me-3">
                                      <Image
                                        src={
                                          vote.voter?.profile?.profilePictureUrl ||
                                          "/images/client/01.jpg"
                                        }
                                        width={40}
                                        height={40}
                                        className="rounded-circle border border-2 border-white shadow-sm"
                                        alt=""
                                      />
                                    </div>
                                    <div className="flex-grow-1">
                                      <p className="mb-0 fw-medium">
                                        {vote.voter?.profile?.name ||
                                          formatAddress(vote.voter?.owner)}
                                      </p>
                                      <small className="text-muted font-monospace">
                                        {formatAddress(vote.voter?.owner)}
                                      </small>
                                    </div>
                                    <span
                                      className={`badge ${vote.support ? "bg-success text-white" : "bg-danger text-white"} px-3 py-2 rounded-pill fw-semibold`}
                                    >
                                      {vote.support ? (
                                        <ThumbsUpIcon className="me-1" />
                                      ) : (
                                        <ThumbsDownIcon className="me-1" />
                                      )}
                                      {vote.support ? "For" : "Against"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-muted mb-0">No votes recorded yet for this proposal.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle p-4 d-inline-flex mb-4">
            <ClipboardCheckIcon size={48} className="text-muted" />
          </div>
          <h4 className="text-muted mb-2">No Proposals Yet</h4>
          <p className="text-muted">
            This model hasn't been proposed for any voting actions yet.
          </p>
        </div>
      )}
    </div>
  )
}
