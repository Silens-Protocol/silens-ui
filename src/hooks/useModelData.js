import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:42069';

export const useModels = (options = {}) => {
  const {
    limit = 50,
    offset = 0,
    status,
    excludeStatus,
    submitter,
    includeRelated = true,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['models', { limit, offset, status, excludeStatus, submitter, includeRelated }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        includeRelated: includeRelated.toString()
      });

      if (status !== undefined) params.append('status', status.toString());
      if (excludeStatus !== undefined) params.append('excludeStatus', excludeStatus.toString());
      if (submitter) params.append('submitter', submitter);

      const response = await fetch(`${API_BASE_URL}/models?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      return response.json();
    },
    ...queryOptions
  });
};

export const useModel = (modelId, options = {}) => {
  return useQuery({
    queryKey: ['model', modelId],
    queryFn: async () => {
      if (!modelId) {
        throw new Error('Model ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/models/${modelId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Model not found');
        }
        throw new Error(`Failed to fetch model: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!modelId,
    ...options
  });
};

export const useModelReviews = (modelId, options = {}) => {
  const {
    limit = 50,
    offset = 0,
    severity,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['model-reviews', modelId, { limit, offset, severity }],
    queryFn: async () => {
      if (!modelId) {
        throw new Error('Model ID is required');
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (severity !== undefined) params.append('severity', severity.toString());

      const response = await fetch(`${API_BASE_URL}/models/${modelId}/reviews?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch model reviews: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!modelId,
    ...queryOptions
  });
};

export const useUserModels = (userAddress, options = {}) => {
  const {
    limit = 50,
    offset = 0,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['user-models', userAddress, { limit, offset }],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${API_BASE_URL}/users/${userAddress}/models?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user models: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!userAddress,
    ...queryOptions
  });
};

export const useUserReviews = (userAddress, options = {}) => {
  const {
    limit = 50,
    offset = 0,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['user-reviews', userAddress, { limit, offset }],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${API_BASE_URL}/users/${userAddress}/reviews?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user reviews: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!userAddress,
    ...queryOptions
  });
};

export const useModelsUnderReview = (options = {}) => {
  const {
    limit = 6,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['models-under-review', { limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
        status: '0',
        includeRelated: 'true'
      });

      const response = await fetch(`${API_BASE_URL}/models?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models under review: ${response.statusText}`);
      }

      return response.json();
    },
    ...queryOptions
  });
};

export const useApprovedModels = (options = {}) => {
  const {
    limit = 12,
    offset = 0,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['approved-models', { limit, offset }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        status: '1',
        includeRelated: 'true'
      });

      const response = await fetch(`${API_BASE_URL}/models?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch approved models: ${response.statusText}`);
      }

      return response.json();
    },
    ...queryOptions
  });
};

export const useActiveProposals = (options = {}) => {
  const {
    limit = 4,
    offset = 0,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['active-proposals', { limit, offset }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        status: '0'
      });

      const response = await fetch(`${API_BASE_URL}/proposals?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch active proposals: ${response.statusText}`);
      }

      const proposalsData = await response.json();

      const proposalsWithModels = await Promise.all(
        proposalsData.proposals.map(async (proposal) => {
          try {
            const modelResponse = await fetch(`${API_BASE_URL}/models/${proposal.modelId}?includeRelated=true`);
            if (modelResponse.ok) {
              const modelData = await modelResponse.json();
              return {
                ...proposal,
                model: modelData
              };
            }
          } catch (error) {
            console.error(`Error fetching model data for proposal ${proposal.id}:`, error);
          }
          
          return proposal;
        })
      );

      return {
        proposals: proposalsWithModels,
        pagination: proposalsData.pagination
      };
    },
    ...queryOptions
  });
};

export const useAnalytics = (options = {}) => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      return response.json();
    },
    ...options
  });
};

export const useProposalVotes = (proposalId, options = {}) => {
  const {
    limit = 50,
    offset = 0,
    support,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ['proposal-votes', proposalId, { limit, offset, support }],
    queryFn: async () => {
      if (!proposalId) {
        throw new Error('Proposal ID is required');
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (support !== undefined) params.append('support', support.toString());

      const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/votes?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch proposal votes: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!proposalId,
    ...queryOptions
  });
};