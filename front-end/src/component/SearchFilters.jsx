import React, { useState } from "react";
export default function SearchFilters() {
    const [keywords, setKeywords] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [author, setAuthor] = useState("");
    const [level, setLevel] = useState("");
    const [contentTypes, setContentTypes] = useState({
        video: false,
        article: false,
        quiz: false,
        course: false,
        book: false
    });
    const [duration, setDuration] = useState("");
    const [saved, setSaved] = useState(false);

    function toggleContentType(type) {
        setContentTypes(prev => ({ ...prev, [type]: !prev[type] }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const selectedContent = Object.keys(contentTypes).filter(type => contentTypes[type]);
        const filters = {
        keywords: keywords.trim() || null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        author: author.trim() || null,
        level: level || null,
        contentTypes: selectedContent,
        duration: duration || null,
        savedAt: new Date().toISOString() //this saved logic lets the user save the search filters with a timestamp
        };
        console.log("Applied Filters:", filters);
        try {
            localStorage.setItem("s_f", JSON.stringify(filters)); //search filters
            sessionStorage.setItem("s_f_r", JSON.stringify(filters)); //search filters for current session
            setSaved(true);
            setTimeout(() => setSaved(false), 10000); //reset saved after 10 secs
            //FLASK CODE GOES HERE!!!
            alert("Filters saved successfully!");
            console.log("Filters saved to localStorage:", filters);
        } catch (err) {
            console.error("Error saving filters:", err);
            alert("Failed to save filters. Please try again.");
        }
        }
    function resetFilters() {
        setKeywords("");
        setDateFrom("");
        setDateTo("");
        setAuthor("");
        setLevel("");
        setContentTypes({
            video: false,
            article: false,
            quiz: false,
            book: false
        });
        setDuration("");
        try{
            localStorage.removeItem("s_f");
            localStorage.removeItem("s_f_r");
        } catch {}
    }
    return (
    <section className="search-filters" aria-labelledby="filters-H"> 
      <h2 id="filters-H">Search Filters</h2>

      <form className="filters-form" onSubmit={handleSubmit}>
        <label>
          Keywords / Tags
          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., machine learning" />
        </label>

        <div className="row">
          <label>
            Date From
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </label>
          <label>
            Date To
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </label>
        </div>

        <label>
          Author / Instructor
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., Werner Heisenberg" />
        </label>

        <label>
          Level
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Any</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <fieldset>
          <legend>Content Type</legend>
          <label>
            <input type="checkbox" checked={contentTypes.video} onChange={() => toggleContentType("video")} />
            Video
          </label>
          <label>
            <input type="checkbox" checked={contentTypes.article} onChange={() => toggleContentType("article")} />
            Article
          </label>
          <label>
            <input type="checkbox" checked={contentTypes.quiz} onChange={() => toggleContentType("quiz")} />
            Quiz
          </label>
          <label>
            <input type="checkbox" checked={contentTypes.book} onChange={() => toggleContentType("book")} />
            Book
          </label>
          <label>
            Courses
            <input type="checkbox" checked={contentTypes.course} onChange={() => toggleContentType("course")} />
          </label>
        </fieldset>

        <label>
          Duration
          <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 30 minutes" />
        </label>

        <div className="controls">
          <button type="submit" className="apply-btn">Save Filters</button>
          <button type="button" className="reset-btn" onClick={resetFilters}>Reset Filters</button>
        </div>
        {saved && <div className="save-note">Filters saved locally</div>}
      </form>
    </section>
  );
}