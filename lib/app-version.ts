import { execFileSync } from "node:child_process";

export type AppVersionInfo = {
  sha: string | null;
  shortSha: string;
  source: "environment" | "git" | "unknown";
};

let cachedVersion: AppVersionInfo | null = null;

function normalizeSha(value: string | undefined) {
  const sha = value?.trim();
  return sha && /^[a-f0-9]{7,40}$/i.test(sha) ? sha.toLowerCase() : null;
}

export function getAppVersion(): AppVersionInfo {
  if (cachedVersion) return cachedVersion;

  const environmentSha = normalizeSha(
    process.env.NEXT_PUBLIC_APP_COMMIT
      ?? process.env.VERCEL_GIT_COMMIT_SHA
      ?? process.env.GITHUB_SHA,
  );
  if (environmentSha) {
    cachedVersion = { sha: environmentSha, shortSha: environmentSha.slice(0, 7), source: "environment" };
    return cachedVersion;
  }

  try {
    const gitSha = normalizeSha(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }));
    if (gitSha) {
      cachedVersion = { sha: gitSha, shortSha: gitSha.slice(0, 7), source: "git" };
      return cachedVersion;
    }
  } catch {
    // Git is not available in some production bundles. The UI will show unknown.
  }

  cachedVersion = { sha: null, shortSha: "غير معروف", source: "unknown" };
  return cachedVersion;
}

export function getGitHubRepository() {
  return process.env.NEXT_PUBLIC_GITHUB_REPOSITORY ?? process.env.GITHUB_REPOSITORY ?? "purity091/data-companies";
}
