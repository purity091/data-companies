import { NextResponse } from "next/server";
import { getAppVersion, getGitHubRepository } from "@/lib/app-version";

export const revalidate = 300;

export async function GET() {
  const installed = getAppVersion();
  const repository = getGitHubRepository();
  const [owner, name] = repository.split("/");

  if (!owner || !name) {
    return NextResponse.json({ installed, latest: null, repository, status: "unknown" });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/commits/main`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "global-companies-version-checker",
      },
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);

    const commit = await response.json() as {
      sha?: string;
      html_url?: string;
      commit?: { message?: string; author?: { date?: string } };
    };
    const latestSha = commit.sha?.toLowerCase() ?? null;
    const latest = latestSha ? {
      sha: latestSha,
      shortSha: latestSha.slice(0, 7),
      message: commit.commit?.message?.split("\n")[0] ?? "آخر تحديث",
      date: commit.commit?.author?.date ?? null,
      url: commit.html_url ?? `https://github.com/${repository}/commit/${latestSha}`,
    } : null;

    return NextResponse.json({
      installed,
      latest,
      repository,
      status: latestSha && installed.sha === latestSha ? "up_to_date" : "update_available",
    });
  } catch {
    return NextResponse.json({ installed, latest: null, repository, status: "unknown" });
  }
}
