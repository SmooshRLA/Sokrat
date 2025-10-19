import React from "react";
import PopularTopics from "./component/PopularTopics";
import "./App.css";

export default function App() {
  const handleSearch = (query) => {
    const randomHash = Math.random().toString(36).substring(2, 10);
    const cache = JSON.parse(localStorage.getItem("cr_cache") || "{}");
    cache[randomHash] = { query, created: Date.now() };
    localStorage.setItem("cr_cache", JSON.stringify(cache));

    window.location.href = `/course/${randomHash}`;
  };

  return (
    <div className="app-container">
      <img src="/images/Sokrat2.png" alt="ballinSoc"/>
      <div className="search-wrapper">
        <PopularTopics onSearch={handleSearch} />
      </div>
    </div>
  );
}