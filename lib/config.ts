import { CommunityRules, Gatekeeper, Applicant } from './types';

export const COMMUNITY_RULES: CommunityRules = {
  build: 'You build things. Code, design, hardware, research all count.',
  give: "You'll give as much as you take.",
  nosell: 'No selling, recruiting or promoting without asking first.',
  kind: 'Be kind and curious. Beginners are welcome.',
};

export const GATEKEEPERS: Gatekeeper[] = [
  { name: 'The Builder', rules: ['build'], color: '#ff4d5e' },
  { name: 'The Host', rules: ['give', 'kind'], color: '#ff4d5e' },
  { name: 'The Sentinel', rules: ['nosell'], color: '#ff4d5e' },
];

export const BLOCKLIST = [
  {
    handle: 'cryptoking_88',
    reported_by: 'Partner community B',
    confirmed: true,
    evidence: 'Posted token presale links in 3 channels, removed 14 Oct',
    sha256_prefix: 'e3b0c442',
  }
];

export const SAMPLE_APPLICANTS: Applicant[] = [
  {
    id: 'sample-1',
    name: 'Priya',
    handle: 'priya-builds',
    intro: 'ML engineer maintaining open-source agent memory layer, offers a session',
    isSample: true,
    status: 'arriving',
    githubData: {
      since: '2022-03-15',
      days: 962,
      repos: 41,
      followers: 287,
      languages: ['Python', 'TypeScript', 'Rust'],
      recentRepos: [
        { name: 'agent-memory', pushed: '2026-10-20' },
        { name: 'llm-experiments', pushed: '2026-10-15' },
        { name: 'ml-utils', pushed: '2026-10-10' },
      ],
      fetched: new Date().toISOString(),
    }
  },
  {
    id: 'sample-2',
    name: 'Tom',
    handle: 'tom-first-hack',
    intro: 'First-year student, first hackathon',
    isSample: true,
    status: 'arriving',
    githubData: {
      since: '2026-09-01',
      days: 51,
      repos: 2,
      followers: 3,
      languages: ['JavaScript'],
      recentRepos: [
        { name: 'learning-react', pushed: '2026-10-18' },
        { name: 'first-project', pushed: '2026-09-15' },
      ],
      fetched: new Date().toISOString(),
    }
  },
  {
    id: 'sample-3',
    name: 'CryptoKing',
    handle: 'CryptoKing_88',
    intro: 'Token presale 100x DM me',
    isSample: true,
    status: 'arriving',
    githubData: {
      since: '2026-10-20',
      days: 2,
      repos: 0,
      followers: 0,
      languages: [],
      recentRepos: [],
      fetched: new Date().toISOString(),
    }
  },
  {
    id: 'sample-4',
    name: 'Dan',
    handle: 'dan-talent',
    intro: 'Technical recruiter offering pizza/CV night',
    isSample: true,
    status: 'arriving',
    githubData: {
      since: '2024-01-10',
      days: 651,
      repos: 0,
      followers: 145,
      languages: [],
      recentRepos: [],
      fetched: new Date().toISOString(),
    }
  },
  {
    id: 'sample-5',
    name: 'Aisha',
    handle: 'aisha-designs',
    intro: 'Designer who prototypes in code, offers design feedback',
    isSample: true,
    status: 'arriving',
    githubData: {
      since: '2023-02-20',
      days: 610,
      repos: 18,
      followers: 92,
      languages: ['HTML', 'CSS', 'JavaScript', 'Figma'],
      recentRepos: [
        { name: 'design-system', pushed: '2026-10-19' },
        { name: 'portfolio-site', pushed: '2026-10-12' },
        { name: 'ui-components', pushed: '2026-09-28' },
      ],
      fetched: new Date().toISOString(),
    }
  },
];
