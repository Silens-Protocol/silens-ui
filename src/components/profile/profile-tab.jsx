"use client";

import React, { useState } from "react";
import ModelTab from "./model-tab";
import ReviewTab from "./review-tab";
import VoteTab from "./vote-tab";
import { useAccount } from "wagmi";
import { useUser } from "../../hooks/useUser";

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState(1);
  const { isConnected } = useAccount();
  const { data: userData } = useUser();

  const hasIdentityToken = !!userData?.identity?.tokenId;
  const shouldShowTabs = isConnected && hasIdentityToken;

  if (!shouldShowTabs) return null;

  return (
    <div className="container mt-100 mt-60">
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs border-bottom justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                onClick={() => setActiveTab(1)}
              >
                Models
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 2 ? "active" : ""}`}
                onClick={() => setActiveTab(2)}
              >
                Reviews
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 3 ? "active" : ""}`}
                onClick={() => setActiveTab(3)}
              >
                Votes
              </button>
            </li>
          </ul>

          <div className="tab-content mt-4 pt-2">
            {activeTab === 1 && <ModelTab />}
            {activeTab === 2 && <ReviewTab />}
            {activeTab === 3 && <VoteTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
