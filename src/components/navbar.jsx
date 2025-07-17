"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useUser, hasIdentityAndVerified } from "../hooks/useUser";
import ConnectWallet from "./connect-wallet";

export default function Navbar({ navlight, gradient }) {
  let [manu, setManu] = useState();
  let [toggle, setToggle] = useState(false);
  let [scrolling, setScrolling] = useState(false);

  let pathname = usePathname();
  let current = pathname;

  const { isConnected } = useAccount();
  const { data: userData } = useUser();

  const isUserVerified =
    isConnected && userData && hasIdentityAndVerified(userData);

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

  return (
    <header
      id="topnav"
      className={`defaultscroll sticky ${scrolling ? "nav-sticky" : ""} ${
        gradient ? "gradient" : ""
      }`}
    >
      <div className="container">
        {/* Logo */}
        {navlight ? (
          <Link className="logo" href="/">
            <span className="logo-light-mode">
              <Image
                src="/images/logo-full-dark.png"
                width={120}
                height={35}
                className="l-dark"
                alt=""
              />
              <Image
                src="/images/logo-full-light.png"
                width={120}
                height={35}
                className="l-light"
                alt=""
              />
            </span>
            <Image
              src="/images/logo-full-light.png"
              width={120}
              height={35}
              className="logo-dark-mode"
              alt=""
            />
          </Link>
        ) : (
          <Link className="logo" href="/">
            <Image
              src="/images/logo-full-dark.png"
              width={120}
              height={35}
              className="logo-light-mode"
              alt=""
            />
            <Image
              src="/images/logo-full-light.png"
              width={120}
              height={35}
              className="logo-dark-mode"
              alt=""
            />
          </Link>
        )}

        {/* Mobile Menu Toggle */}
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

        {/* Custom Wallet Connect Button */}
        <ul className="buy-button list-inline mb-0">
          <li className="list-inline-item mb-0">
            <ConnectWallet />
          </li>
        </ul>

        {/* Navigation Menu */}
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

            <li className={manu === "/governance" ? "active" : ""}>
              <Link href="/governance" className="sub-menu-item">
                Governance
              </Link>
            </li>

            {isUserVerified && (
              <li className={manu === "/profile" ? "active" : ""}>
                <Link href="/profile" className="sub-menu-item">
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
