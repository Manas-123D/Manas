import { Reveal } from "../components/Reveal";
import { TeamCard } from "../components/TeamCard";
import { TEAM } from "../data/team";
import "./Home.css";
import "./About.css";

const VALUES = [
  { num: "01", title: "Real, not simulated", desc: "Every booking, price and ETA in NexServ comes from a live system — never a placeholder." },
  { num: "02", title: "One companion, not four apps", desc: "Myra is the same intelligence across every service, so context never resets." },
  { num: "03", title: "Built to be trusted", desc: "Your data personalizes Myra and is never used for anything else." },
];

export function About() {
  return (
    <>
      <section className="about-hero">
        <div className="grid-texture" />
        <div className="container">
          <Reveal>
            <span className="eyebrow">About NexServ</span>
            <h1>We're building the AI companion that runs your everyday errands.</h1>
            <p>Three people, one belief: getting through the day shouldn't mean juggling four different apps for four different services.</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="story-grid">
            <Reveal>
              <h2>Our story</h2>
            </Reveal>
            <Reveal delay={0.1} className="story-copy">
              <p>
                NexServ started from a simple annoyance: booking a ride, ordering dinner, refilling a prescription
                and calling an electrician all meant four different apps, four different logins, and zero memory of
                what you did yesterday.
              </p>
              <p>
                We wanted one place that actually knew you — where your commute, your usual order, and the fact
                that your prescription runs out every 28 days weren't things you had to re-enter every time.
                That's what became Myra: not a chatbot bolted onto a services app, but the thing that orchestrates
                every service underneath her.
              </p>
              <p>
                We're still early. NexRide, NexFood, NexMeds and NexHome are live, Myra is learning, and the three
                of us are building in the open, one real feature at a time.
              </p>

              <div className="story-values">
                {VALUES.map((v) => (
                  <div className="story-value" key={v.num}>
                    <div className="story-value-num">{v.num}</div>
                    <h4>{v.title}</h4>
                    <p>{v.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">The team</span>
            <h2>Three people building NexServ</h2>
            <p>Hover a card to see what each of us actually does day to day.</p>
          </Reveal>

          <div className="team-grid">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <div className="cta-band" id="get-app">
          <span className="eyebrow">Join us early</span>
          <h2>Come build the everyday AI companion with us.</h2>
          <p>NexServ is small on purpose, for now. Try the app and tell us what Myra should do next.</p>
          <div className="cta-actions">
            <a href="#" className="pill-btn primary">
              Get the app
            </a>
            <a href="/" className="pill-btn">
              Back to home
            </a>
          </div>
        </div>
      </Reveal>
    </>
  );
}
