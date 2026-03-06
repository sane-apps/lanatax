"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TX_TYPE_COLORS } from "@/lib/constants";
import type { HeliusTransaction } from "@/lib/types";

interface OverviewTabProps {
  transactions: HeliusTransaction[];
}

export function OverviewTab({ transactions }: OverviewTabProps) {
  const typeData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of transactions) {
      map[tx.type] = (map[tx.type] || 0) + 1;
    }
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        color: TX_TYPE_COLORS[name] || TX_TYPE_COLORS.UNKNOWN,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const volumeData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of transactions) {
      const d = new Date(tx.timestamp * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [transactions]);

  return (
    <div className="grid gap-[21px] lg:grid-cols-2">
      {/* Pie chart */}
      <Card className="glass-card animate-fade-in border-0 rounded-xl">
        <CardHeader className="pb-[8px] px-[21px] pt-[21px]">
          <CardTitle className="text-sm font-medium text-white/90">
            Transaction Types
          </CardTitle>
        </CardHeader>
        <CardContent className="px-[21px] pb-[21px]">
          <div className="flex flex-col items-center gap-[21px] sm:flex-row">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f14",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-x-[21px] gap-y-[8px]">
              {typeData.slice(0, 8).map((d) => (
                <div key={d.name} className="flex items-center gap-[8px] text-sm">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-white/90">{d.name}</span>
                  <span className="text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area chart */}
      <Card className="glass-card animate-fade-in border-0 rounded-xl">
        <CardHeader className="pb-[8px] px-[21px] pt-[21px]">
          <CardTitle className="text-sm font-medium text-white/90">
            Transaction Volume
          </CardTitle>
        </CardHeader>
        <CardContent className="px-[21px] pb-[21px]">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#ffffff", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#ffffff", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f0f14",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#volumeGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
