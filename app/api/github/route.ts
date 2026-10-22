import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');
  
  if (!handle) {
    return NextResponse.json({ error: 'Missing handle' }, { status: 400 });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${handle}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = await userResponse.json();

    // Fetch repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${handle}/repos?sort=pushed&per_page=10`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    const reposData = await reposResponse.json();

    // Extract languages from repos
    const languages = new Set<string>();
    reposData.forEach((repo: any) => {
      if (repo.language) languages.add(repo.language);
    });

    // Calculate days since account creation
    const createdDate = new Date(userData.created_at);
    const now = new Date();
    const days = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      since: userData.created_at,
      days,
      repos: userData.public_repos,
      followers: userData.followers,
      languages: Array.from(languages).slice(0, 5),
      recentRepos: reposData.slice(0, 5).map((repo: any) => ({
        name: repo.name,
        pushed: repo.pushed_at,
      })),
      fetched: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
