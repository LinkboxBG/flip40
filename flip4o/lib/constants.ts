import type {
  AnalysisResult,
  CriterionDefinition,
  CriterionKey,
  CriterionQuestion,
} from "./types";

export const SITE_URL = "https://flip40.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/ivnkolev/";

export const VERDICT_LABELS: Record<AnalysisResult["verdictTone"], string> = {
  strong: "BUILD",
  conditional: "PIVOT",
  weak: "PIVOT",
  pass: "KILL",
};

export const COUNTER_ARGUMENTS_ENABLED =
  process.env.NEXT_PUBLIC_COUNTER_ARGUMENTS === "true";

export const BRAND = {
  lime: "#b8ff00",
  violet: "#9b5cf6",
  bgBase: "#080808",
  bgSurface: "#111111",
  bgElevated: "#1a1a1a",
  textPrimary: "#f5f5f5",
  textSecondary: "#888888",
  error: "#ef4444",
  warning: "#f59e0b",
} as const;

export const UI = {
  chart: {
    tickFill: "#888888",
    gridStroke: "rgba(184, 255, 0, 0.15)",
    stroke: "#b8ff00",
    fill: "#b8ff00",
    fillOpacity: 0.28,
    tooltipBg: "#111111",
    tooltipBorder: "rgba(184, 255, 0, 0.3)",
    gaugeBg: "rgba(184, 255, 0, 0.15)",
  },
} as const;

export const CRITERIA: CriterionDefinition[] = [
  {
    key: "flipPotential",
    label: "Flip Potential",
    radarLabel: "Flip",
    description: "Speed and likelihood of a profitable exit or turnaround.",
  },
  {
    key: "moat",
    label: "Moat",
    radarLabel: "Moat",
    description: "Defensibility — barriers that protect margins and market share.",
  },
  {
    key: "marketSize",
    label: "Market Size",
    radarLabel: "Market",
    description: "Total addressable demand and room for scalable growth.",
  },
  {
    key: "execution",
    label: "Execution",
    radarLabel: "Exec.",
    description: "Operational readiness, team depth, and delivery track record.",
  },
  {
    key: "capitalEfficiency",
    label: "CAP. EFFICIENCY",
    radarLabel: "Cap. Eff.",
    description: "Capital required per unit of value created or revenue gained.",
  },
];

export const DEFAULT_SCORES = {
  flipPotential: 3,
  moat: 3,
  marketSize: 3,
  execution: 3,
  capitalEfficiency: 3,
} as const;

export const CRITERIA_QUESTIONS: Record<CriterionKey, CriterionQuestion[]> = {
  flipPotential: [
    {
      id: "fp-1",
      question:
        "Under stress, how fast could you find a buyer or liquidity event for this asset?",
    },
    {
      id: "fp-2",
      question:
        "If market conditions worsened 30%, would exit value still clear your hurdle rate?",
    },
    {
      id: "fp-3",
      question:
        "How much operational lift is required before the asset is flip-ready?",
    },
  ],
  moat: [
    {
      id: "mo-1",
      question:
        "If a well-funded competitor copied your offer tomorrow, how long would margins hold?",
    },
    {
      id: "mo-2",
      question:
        "Do switching costs, IP, or network effects create a durable barrier?",
    },
    {
      id: "mo-3",
      question:
        "Under price-war stress, could you defend share without destroying unit economics?",
    },
  ],
  marketSize: [
    {
      id: "ms-1",
      question:
        "Is the addressable market large enough to support a venture-scale outcome?",
    },
    {
      id: "ms-2",
      question:
        "If growth assumptions were cut in half, is the opportunity still meaningful?",
    },
    {
      id: "ms-3",
      question:
        "Can you realistically capture meaningful share within 24 months?",
    },
  ],
  execution: [
    {
      id: "ex-1",
      question:
        "Does the team have a proven track record delivering under compressed timelines?",
    },
    {
      id: "ex-2",
      question:
        "If a key hire left today, could execution velocity recover within one quarter?",
    },
    {
      id: "ex-3",
      question:
        "Are core processes documented enough to scale without heroics?",
    },
  ],
  capitalEfficiency: [
    {
      id: "ce-1",
      question:
        "How much capital is required to reach the next value inflection point?",
    },
    {
      id: "ce-2",
      question:
        "Under a 40% budget cut, could you still hit critical milestones?",
    },
    {
      id: "ce-3",
      question:
        "Does each dollar deployed produce measurable, repeatable ROI?",
    },
  ],
};

export const STORAGE_KEY = "flip4o-ideas";
export const IDEAS_CHANGED_EVENT = "flip4o-ideas-changed";
export const HOW_IT_WORKS_SEEN_KEY = "flip4o-how-it-works-seen";
export const MODAL_AUDIO_MUTED_KEY = "flip4o-modal-audio-muted";
