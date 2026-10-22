"use client";

import { Applicant } from '@/lib/types';
import { GATEKEEPERS } from '@/lib/config';

interface FieldProps {
  applicants: Applicant[];
  onSelectPerson: (person: Applicant) => void;
  selectedPerson: Applicant | null;
}

export default function Field({ applicants, onSelectPerson, selectedPerson }: FieldProps) {
  const zones = {
    arriving: { x: 80, y: 200, label: 'Arrivals' },
    interviewing: { x: 400, y: 150, label: 'The gate\n(one-to-one, in parallel)' },
    needs_human: { x: 400, y: 350, label: 'Needs a human' },
    accepted: { x: 720, y: 150, label: 'Members' },
    declined: { x: 720, y: 350, label: 'Turned away' },
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '500px',
      background: 'radial-gradient(circle at 50% 50%, rgba(47, 43, 61, 0.3) 0%, transparent 70%)',
      border: '1px solid var(--line)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Zone labels and dashed areas */}
      {Object.entries(zones).map(([status, zone]) => (
        <div
          key={status}
          style={{
            position: 'absolute',
            left: zone.x - 60,
            top: zone.y - 60,
            width: '120px',
            height: '120px',
            border: '2px dashed var(--line)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            fontSize: '11px',
            color: 'var(--mute)',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            lineHeight: '1.3',
          }}>
            {zone.label}
          </div>
        </div>
      ))}

      {/* Applicants */}
      {applicants.map((applicant) => {
        const zone = zones[applicant.status];
        const color = applicant.verdict?.decision === 'accept' ? 'var(--accept)' :
                     applicant.verdict?.decision === 'ask' ? 'var(--ask)' :
                     applicant.verdict?.decision === 'decline' ? 'var(--decline)' :
                     'var(--person)';
        
        const isInterviewing = applicant.status === 'interviewing';
        const isSelected = selectedPerson?.id === applicant.id;

        return (
          <div key={applicant.id}>
            {/* Person dot */}
            <div
              onClick={() => onSelectPerson(applicant)}
              style={{
                position: 'absolute',
                left: zone.x,
                top: zone.y,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: color,
                transition: 'all 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                border: isSelected ? '2px solid var(--ink)' : 'none',
                boxShadow: isSelected ? '0 0 12px rgba(236, 232, 244, 0.5)' : 'none',
                zIndex: isSelected ? 100 : 10,
              }}
            />

            {/* Name label */}
            <div
              style={{
                position: 'absolute',
                left: zone.x,
                top: zone.y + 14,
                fontSize: '11px',
                color: 'var(--mute)',
                whiteSpace: 'nowrap',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                transition: 'all 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {applicant.name}
            </div>

            {/* Gatekeeper dots and connecting lines when interviewing */}
            {isInterviewing && GATEKEEPERS.map((gatekeeper, idx) => {
              const angle = (idx * 120) - 90;
              const radius = 40;
              const gkX = zone.x + Math.cos(angle * Math.PI / 180) * radius;
              const gkY = zone.y + Math.sin(angle * Math.PI / 180) * radius;

              return (
                <div key={gatekeeper.name}>
                  {/* Connecting line */}
                  <svg
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  >
                    <line
                      x1={zone.x}
                      y1={zone.y}
                      x2={gkX}
                      y2={gkY}
                      stroke="url(#gradient)"
                      strokeWidth="1.5"
                      opacity="0.6"
                      style={{
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--person)" />
                        <stop offset="100%" stopColor="var(--gate)" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Gatekeeper dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: gkX,
                      top: gkY,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--gate)',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 8px var(--gate)',
                      animation: 'glow 2s ease-in-out infinite',
                      zIndex: 5,
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 4px var(--gate);
          }
          50% { 
            box-shadow: 0 0 12px var(--gate), 0 0 20px var(--gate);
          }
        }
      `}</style>
    </div>
  );
}
