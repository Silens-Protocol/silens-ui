import SilensAbi from "../contracts/SilensAbi.json"
import IdentityRegistryAbi from "../contracts/IdentityRegistryAbi.json"
import ModelRegistryAbi from "../contracts/ModelRegistryAbi.json"
import VotingProposalAbi from "../contracts/VotingProposalAbi.json"
import ReputationSystemAbi from "../contracts/ReputationSystemAbi.json"

export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export const SILENS_ADDRESS = process.env.NEXT_PUBLIC_SILENS_ADDRESS;
export const IDENTITY_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS;
export const MODEL_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_MODEL_REGISTRY_ADDRESS;
export const VOTING_PROPOSAL_ADDRESS = process.env.NEXT_PUBLIC_VOTING_PROPOSAL_ADDRESS;
export const REPUTATION_SYSTEM_ADDRESS = process.env.NEXT_PUBLIC_REPUTATION_SYSTEM_ADDRESS;

export const SILENS_CONTRACT = {
    address: SILENS_ADDRESS,
    abi: SilensAbi
}

export const IDENTITY_REGISTRY_CONTRACT = {
    address: IDENTITY_REGISTRY_ADDRESS,
    abi: IdentityRegistryAbi
}

export const MODEL_REGISTRY_CONTRACT = {
    address: MODEL_REGISTRY_ADDRESS,
    abi: ModelRegistryAbi
}

export const VOTING_PROPOSAL_CONTRACT = {
    address: VOTING_PROPOSAL_ADDRESS,
    abi: VotingProposalAbi
}

export const REPUTATION_SYSTEM_CONTRACT = {
    address: REPUTATION_SYSTEM_ADDRESS,
    abi: ReputationSystemAbi
}

export const SILENS_CONTRACT_ABI = SilensAbi;
export const IDENTITY_REGISTRY_CONTRACT_ABI = IdentityRegistryAbi;
export const MODEL_REGISTRY_CONTRACT_ABI = ModelRegistryAbi;
export const VOTING_PROPOSAL_CONTRACT_ABI = VotingProposalAbi;
export const REPUTATION_SYSTEM_CONTRACT_ABI = ReputationSystemAbi;
