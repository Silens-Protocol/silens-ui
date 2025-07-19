"use client"

import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRightIcon as FiChevronRight, ArrowUpIcon as FiArrowUp, CheckIcon as FiCheck } from "lucide-react"
import { useAccount } from "wagmi"
import {
  useUser,
  hasIdentityAndVerified,
  hasIdentityButNotVerified,
} from "../hooks/useUser"

export default function Footer() {
  const [visible, setVisible] = useState(false)

  const { isConnected } = useAccount()
  const { data: userData } = useUser()

  const isUserVerified =
    isConnected && userData && hasIdentityAndVerified(userData)
  const isUserConnectedButNotVerified =
    isConnected && userData && hasIdentityButNotVerified(userData)
  const isUserNotConnected = !isConnected

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop
      setVisible(scrolled > 300)
    }

    window.addEventListener("scroll", toggleVisible)
    return () => window.removeEventListener("scroll", toggleVisible)
  }, [])

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderCTA = () => {
    if (isUserNotConnected) {
      return (
        <>
          <div>
            <h5 className="text-light fw-normal title-dark mb-2 mb-md-0">
              Join the AI governance revolution
            </h5>
            <p className="text-white-50 para-desc mb-0">
              Connect with CARV ID to start reviewing AI models and earning reputation badges.
            </p>
          </div>
          <div className="mt-4 mt-md-0">
            <Link
              href="/signup"
              className="btn btn-pills btn-light px-4 py-2 fw-bold"
            >
              Connect CARV ID
            </Link>
          </div>
        </>
      )
    }

    if (isUserConnectedButNotVerified) {
      return (
        <>
          <div>
            <h5 className="text-light fw-normal title-dark mb-2 mb-md-0">
              Complete your verification
            </h5>
            <p className="text-white-50 para-desc mb-0">
              Get verified to start reviewing AI models and earning reputation badges.
            </p>
          </div>
          <div className="mt-4 mt-md-0">
            <Link
              href="/signup"
              className="btn btn-pills btn-light px-4 py-2 fw-bold"
            >
              Get Verified Badge
            </Link>
          </div>
        </>
      )
    }

    if (isUserVerified) {
      return (
        <>
          <div>
            <h5 className="text-light fw-normal title-dark mb-2 mb-md-0">
              You're verified and ready to contribute
            </h5>
            <p className="text-white-50 para-desc mb-0">
              Start reviewing AI models and participating in governance decisions.
            </p>
          </div>
          <div className="mt-4 mt-md-0">
            <div className="d-flex align-items-center">
              <span className="badge bg-success rounded-pill me-3 px-3 py-2">
                <FiCheck className="me-1" style={{ width: '16px', height: '16px' }} />
                Verified Reviewer
              </span>
              <Link
                href="/explore"
                className="btn btn-pills btn-light px-4 py-2 fw-bold"
              >
                Explore Models
              </Link>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <div>
          <h5 className="text-light fw-normal title-dark mb-2 mb-md-0">
            Join the AI governance revolution
          </h5>
          <p className="text-white-50 para-desc mb-0">
            Checking your verification status...
          </p>
        </div>
        <div className="mt-4 mt-md-0">
          <div className="btn btn-pills btn-light px-4 py-2 fw-bold disabled">
            Loading...
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <footer className="bg-footer">
        <div className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                  {renderCTA()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="footer-py-60 footer-border">
                <div className="row g-4">
                  <div className="col-lg-8 mb-4 mb-lg-0">
                    <Link href="/" className="logo-footer d-inline-block">
                      <Image
                        src="/images/logo-full-light.png"
                        width={120}
                        height={65}
                        alt="Silens Logo"
                        priority
                        className="h-8 w-auto"
                      />
                    </Link>
                    <p className="para-desc mb-0 mt-4">
                      Silens empowers the community to review, audit, and govern AI models through transparent,
                      reputation-based systems. Building trust in AI together.
                    </p>
                  </div>

                  <div className="col-lg-4">
                    <h5 className="footer-head">Silens</h5>
                    <ul className="list-unstyled footer-list mt-4">
                      {[
                        { href: "/explore-model", label: "Explore Models" },
                        { href: "/governance", label: "Governance" },
                        { href: "/submit-model", label: "Submit Model" },
                        { href: "/become-reviewer", label: "Become Reviewer" },
                        { href: "/connect-carv-id", label: "Connect CARV ID" },
                      ].map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-foot d-flex align-items-center"
                            style={{ transition: 'color 0.2s ease' }}
                          >
                            <FiChevronRight className="me-2" style={{ width: '16px', height: '16px' }} />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-py-30 footer-bar">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-lg-10 text-center text-sm-start">
                <p className="mb-0">
                  © {new Date().getFullYear()} Silens. Building trust in AI through community governance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Link
        href="#"
        id="back-to-top"
        onClick={scrollToTop}
        className={`back-to-top rounded-pill ${visible ? "show" : ""}`}
        style={{
          display: visible ? "inline-flex" : "none",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Back to top"
      >
        <FiArrowUp />
      </Link>

      <style jsx global>{`
        @media (min-width: 1200px) {
          .container, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
            max-width: 1100px !important;
          }
        }
        footer.bg-footer {
          overflow-x: hidden;
        }
      `}</style>
    </>
  )
}
