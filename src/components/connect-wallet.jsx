import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

export default function ConnectWallet({ navlight }) {
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
                  <>
                    {navlight ? (
                      <span>
                        <span className="btn-icon-dark">
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="btn btn-icon btn-pills btn-light"
                            style={{
                              border: 'none',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <Wallet className="fs-6" />
                          </button>
                        </span>
                        <span className="btn-icon-light">
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="btn btn-icon btn-pills btn-light"
                            style={{
                              border: 'none',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <Wallet className="fs-6" />
                          </button>
                        </span>
                      </span>
                    ) : (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="btn btn-icon btn-pills btn-light"
                        style={{
                          border: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <Wallet className="fs-6" />
                      </button>
                    )}
                  </>
                );
              }

              if (chain.unsupported) {
                return (
                  <>
                    {navlight ? (
                      <span>
                        <span className="btn-icon-dark">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="btn btn-icon btn-pills btn-light"
                            style={{
                              border: 'none',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <Wallet className="fs-6" />
                          </button>
                        </span>
                        <span className="btn-icon-light">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="btn btn-icon btn-pills btn-light"
                            style={{
                              border: 'none',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <Wallet className="fs-6" />
                          </button>
                        </span>
                      </span>
                    ) : (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="btn btn-icon btn-pills btn-light"
                        style={{
                          border: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <Wallet className="fs-6" />
                      </button>
                    )}
                  </>
                );
              }

              return (
                <>
                  {navlight ? (
                    <span>
                      <span className="btn-icon-dark">
                        <button
                          onClick={openAccountModal}
                          className="btn btn-icon btn-pills btn-light"
                          style={{
                            border: 'none',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                          type="button"
                        >
                          <Wallet className="fs-6" />
                        </button>
                      </span>
                      <span className="btn-icon-light">
                        <button
                          onClick={openAccountModal}
                          className="btn btn-icon btn-pills btn-light"
                          style={{
                            border: 'none',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                          type="button"
                        >
                          <Wallet className="fs-6" />
                        </button>
                      </span>
                    </span>
                  ) : (
                    <button
                      onClick={openAccountModal}
                      className="btn btn-icon btn-pills btn-light"
                      style={{
                        border: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                      type="button"
                    >
                      <Wallet className="fs-6" />
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}