const baseUrl = process.env.APP_URL || "http://localhost:4000";
const intervalMs = 60_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runOnce() {
  try {
    const response = await fetch(`${baseUrl}/api/cron/trustmrr`, {
      headers: { Accept: "application/json" },
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(`[TrustMRR] HTTP ${response.status}`, body);
      return;
    }

    console.log(`[TrustMRR] ${new Date().toISOString()}`, body);
  } catch (error) {
    console.error(`[TrustMRR] Cannot reach ${baseUrl}. Is npm run dev running?`, error instanceof Error ? error.message : error);
  }
}

console.log(`[TrustMRR] Worker started. One page (10 companies) every ${intervalMs / 1000} seconds.`);
await runOnce();

while (true) {
  await sleep(intervalMs);
  await runOnce();
}
