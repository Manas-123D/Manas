import type { TeamMember } from "../data/team";
import "./TeamCard.css";

interface TeamCardProps {
  member: TeamMember;
}

/** Photo + name + designation always visible; hovering (or focusing, for keyboard users) the photo raises an overlay with what they do. */
export function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="team-card" tabIndex={0}>
      <div className="team-card-photo">
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} />
        ) : (
          <div
            className="team-card-avatar"
            style={{ background: `linear-gradient(145deg, ${member.colors[0]}, ${member.colors[1]})` }}
          >
            {member.initials}
          </div>
        )}

        <div className="team-card-overlay">
          <div>
            <span className="eyebrow" style={{ marginBottom: 8 }}>
              What {member.name.split(" ")[0]} does
            </span>
            <p>{member.bio}</p>
          </div>
        </div>
      </div>

      <div className="team-card-info">
        <h3>{member.name}</h3>
        <p className="team-card-role" style={{ color: member.colors[0] }}>
          {member.role}
        </p>
      </div>
    </div>
  );
}
