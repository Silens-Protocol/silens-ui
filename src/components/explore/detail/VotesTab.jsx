import { useState } from "react"
import Image from "next/image"
import { useAccount, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "@wagmi/core"
import { toast } from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { formatDate, formatAddress } from "../../../utils/utils"
import { 
  FaClipboardCheck as ClipboardCheckIcon,
  FaThumbsUp as ThumbsUpIcon,
  FaThumbsDown as ThumbsDownIcon,
  FaCheckCircle as CheckCircleIcon,
  FaTimesCircle as TimesCircleIcon,
  FaEye as EyeIcon,
  FaUsers as UsersIcon,
  FaClock as ClockIcon,
} from "react-icons/fa"
import { VOTING_PROPOSAL_CONTRACT } from "../../../constants"
import { config } from "../../../wagmi"

export default function VotesTab({ modelData }) {
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const { isConnected, address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const queryClient = useQueryClient()

  const isProposalActive = (proposal) => {
    const now = Math.floor(Date.now() / 1000)
    return proposal.status === 0 && now <= parseInt(proposal.endTime)
  }

  const hasUserVoted = (proposal) => {
    if (!address || !proposal.votes) return false
    return proposal.votes.some(vote => 
      vote.voter?.owner?.toLowerCase() === address.toLowerCase()
    )
  }

  const getUserVote = (proposal) => {
    if (!address || !proposal.votes) return null
    return proposal.votes.find(vote => 
      vote.voter?.owner?.toLowerCase() === address.toLowerCase()
    )
  }

  const getVotePercentage = (proposal) => {
    const totalVotes = proposal.forVotes + proposal.againstVotes
    if (totalVotes === 0) return { for: 0, against: 0 }
    return {
      for: Math.round((proposal.forVotes / totalVotes) * 100),
      against: Math.round((proposal.againstVotes / totalVotes) * 100)
    }
  }

  const handleVote = async (proposalId, support) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsVoting(true)

    const promise = async () => {
      const result = await writeContractAsync({
        ...VOTING_PROPOSAL_CONTRACT,
        functionName: 'vote',
        args: [proposalId, support],
        account: address,
      })

      await waitForTransactionReceipt(config, {
        hash: result,
      })

      await queryClient.invalidateQueries(['model', modelData.id])
      
      return result
    }

    toast.promise(promise(), {
      loading: `Submitting your ${support ? 'support' : 'opposition'} vote...`,
      success: `Vote submitted successfully!`,
      error: (err) => {
        console.error("Vote submission error:", err)
        return `Error: ${err.message || 'Something went wrong'}`
      }
    }).finally(() => {
      setIsVoting(false)
    })
  }

  return (
    <div className="tab-pane fade show active">
      {modelData.proposals && modelData.proposals.length > 0 ? (
        <div>
          <div className="d-flex align-items-center mb-5">
            <div>
              <h3 className="mb-0 fw-bold text-dark">Active Proposals</h3>
              <small className="text-muted">Participate in governance decisions</small>
            </div>
          </div>

          <div className="row g-4">
            {modelData.proposals.map((proposal, index) => {
              const isActive = isProposalActive(proposal)
              const userVoted = hasUserVoted(proposal)
              const userVote = getUserVote(proposal)
              const votePercentages = getVotePercentage(proposal)

              return (
                <div key={proposal.id} className="col-12">
                  <div className="card border-0 shadow-sm proposal-card">
                    <div className="card-header bg-transparent py-4 d-flex justify-content-between align-items-center border-bottom">
                      <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                        Proposal #{proposal.id}
                      </h5>
                      <span
                        className={`badge ${
                          proposal.status === 0
                            ? "bg-warning bg-opacity-10 text-white"
                            : proposal.status === 1
                              ? "bg-success bg-opacity-10 text-white"
                              : "bg-danger bg-opacity-10 text-white"
                        } px-4 py-2 rounded-pill fw-semibold`}
                      >
                        {proposal.status === 0 ? "Active" : proposal.status === 1 ? "Passed" : "Failed"}
                      </span>
                    </div>

                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-lg-8">
                          <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                              <small className="text-muted text-uppercase fw-semibold">
                                Proposal Type
                              </small>
                            </div>
                            <div className="proposal-type-badge">
                              <span className="fw-medium fs-6">
                                {proposal.proposalType === 0
                                  ? "Approve"
                                  : proposal.proposalType === 1
                                    ? "Flag"
                                    : "Delist"}
                              </span>
                            </div>
                          </div>

                          <div className="row g-3">
                            <div className="col-6">
                              <div className="vote-stat-card vote-for">
                                <div className="vote-stat-header">
                                  <ThumbsUpIcon size={20} className="text-white mb-2" />
                                  <small className="text-white d-block mb-1 text-uppercase fw-semibold">
                                    For Votes
                                  </small>
                                </div>
                                <div className="vote-stat-content">
                                  <h3 className="mb-0 fw-bold text-white">{proposal.forVotes}</h3>
                                  <small className="text-white opacity-75">{votePercentages.for}%</small>
                                </div>
                                <div className="vote-progress-bar">
                                  <div 
                                    className="vote-progress-fill"
                                    style={{ width: `${votePercentages.for}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="vote-stat-card vote-against">
                                <div className="vote-stat-header">
                                  <ThumbsDownIcon size={20} className="text-white mb-2" />
                                  <small className="text-white d-block mb-1 text-uppercase fw-semibold">
                                    Against Votes
                                  </small>
                                </div>
                                <div className="vote-stat-content">
                                  <h3 className="mb-0 fw-bold text-white">{proposal.againstVotes}</h3>
                                  <small className="text-white opacity-75">{votePercentages.against}%</small>
                                </div>
                                <div className="vote-progress-bar">
                                  <div 
                                    className="vote-progress-fill"
                                    style={{ width: `${votePercentages.against}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="proposal-details">
                            <div className="detail-item mb-3">
                              <div className="d-flex align-items-center mb-2">
                                <ClockIcon className="text-muted me-2" style={{ fontSize: '14px' }} />
                                <small className="text-muted text-uppercase fw-semibold">Start Date</small>
                              </div>
                              <p className="mb-0 fw-medium fs-6 text-dark">{formatDate(proposal.startTime)}</p>
                            </div>
                            
                            <div className="detail-item mb-3">
                              <div className="d-flex align-items-center mb-2">
                                <ClockIcon className="text-muted me-2" style={{ fontSize: '14px' }} />
                                <small className="text-muted text-uppercase fw-semibold">End Date</small>
                              </div>
                              <p className="mb-0 fw-medium fs-6 text-dark">{formatDate(proposal.endTime)}</p>
                            </div>
                            
                            <div className="detail-item">
                              <div className="d-flex align-items-center mb-2">
                                <UsersIcon className="text-muted me-2" style={{ fontSize: '14px' }} />
                                <small className="text-muted text-uppercase fw-semibold">Quorum Status</small>
                              </div>
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
                      </div>

                      {isActive && isConnected && (
                        <div className="mt-4 pt-4 border-top">
                          <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                            Cast Your Vote
                          </h6>
                          
                          {userVoted ? (
                            <div className="alert alert-info d-flex align-items-center border-0 shadow-sm">
                              <CheckCircleIcon className="me-2" />
                              You have already voted: 
                              <span className={`badge ms-2 ${userVote.support ? 'bg-success' : 'bg-danger'} text-white`}>
                                {userVote.support ? 'For' : 'Against'}
                              </span>
                            </div>
                          ) : (
                            <div className="d-flex gap-3">
                              <button
                                className="btn btn-success px-4 py-3 rounded-pill fw-semibold d-flex align-items-center shadow-sm vote-btn"
                                onClick={() => handleVote(proposal.id, true)}
                                disabled={isVoting}
                              >
                                <ThumbsUpIcon className="me-2" />
                                Vote For
                              </button>
                              <button
                                className="btn btn-danger px-4 py-3 rounded-pill fw-semibold d-flex align-items-center shadow-sm vote-btn"
                                onClick={() => handleVote(proposal.id, false)}
                                disabled={isVoting}
                              >
                                <ThumbsDownIcon className="me-2" />
                                Vote Against
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4">
                        <button
                          className={`btn ${
                            selectedProposal?.id === proposal.id ? "btn-outline-primary" : "btn-primary"
                          } rounded-pill px-4 py-2 fw-semibold shadow-sm`}
                          onClick={() =>
                            setSelectedProposal(selectedProposal?.id === proposal.id ? null : proposal)
                          }
                        >
                          <EyeIcon className="me-2" />
                          {selectedProposal?.id === proposal.id ? "Hide Votes" : "View Votes"}
                        </button>
                      </div>

                      {selectedProposal?.id === proposal.id && (
                        <div className="mt-4 pt-4 border-top">
                          <h6 className="fw-bold mb-4 d-flex align-items-center text-dark">
                            Individual Votes ({proposal.votes?.length || 0})
                          </h6>

                          <div className="votes-container">
                            {proposal.votes && proposal.votes.length > 0 ? (
                              <div className="row g-3">
                                {proposal.votes.map((vote, voteIndex) => (
                                  <div key={vote.id} className="col-md-6">
                                    <div className="vote-item">
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
                                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                                             style={{ width: '12px', height: '12px' }}></div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <p className="mb-0 fw-medium text-dark">
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
                                <div className="bg-light rounded-circle p-3 d-inline-flex mb-3">
                                  <UsersIcon className="text-muted" />
                                </div>
                                <p className="text-muted mb-0">No votes recorded yet for this proposal.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle p-4 d-inline-flex mb-4">
            <ClipboardCheckIcon size={32} className="text-muted" />
          </div>
          <h4 className="text-muted mb-2">No Proposals Yet</h4>
          <p className="text-muted">
            This model hasn't been proposed for any voting actions yet.
          </p>
        </div>
      )}

      <style jsx>{`
        .proposal-card {
          transition: all 0.3s ease;
          border-radius: 16px;
        }

        .proposal-type-badge {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 12px 16px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .vote-stat-card {
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .vote-for {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }

        .vote-against {
          background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
        }

        .vote-stat-header {
          text-align: center;
          margin-bottom: 12px;
        }

        .vote-stat-content {
          text-align: center;
          margin-bottom: 12px;
        }

        .vote-progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .vote-progress-fill {
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .proposal-details {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .detail-item {
          padding-bottom: 12px;
        }

        .detail-item:last-child {
          padding-bottom: 0;
        }

        .vote-btn {
          transition: all 0.3s ease;
        }

        .vote-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
        }

        .votes-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e9ecef;
        }

        .vote-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

      `}</style>
    </div>
  )
}
