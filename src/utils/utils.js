export const getLatestProposal = (proposals) => {
  if (!proposals || proposals.length === 0) return null;
  return proposals[0];
}

export const isProposalActive = (proposal) => {
  if (!proposal || !proposal.endTime) return false;
  return Date.now() < parseInt(proposal.endTime) * 1000;
}

export const getStatusText = (status, proposals = []) => {
  if (proposals && proposals.length > 0) {
    const latestProposal = proposals[0];
    
    if (isProposalActive(latestProposal)) {
      return "Governance Active";
    }
    
    if (latestProposal.endTime && Date.now() >= parseInt(latestProposal.endTime) * 1000) {
      if (!latestProposal.executed) {
        return "Pending Execution";
      }
      
      if (latestProposal.status === 1) {
        switch (latestProposal.proposalType) {
          case 0:
            return "Approved";
          case 1:
            return "Flagged";
          case 2:
            return "Delisted";
          default:
            break;
        }
      } else if (latestProposal.status === 2) {
        return getOriginalStatusText(status);
      }
    }
  }
  
  return getOriginalStatusText(status);
}

const getOriginalStatusText = (status) => {
  switch (status) {
    case 0:
      return "Under Review"
    case 1:
      return "Approved"
    case 2:
      return "Flagged"
    case 3:
      return "Delisted"
    default:
      return "Unknown"
  }
}

export const getStatusBadge = (status, proposals = []) => {
  if (proposals && proposals.length > 0) {
    const latestProposal = proposals[0];
    
    if (isProposalActive(latestProposal)) {
      return "bg-info";
    }
    
    if (latestProposal.endTime && Date.now() >= parseInt(latestProposal.endTime) * 1000) {
      if (!latestProposal.executed) {
        return "bg-warning";
      }
      
      if (latestProposal.status === 1) {
        switch (latestProposal.proposalType) {
          case 0:
            return "bg-success";
          case 1:
            return "bg-danger";
          case 2:
            return "bg-secondary";
          default:
            break;
        }
      } else if (latestProposal.status === 2) {
        return getOriginalStatusBadge(status);
      }
    }
  }
  
  return getOriginalStatusBadge(status);
}

const getOriginalStatusBadge = (status) => {
  const statusClasses = {
    0: "bg-warning",
    1: "bg-success",
    2: "bg-danger",
    3: "bg-secondary",
  }
  return statusClasses[status] || "bg-secondary"
}

export const getProposalStatusText = (proposal) => {
  if (!proposal) return "Unknown";
  
  if (isProposalActive(proposal)) {
    return "Active";
  }
  
  if (proposal.status === 1) {
    switch (proposal.proposalType) {
      case 0:
        return "Approved";
      case 1:
        return "Flagged";
      case 2:
        return "Delisted";
      default:
        return "Unknown";
    }
  } else if (proposal.status === 2) {
    return "Failed";
  } else {
    return "Unknown";
  }
}

export const getProposalTypeText = (proposalType) => {
  switch (proposalType) {
    case 0:
      return "Approve";
    case 1:
      return "Flag";
    case 2:
      return "Delist";
    default:
      return "Unknown";
  }
}

export const getReviewTypeText = (reviewType) => {
    return reviewType === 0 ? "Positive" : "Negative"
  }

export const getSeverityText = (severity) => {
    const severityLevels = ["Low", "Medium", "High", "Critical"]
    return severityLevels[severity] || "Unknown"
  }

export const getSeverityBadge = (severity) => {
    const severityClasses = {
      0: "bg-success",
      1: "bg-warning",
      2: "bg-danger",
      3: "bg-dark",
    }
    return severityClasses[severity] || "bg-secondary"
  }

export const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    return new Date(Number.parseInt(timestamp) * 1000).toLocaleDateString()
  }

export const formatAddress = (address) => {
  if (!address) return "N/A"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const getProposalTimeRemaining = (proposal) => {
  if (!isProposalActive(proposal)) return null;
  
  const endTime = parseInt(proposal.endTime) * 1000;
  const now = Date.now();
  const remaining = endTime - now;
  
  if (remaining <= 0) return null;
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}