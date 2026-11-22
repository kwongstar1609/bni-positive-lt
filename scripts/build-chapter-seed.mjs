import fs from "node:fs";
import * as XLSX from "xlsx";
import { scoreActivity } from "../src/lib/scoring.ts";

const file = "attachments/Member Traffic Light - Positive (Chinese) (2026-05).xlsx";
const book = XLSX.read(fs.readFileSync(file), { type: "buffer" });
const matrix = XLSX.utils.sheet_to_json(book.Sheets["Traffic Light Report"], { header: 1, raw: false, defval: "" });

const extras = {
  "andrew kwong": { company: "Feral Technology", category: "IT", pitch: "Internal systems and web platforms." },
};

const members = [];
let mismatches = 0;
for (let r = 5; r < matrix.length; r++) {
  const row = matrix[r];
  const name = String(row[1] ?? "").replace(/\s+/g, " ").trim();
  if (!name || /perfect/i.test(name)) continue;
  const weeks = Number(String(row[16]).replace(/,/g, "")) || 25;
  const activity = {
    weeks,
    present: num(row[3]),
    absent: num(row[4]),
    late: num(row[5]),
    medical: num(row[6]),
    substitute: num(row[7]),
    referrals: num(row[8]),
    referralsReceived: num(row[9]),
    visitors: num(row[10]),
    oneToOnes: num(row[11]),
    training: num(row[12]),
    tyfcbAmount: num(row[13]),
  };
  const reported = num(row[15]);
  const calculated = scoreActivity(activity).total;
  if (reported !== calculated) {
    mismatches++;
    console.log("MISMATCH", name, "file", reported, "calc", calculated, activity);
  }
  const extra = extras[name.toLowerCase()] ?? {};
  members.push({
    id: `m-${String(members.length + 1).padStart(3, "0")}`,
    name,
    company: extra.company ?? "",
    category: extra.category ?? "",
    active: true,
    lastPresentation: "",
    pitch: extra.pitch ?? "",
    ...activity,
  });
}

const body = `import type { Member } from "@/lib/types";

export const CHAPTER_PERIOD = "2025-12-01 – 2026-05-31";
export const CHAPTER_WEEKS = 25;

export const CHAPTER_MEMBERS: Member[] = ${JSON.stringify(members, null, 2)};
`;
fs.writeFileSync("src/lib/chapter-seed.ts", body);
console.log("members", members.length, "mismatches", mismatches);

function num(value) {
  const n = Number(String(value ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
