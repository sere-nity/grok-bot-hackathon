export interface Applicant {
  id: string;
  name: string;
  handle: string;
  intro: string;
  githubData?: GitHubData;
  isSample?: boolean;
  status: 'arriving' | 'interviewing' | 'needs_human' | 'accepted' | 'declined';
  transcript?: TranscriptEntry[];
  verdict?: Verdict;
  blocklistMatch?: BlocklistMatch;
}

export interface GitHubData {
  since: string;
  days: number;
  repos: number;
  followers: number;
  languages: string[];
  recentRepos: RecentRepo[];
  fetched: string;
}

export interface RecentRepo {
  name: string;
  pushed: string;
}

export interface TranscriptEntry {
  speaker: string;
  role: 'gatekeeper' | 'clone';
  text: string;
  timestamp: string;
}

export interface Verdict {
  decision: 'accept' | 'ask' | 'decline';
  reasons: VerdictReason[];
  suggested: boolean;
}

export interface VerdictReason {
  rule: string;
  ruleText: string;
  explanation: string;
  quote: string;
}

export interface BlocklistMatch {
  handle: string;
  reported_by: string;
  confirmed: boolean;
  evidence: string;
  sha256_prefix: string;
}

export interface CommunityRules {
  [key: string]: string;
}

export interface Gatekeeper {
  name: string;
  rules: string[];
  color?: string;
}
