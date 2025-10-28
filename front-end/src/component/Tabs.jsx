import React, { useEffect } from "react";

export default function Tabs({ active, onTabChange }) {
  // Removed local state—now managed by App.jsx

  useEffect(() => {
    const onPop = () => onTabChange(tabFromPath()); // Call parent's handler on popstate
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onTabChange]);

  const tabFromPath = () =>
    typeof window !== 'undefined' && window.location.pathname === "/search" ? "search" : "home";

  return (
    <nav className="tabs" role="tablist" aria-label="Main tabs">
      <button 
        role="tab"
        className={`tab-btn ${active === "home" ? "active" : ""}`}
        aria-selected={active === "home"}
        onClick={() => onTabChange("home")}
      >
        Home
      </button>

      <button 
        role="tab"
        className={`tab-btn ${active === "search" ? "active" : ""}`}
        aria-selected={active === "search"}
        onClick={() => onTabChange("search")}
      >
        Search
      </button>
    </nav>
  );
}