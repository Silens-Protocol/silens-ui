"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import {
  useUser,
  hasIdentityAndVerified,
  hasIdentityButNotVerified,
} from "../../hooks/useUser";

import { TypeAnimation } from "react-type-animation";

import { FiShield, FiUsers, FiAward, FiCheck } from "../../assets/icons/vander";

export default function HeroSectionOne() {
  let reviewerGroup = [
    "/images/client/08.jpg",
    "/images/client/05.jpg",
    "/images/client/06.jpg",
  ];
  const [modelsReviewed, setModelsReviewed] = useState(0);
  const [activeReviewers, setActiveReviewers] = useState(0);
  const [governanceVotes, setGovernanceVotes] = useState(0);

  const { isConnected } = useAccount();
  const { data: userData, isLoading, error } = useUser();

  const isUserVerified =
    isConnected && userData && hasIdentityAndVerified(userData);
  const isUserConnectedButNotVerified =
    isConnected && userData && hasIdentityButNotVerified(userData);
  const isUserNotConnected = !isConnected;
  const isUserConnectedButNotRegistered = isConnected && !userData && !isLoading;

  useEffect(() => {
    const interval = setInterval(() => {
      setModelsReviewed((prev) => prev + Math.floor(Math.random() * 3));
      setActiveReviewers((prev) => prev + Math.floor(Math.random() * 2));
      setGovernanceVotes((prev) => prev + Math.floor(Math.random() * 2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderButtons = () => {
    if (isUserNotConnected) {
      return (
        <>
          <Link
            href="/signup"
            className="btn btn-pills btn-light me-3 px-4 py-3 fw-bold fs-5"
          >
            Mint Identity
          </Link>
          <Link
            href="/signup"
            className="btn btn-pills btn-outline-light px-4 py-3 fw-bold fs-5"
          >
            Be Verified
          </Link>
        </>
      );
    }

    if (isUserConnectedButNotRegistered) {
      return (
        <>
          <Link
            href="/signup"
            className="btn btn-pills btn-light me-3 px-4 py-3 fw-bold fs-5"
          >
            Mint Identity
          </Link>
          <Link
            href="/signup"
            className="btn btn-pills btn-outline-light px-4 py-3 fw-bold fs-5"
          >
            Be Verified
          </Link>
        </>
      );
    }

    if (isUserConnectedButNotVerified) {
      return (
        <Link
          href="/signup"
          className="btn btn-pills btn-light px-4 py-3 fw-bold fs-5"
        >
          Get Verified Badge
        </Link>
      );
    }

    if (isUserVerified) {
      return (
        <>
          <Link
            href="/submit"
            className="btn btn-pills btn-light me-3 px-4 py-3 fw-bold fs-5"
          >
            Submit AI Model
          </Link>
          <Link
            href="/explore"
            className="btn btn-pills btn-outline-light px-4 py-3 fw-bold fs-5"
          >
            Explore Models
          </Link>
        </>
      );
    }

    return (
      <>
        <div className="btn btn-pills btn-light me-3 px-4 py-3 fw-bold fs-5 disabled">
          Loading...
        </div>
        <div className="btn btn-pills btn-outline-light px-4 py-3 fw-bold fs-5 disabled">
          Loading...
        </div>
      </>
    );
  };

  const renderBottomContent = () => {
    if (isUserNotConnected) {
      return (
        <>
          <p className="text-white-50 mb-0">
            <small>Join as a reviewer and earn reputation badges</small>
          </p>
          <Link href="/signup" className="text-white fw-bold">
            <small>Connect with CARV ID →</small>
          </Link>
        </>
      );
    }

    if (isUserConnectedButNotRegistered) {
      return (
        <>
          <p className="text-white-50 mb-0">
            <small>Join as a reviewer and earn reputation badges</small>
          </p>
          <Link href="/signup" className="text-white fw-bold">
            <small>Connect with CARV ID →</small>
          </Link>
        </>
      );
    }

    if (isUserConnectedButNotVerified) {
      return (
        <>
          <p className="text-white-50 mb-0">
            <small>Complete verification to start reviewing models</small>
          </p>
          <Link href="/signup" className="text-white fw-bold">
            <small>Get Verified Badge →</small>
          </Link>
        </>
      );
    }

    if (isUserVerified) {
      return (
        <>
          <p className="text-white-50 mb-0">
            <small>You are verified and ready to review models</small>
          </p>
          <div className="text-white fw-bold">
            <small>
              <FiCheck className="me-1" /> Verified Reviewer
            </small>
          </div>
        </>
      );
    }

    return (
      <>
        <p className="text-white-50 mb-0">
          <small>Checking your verification status...</small>
        </p>
      </>
    );
  };

  return (
    <section
      className="bg-half-170 d-table w-100"
      style={{
        backgroundImage: `url("/images/bg/bg01.png")`,
        backgroundPosition: "center",
      }}
    >
      <div className="bg-overlay bg-gradient-primary opacity-8"></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-6">
            <div className="title-heading">
              <h6 className="text-light title-dark fw-normal">
                Decentralized AI Governance Protocol
              </h6>
              <h4 className="heading text-white title-dark fw-bold mb-3">
                Building Trust in AI Through <br />
                <TypeAnimation
                  sequence={[
                    "Community Review",
                    2000,
                    "Transparent Voting",
                    2000,
                    "Reputation Systems",
                    2000,
                    "Fair Governance",
                    2000,
                    "CARV Identity",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  cursor={true}
                  repeat={Infinity}
                  className="typewrite"
                />
              </h4>
              <p className="text-white-50 para-desc mb-0 mb-0">
                Silens empowers the community to review, audit, and govern AI
                models through a transparent, reputation-based system. Submit
                models for review, earn reputation as a reviewer, and
                participate in governance decisions.
              </p>

              <div className="mt-4 pt-2">{renderButtons()}</div>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0">
            <div className="card bg-white nft-items nft-primary img-skewed rounded-md shadow overflow-hidden mb-1 p-3">
              <div className="d-flex justify-content-between">
                <div className="img-group">
                  <span className="badge bg-soft-primary rounded-pill px-3 py-1">
                    <FiShield className="fea icon-sm" /> Under Review
                  </span>
                </div>

                <div className="ms-3">
                  {reviewerGroup.map((item, index) => {
                    return (
                      <Link
                        href="/reviewer-profile"
                        className="user-avatar ms-n3"
                        key={index}
                      >
                        <Image
                          src={item}
                          alt="reviewer"
                          width={36}
                          height={36}
                          className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
                        />
                      </Link>
                    );
                  })}
                  <span className="text-muted small ms-2">+12 reviewers</span>
                </div>
              </div>

              <div className="nft-image rounded-md mt-3 position-relative overflow-hidden shadow bg-light p-4">
                {/* AI Model Card Preview */}
                <div className="text-center">
                  <div className="icon-xxl rounded-circle bg-soft-primary mx-auto mb-3">
                    <FiShield className="text-primary h1 mb-0" />
                  </div>
                  <h5 className="mb-1">GPT-Safety-Shield v2.1</h5>
                  <p className="text-muted small mb-3">
                    Content Moderation AI Model
                  </p>

                  {/* Review Progress */}
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: "75%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small className="text-muted">Review Progress: 75%</small>
                </div>

                <div className="position-absolute top-0 start-0 m-2">
                  <span className="badge bg-warning">2 Days Left</span>
                </div>

                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-success">
                    <FiCheck /> CARV ID Verified
                  </span>
                </div>
              </div>

              <div className="card-body content position-relative p-0 mt-3">
                <Link href="/model-detail" className="title text-dark h5">
                  Community Safety Score
                </Link>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div>
                    <small className="text-muted">Risk Level</small>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-soft-success rounded-pill">
                        Low Risk
                      </span>
                      <small className="text-dark fw-bold ms-2">
                        Score: 8.5/10
                      </small>
                    </div>
                  </div>
                  <Link
                    href="/submit-review"
                    className="btn btn-sm btn-primary"
                  >
                    Review Model
                  </Link>
                </div>

                {/* Reviewer Badges */}
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Top Reviewers</small>
                    <div className="badges">
                      <span className="badge bg-soft-primary rounded-pill me-1">
                        <FiAward /> AI Auditor
                      </span>
                      <span className="badge bg-soft-warning rounded-pill">
                        <FiUsers /> Trusted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reputation CTA */}
            <div className="text-center mt-3">{renderBottomContent()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
