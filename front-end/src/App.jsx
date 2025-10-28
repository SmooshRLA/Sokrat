import React, {useState, useEffect} from "react";
import PopularTopics from "./component/PopularTopics";
import SearchFilters from "./component/SearchFilters";
import "./App.css";
import Tabs from "./component/Tabs";

export default function App() {
  const tabFromPath = () => 
  typeof window !== 'undefined' && window.location.pathname === "/search" ? "search" : "home";  
  const [activeTab, setActiveTab] = useState(tabFromPath());

  useEffect(() => {
    const onPop = () => setActiveTab(tabFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const path = tab === "search" ? "/search" : "/";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
  }
    window.scrollTo(0, 0);
  };


  const handleSearch = (query) => {
    const randomHash = Math.random().toString(36).substring(2, 10);
    const cache = JSON.parse(localStorage.getItem("cr_cache") || "{}");
    cache[randomHash] = { query, created: Date.now() };
    localStorage.setItem("cr_cache", JSON.stringify(cache));

    window.location.href = `/course/${randomHash}`;
  };

  return (
    <div className = {`base ${activeTab === "search" ? "search-active" : ""} `}>
    <Tabs active={activeTab} onTabChange={handleTabChange} />
    <div className="app-container">
      <img src="/images/Sokrat2.png" alt="ballinSoc"/>
      <div className="search-wrapper">
        {activeTab === "search" ? <SearchFilters /> : <PopularTopics onSearch={handleSearch} />}
      </div>
    </div>
    </div>
  );
}