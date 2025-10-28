import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  function goToNextApp({ query, dateFrom, dateTo, level, subject, contentTypes, duration }) {
  // base URL of the Next app search page
  const target = new URL("http://localhost:3000/search");

  // basic query param
  if (query) target.searchParams.set("q", query);

  // add simple filters as params (only add if set)
  if (dateFrom) target.searchParams.set("dateFrom", dateFrom);
  if (dateTo) target.searchParams.set("dateTo", dateTo);
  if (level) target.searchParams.set("level", level);
  if (subject) target.searchParams.set("subject", subject);
  if (duration) target.searchParams.set("duration", duration);

  // contentTypes is an array or comma list; convert if needed
  if (contentTypes && contentTypes.length) {
    target.searchParams.set("contentTypes", contentTypes.join(","));
  }

  // navigate in the same tab:
  window.location.href = target.toString();

  

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search any topic..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="icon" className="search-btn">Search</button>
    </form>
  );
}

}