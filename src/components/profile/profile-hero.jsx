'use client'

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegCopy, FaCheck } from '../../assets/icons/vander'
import { useUser } from '../../hooks/useUser';
import { useAccount } from 'wagmi';
import { hasVerifiedBadge } from '../../hooks/useUser';

export default function ProfileHero() {
    const { isConnected, address } = useAccount();
    const { data: userData, isLoading, error } = useUser();

    const userName = userData?.identity?.profile?.name || 'Anonymous User';
    const userBio = userData?.identity?.profile?.bio || 'No bio available';
    const userProfilePicture = userData?.identity?.profile?.profilePictureUrl || '/images/client/01.png';
    const isVerified = hasVerifiedBadge(userData);
    const userStats = userData?.stats || {};

    const hasIdentityToken = !!userData?.identity?.tokenId;
    const needsToMintIdentity = isConnected && (!userData || !hasIdentityToken);

    const copyToClipboard = () => {
        if (userData?.user?.address) {
            navigator.clipboard.writeText(userData.user.address);
        }
    };

    if (isConnected && isLoading) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <h5>Loading profile...</h5>
                </div>
            </div>
        );
    }

    // Show placeholder content when not connected or needs to mint identity
    const displayName = !needsToMintIdentity ? userName : 'Mint Your Identity';
    const displayAddress = isConnected ? (address || '0x0000...0000') : '0x0000...0000';
    const displayBio = !needsToMintIdentity ? userBio : 'Mint your identity to view your profile';
    const displayProfilePicture = !needsToMintIdentity ? userProfilePicture : '/images/client/01.png';
    const displayStats = !needsToMintIdentity ? userStats : { totalModels: 0, totalReviews: 0, totalVotes: 0, totalBadges: 0 };
    const displayReputationScore = !needsToMintIdentity ? (userData?.user?.reputationScore || 0) : 0;

  return (
    <div className="container">
        <div className="profile-banner" style={{ background: 'black', width: '100%', height: '250px' }}></div>

        <div className="row justify-content-center">
            <div className="col">
                <div className="text-center mt-n80">
                    <div className="profile-pic">
                        <div className="position-relative d-inline-block" style={{ width: 110, height: 110 }}>
                            <Image
                                src={displayProfilePicture}
                                width={220}
                                height={220}
                                className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm"
                                id="profile-image"
                                alt=""
                                style={{ objectFit: 'cover', width: '110px', height: '110px' }}
                                unoptimized={true}
                                quality={100}
                                priority
                            />
                        </div>
                    </div>

                    <div className="content mt-3">
                        <h5 className="mb-3 d-flex align-items-center justify-content-center">
                            {displayName}
                            {!needsToMintIdentity && isVerified && (
                                <span className="badge bg-success ms-2 d-flex align-items-center rounded-pill px-2 py-1" style={{borderRadius: '999px', fontWeight: '500', fontSize: '0.85rem'}}>
                                    <FaCheck className="me-1" style={{fontSize: '0.9em'}} />
                                    Verified
                                </span>
                            )}
                        </h5>
                        <small className="text-muted px-2 py-1 rounded-lg shadow">
                            {displayAddress} 
                            {!needsToMintIdentity && (
                                <Link href="#" className="text-primary h5 ms-1" onClick={copyToClipboard}>
                                    <FaRegCopy className="fs-6"></FaRegCopy>
                                </Link>
                            )}
                        </small>

                        <h6 className="mt-3 mb-3">{displayBio}</h6>

                        <div className="row justify-content-center mt-4">
                            <div className="col-lg-10 col-md-12">
                                <div className="row text-center">
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-primary">{displayStats.totalModels || 0}</h4>
                                            <small className="text-muted">Models</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-success">{displayStats.totalReviews || 0}</h4>
                                            <small className="text-muted">Reviews</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-warning">{displayStats.totalVotes || 0}</h4>
                                            <small className="text-muted">Votes</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-info">{displayStats.totalBadges || 0}</h4>
                                            <small className="text-muted">Badges</small>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="h-100">
                                            <h4 className="mb-1 fw-bold text-info">{displayReputationScore}</h4>
                                            <small className="text-muted">Reputation Score</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isConnected && (
                            <div className="mt-4">
                                <div className="d-inline-block" role="alert">
                                    <strong>Connect your wallet</strong> to view your full profile and start contributing to the community!
                                </div>
                            </div>
                        )}

                        {needsToMintIdentity && (
                            <div className="mt-4">
                                <div className="d-inline-block" role="alert">
                                    <strong>Mint your identity</strong> to view your full profile and start contributing to the community!
                                    <br />
                                    <Link href="/signup" className="btn btn-primary btn-sm mt-2">
                                        Go to Signup
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
