import "../css/Navbar.css";
import { GlowingEffect } from "./GlowingEffect";
import "../css/GlowingEffect.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-icon">🎬</span>
                <Link to="/" className="brand-name">MoviesInfo</Link>
            </div>

            <div className="navbar-links">
                <Link to="/" className={`nav-link ${location.pathname === "/" && !location.search ? "active" : ""}`}>Home</Link>
                <Link to="/favorites" className={`nav-link ${location.pathname === "/favorites" ? "active" : ""}`}>Favorites</Link>
            </div>

            <form className="navbar-search" onSubmit={handleSearch}>
                <GlowingEffect disabled={false} spread={40} borderWidth={2} />
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="navbar-search-input"
                    placeholder="Search titles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button
                        type="button"
                        className="navbar-search-clear"
                        onClick={() => { setQuery(""); navigate("/"); }}
                    >✕</button>
                )}
            </form>
        </nav>
    );
}

export default Navbar;