"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import ConnectWallet from "./connect-wallet";
import { useUser } from "../hooks/useUser";
import { AiOutlineUser } from "../assets/icons/vander";

export default function Navbar({ navlight, gradient }) {
  let [manu, setManu] = useState();
  let [toggle, setToggle] = useState(false);
  let [scrolling, setScrolling] = useState(false);
  const { data: userData, isLoading } = useUser();
  const { isConnected } = useAccount();

  const profilePictureUrl = userData?.identity?.profile?.profilePictureUrl;

  let pathname = usePathname();
  let current = pathname;

  useEffect(() => {
    setManu(current);

    const handleScroll = () => {
      const isScrolling = window.scrollY > 50;
      setScrolling(isScrolling);
    };

    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [current]);

  if (isLoading) {
    return (
      <header
        id="topnav"
        className={`defaultscroll sticky ${scrolling ? "nav-sticky" : ""} ${
          gradient ? "gradient" : ""
        }`}
      >
        <div className="container">
          {navlight ? (
            <Link className="logo" href="/">
              <span className="logo-light-mode">
                <Image
                  src="/images/logo-full-dark.png"
                  width={120}
                  height={50}
                  className="l-dark"
                  alt=""
                />
                <Image
                  src="/images/logo-full-light.png"
                  width={120}
                  height={50}
                  className="l-light"
                  alt=""
                />
              </span>
              <Image
                src="/images/logo-full-light.png"
                width={120}
                height={50}
                className="logo-dark-mode"
                alt=""
              />
            </Link>
          ) : (
            <Link className="logo" href="/">
              <Image
                src="/images/logo-full-dark.png"
                width={120}
                height={50}
                className="logo-light-mode"
                alt=""
              />
              <Image
                src="/images/logo-full-light.png"
                width={120}
                height={50}
                className="logo-dark-mode"
                alt=""
              />
            </Link>
          )}

          <div className="menu-extras">
            <div className="menu-item">
              <Link
                href="#"
                className={`navbar-toggle ${toggle ? "open" : ""}`}
                id="isToggle"
                onClick={(e) => {
                  setToggle(!toggle);
                }}
              >
                <div className="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Link>
            </div>
          </div>

          <ul className="buy-button list-inline mb-0">
            <li className="list-inline-item mb-0 me-2">
              <ConnectWallet />
            </li>
          </ul>

          <div id="navigation" style={{ display: toggle ? "block" : "none" }}>
            <ul
              className={`navigation-menu nav-left ${
                navlight ? "nav-light" : ""
              }`}
            >
              <li className={manu === "/submit" ? "active" : ""}>
                <Link href="/submit" className="sub-menu-item">
                  Submit Model
                </Link>
              </li>

              <li className={manu === "/explore-model" ? "active" : ""}>
                <Link href="/explore" className="sub-menu-item">
                  Explore Model
                </Link>
              </li>

              <li className={manu === "/profile" ? "active" : ""}>
                <Link href="/profile" className="sub-menu-item">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      id="topnav"
      className={`defaultscroll sticky ${scrolling ? "nav-sticky" : ""} ${
        gradient ? "gradient" : ""
      }`}
    >
      <div className="container">
        {navlight ? (
          <Link className="logo" href="/">
            <span className="logo-light-mode">
              <Image
                src="/images/logo-full-dark.png"
                width={80}
                height={43}
                className="l-dark"
                alt=""
              />
              <Image
                src="/images/logo-full-light.png"
                width={80}
                height={43}
                className="l-light"
                alt=""
              />
            </span>
            <Image
              src="/images/logo-full-light.png"
              width={80}
              height={43}
              className="logo-dark-mode"
              alt=""
            />
          </Link>
        ) : (
          <Link className="logo" href="/">
            <Image
              src="/images/logo-full-dark.png"
              width={80}
              height={43}
              className="logo-light-mode"
              alt=""
            />
            <Image
              src="/images/logo-full-light.png"
              width={80}
              height={43}
              className="logo-dark-mode"
              alt=""
            />
          </Link>
        )}

        <div className="menu-extras">
          <div className="menu-item">
            <Link
              href="#"
              className={`navbar-toggle ${toggle ? "open" : ""}`}
              id="isToggle"
              onClick={(e) => {
                setToggle(!toggle);
              }}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          </div>
        </div>

        <ul className="buy-button list-inline mb-0">
          <li className="list-inline-item mb-0 me-2">
            <ConnectWallet navlight={navlight} />
          </li>
          {isConnected && (
            <li className="list-inline-item mb-0">
              {profilePictureUrl ? (
                <div className="position-relative d-inline-block" style={{ width: 36, height: 36 }}>
                  <Image
                    src={profilePictureUrl}
                    width={72}
                    height={72}
                    className="rounded-pill avatar avatar-sm-sm"
                    alt="Profile"
                    style={{ objectFit: 'cover', width: '36px', height: '36px' }}
                    unoptimized={true}
                    quality={100}
                  />
                </div>
              ) : (
                <div className="rounded-pill avatar avatar-sm-sm d-flex align-items-center justify-content-center bg-light">
                  <AiOutlineUser className="text-muted" size={20} />
                </div>
              )}
            </li>
          )}
        </ul>

        <div id="navigation" style={{ display: toggle ? "block" : "none" }}>
          <ul
            className={`navigation-menu nav-left ${
              navlight ? "nav-light" : ""
            }`}
          >
            <li className={manu === "/submit" ? "active" : ""}>
              <Link href="/submit" className="sub-menu-item">
                Submit Model
              </Link>
            </li>

            <li className={manu === "/explore-model" ? "active" : ""}>
              <Link href="/explore" className="sub-menu-item">
                Explore Model
              </Link>
            </li>

                <li className={manu === "/profile" ? "active" : ""}>
                  <Link href="/profile" className="sub-menu-item">
                    Profile
                  </Link>
                </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
