"use client";

import { useState } from "react";
import Select from "react-select";
import { useAnalytics } from "../../hooks/useModelData";

export default function ModelFilterForm({ onFilterChange }) {
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
  });

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const statusOptions = [
    { value: "all", label: "All Models" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved Models" },
    { value: "flagged", label: "Flagged Models" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "safety", label: "Safety & Security" },
    { value: "fairness", label: "Fairness & Bias" },
    { value: "privacy", label: "Privacy Protection" },
    { value: "ethics", label: "Ethics & Values" },
    { value: "transparency", label: "Transparency" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f8f9fa",
      border: "none",
      borderRadius: "8px",
      minHeight: "50px",
      width: "100%",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(102, 126, 234, 0.1)"
        : "none",
      "&:hover": {
        borderColor: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6c757d",
      fontSize: "15px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#2c3e50",
      fontSize: "15px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#667eea"
        : state.isFocused
        ? "#f0f0f0"
        : "white",
      color: state.isSelected ? "white" : "#2c3e50",
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "15px",
    }),
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="filter-container">
        <div className="row g-3">
          <div className="col-lg-6 col-md-6">
            <div className="filter-item">
              <Select
                options={statusOptions}
                styles={customStyles}
                placeholder="Model Status"
                value={statusOptions.find(
                  (opt) => opt.value === filters.status
                )}
                onChange={(selected) =>
                  handleFilterChange("status", selected.value)
                }
                isSearchable={false}
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="filter-item">
              <Select
                options={categoryOptions}
                styles={customStyles}
                placeholder="Category"
                value={categoryOptions.find(
                  (opt) => opt.value === filters.category
                )}
                onChange={(selected) =>
                  handleFilterChange("category", selected.value)
                }
                isSearchable={false}
              />
            </div>
          </div>
        </div>

        <div className="filter-stats">
          <div className="stat-item">
            <span className="stat-label">Total Models:</span>
            <span className="stat-value">
              {analyticsLoading ? "..." : analytics?.models?.total || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Under Review:</span>
            <span className="stat-value text-info">
              {analyticsLoading ? "..." : analytics?.models?.underReview || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approved:</span>
            <span className="stat-value text-success">
              {analyticsLoading ? "..." : analytics?.models?.approved || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Flagged:</span>
            <span className="stat-value text-warning">
              {analyticsLoading ? "..." : analytics?.models?.flagged || 0}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .filter-container {
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -8px;
        }

        .g-3 > * {
          padding: 8px;
        }

        .col-lg-3 {
          flex: 0 0 25%;
          max-width: 25%;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        .filter-item {
          position: relative;
          width: 100%;
          margin-left: 0 !important;
        }

        .filter-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 18px;
          z-index: 10;
          pointer-events: none;
        }

        .filter-item :global(.css-13cymwt-control) {
          width: 100% !important;
        }

        .filter-item :global(.css-t3ipsp-control) {
          width: 100% !important;
        }

        .filter-input {
          width: 100%;
          background-color: #f8f9fa;
          border: none;
          border-radius: 8px;
          height: 50px;
          font-size: 15px;
          color: #2c3e50;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .filter-input:focus {
          background-color: white;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
          outline: none;
        }

        .filter-input::placeholder {
          color: #6c757d;
        }

        .filter-stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e9ecef;
          gap: 16px;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .filter-item :global(.css-b62m3t-container) {
          width: 100% !important;
          margin-left: 0 !important;
        }

        .stat-label {
          display: block;
          font-size: 13px;
          color: #6c757d;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1.2;
        }

        .stat-value.text-success {
          color: #28a745;
        }

        .stat-value.text-warning {
          color: #ff9800;
        }

        @media (max-width: 992px) {
          .col-lg-3 {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        @media (max-width: 768px) {
          .filter-container {
            padding: 16px;
          }

          .col-lg-3,
          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }

          .filter-stats {
            flex-wrap: wrap;
            gap: 12px;
          }

          .stat-item {
            flex: 0 0 calc(50% - 6px);
            min-width: calc(50% - 6px);
          }

          .stat-value {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .filter-stats {
            gap: 8px;
          }

          .stat-item {
            flex: 0 0 100%;
            min-width: 100%;
            margin-bottom: 8px;
          }

          .stat-label {
            font-size: 12px;
          }

          .stat-value {
            font-size: 16px;
          }
        }
      `}</style>
    </form>
  );
}
