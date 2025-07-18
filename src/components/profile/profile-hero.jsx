'use client'

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegCopy, FaCheck } from '../../assets/icons/vander'
import { useUser } from '../../hooks/useUser';
import { useAccount } from 'wagmi';
import { hasVerifiedBadge } from '../../hooks/useUser';

export default function ProfileHero() {
    const { isConnected } = useAccount();
    const { data: userData, isLoading, error } = useUser();

    const userName = userData?.identity?.profile?.name || 'Anonymous User';
    const userAddress = userData?.user?.address || 'Not connected';
    const userBio = userData?.identity?.profile?.bio || 'No bio available';
    const userProfilePicture = userData?.identity?.profile?.profilePictureUrl || '/images/client/01.jpg';
    const isVerified = hasVerifiedBadge(userData);
    const userStats = userData?.stats || {};

    const copyToClipboard = () => {
        if (userData?.user?.address) {
            navigator.clipboard.writeText(userData.user.address);
        }
    };

    if (!isConnected) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <h5>Please connect your wallet to view your profile</h5>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <h5>Loading profile...</h5>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <h5>Error loading profile</h5>
                </div>
            </div>
        );
    }

  return (
    <div className="container">
        <div className="profile-banner" style={{ background: 'black', width: '100%', height: '250px' }}></div>

        <div className="row justify-content-center">
            <div className="col">
                <div className="text-center mt-n80">
                    <div className="profile-pic">
                        <div className="position-relative d-inline-block" style={{ width: 110, height: 110 }}>
                            <Image
                                src={userProfilePicture}
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
                            {userName}
                            {isVerified && (
                                <span className="badge bg-success ms-2 d-flex align-items-center rounded-pill px-2 py-1" style={{borderRadius: '999px', fontWeight: '500', fontSize: '0.85rem'}}>
                                    <FaCheck className="me-1" style={{fontSize: '0.9em'}} />
                                    Verified
                                </span>
                            )}
                        </h5>
                        <small className="text-muted px-2 py-1 rounded-lg shadow">
                            {userAddress} 
                            <Link href="#" className="text-primary h5 ms-1" onClick={copyToClipboard}>
                                <FaRegCopy className="fs-6"></FaRegCopy>
                            </Link>
                        </small>

                        <h6 className="mt-3 mb-3">{userBio}</h6>

                        {/* User Stats */}
                        <div className="row justify-content-center mt-4">
                            <div className="col-lg-10 col-md-12">
                                <div className="row text-center">
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-primary">{userStats.totalModels || 0}</h4>
                                            <small className="text-muted">Models</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-success">{userStats.totalReviews || 0}</h4>
                                            <small className="text-muted">Reviews</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-warning">{userStats.totalVotes || 0}</h4>
                                            <small className="text-muted">Votes</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 mb-3 mb-md-0">
                                        <div className="border-end h-100">
                                            <h4 className="mb-1 fw-bold text-info">{userStats.totalBadges || 0}</h4>
                                            <small className="text-muted">Badges</small>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="h-100">
                                            <h4 className="mb-1 fw-bold text-info">{userData?.user?.reputationScore || 0}</h4>
                                            <small className="text-muted">Reputation Score</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
