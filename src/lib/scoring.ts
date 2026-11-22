/**
 * Scoring from the BNI Positive traffic-light workbook (Scoring sheet, May 2026).
 * 100 points: Absences 15, On time 10, Referrals/week 20, Visitors/week 20,
 * 1-2-1s/week 10, Skills modules 10, TYFCB 15.
 * Colors: Green ≥70, Yellow 50–69, Red 30–49, Black <30.
 * The printed Total PTs column is checked, not trusted, when raw counts exist.
 */

export type Light = "green" | "yellow" | "red" | "black";

export type Activity = {
  weeks: number;
  present: number;
  absent: number;
  late: number;
  medical: number;
  substitute: number;
  referrals: number;
  referralsReceived: number;
  visitors: number;
  oneToOnes: number;
  training: number;
  tyfcbAmount: number;
};

export type ScoreBreakdown = {
  absent: number;
  late: number;
  referrals: number;
  visitors: number;
  oneToOnes: number;
  training: number;
  tyfcb: number;
  total: number;
  light: Light;
  rates: {
    referralsPerWeek: number;
    visitorsPerWeek: number;
    oneToOnesPerWeek: number;
  };
};

export const TARGETS = [30, 50, 70, 75, 80, 85, 90, 95, 100] as const;

export const EMPTY_ACTIVITY: Activity = {
  weeks: 25,
  present: 0,
  absent: 0,
  late: 0,
  medical: 0,
  substitute: 0,
  referrals: 0,
  referralsReceived: 0,
  visitors: 0,
  oneToOnes: 0,
  training: 0,
  tyfcbAmount: 0,
};

export function lightOf(score: number): Light {
  if (score >= 70) return "green";
  if (score >= 50) return "yellow";
  if (score >= 30) return "red";
  return "black";
}

export function nextBand(score: number) {
  if (score < 30) return 30;
  if (score < 50) return 50;
  if (score < 70) return 70;
  if (score < 75) return 75;
  if (score < 80) return 80;
  if (score < 85) return 85;
  if (score < 90) return 90;
  if (score < 95) return 95;
  return 100;
}

export function absencePoints(absent: number) {
  if (absent > 2) return 0;
  if (absent === 2) return 5;
  if (absent === 1) return 10;
  return 15;
}

export function latePoints(late: number) {
  if (late >= 2) return 0;
  if (late === 1) return 5;
  return 10;
}

export function referralPoints(count: number, weeks: number) {
  const rate = weeks > 0 ? count / weeks : 0;
  if (rate >= 1.5) return 20;
  if (rate >= 1.2) return 15;
  if (rate >= 1) return 10;
  if (rate >= 0.75) return 5;
  return 0;
}

export function visitorPoints(count: number, weeks: number) {
  const rate = weeks > 0 ? count / weeks : 0;
  if (rate >= 0.75) return 20;
  if (rate >= 0.5) return 15;
  if (rate >= 0.25) return 10;
  if (rate >= 0.1) return 5;
  return 0;
}

export function oneToOnePoints(count: number, weeks: number) {
  const rate = weeks > 0 ? count / weeks : 0;
  if (rate >= 1) return 10;
  if (rate > 0.5) return 5;
  return 0;
}

export function trainingPoints(count: number) {
  if (count >= 2) return 10;
  if (count === 1) return 5;
  return 0;
}

export function tyfcbPoints(amount: number) {
  if (amount >= 500000) return 15;
  if (amount >= 200000) return 10;
  if (amount >= 100000) return 5;
  return 0;
}

export function scoreActivity(activity: Activity): ScoreBreakdown {
  const weeks = Math.max(0, activity.weeks);
  const absent = absencePoints(activity.absent);
  const late = latePoints(activity.late);
  const referrals = referralPoints(activity.referrals, weeks);
  const visitors = visitorPoints(activity.visitors, weeks);
  const oneToOnes = oneToOnePoints(activity.oneToOnes, weeks);
  const training = trainingPoints(activity.training);
  const tyfcb = tyfcbPoints(activity.tyfcbAmount);
  const total = absent + late + referrals + visitors + oneToOnes + training + tyfcb;
  return {
    absent,
    late,
    referrals,
    visitors,
    oneToOnes,
    training,
    tyfcb,
    total,
    light: lightOf(total),
    rates: {
      referralsPerWeek: weeks > 0 ? activity.referrals / weeks : 0,
      visitorsPerWeek: weeks > 0 ? activity.visitors / weeks : 0,
      oneToOnesPerWeek: weeks > 0 ? activity.oneToOnes / weeks : 0,
    },
  };
}

export type PlanAction = {
  key: string;
  label: string;
  detail: string;
  pointsGain: number;
};

function jumpCount(current: number, pointsAt: (n: number) => number, cap: number) {
  const now = pointsAt(current);
  const ceiling = pointsAt(cap);
  if (now >= ceiling) return null;
  for (let n = current + 1; n <= cap; n++) {
    if (pointsAt(n) > now) return n;
  }
  return null;
}

/** Smallest extra activity inside this window that reaches the target. One step is a whole scoring band, not a single unit that changes nothing. */
export function planToTarget(activity: Activity, target: number): PlanAction[] {
  const start = scoreActivity(activity);
  if (start.total >= target) return [];

  let current: Activity = { ...activity };
  const weeks = Math.max(1, current.weeks);

  for (let step = 0; step < 8; step++) {
    const now = scoreActivity(current).total;
    if (now >= target) break;

    type Candidate = { effort: number; apply: (a: Activity) => void };
    const candidates: Candidate[] = [];

    const nextRef = jumpCount(current.referrals, (n) => referralPoints(n, weeks), Math.ceil(1.5 * weeks));
    if (nextRef !== null) {
      const delta = nextRef - current.referrals;
      candidates.push({
        effort: delta * 2,
        apply: (a) => {
          a.referrals = nextRef;
        },
      });
    }
    const nextVis = jumpCount(current.visitors, (n) => visitorPoints(n, weeks), Math.ceil(0.75 * weeks));
    if (nextVis !== null) {
      const delta = nextVis - current.visitors;
      candidates.push({
        effort: delta * 3,
        apply: (a) => {
          a.visitors = nextVis;
        },
      });
    }
    const next121 = jumpCount(current.oneToOnes, (n) => oneToOnePoints(n, weeks), weeks);
    if (next121 !== null) {
      const delta = next121 - current.oneToOnes;
      candidates.push({
        effort: delta * 2,
        apply: (a) => {
          a.oneToOnes = next121;
        },
      });
    }
    const nextTrain = jumpCount(current.training, (n) => trainingPoints(n), 2);
    if (nextTrain !== null) {
      const delta = nextTrain - current.training;
      candidates.push({
        effort: delta * 3,
        apply: (a) => {
          a.training = nextTrain;
        },
      });
    }
    const nextBiz = [100000, 200000, 500000].find((band) => current.tyfcbAmount < band);
    if (nextBiz !== undefined) {
      candidates.push({
        effort: 80,
        apply: (a) => {
          a.tyfcbAmount = nextBiz;
        },
      });
    }

    let best: { candidate: Candidate; gain: number } | null = null;
    for (const candidate of candidates) {
      const trial = { ...current };
      candidate.apply(trial);
      const gain = scoreActivity(trial).total - now;
      if (gain <= 0) continue;
      const efficiency = gain / candidate.effort;
      if (!best || efficiency > best.gain / best.candidate.effort) best = { candidate, gain };
    }
    if (!best) break;
    best.candidate.apply(current);
  }

  const end = scoreActivity(current);
  const actions: PlanAction[] = [];
  const dRef = current.referrals - activity.referrals;
  const dVis = current.visitors - activity.visitors;
  const d121 = current.oneToOnes - activity.oneToOnes;
  const dTrain = current.training - activity.training;
  const dTy = current.tyfcbAmount - activity.tyfcbAmount;

  if (d121 > 0) {
    actions.push({
      key: "oneToOnes",
      label: `Complete ${d121} more 1-2-1${d121 > 1 ? "s" : ""}`,
      detail: `1 per week is 10 pts. Above 0.5 and under 1 is 5.`,
      pointsGain: end.oneToOnes - start.oneToOnes,
    });
  }
  if (dRef > 0) {
    actions.push({
      key: "referrals",
      label: `Give ${dRef} more referral${dRef > 1 ? "s" : ""}`,
      detail: "Per week: 0.75 = 5, 1.00 = 10, 1.20 = 15, 1.50 = 20.",
      pointsGain: end.referrals - start.referrals,
    });
  }
  if (dVis > 0) {
    actions.push({
      key: "visitors",
      label: `Bring ${dVis} more visitor${dVis > 1 ? "s" : ""}`,
      detail: "Per week: 0.10 = 5, 0.25 = 10, 0.50 = 15, 0.75 = 20.",
      pointsGain: end.visitors - start.visitors,
    });
  }
  if (dTrain > 0) {
    actions.push({
      key: "training",
      label: dTrain === 1 && activity.training === 0 ? "Attend 1 skills module" : `Attend ${dTrain} more skills module${dTrain > 1 ? "s" : ""}`,
      detail: "0 modules = 0, 1 = 5, 2 or more = 10. This is what Green Light is asked to push.",
      pointsGain: end.training - start.training,
    });
  }
  if (dTy > 0) {
    actions.push({
      key: "tyfcb",
      label: `Close ${formatMoney(dTy)} more TYFCB`,
      detail: "Bands are HK$100,000, HK$200,000 and HK$500,000. Only the next band is suggested.",
      pointsGain: end.tyfcb - start.tyfcb,
    });
  }

  if (end.total < target && (activity.absent > 0 || activity.late > 0)) {
    const bits = [];
    if (activity.absent > 0) bits.push(`${activity.absent} absence${activity.absent > 1 ? "s" : ""} (${start.absent}/15)`);
    if (activity.late > 0) bits.push(`${activity.late} late${activity.late > 1 ? "s" : ""} (${start.late}/10)`);
    actions.push({
      key: "locked",
      label: `Already locked in this window: ${bits.join(", ")}`,
      detail: "Absences and lates cannot be undone. Those points return only when they roll out of the 6 months.",
      pointsGain: 0,
    });
  }

  if (actions.length === 0) {
    actions.push({
      key: "blocked",
      label: `Cannot reach ${target} inside this window`,
      detail: "Every band that can still move is already maxed, or the gap is locked absences and lates.",
      pointsGain: 0,
    });
  }

  return actions.sort((a, b) => b.pointsGain - a.pointsGain);
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatRate(n: number) {
  return n.toFixed(2);
}
