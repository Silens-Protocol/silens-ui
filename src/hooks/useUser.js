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

export const useUser = () => {
  const { isConnected, address } = useAccount();

  return useQuery({
    queryKey: ['user', address],
    queryFn: () => fetchUserData(address),
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const hasVerifiedBadge = (userData) => {  
  if (!userData?.badges) return false;
  
  const hasVerified = userData.badges.some(badge => badge.badgeId === 1);
  
  return hasVerified;
};

export const hasIdentityButNotVerified = (userData) => {
  return userData?.user?.identityTokenId && !hasVerifiedBadge(userData);
};

export const hasIdentityAndVerified = (userData) => {
  const hasIdentity = !!userData?.user?.identityTokenId;
  const hasVerified = hasVerifiedBadge(userData);
  
  return hasIdentity && hasVerified;
};
