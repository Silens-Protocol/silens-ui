import React from "react";
import Link from "next/link";
import Image from "next/image";

import HeroSectionOne from "../components/home/hero-section-one";
import Navbar from "../components/navbar";
import ActiveModelReviews from "../components/home/active-model-reviews";
import ApprovedModels from "../components/home/approved-models";
import ActiveGovernanceProposals from "../components/home/active-proposal";
import Footer from "../components/footer";

import { FiArrowRight } from "../assets/icons/vander";

export default function Home() {
  return (
    <>
      <Navbar navlight={true} />
      <HeroSectionOne />

      <section className="section">
        <ActiveModelReviews />

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center">
            <div className="col">
              <div className="section-title text-center mb-4 pb-2">
                <h4 className="title mb-4">Community-Approved AI Models</h4>
                <p className="text-muted para-desc mb-0 mx-auto">
                  Explore AI models that have passed rigorous community review
                  and governance voting. Each model is thoroughly tested for
                  safety, fairness, and transparency.
                </p>
              </div>
            </div>
          </div>

          <ApprovedModels />
        </div>

        <div className="container-fluid mt-100 mt-60">
          <div className="row px-0">
            <div className="bg-half-100 bg-gradient-primary">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col">
                    <div className="section-title text-center mb-4 pb-2">
                      <h4 className="title text-white title-dark mb-4">
                        Join the fastest growing AI governance community <br /> with more
                        than 500+ reviewed models
                      </h4>
                      <p className="text-white-50 para-desc mb-0 mx-auto">
                        Silens empowers the community to review, audit, and govern AI models through 
                        transparent, reputation-based systems. Build trust in AI together!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mt-4 pt-2">
                    <div className="card p-4 rounded-md shadow bg-white">
                      <h4 className="mb-4">Become a Reviewer</h4>
                      <p className="text-muted mb-0">
                        Join our community of AI auditors and earn reputation badges. 
                        Review models, participate in governance, and help build safer AI.
                      </p>

                      <div className="mt-3">
                        <Link
                          href="/become-reviewer"
                          className="btn btn-link primary text-dark"
                        >
                          Start Reviewing <FiArrowRight className="ms-1" />
                        </Link>
                      </div>
                      <div className="py-4"></div>
                      <div className="position-absolute bottom-0 end-0">
                        <Image
                          src="/images/svg/community.png"
                          width={110}
                          height={110}
                          className="avatar avatar-medium opacity-05"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mt-4 pt-2">
                    <div className="card p-4 rounded-md shadow bg-white">
                      <h4 className="mb-4">Submit Your AI Model</h4>
                      <p className="text-muted mb-0">
                        Have an AI model that needs community review? Submit it to our 
                        governance protocol and get transparent feedback from experts.
                      </p>

                      <div className="mt-3">
                        <Link
                          href="/submit-model"
                          className="btn btn-link primary text-dark"
                        >
                          Submit Model <FiArrowRight className="ms-1" />
                        </Link>
                      </div>
                      <div className="py-4"></div>
                      <div className="position-absolute bottom-0 end-0">
                        <Image
                          src="/images/svg/united.png"
                          width={110}
                          height={110}
                          className="avatar avatar-medium opacity-05"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <ActiveGovernanceProposals />
        </div>

      </section>
      <Footer />
    </>
  );
}
