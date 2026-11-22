import { scoreActivity, type Activity } from "@/lib/scoring";
import type { Goal, Member } from "@/lib/types";
import { normName } from "@/lib/utils";

export type TrafficRow = {
  name: string;
  activity: Activity;
  reportedScore: number | null;
  calculatedScore: number;
};

export type MspPerson = { name: string; chapter: string; role: string };

export type Interpreted =
  | {
      kind: "traffic-lights";
      fileName: string;
      period: string;
      weeks: number;
      rows: TrafficRow[];
      notes: string[];
    }
  | { kind: "goals"; fileName: string; goals: Goal[]; notes: string[] }
  | {
      kind: "msp";
      fileName: string;
      date: string;
      title: string;
      positive: MspPerson[];
      others: number;
      notes: string[];
    }
  | { kind: "unknown"; fileName: string; notes: string[] };

type Matrix = string[][];

function cell(row: string[] | undefined, index: number) {
  return String(row?.[index] ?? "").trim();
}

function parseNumber(raw: string) {
  const cleaned = raw.replace(/hk\$|hkd|usd|\$|,|%|∞/gi, "").trim();
  if (!cleaned || cleaned === "-" || cleaned === "—") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseGoalNumber(raw: string) {
  const text = raw.replace(/,/g, "").trim();
  if (!text) return null;
  const wan = text.match(/([\d.]+)\s*萬/);
  if (wan) return Math.round(Number(wan[1]) * 10000);
  const yi = text.match(/([\d.]+)\s*億/);
  if (yi) return Math.round(Number(yi[1]) * 100000000);
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}

export function splitCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          value += '"';
          i++;
        } else quoted = false;
      } else value += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(value.trim());
      value = "";
    } else if (ch === "\n") {
      row.push(value.trim());
      if (row.some((c) => c)) rows.push(row);
      row = [];
      value = "";
    } else if (ch !== "\r") value += ch;
  }
  row.push(value.trim());
  if (row.some((c) => c)) rows.push(row);
  return rows;
}

function findTrafficHeader(matrix: Matrix) {
  const limit = Math.min(matrix.length, 20);
  for (let r = 0; r < limit; r++) {
    const cells = (matrix[r] ?? []).map((c) => c.trim());
    const has121 = cells.some((c) => c === "1-2-1");
    const hasBiz = cells.some((c) => /^biz give$/i.test(c));
    const hasP = cells.some((c) => c === "P");
    if (!has121 || (!hasBiz && !hasP)) continue;
    const weekIdx = cells.findIndex((c) => c.toLowerCase() === "week");
    const take = (label: string) => {
      for (let i = 0; i < cells.length; i++) {
        if (weekIdx >= 0 && i >= weekIdx) break;
        if (cells[i].toLowerCase() === label.toLowerCase()) return i;
      }
      return -1;
    };
    const cols = {
      P: take("P"),
      A: take("A"),
      L: take("L"),
      M: take("M"),
      S: take("S"),
      G: take("G"),
      R: take("R"),
      V: take("V"),
      oto: take("1-2-1"),
      T: take("T"),
      biz: take("Biz Give"),
      total: cells.findIndex((c) => /total pts/i.test(c)),
      week: weekIdx,
    };
    if (cols.P < 0 || cols.G < 0) continue;
    let nameCol = 0;
    let best = -1;
    for (let c = 0; c < cols.P; c++) {
      let score = 0;
      for (let i = r + 1; i < Math.min(matrix.length, r + 15); i++) {
        const value = cell(matrix[i], c);
        if (value && !/^\d+(\.\d+)?$/.test(value) && !/perfect|total|合計/i.test(value)) score++;
      }
      if (score > best) {
        best = score;
        nameCol = c;
      }
    }
    return { row: r, cols, nameCol };
  }
  return null;
}

function num(row: string[], index: number) {
  if (index < 0) return 0;
  return parseNumber(cell(row, index)) ?? 0;
}

export function parseTrafficMatrix(matrix: Matrix, fileName: string): Interpreted | null {
  const header = findTrafficHeader(matrix);
  if (!header) return null;
  let period = "";
  for (let r = 0; r < header.row; r++) {
    const line = (matrix[r] ?? []).join(" ");
    const range = line.match(/(20\d{2}-\d{2}-\d{2})\s*[-–]\s*(20\d{2}-\d{2}-\d{2})/);
    if (range) period = `${range[1]} – ${range[2]}`;
  }

  const rows: TrafficRow[] = [];
  const weekVotes = new Map<number, number>();
  for (let r = header.row + 1; r < matrix.length; r++) {
    const row = matrix[r] ?? [];
    const name = cell(row, header.nameCol).replace(/\s+/g, " ");
    if (!name || /perfect|total|合計|合计|chapter/i.test(name)) continue;
    const weeks = header.cols.week >= 0 ? parseNumber(cell(row, header.cols.week)) ?? 0 : 0;
    if (weeks > 0) weekVotes.set(weeks, (weekVotes.get(weeks) ?? 0) + 1);
    const activity: Activity = {
      weeks: weeks || 25,
      present: num(row, header.cols.P),
      absent: num(row, header.cols.A),
      late: num(row, header.cols.L),
      medical: num(row, header.cols.M),
      substitute: num(row, header.cols.S),
      referrals: num(row, header.cols.G),
      referralsReceived: num(row, header.cols.R),
      visitors: num(row, header.cols.V),
      oneToOnes: num(row, header.cols.oto),
      training: num(row, header.cols.T),
      tyfcbAmount: num(row, header.cols.biz),
    };
    const reportedScore = header.cols.total >= 0 ? parseNumber(cell(row, header.cols.total)) : null;
    rows.push({
      name,
      activity,
      reportedScore,
      calculatedScore: scoreActivity(activity).total,
    });
  }

  if (rows.length < 3) return null;
  let weeks = 25;
  let votes = 0;
  for (const [value, count] of weekVotes) {
    if (count > votes) {
      weeks = value;
      votes = count;
    }
  }
  rows.forEach((row) => {
    if (!row.activity.weeks) row.activity.weeks = weeks;
  });

  const mismatched = rows.filter((row) => row.reportedScore !== null && row.reportedScore !== row.calculatedScore);
  const notes = [
    `${rows.length} members read from the traffic-light grid (P A L M S G R V 1-2-1 T Biz).`,
    `Scores are recalculated from the chapter Scoring sheet. ${mismatched.length} row${mismatched.length === 1 ? "" : "s"} disagree with Total PTs.`,
  ];
  if (period) notes.unshift(`Window ${period}. ${weeks} meetings.`);
  return { kind: "traffic-lights", fileName, period, weeks, rows, notes };
}

function goalKey(label: string): { key: string; lowerIsBetter: boolean } | null {
  const text = label.toLowerCase();
  if (/revenue|生意額|tyfcb/.test(text)) return { key: "revenue", lowerIsBetter: false };
  if (/chapter size|分會人數/.test(text)) return { key: "size", lowerIsBetter: false };
  if (/growth|會員增長/.test(text)) return { key: "growth", lowerIsBetter: false };
  if (/conversion|轉換/.test(text)) return { key: "conversion", lowerIsBetter: false };
  if (/visitor|嘉賓/.test(text)) return { key: "visitorsPerWeek", lowerIsBetter: false };
  if (/training|培訓/.test(text)) return { key: "training", lowerIsBetter: false };
  if (/absent|缺席/.test(text)) return { key: "absenteeism", lowerIsBetter: true };
  if (/rpm|引薦/.test(text)) return { key: "referralsPerWeek", lowerIsBetter: false };
  if (/traffic|紅綠燈/.test(text)) return { key: "trafficLight", lowerIsBetter: false };
  if (/retention|續會/.test(text)) return { key: "retention", lowerIsBetter: false };
  if (/1-2-1|121/.test(text)) return { key: "oneToOnes", lowerIsBetter: false };
  return null;
}

export function parseGoalsMatrix(matrix: Matrix, fileName: string): Interpreted | null {
  const joined = matrix
    .slice(0, 3)
    .map((row) => row.join(" "))
    .join(" ");
  if (!/chapter team goals|分會/i.test(joined) && !matrix.some((row) => row.some((c) => /6 months/i.test(c)))) {
    return null;
  }
  let header = -1;
  for (let r = 0; r < Math.min(matrix.length, 8); r++) {
    const cells = (matrix[r] ?? []).map((c) => c.toLowerCase());
    if (cells.some((c) => c.includes("6 month")) && cells.some((c) => c.includes("current") || c.includes("12"))) {
      header = r;
      break;
    }
  }
  if (header < 0) return null;
  const head = (matrix[header] ?? []).map((c) => c.toLowerCase());
  const i6 = head.findIndex((c) => c.includes("6"));
  const i12 = head.findIndex((c) => c.includes("12"));
  const goals: Goal[] = [];
  const notes: string[] = [];
  for (let r = header + 1; r < matrix.length; r++) {
    const row = matrix[r] ?? [];
    const label = cell(row, 0);
    if (!label) continue;
    const mapped = goalKey(label);
    if (!mapped) continue;
    let target6 = i6 >= 0 ? parseGoalNumber(cell(row, i6)) : null;
    const target12 = i12 >= 0 ? parseGoalNumber(cell(row, i12)) : null;
    if (mapped.key === "trafficLight" && target6 !== null && target6 < 30 && target12 !== null && target12 >= 70) {
      notes.push(`The 6-month traffic-light cell was ${target6}, which is not a score. Using the 12-month target of ${target12}.`);
      target6 = target12;
    }
    goals.push({
      key: mapped.key,
      label: label.split("(")[0].trim(),
      target6,
      target12,
      lowerIsBetter: mapped.lowerIsBetter,
    });
  }
  if (goals.length < 3) return null;
  notes.unshift(`${goals.length} chapter goals read. Live numbers are compared with the 6-month column.`);
  return { kind: "goals", fileName, goals, notes };
}

export function parseMspMatrix(matrix: Matrix, fileName: string): Interpreted | null {
  let header = -1;
  for (let r = 0; r < Math.min(matrix.length, 8); r++) {
    const cells = (matrix[r] ?? []).join(" ");
    if (/分會/.test(cells) && /(姓氏|名字|簽到)/.test(cells)) {
      header = r;
      break;
    }
  }
  if (header < 0) return null;
  const head = (matrix[header] ?? []).map((c) => c.trim());
  const col = (labels: string[]) => head.findIndex((c) => labels.some((label) => c.includes(label)));
  const iTime = col(["簽到"]);
  const iSur = col(["姓氏"]);
  const iGiven = col(["名字"]);
  const iChapter = col(["分會"]);
  const iRole = col(["职位", "職位"]);
  const iMeeting = col(["會議"]);
  if (iChapter < 0) return null;

  const people: MspPerson[] = [];
  let date = "";
  let title = "";
  for (let r = header + 1; r < matrix.length; r++) {
    const row = matrix[r] ?? [];
    const chapter = cell(row, iChapter);
    if (!chapter) continue;
    const surname = iSur >= 0 ? cell(row, iSur) : "";
    const given = iGiven >= 0 ? cell(row, iGiven) : "";
    const name = `${given} ${surname}`.replace(/\s+/g, " ").trim() || surname || given;
    if (!name) continue;
    people.push({ name, chapter, role: iRole >= 0 ? cell(row, iRole) : "" });
    const stamp = iTime >= 0 ? cell(row, iTime) : "";
    const found = stamp.match(/20\d{2}-\d{2}-\d{2}/);
    if (found && !date) date = found[0];
    if (!title && iMeeting >= 0) title = cell(row, iMeeting);
  }
  if (people.length < 3) return null;
  const positive = people.filter((p) => /positive/i.test(p.chapter));
  const notes = [
    `${people.length} sign-ins. ${positive.length} from Positive.`,
    "Attendance is recorded against the member. Training points from the 6-month report are not incremented, so a class is not counted twice.",
  ];
  return {
    kind: "msp",
    fileName,
    date: date || "",
    title: title || "MSP",
    positive,
    others: people.length - positive.length,
    notes,
  };
}

const GENERIC: { field: keyof Activity | "name" | "score"; aliases: string[] }[] = [
  { field: "name", aliases: ["name", "member", "member name", "姓名", "會員", "会员"] },
  { field: "present", aliases: ["present", "attendance", "出席"] },
  { field: "absent", aliases: ["absent", "absences", "缺席"] },
  { field: "late", aliases: ["late", "lates", "遲到", "迟到"] },
  { field: "medical", aliases: ["medical", "病假"] },
  { field: "substitute", aliases: ["substitute", "substitutes", "替補", "替补"] },
  { field: "referrals", aliases: ["referrals", "referral", "rgi", "引薦", "引荐"] },
  { field: "referralsReceived", aliases: ["referrals received", "received", "rgo"] },
  { field: "visitors", aliases: ["visitors", "visitor", "訪客", "访客"] },
  { field: "oneToOnes", aliases: ["1-2-1", "121", "one to one", "一對一", "一对一"] },
  { field: "training", aliases: ["training", "ceu", "ceus", "skills", "培訓", "培训"] },
  { field: "tyfcbAmount", aliases: ["tyfcb", "biz give", "biz", "成交", "closed business"] },
  { field: "weeks", aliases: ["weeks", "week", "meetings"] },
  { field: "score", aliases: ["score", "total", "total pts", "總分", "分数"] },
];

function matchGeneric(header: string): (typeof GENERIC)[number]["field"] | null {
  const key = header.toLowerCase().replace(/\s+/g, " ").trim();
  if (!key) return null;
  if (key.length === 1) {
    const letters: Record<string, (typeof GENERIC)[number]["field"]> = {
      p: "present",
      a: "absent",
      l: "late",
      m: "medical",
      s: "substitute",
      g: "referrals",
      r: "referralsReceived",
      v: "visitors",
      t: "training",
    };
    return letters[key] ?? null;
  }
  for (const entry of GENERIC) {
    if (entry.aliases.some((alias) => key === alias || (alias.length >= 3 && key.includes(alias)))) return entry.field;
  }
  return null;
}

export function parseGenericMatrix(matrix: Matrix, fileName: string): Interpreted | null {
  let header = -1;
  let mapping: Partial<Record<(typeof GENERIC)[number]["field"], number>> = {};
  for (let r = 0; r < Math.min(matrix.length, 15); r++) {
    const next: typeof mapping = {};
    (matrix[r] ?? []).forEach((value, index) => {
      const field = matchGeneric(value);
      if (field && next[field] === undefined) next[field] = index;
    });
    const metrics = ["absent", "referrals", "visitors", "oneToOnes", "training", "tyfcbAmount"].filter((k) => next[k as keyof typeof next] !== undefined);
    if (next.name !== undefined && metrics.length >= 2) {
      header = r;
      mapping = next;
      break;
    }
  }
  if (header < 0) return null;
  const rows: TrafficRow[] = [];
  for (let r = header + 1; r < matrix.length; r++) {
    const row = matrix[r] ?? [];
    const name = cell(row, mapping.name ?? -1).replace(/\s+/g, " ");
    if (!name || /total|合計|chapter/i.test(name)) continue;
    const weeks = mapping.weeks !== undefined ? parseNumber(cell(row, mapping.weeks)) ?? 25 : 25;
    const activity: Activity = {
      weeks,
      present: mapping.present !== undefined ? parseNumber(cell(row, mapping.present)) ?? 0 : 0,
      absent: mapping.absent !== undefined ? parseNumber(cell(row, mapping.absent)) ?? 0 : 0,
      late: mapping.late !== undefined ? parseNumber(cell(row, mapping.late)) ?? 0 : 0,
      medical: mapping.medical !== undefined ? parseNumber(cell(row, mapping.medical)) ?? 0 : 0,
      substitute: mapping.substitute !== undefined ? parseNumber(cell(row, mapping.substitute)) ?? 0 : 0,
      referrals: mapping.referrals !== undefined ? parseNumber(cell(row, mapping.referrals)) ?? 0 : 0,
      referralsReceived: mapping.referralsReceived !== undefined ? parseNumber(cell(row, mapping.referralsReceived)) ?? 0 : 0,
      visitors: mapping.visitors !== undefined ? parseNumber(cell(row, mapping.visitors)) ?? 0 : 0,
      oneToOnes: mapping.oneToOnes !== undefined ? parseNumber(cell(row, mapping.oneToOnes)) ?? 0 : 0,
      training: mapping.training !== undefined ? parseNumber(cell(row, mapping.training)) ?? 0 : 0,
      tyfcbAmount: mapping.tyfcbAmount !== undefined ? parseNumber(cell(row, mapping.tyfcbAmount)) ?? 0 : 0,
    };
    const reported = mapping.score !== undefined ? parseNumber(cell(row, mapping.score)) : null;
    rows.push({ name, activity, reportedScore: reported, calculatedScore: scoreActivity(activity).total });
  }
  if (!rows.length) return null;
  const weeks = rows[0]?.activity.weeks || 25;
  return {
    kind: "traffic-lights",
    fileName,
    period: "",
    weeks,
    rows,
    notes: [`${rows.length} rows read from a column list. Weekly rates use each row’s meeting count, or ${weeks}.`],
  };
}

export function interpretMatrices(sheets: { name: string; matrix: Matrix }[], fileName: string): Interpreted {
  for (const sheet of sheets) {
    const traffic = parseTrafficMatrix(sheet.matrix, fileName);
    if (traffic) return traffic;
  }
  for (const sheet of sheets) {
    const goals = parseGoalsMatrix(sheet.matrix, fileName);
    if (goals && goals.kind === "goals") return goals;
  }
  for (const sheet of sheets) {
    const msp = parseMspMatrix(sheet.matrix, fileName);
    if (msp) return msp;
  }
  for (const sheet of sheets) {
    const generic = parseGenericMatrix(sheet.matrix, fileName);
    if (generic) return generic;
  }
  return {
    kind: "unknown",
    fileName,
    notes: [
      "This file is not a chapter traffic-light workbook, a Chapter Team Goals sheet, or an MSP sign-in.",
      "Export stays as Excel or CSV. PDF reports are not read.",
    ],
  };
}

export async function interpretFile(file: File): Promise<Interpreted> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv") || name.endsWith(".txt")) {
    return interpretMatrices([{ name: "csv", matrix: splitCsv(await file.text()) }], file.name);
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheets = book.SheetNames.map((sheetName) => {
      const matrix = XLSX.utils.sheet_to_json<(string | number | null)[]>(book.Sheets[sheetName], {
        header: 1,
        raw: false,
        defval: "",
      });
      return { name: sheetName, matrix: matrix.map((row) => row.map((value) => String(value ?? ""))) };
    });
    return interpretMatrices(sheets, file.name);
  }
  return {
    kind: "unknown",
    fileName: file.name,
    notes: ["Upload Excel or CSV. The chapter traffic-light workbook, the goals sheet, and an MSP sign-in are recognised."],
  };
}

export function nameKeys(value: string) {
  const key = normName(value);
  const parts = key.split(" ").filter(Boolean);
  const keys = new Set<string>();
  if (key) keys.add(key);
  if (parts.length === 2) keys.add(`${parts[1]} ${parts[0]}`);
  if (parts.length > 2) keys.add(`${parts[parts.length - 1]} ${parts.slice(0, -1).join(" ")}`);
  return [...keys];
}

export function findMember(members: Member[], name: string) {
  const keys = nameKeys(name);
  const exact = members.find((member) => keys.includes(normName(member.name)));
  if (exact) return exact;
  return members.find((member) => {
    const theirs = normName(member.name);
    return keys.some((key) => {
      const shorter = key.length < theirs.length ? key : theirs;
      const longer = key.length < theirs.length ? theirs : key;
      return shorter.length >= 8 && longer.includes(shorter);
    });
  });
}

export function activityOf(member: Member): Activity {
  return {
    weeks: member.weeks,
    present: member.present,
    absent: member.absent,
    late: member.late,
    medical: member.medical,
    substitute: member.substitute,
    referrals: member.referrals,
    referralsReceived: member.referralsReceived,
    visitors: member.visitors,
    oneToOnes: member.oneToOnes,
    training: member.training,
    tyfcbAmount: member.tyfcbAmount,
  };
}
