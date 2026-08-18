import { LogoMark } from "./LogoMark";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              <LogoMark size={24} />
              NexServ
            </div>
            <p className="footer-tagline">One app for every everyday service — orchestrated by your AI companion, Myra.</p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <div className="footer-col-title">Services</div>
              <span>NexRide</span>
              <span>NexFood</span>
              <span>NexMeds</span>
              <span>NexHome</span>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="/about">About us</a>
              <span>Careers</span>
              <span>Press</span>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NexServ. All rights reserved.</span>
          <span>Built with Myra.</span>
        </div>
      </div>
    </footer>
  );
}
