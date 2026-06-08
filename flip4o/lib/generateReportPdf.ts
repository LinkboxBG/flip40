import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { BRAND, CRITERIA, VERDICT_LABELS } from "./constants";
import { sourceLabel } from "./evaluation";
import type { AnalysisResult, CriteriaEvaluation, CriteriaScores } from "./types";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const COL_GAP = 8;
const COL_W = (CONTENT_W - COL_GAP) / 2;
const COL_LEFT_X = MARGIN;
const COL_RIGHT_X = MARGIN + COL_W + COL_GAP;

const LIME = { r: 184, g: 255, b: 0 };
const TEXT_PRIMARY = { r: 245, g: 245, b: 245 };
const TEXT_SECONDARY = { r: 136, g: 136, b: 136 };
const TEXT_MUTED = { r: 68, g: 68, b: 68 };
const BG = { r: 8, g: 8, b: 8 };
const SURFACE = { r: 17, g: 17, b: 17 };

const TICK_SIZE = 3;
const TICK_GAP = 1.5;
const TICK_COUNT = 5;

function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 60) || "Analysis";
}

async function loadImageDataUrl(src: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

const RADAR_CAPTURE_PADDING = 32;

async function captureRadarChart(elementId: string): Promise<string | null> {
  const el = document.getElementById(elementId);
  if (!el) return null;

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  await new Promise<void>((resolve) => setTimeout(resolve, 900));

  const canvas = await html2canvas(el, {
    backgroundColor: BRAND.bgSurface,
    scale: 2,
    logging: false,
    useCORS: true,
    width: el.offsetWidth + RADAR_CAPTURE_PADDING * 2,
    height: el.offsetHeight + RADAR_CAPTURE_PADDING * 2,
    x: -RADAR_CAPTURE_PADDING,
    y: -RADAR_CAPTURE_PADDING,
    scrollX: 0,
    scrollY: -window.scrollY,
    onclone: (_doc, clonedEl) => {
      const cloned = clonedEl as HTMLElement;
      cloned.style.overflow = "visible";
      cloned.style.padding = `${RADAR_CAPTURE_PADDING}px`;
      cloned.style.boxSizing = "border-box";

      cloned.querySelectorAll("svg").forEach((svg) => {
        svg.style.overflow = "visible";
      });

      cloned.querySelectorAll(".flip-score-micro, .stat-label").forEach((node) => {
        (node as HTMLElement).style.display = "none";
      });
    },
  });

  return canvas.toDataURL("image/png");
}

function drawPageBackground(doc: jsPDF) {
  doc.setFillColor(BG.r, BG.g, BG.b);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function drawAccentLine(doc: jsPDF, y: number, x = MARGIN, width = CONTENT_W) {
  doc.setDrawColor(LIME.r, LIME.g, LIME.b);
  doc.setLineWidth(0.35);
  doc.line(x, y, x + width, y);
}

function drawSectionHeader(doc: jsPDF, title: string, x: number, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(LIME.r, LIME.g, LIME.b);
  doc.text(title, x, y);
  return y + 7;
}

function drawProgressTicks(doc: jsPDF, x: number, y: number, score: number) {
  const clamped = Math.min(TICK_COUNT, Math.max(0, Math.round(score)));

  for (let i = 0; i < TICK_COUNT; i++) {
    const tickX = x + i * (TICK_SIZE + TICK_GAP);
    const filled = i < clamped;

    if (filled) {
      doc.setFillColor(LIME.r, LIME.g, LIME.b);
      doc.setDrawColor(LIME.r, LIME.g, LIME.b);
    } else {
      doc.setFillColor(SURFACE.r, SURFACE.g, SURFACE.b);
      doc.setDrawColor(51, 51, 51);
    }

    doc.setLineWidth(0.25);
    doc.rect(tickX, y - TICK_SIZE + 1, TICK_SIZE, TICK_SIZE, filled ? "FD" : "S");
  }
}

function drawCriterionRow(
  doc: jsPDF,
  x: number,
  colW: number,
  label: string,
  score: number,
  provenance: string,
  y: number,
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  doc.text(label, x, y);

  const ticksX = x + colW - TICK_COUNT * (TICK_SIZE + TICK_GAP) + TICK_GAP;
  drawProgressTicks(doc, ticksX, y, score);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text(provenance, x, y + 3.5);

  return y + 9;
}

function drawScoreSummaryBlock(
  doc: jsPDF,
  result: AnalysisResult,
  x: number,
  colW: number,
  y: number,
): number {
  const blockH = 34;
  const blockY = y;

  doc.setFillColor(SURFACE.r, SURFACE.g, SURFACE.b);
  doc.setDrawColor(LIME.r, LIME.g, LIME.b);
  doc.setLineWidth(0.45);
  doc.roundedRect(x, blockY, colW, blockH, 1.5, 1.5, "FD");

  let innerY = blockY + 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  doc.text(`Base Score: ${result.baseScore}`, x + 5, innerY);
  innerY += 5;
  doc.text(`Penalty: −${result.totalPenalty}`, x + 5, innerY);
  innerY += 7;

  doc.setFillColor(LIME.r, LIME.g, LIME.b);
  doc.roundedRect(x + 5, innerY - 4, colW - 10, 9, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(BG.r, BG.g, BG.b);
  doc.text(`Final Score: ${result.finalScore} / 100`, x + 8, innerY + 1.5);

  return blockY + blockH + 6;
}

function drawFlipScoreBlock(
  doc: jsPDF,
  score: number,
  x: number,
  colW: number,
  y: number,
): number {
  const blockH = 22;

  doc.setFillColor(SURFACE.r, SURFACE.g, SURFACE.b);
  doc.setDrawColor(LIME.r, LIME.g, LIME.b);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, colW, blockH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  doc.text("FLIP SCORE", x + 5, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(LIME.r, LIME.g, LIME.b);
  doc.text(String(score), x + colW - 5, y + 14, { align: "right" });

  return y + blockH + 4;
}

function drawVerdictHero(
  doc: jsPDF,
  reportVerdict: string,
  verdictText: string,
  y: number,
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  doc.text("VERDICT", PAGE_W / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(LIME.r, LIME.g, LIME.b);
  doc.text(reportVerdict, PAGE_W / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  const verdictLines = doc.splitTextToSize(verdictText, CONTENT_W - 24);
  doc.text(verdictLines, PAGE_W / 2, y, { align: "center" });
  y += verdictLines.length * 4.5 + 6;

  return y;
}

function drawMethodologyFooter(doc: jsPDF, evaluation: CriteriaEvaluation) {
  const footerTop = PAGE_H - MARGIN - 22;
  const methodologyText = methodologyDetail(evaluation).join(" ");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);

  const lines = doc.splitTextToSize(methodologyText, CONTENT_W);
  let y = footerTop - lines.length * 3.2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text("EVALUATION METHODOLOGY", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text(lines, MARGIN, y);

  drawAccentLine(doc, PAGE_H - MARGIN - 10);

  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text("FLIP40.COM — Confidential Analysis Report", PAGE_W / 2, PAGE_H - MARGIN - 4, {
    align: "center",
  });
  doc.text("BY IVAN KOLEV", PAGE_W / 2, PAGE_H - MARGIN, { align: "center" });
}

export interface GenerateReportOptions {
  ideaName: string;
  scores: CriteriaScores;
  evaluation: CriteriaEvaluation;
  result: AnalysisResult;
  radarChartElementId?: string;
}

const METHODOLOGY_INTRO =
  "Each criterion is scored 1–5. Manual scores reflect direct slider input. Auto scores are produced by Auto-evaluate — three scenario questions averaged and rounded to the nearest integer.";

function methodologyDetail(evaluation: CriteriaEvaluation): string[] {
  const manual = CRITERIA.filter((c) => evaluation[c.key].source === "manual").map(
    (c) => c.label,
  );
  const auto = CRITERIA.filter((c) => evaluation[c.key].source === "calculated").map(
    (c) => c.label,
  );

  const parts: string[] = [METHODOLOGY_INTRO];

  if (manual.length > 0) {
    parts.push(`Manual input: ${manual.join(", ")}.`);
  }
  if (auto.length > 0) {
    parts.push(`Auto-evaluate: ${auto.join(", ")}.`);
  }
  if (manual.length === 0 && auto.length === 0) {
    parts.push("All criteria were evaluated using the default manual workflow.");
  }

  parts.push(
    "The FLIP40.COM engine applies penalty rules to the base score derived from these criterion values. Final verdict reflects both composite score and structural weaknesses.",
  );

  return parts;
}

export async function generateReportPdf({
  ideaName,
  scores,
  evaluation,
  result,
  radarChartElementId = "radar-chart-export",
}: GenerateReportOptions): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  drawPageBackground(doc);

  let y = MARGIN;

  try {
    const logoData = await loadImageDataUrl("/assets/svg/flip40-text.svg", 448, 110);
    const logoW = 48;
    const logoH = (110 / 448) * logoW;
    doc.addImage(logoData, "PNG", MARGIN, y, logoW, logoH);
    y += logoH + 8;
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(LIME.r, LIME.g, LIME.b);
    doc.text("FLIP40.COM", MARGIN, y + 8);
    y += 16;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  doc.text("STRATEGIC ASSET EVALUATION REPORT", MARGIN, y);
  y += 8;

  drawAccentLine(doc, y);
  y += 9;

  const projectName = ideaName.trim() || "Untitled Project";
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(TEXT_PRIMARY.r, TEXT_PRIMARY.g, TEXT_PRIMARY.b);
  doc.text(projectName, MARGIN, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_SECONDARY.r, TEXT_SECONDARY.g, TEXT_SECONDARY.b);
  doc.text(`Generated: ${dateStr}`, MARGIN, y);
  y += 10;

  const reportVerdict = VERDICT_LABELS[result.verdictTone];
  y = drawVerdictHero(doc, reportVerdict, result.verdict, y);

  drawAccentLine(doc, y);
  y += 10;

  const gridStartY = y;
  let leftY = gridStartY;
  let rightY = gridStartY;

  leftY = drawSectionHeader(doc, "CRITERIA SCORES", COL_LEFT_X, leftY);

  for (const criterion of CRITERIA) {
    const score = scores[criterion.key];
    const provenance = sourceLabel(evaluation[criterion.key].source);
    leftY = drawCriterionRow(
      doc,
      COL_LEFT_X,
      COL_W,
      criterion.label,
      score,
      provenance,
      leftY,
    );
  }

  leftY += 4;
  leftY = drawSectionHeader(doc, "SCORE SUMMARY", COL_LEFT_X, leftY);
  leftY = drawScoreSummaryBlock(doc, result, COL_LEFT_X, COL_W, leftY);

  const radarData = await captureRadarChart(radarChartElementId);
  rightY = drawSectionHeader(doc, "CRITERIA RADAR", COL_RIGHT_X, rightY);

  if (radarData) {
    doc.addImage(radarData, "PNG", COL_RIGHT_X, rightY, COL_W, COL_W);
    rightY += COL_W + 6;
  } else {
    doc.setFillColor(SURFACE.r, SURFACE.g, SURFACE.b);
    doc.setDrawColor(51, 51, 51);
    doc.roundedRect(COL_RIGHT_X, rightY, COL_W, COL_W, 1, 1, "S");
    rightY += COL_W + 6;
  }

  rightY = drawFlipScoreBlock(doc, result.finalScore, COL_RIGHT_X, COL_W, rightY);

  drawMethodologyFooter(doc, evaluation);

  const filename = `FLIP40.COM_Analysis_${sanitizeFilename(projectName)}.pdf`;
  doc.save(filename);
}
