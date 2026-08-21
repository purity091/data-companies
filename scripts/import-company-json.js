import fs from "node:fs";
import path from "node:path";

async function main() {
  const fileArg = process.argv[2] || "docs/company-reference.json";
  const filePath = path.resolve(process.cwd(), fileArg);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`📄 Reading JSON file: ${filePath}...`);
  const rawText = fs.readFileSync(filePath, "utf-8");

  const apiUrl = process.env.API_URL || "http://localhost:4000";

  console.log(`🔍 Previewing company data via API...`);
  const previewRes = await fetch(`${apiUrl}/api/imports/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText }),
  });

  const previewData = await previewRes.json();
  if (!previewRes.ok || !previewData.data) {
    console.error(`❌ Parsing failed:`, previewData);
    process.exit(1);
  }

  console.log(`✅ Company parsed: "${previewData.data.name}" (${previewData.data.countryName || "غير محددة"})`);
  if (previewData.enrichment) {
    console.log(`✨ Full Enrichment bundle detected (Identity, Business, PeopleFinance, Evidence).`);
  }

  console.log(`🚀 Committing to database...`);
  const commitRes = await fetch(`${apiUrl}/api/imports/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company: previewData.data,
      enrichment: previewData.enrichment || undefined,
    }),
  });

  const commitData = await commitRes.json();
  if (!commitRes.ok) {
    console.error(`❌ Commit failed:`, commitData);
    process.exit(1);
  }

  console.log(`🎉 SUCCESS! Company "${commitData.data?.name || previewData.data.name}" committed to database!`);
  console.log(`📊 Result mode: ${commitData.mode || "database"}, ID: ${commitData.data?.id || "N/A"}, Sources: ${commitData.sourcesReceived}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
