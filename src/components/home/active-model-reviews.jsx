"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const TinySlider = dynamic(() => import("tiny-slider-react"), { ssr: false });
import "tiny-slider/dist/tiny-slider.css";

import {
  FiArrowRight,
  FiShield,
  FiUsers,
  FiClock,
} from "../../assets/icons/vander";

const activeModelsData = [
  {
    id: 1,
    name: "GPT-Guard v2.1",
    submitter: "0x1234...5678",
    submitterAvatar: "/images/client/01.jpg",
    summary: "Advanced content moderation model with bias detection",
    status: 0,
    reviewCount: 12,
    averageSeverity: 2.3,
    timeLeft: "2 days 14 hours",
    progress: 65,
    ipfsHash: "QmXxx...",
  },
  {
    id: 2,
    name: "SafeGen AI",
    submitter: "0xabcd...efgh",
    submitterAvatar: "/images/client/02.jpg",
    summary: "Ethical text generation with built-in safety checks",
    status: 0,
    reviewCount: 8,
    averageSeverity: 1.8,
    timeLeft: "1 day 8 hours",
    progress: 80,
    ipfsHash: "QmYyy...",
  },
  {
    id: 3,
    name: "BiasShield Pro",
    submitter: "0x9876...5432",
    submitterAvatar: "/images/client/03.jpg",
    summary: "Detects and mitigates algorithmic bias in ML models",
    status: 0,
    reviewCount: 15,
    averageSeverity: 3.1,
    timeLeft: "3 days 2 hours",
    progress: 45,
    ipfsHash: "QmZzz...",
  },
  {
    id: 4,
    name: "ToxicityFilter AI",
    submitter: "0x5555...6666",
    submitterAvatar: "/images/client/04.jpg",
    summary: "Real-time toxicity detection for online platforms",
    status: 0,
    reviewCount: 20,
    averageSeverity: 1.5,
    timeLeft: "12 hours",
    progress: 90,
    ipfsHash: "QmAaa...",
  },
  {
    id: 5,
    name: "FairRank Algorithm",
    submitter: "0x7777...8888",
    submitterAvatar: "/images/client/05.jpg",
    summary: "Ensures fair ranking in recommendation systems",
    status: 0,
    reviewCount: 6,
    averageSeverity: 2.0,
    timeLeft: "2 days 20 hours",
    progress: 30,
    ipfsHash: "QmBbb...",
  },
];

export default function ActiveModelReviews() {
  const settings = {
    container: ".tiny-model-review-slider",
    controls: true,
    mouseDrag: true,
    loop: true,
    rewind: true,
    autoplay: true,
    autoplayButtonOutput: false,
    autoplayTimeout: 4000,
    navPosition: "bottom",
    controlsText: [
      '<i class="mdi mdi-chevron-left "></i>',
      '<i class="mdi mdi-chevron-right"></i>',
    ],
    nav: false,
    speed: 400,
    gutter: 20,
    responsive: {
      992: {
        items: 3,
      },
      767: {
        items: 2,
      },
      320: {
        items: 1,
      },
    },
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return "success";
    if (severity <= 3) return "warning";
    return "danger";
  };

  const getSeverityLabel = (severity) => {
    if (severity <= 2) return "Low Risk";
    if (severity <= 3) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="container">
      <div className="row align-items-end mb-4 pb-2">
        <div className="col-md-8">
          <div className="section-title">
            <h4 className="title mb-2">Active Model Reviews</h4>
            <p className="text-muted mb-0">
              AI models currently under community review
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="text-end d-md-block d-none">
            <Link
              href="/models/under-review"
              className="btn btn-link primary text-dark"
            >
              View All <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mt-3">
          <div className="tiny-model-review-slider">
            <TinySlider settings={settings}>
              {activeModelsData.map((model, index) => {
                return (
                  <div className="tiny-slide" key={index}>
                    <div className="card model-review-card rounded-md shadow overflow-hidden mx-2 my-3">
                      {/* Review Timer Banner */}
                      <div className="bg-soft-primary text-center py-2">
                        <small className="text-primary fw-bold">
                          <FiClock className="me-1" /> {model.timeLeft} left
                        </small>
                      </div>

                      <div className="card-body p-4">
                        {/* Model Header */}
                        <div className="d-flex align-items-center mb-3">
                          <Image
                            src={model.submitterAvatar}
                            width={40}
                            height={40}
                            className="avatar avatar-sm rounded-circle shadow"
                            alt="submitter"
                          />
                          <div className="ms-3 flex-1">
                            <h6 className="mb-0">
                              <Link
                                href={`/model/${model.id}`}
                                className="text-dark"
                              >
                                {model.name}
                              </Link>
                            </h6>
                            <small className="text-muted">
                              by {model.submitter}
                            </small>
                          </div>
                        </div>

                        {/* Model Summary */}
                        <p
                          className="text-muted small mb-3"
                          style={{ minHeight: "48px" }}
                        >
                          {model.summary}
                        </p>

                        {/* Review Progress */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">
                              Review Progress
                            </small>
                            <small className="text-dark fw-bold">
                              {model.progress}%
                            </small>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: `${model.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <div className="bg-soft-primary rounded p-2 text-center">
                              <FiUsers className="text-primary mb-1" />
                              <p className="mb-0 fw-bold">
                                {model.reviewCount}
                              </p>
                              <small className="text-muted">Reviews</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              className={`bg-soft-${getSeverityColor(
                                model.averageSeverity
                              )} rounded p-2 text-center`}
                            >
                              <FiShield
                                className={`text-${getSeverityColor(
                                  model.averageSeverity
                                )} mb-1`}
                              />
                              <p className="mb-0 fw-bold">
                                {model.averageSeverity.toFixed(1)}
                              </p>
                              <small className="text-muted">Risk Score</small>
                            </div>
                          </div>
                        </div>

                        {/* Risk Level Badge */}
                        <div className="text-center mb-3">
                          <span
                            className={`badge bg-soft-${getSeverityColor(
                              model.averageSeverity
                            )} text-${getSeverityColor(
                              model.averageSeverity
                            )} rounded-pill px-3`}
                          >
                            {getSeverityLabel(model.averageSeverity)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "grid", gap: "0.5rem" }}>
                          <Link
                            href={`/model/${model.id}`}
                            style={{
                              backgroundColor: "#e7f1ff",
                              color: "#2d6cdf",
                              border: "none",
                              borderRadius: "0.25rem",
                              padding: "0.375rem 0.75rem",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              textAlign: "center",
                              textDecoration: "none",
                              transition: "background 0.2s, color 0.2s",
                              cursor: "pointer",
                              display: "inline-block"
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TinySlider>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="text-center d-md-none d-block">
            <Link
              href="/models/under-review"
              className="btn btn-link primary text-dark"
            >
              View All <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
