import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

export default function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="btn btn-pills d-inline-flex align-items-center"
                    style={{
                      border: 'none',
                      background: '#4072c2',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Wallet className="me-2" style={{ animation: 'pulse 2s infinite' }} />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="btn btn-pills"
                    style={{
                      border: 'none',
                      background: '#4072c2',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="d-flex flex-column flex-md-row gap-3">
                  <button
                    onClick={openAccountModal}
                    className="btn btn-pills"
                    style={{
                      border: 'none',
                      background: '#4072c2',
                      transition: 'all 0.3s ease',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}