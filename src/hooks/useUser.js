import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

const fetchUserData = async (address) => {
  const baseUrl = process.env.NEXT_PUBLIC_INDEXER_URL;
  const response = await fetch(`${baseUrl}/users/${address}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  return response.json();
};

const fetchUserReviews = async (address) => {
  const baseUrl = process.env.NEXT_PUBLIC_INDEXER_URL;
  const response = await fetch(`${baseUrl}/users/${address}/reviews`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user reviews');
  }
  
  return response.json();
};

const fetchUserModels = async (address) => {
  const baseUrl = process.env.NEXT_PUBLIC_INDEXER_URL;
  const response = await fetch(`${baseUrl}/users/${address}/models?includeRelated=true`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user models');
  }
  
  return response.json();
};

const fetchUserVotes = async (address) => {
  const baseUrl = process.env.NEXT_PUBLIC_INDEXER_URL;
  const response = await fetch(`${baseUrl}/users/${address}/votes`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user votes');
  }
  
  return response.json();
};

export const useUser = () => {
  const { isConnected, address } = useAccount();

  return useQuery({
    queryKey: ['user', address],
    queryFn: () => fetchUserData(address),
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useUserReviews = (address) => {
  return useQuery({
    queryKey: ['user-reviews', address],
    queryFn: () => fetchUserReviews(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useUserModels = (address) => {
  return useQuery({
    queryKey: ['user-models', address],
    queryFn: () => fetchUserModels(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useUserVotes = (address) => {
  return useQuery({
    queryKey: ['user-votes', address],
    queryFn: () => fetchUserVotes(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const hasVerifiedBadge = (userData) => {  
  if (!userData?.badges) return false;
  
  const hasVerified = userData.badges.some(badge => badge.badgeId === 1);
  
  return hasVerified;
};

export const hasIdentityButNotVerified = (userData) => {
  return userData?.identity?.tokenId && !hasVerifiedBadge(userData);
};

export const hasIdentityAndVerified = (userData) => {
  const hasIdentity = !!userData?.identity?.tokenId;
  const hasVerified = hasVerifiedBadge(userData);
  
  return hasIdentity && hasVerified;
};
