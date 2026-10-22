"use client";

import { Applicant } from '@/lib/types';

interface PersonPanelProps {
  person: Applicant;
  onConfirmVerdict: (applicantId: string, decision: 'accept' | 'ask' | 'decline') => void;
}

export default function PersonPanel({ person, onConfirmVerdict }: PersonPanelProps) {
  const decisionColor = person.verdict?.decision === 'accept' ? 'var(--accept)' :
                       person.verdict?.decision === 'ask' ? 'var(--ask)' :
                       person.verdict?.decision === 'decline' ? 'var(--decline)' :
                       'var(--mute)';

  return (
    <div style={{
      width: '380px',
      height: 'calc(100vh - 200px)',
      background: 'var(--panel)',
      border: '1px solid var(--line)',
      borderRadius: '12px',
      overflow: 'auto',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
          {person.name}
        </h2>
        <div style={{ fontSize: '13px', color: 'var(--mute)', fontFamily: 'JetBrains Mono' }}>
          @{person.handle}
        </div>
        <div style={{
          display: 'inline-block',
          marginTop: '8px',
          padding: '4px 8px',
          background: person.isSample ? 'var(--panel2)' : 'var(--accent)',
          color: person.isSample ? 'var(--mute)' : 'var(--accent-dark)',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 500,
        }}>
          {person.isSample ? 'sample data' : `live GitHub · ${new Date(person.githubData?.fetched || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
        </div>
      </div>

      {/* Seed Data */}
      <div style={{
        background: 'var(--panel2)',
        border: '1px solid var(--line)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--mute)' }}>
          Seed data
        </h3>
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px', color: 'var(--ink)' }}>
            "{person.intro}"
          </p>
          {person.githubData && (
            <div style={{ fontSize: '12px', color: 'var(--mute)', display: 'grid', gap: '6px' }}>
              <div>GitHub since: {new Date(person.githubData.since).toLocaleDateString('en-GB')} ({person.githubData.days} days)</div>
              <div>Public repos: {person.githubData.repos}</div>
              <div>Followers: {person.githubData.followers}</div>
              {person.githubData.languages.length > 0 && (
                <div>Languages: {person.githubData.languages.join(', ')}</div>
              )}
              {person.githubData.recentRepos.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ marginBottom: '4px', fontWeight: 500 }}>Recent repos:</div>
                  {person.githubData.recentRepos.map(repo => (
                    <div key={repo.name} style={{ paddingLeft: '8px' }}>
                      • {repo.name} (pushed {new Date(repo.pushed).toLocaleDateString('en-GB')})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blocklist Match */}
      {person.blocklistMatch && (
        <div style={{
          background: 'rgba(255, 77, 94, 0.1)',
          border: '1px solid var(--gate)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--gate)' }}>
            ⚠️ Shared blocklist match
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '6px' }}>
              Reported by: <strong>{person.blocklistMatch.reported_by}</strong>
            </div>
            <div style={{ marginBottom: '6px' }}>
              Evidence: {person.blocklistMatch.evidence}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', color: 'var(--mute)', fontSize: '11px' }}>
              SHA-256: {person.blocklistMatch.sha256_prefix}...
            </div>
          </div>
        </div>
      )}

      {/* Transcript */}
      {person.transcript && person.transcript.length > 0 && (
        <div style={{
          background: 'var(--panel2)',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--mute)' }}>
            One-to-one at the gate
          </h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            {person.transcript.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div style={{
                  fontWeight: 600,
                  color: entry.role === 'gatekeeper' ? 'var(--gate)' : 'var(--accent)',
                  marginBottom: '4px',
                }}>
                  {entry.speaker}:
                </div>
                <div style={{ color: 'var(--ink)', paddingLeft: '12px' }}>
                  {entry.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      {person.verdict && (
        <div style={{
          background: 'var(--panel2)',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--mute)' }}>
            Verdict {person.verdict.suggested && '(suggested)'}
          </h3>
          
          <div style={{
            padding: '16px',
            background: `${decisionColor}22`,
            border: `2px solid ${decisionColor}`,
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: decisionColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {person.verdict.decision}
            </div>
          </div>

          {person.verdict.reasons.map((reason, idx) => (
            <div key={idx} style={{
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: idx < person.verdict!.reasons.length - 1 ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--mute)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}>
                {reason.rule}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--mute)',
                fontStyle: 'italic',
                marginBottom: '8px',
                paddingLeft: '8px',
                borderLeft: '2px solid var(--line)',
              }}>
                "{reason.ruleText}"
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '8px' }}>
                {reason.explanation}
              </div>
              {reason.quote && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--mute)',
                  fontStyle: 'italic',
                  paddingLeft: '8px',
                  borderLeft: '2px solid var(--accent)',
                }}>
                  "{reason.quote}"
                </div>
              )}
            </div>
          ))}

          {person.verdict.suggested && (
            <>
              <div style={{
                padding: '12px',
                background: 'rgba(255, 196, 94, 0.1)',
                border: '1px solid var(--ask)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--ink)',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                Nothing is final until a human presses one of these.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onConfirmVerdict(person.id, 'accept')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--accept)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => onConfirmVerdict(person.id, 'ask')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--ask)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Ask more
                </button>
                <button
                  onClick={() => onConfirmVerdict(person.id, 'decline')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--decline)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--ink)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Decline
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
