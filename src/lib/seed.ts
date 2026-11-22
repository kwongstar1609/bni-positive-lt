import { CHAPTER_MEMBERS, CHAPTER_PERIOD, CHAPTER_WEEKS } from "@/lib/chapter-seed";
import type { Application, ChapterEvent, Goal, Member, Presentation, Settings, Task, Visitor } from "@/lib/types";

export const CHAPTER_GOALS: Goal[] = [
  { key: "revenue", label: "Revenue", target6: 50000000, target12: 100000000, lowerIsBetter: false },
  { key: "size", label: "Chapter size", target6: 50, target12: 58, lowerIsBetter: false },
  { key: "growth", label: "Members growth", target6: 8, target12: 16, lowerIsBetter: false },
  { key: "visitorsPerWeek", label: "Visitors per week", target6: 10, target12: 10, lowerIsBetter: false },
  { key: "conversion", label: "Visitor conversion", target6: 9, target12: 9, lowerIsBetter: false },
  { key: "training", label: "Training per member", target6: 2, target12: 2, lowerIsBetter: false },
  { key: "absenteeism", label: "Absenteeism", target6: 2.72, target12: 2.72, lowerIsBetter: true },
  { key: "referralsPerWeek", label: "Referrals per member per week", target6: 2.72, target12: 2, lowerIsBetter: false },
  { key: "trafficLight", label: "Chapter traffic light", target6: 85, target12: 85, lowerIsBetter: false },
  { key: "retention", label: "Retention", target6: 70, target12: 80, lowerIsBetter: false },
  { key: "oneToOnes", label: "1-2-1s per member per week", target6: 2.8, target12: 2.8, lowerIsBetter: false },
];

export const DEFAULT_SETTINGS: Settings = {
  chapterName: "BNI Positive",
  meetingsHeld: CHAPTER_WEEKS,
  period: CHAPTER_PERIOD,
  goals: CHAPTER_GOALS,
};

export const SEED_MEMBERS: Member[] = CHAPTER_MEMBERS;

function memberId(name: string) {
  return SEED_MEMBERS.find((member) => member.name.toLowerCase() === name.toLowerCase())?.id ?? SEED_MEMBERS[0].id;
}

export const SEED_EVENTS: ChapterEvent[] = [
  { id: "e-meet", title: "Weekly chapter meeting", date: "2026-12-02", type: "meeting", notes: "萬怡酒店. Visitors on tables 1, 2, 3, 5 and 6." },
  { id: "e-msp", title: "MSP — Member Success Program", date: "2026-12-01", type: "training", notes: "南洋酒店. First-time members, and anyone still on 0 training points." },
  { id: "e-mc", title: "MC Follow Up Workshop", date: "2026-12-04", type: "training", notes: "BNI office. VP and MCC." },
  { id: "e-reh", title: "5-minute rehearsal", date: "2026-12-01", type: "rehearsal", notes: "Check specialty overlap before the Wednesday meeting." },
  { id: "e-dinner", title: "CS group dinner", date: "2026-12-06", type: "social", notes: "Optional. Not a PALMS event." },
];

export const SEED_VISITORS: Visitor[] = [
  { id: "v-melody", name: "Melody Chan", company: "English Playgroup", invitedById: memberId("Hettina Cheng"), interest: 4, knowsBni: 2, notes: "Curious about education referrals.", status: "confirmed" },
  { id: "v-eric", name: "Eric Ngai", company: "Game design", invitedById: memberId("Andrew Kwong"), interest: 5, knowsBni: 3, notes: "Looking for marketing and IT partners.", status: "confirmed" },
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: "a-roy",
    name: "Roy Wong",
    company: "Commercial photography",
    category: "MP",
    interviewer: "VP",
    status: "voting",
    votesFor: 6,
    votesAgainst: 1,
    notes: "Interview done. Waiting on the anonymous vote. VP can see who voted.",
  },
];

export const SEED_TASKS: Task[] = [
  {
    id: "t-vote",
    source: "app:a-roy",
    team: "MC",
    title: "Close the vote for Roy Wong",
    detail: "Application is in voting.",
    assignee: "VP",
    due: "2026-11-25",
    status: "in-progress",
  },
];

export const SEED_PRESENTATIONS: Presentation[] = [];
