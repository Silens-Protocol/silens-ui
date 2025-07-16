import SilensCoreAbi from "../contracts/SilensCoreAbi.json"
import SilensIdentityAbi from "../contracts/SilensIdentityAbi.json"
import SilensModelRegistryAbi from "../contracts/SilensModelRegistryAbi.json"
import SilensProposalVotingAbi from "../contracts/SilensProposalVotingAbi.json"
import SilensReputationSystemAbi from "../contracts/SilensReputationSystemAbi.json"

export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export const SILENS_CORE_ADDRESS = process.env.NEXT_PUBLIC_SILENS_CORE_ADDRESS;
export const SILENS_IDENTITY_ADDRESS = process.env.NEXT_PUBLIC_SILENS_IDENTITY_ADDRESS;
export const SILENS_MODEL_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_SILENS_MODEL_REGISTRY_ADDRESS;
export const SILENS_PROPOSAL_VOTING_ADDRESS = process.env.NEXT_PUBLIC_SILENS_PROPOSAL_VOTING_ADDRESS;
export const SILENS_REPUTATION_SYSTEM_ADDRESS = process.env.NEXT_PUBLIC_SILENS_REPUTATION_SYSTEM_ADDRESS;

export const SILENS_CORE_CONTRACT = {
    address: SILENS_CORE_ADDRESS,
    abi: SilensCoreAbi
}

export const SILENS_IDENTITY_CONTRACT = {
    address: SILENS_IDENTITY_ADDRESS,
    abi: SilensIdentityAbi
}

export const SILENS_MODEL_REGISTRY_CONTRACT = {
    address: SILENS_MODEL_REGISTRY_ADDRESS,
    abi: SilensModelRegistryAbi
}

export const SILENS_PROPOSAL_VOTING_CONTRACT = {
    address: SILENS_PROPOSAL_VOTING_ADDRESS,
    abi: SilensProposalVotingAbi
}

export const SILENS_REPUTATION_SYSTEM_CONTRACT = {
    address: SILENS_REPUTATION_SYSTEM_ADDRESS,
    abi: SilensReputationSystemAbi
}

export const SILENS_CORE_CONTRACT_ABI = SilensCoreAbi;
export const SILENS_IDENTITY_CONTRACT_ABI = SilensIdentityAbi;
export const SILENS_MODEL_REGISTRY_CONTRACT_ABI = SilensModelRegistryAbi;
export const SILENS_PROPOSAL_VOTING_CONTRACT_ABI = SilensProposalVotingAbi;
export const SILENS_REPUTATION_SYSTEM_CONTRACT_ABI = SilensReputationSystemAbi;
