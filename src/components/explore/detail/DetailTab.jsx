import { formatDate, formatAddress } from "../../../utils/utils"
import { FaExternalLinkAlt as ExternalLinkIcon } from "react-icons/fa"
import { FaInfoCircle as InfoIcon } from "react-icons/fa"
import { FaUserCircle as UserIcon } from "react-icons/fa"

export default function DetailTab({ modelData }) {
  return (
    <div>
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <h3 className="mb-0 fw-bold">Technical Details</h3>
            </div>
            <div className="bg-light rounded-4 p-4 border">
              <pre
                className="mb-0 text-dark"
                style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
              >
                {modelData.metadata?.modelDetails || "No technical details available"}
              </pre>
            </div>
          </div>

          {modelData.metadata?.link && (
            <div className="text-center">
              <a
                href={modelData.metadata.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg rounded-pill px-5 py-3 fw-semibold shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <ExternalLinkIcon className="me-2" />
                View Model
              </a>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4 bg-light">
            <div className="card-header bg-transparent py-4 border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <InfoIcon className="me-2" />
                Model Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <small className="text-muted d-block mb-1 text-uppercase fw-semibold">Category</small>
                <p className="mb-0 fw-medium fs-6">{modelData.metadata?.category || "N/A"}</p>
              </div>
              <div className="mb-4">
                <small className="text-muted d-block mb-1 text-uppercase fw-semibold">
                  Submitted
                </small>
                <p className="mb-0 fw-medium fs-6">{formatDate(modelData.submissionTime)}</p>
              </div>
              <div className="mb-4">
                <small className="text-muted d-block mb-1 text-uppercase fw-semibold">
                  Review End
                </small>
                <p className="mb-0 fw-medium fs-6">{formatDate(modelData.reviewEndTime)}</p>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm bg-light">
            <div className="card-header bg-transparent py-4 border-bottom">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <UserIcon className="me-2" />
                Submitter
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div>
                  <h6 className="mb-1 fw-bold">
                    {modelData.submitter?.profile?.name || formatAddress(modelData.submitter?.owner)}
                  </h6>
                  <small className="text-muted font-monospace">
                    {formatAddress(modelData.submitter?.owner)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
