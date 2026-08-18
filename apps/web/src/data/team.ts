export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  colors: readonly [string, string];
  /** Drop a real photo at public/team/<file> and set this to "/team/<file>" — falls back to a gradient initials avatar until then. */
  photoUrl?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Manas Devaguptapu",
    role: "Founder & CEO",
    bio: "Sets the product vision and drives where NexServ goes next — from the first line of code to the roadmap ahead.",
    initials: "MD",
    colors: ["#38BDF8", "#B565F0"],
  },
  {
    name: "Ayyappa Teegela",
    role: "CTO",
    bio: "Owns the technology behind every service — the platform, Myra's intelligence, and the systems that keep it all reliable.",
    initials: "AT",
    colors: ["#3D5FFF", "#5FA8FF"],
  },
  {
    name: "Chandu Guntupalli",
    role: "COO",
    bio: "Runs the day-to-day — partners, operations and making sure every ride, order and visit shows up on time.",
    initials: "CG",
    colors: ["#1D8577", "#3BD6C6"],
  },
];
