"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { BRAND, UI } from "@/lib/constants";
import { scoresToRadarData } from "@/lib/engine";
import type { CriteriaScores } from "@/lib/types";
import { ClientOnlyChart } from "./ClientOnlyChart";

interface RadarChartPanelProps {
  scores: CriteriaScores;
  size?: "default" | "large";
}

const SIZE_CONFIG = {
  default: {
    containerClass: "h-72 min-h-[288px]",
    outerRadius: "58%",
    margin: { top: 16, right: 24, bottom: 16, left: 24 },
  },
  large: {
    containerClass: "h-[360px] min-h-[360px]",
    outerRadius: "68%",
    margin: { top: 20, right: 32, bottom: 28, left: 32 },
  },
} as const;

export function RadarChartPanel({ scores, size = "default" }: RadarChartPanelProps) {
  const config = SIZE_CONFIG[size];
  const scoreKey = useMemo(
    () =>
      [
        scores.flipPotential,
        scores.moat,
        scores.marketSize,
        scores.execution,
        scores.capitalEfficiency,
      ].join("-"),
    [
      scores.flipPotential,
      scores.moat,
      scores.marketSize,
      scores.execution,
      scores.capitalEfficiency,
    ],
  );

  const data = useMemo(
    () =>
      scoresToRadarData({
        flipPotential: scores.flipPotential,
        moat: scores.moat,
        marketSize: scores.marketSize,
        execution: scores.execution,
        capitalEfficiency: scores.capitalEfficiency,
      }),
    [
      scores.flipPotential,
      scores.moat,
      scores.marketSize,
      scores.execution,
      scores.capitalEfficiency,
    ],
  );

  return (
    <ClientOnlyChart>
      <div className={`w-full ${config.containerClass}`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius={config.outerRadius}
            data={data}
            margin={config.margin}
          >
            <PolarGrid stroke={UI.chart.gridStroke} />
            <PolarAngleAxis
              dataKey="criterion"
              tick={{
                fill: UI.chart.tickFill,
                fontSize: 11,
                fontFamily: "var(--font-body), monospace",
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={false}
              axisLine={false}
            />
            <Radar
              key={scoreKey}
              name="Score"
              dataKey="value"
              stroke={UI.chart.stroke}
              fill={UI.chart.fill}
              fillOpacity={UI.chart.fillOpacity}
              strokeWidth={2}
              animationDuration={800}
              isAnimationActive
            />
            <Tooltip
              contentStyle={{
                background: UI.chart.tooltipBg,
                border: `1px solid ${UI.chart.tooltipBorder}`,
                borderRadius: "2px",
                fontSize: "14px",
                color: BRAND.textPrimary,
                fontFamily: "var(--font-body), monospace",
                padding: "10px 14px",
              }}
              itemStyle={{ color: BRAND.lime }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ClientOnlyChart>
  );
}
