"use client";

import { useState } from 'react';
import { Applicant } from '@/lib/types';
import { SAMPLE_APPLICANTS } from '@/lib/config';
import Field from '@/components/Field';
import PersonPanel from '@/components/PersonPanel';

export default function Home() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Applicant | null>(null);
  const [githubHandle, setGithubHandle] = useState('');
  const [intro, setIntro] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [confirmed, setConfirmed] = useState(0);

  const handleAddApplicant = async () => {
    if (!githubHandle && !intro) return;
    
    const newApplicant: Applicant = {
      id: Date.now().toString(),
      name: githubHandle.split('-')[0] || 'Anonymous',
      handle: githubHandle,
      intro: intro,
      status: 'arriving',
    };
    
    setApplicants([...applicants, newApplicant]);
    setGithubHandle('');
    setIntro('');
  };

  const handleRunGate = async () => {
    // Load sample applicants if none added
    if (applicants.length === 0) {
      setApplicants(SAMPLE_APPLICANTS);
    }
    
    setIsRunning(true);
    
    // Start interviews for all applicants
    const currentApplicants = applicants.length > 0 ? applicants : SAMPLE_APPLICANTS;
    
    for (const applicant of currentApplicants) {
      runInterview(applicant.id);
    }
  };

  const runInterview = async (applicantId: string) => {
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantId }),
      });

      if (!response.ok) return;

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            setApplicants(prev => prev.map(a => {
              if (a.id === applicantId) {
                return { ...a, ...data };
              }
              return a;
            }));

            if (selectedPerson?.id === applicantId) {
              setSelectedPerson(prev => prev ? { ...prev, ...data } : null);
            }
          }
        }
      }
    } catch (error) {
      console.error('Interview failed:', error);
    }
  };

  const handleConfirmVerdict = (applicantId: string, decision: 'accept' | 'ask' | 'decline') => {
    setApplicants(prev => prev.map(a => {
      if (a.id === applicantId && a.verdict) {
        const newStatus = decision === 'accept' ? 'accepted' : decision === 'decline' ? 'declined' : 'needs_human';
        return {
          ...a,
          status: newStatus,
          verdict: { ...a.verdict, suggested: false }
        };
      }
      return a;
    }));
    
    if (selectedPerson?.id === applicantId && selectedPerson.verdict) {
      const newStatus = decision === 'accept' ? 'accepted' : decision === 'decline' ? 'declined' : 'needs_human';
      setSelectedPerson({
        ...selectedPerson,
        status: newStatus,
        verdict: { ...selectedPerson.verdict, suggested: false }
      });
    }
    
    setConfirmed(prev => prev + 1);
  };

  const reviewed = applicants.filter(a => a.verdict).length;
  const total = applicants.length;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--bg)'
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 32px',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--ink)'
          }}>
            The Gate
          </h1>
          <p style={{ 
            color: 'var(--mute)', 
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            Every applicant gets a fair one-to-one with your community's values. A human makes the call.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="GitHub handle (opt-in)"
              value={githubHandle}
              onChange={(e) => setGithubHandle(e.target.value)}
              style={{
                padding: '10px 14px',
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                color: 'var(--ink)',
                fontSize: '14px',
                width: '220px',
              }}
            />
            <input
              type="text"
              placeholder="One-line intro"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              style={{
                padding: '10px 14px',
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                color: 'var(--ink)',
                fontSize: '14px',
                flex: 1,
                minWidth: '300px',
              }}
            />
            <button
              onClick={handleAddApplicant}
              style={{
                padding: '10px 20px',
                background: 'var(--panel2)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                color: 'var(--ink)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Add applicant
            </button>
            <button
              onClick={handleRunGate}
              disabled={isRunning}
              style={{
                padding: '10px 24px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--accent-dark)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning ? 0.6 : 1,
              }}
            >
              {isRunning ? 'Running...' : 'Run the gate'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        padding: '24px 32px',
        gap: '24px',
      }}>
        {/* Field */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Field 
            applicants={applicants}
            onSelectPerson={setSelectedPerson}
            selectedPerson={selectedPerson}
          />
          
          {/* Stats */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--mute)' }}>Reviewed: </span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{reviewed}/{total}</span>
              </div>
              <div>
                <span style={{ color: 'var(--mute)' }}>Confirmed by human: </span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{confirmed}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'var(--person)' 
                }} />
                <span style={{ color: 'var(--mute)' }}>Applicant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'var(--gate)' 
                }} />
                <span style={{ color: 'var(--mute)' }}>Gatekeeper</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'var(--accept)' 
                }} />
                <span style={{ color: 'var(--mute)' }}>Accept</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'var(--ask)' 
                }} />
                <span style={{ color: 'var(--mute)' }}>Ask more</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'var(--decline)' 
                }} />
                <span style={{ color: 'var(--mute)' }}>Decline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Person Panel */}
        {selectedPerson && (
          <PersonPanel 
            person={selectedPerson}
            onConfirmVerdict={handleConfirmVerdict}
          />
        )}
      </div>
    </div>
  );
}
