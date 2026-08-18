import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import "./Nav.css";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <NavLink to="/" className="nav-brand">
          <LogoMark size={26} />
          NexServ
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            About us
          </NavLink>
        </nav>

        <div className="nav-actions">
          <a href="#get-app" className="pill-btn primary">
            Get the app
          </a>
        </div>
      </div>
    </header>
  );
}
