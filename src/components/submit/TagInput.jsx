import React, { useState } from "react";

export default function TagInput({ tags = [], onChange, maxTags = 3 }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && tags.length < maxTags) {
      // Format tag: convert spaces to hyphens and make lowercase
      const formattedTag = trimmedValue.toLowerCase().replace(/\s+/g, '-');
      
      if (!tags.includes(formattedTag)) {
        onChange([...tags, formattedTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleBlur = () => {
    addTag();
  };

  return (
    <div className="tag-input-container">
      <div className="tag-input-wrapper">
        <div className="tags-display">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(index)}
              >
                <i className="mdi mdi-close"></i>
              </button>
            </span>
          ))}
        </div>
        
        {tags.length < maxTags && (
          <input
            type="text"
            className="tag-input"
            placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : "Add another tag..."}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        )}
      </div>
      
      <div className="tag-hint">
        <i className="mdi mdi-information-outline"></i>
        <span>Press Enter or comma to add tags. Maximum {maxTags} tags allowed.</span>
      </div>

      <style jsx>{`
        .tag-input-container {
          width: 100%;
        }
        
        .tag-input-wrapper {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          min-height: 48px;
          transition: all 0.3s ease;
        }
        
        .tag-input-wrapper:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .tags-display {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 500;
          animation: tagSlideIn 0.2s ease-out;
        }
        
        @keyframes tagSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .tag-remove {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .tag-remove:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .tag-remove i {
          font-size: 12px;
        }
        
        .tag-input {
          flex: 1;
          min-width: 120px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: #2d3748;
          padding: 4px 0;
        }
        
        .tag-input::placeholder {
          color: #a0aec0;
        }
        
        .tag-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 0.8rem;
          color: #718096;
        }
        
        .tag-hint i {
          font-size: 14px;
          color: #a0aec0;
        }
        
        @media (max-width: 768px) {
          .tag-input-wrapper {
            padding: 6px 10px;
            min-height: 44px;
          }
          
          .tag {
            font-size: 0.8rem;
            padding: 3px 6px;
          }
          
          .tag-input {
            min-width: 100px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
} 