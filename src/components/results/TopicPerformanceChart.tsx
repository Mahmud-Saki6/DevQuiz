"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = { topic: string; accuracy: number };

function colorFor(pct: number) {
  if (pct >= 70) return "#2e7d32";
  if (pct >= 40) return "#ed6c02";
  return "#d32f2f";
}

export default function TopicPerformanceChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: 16, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="topic" interval={0} angle={-10} height={60} />
        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(v) => `${v}%`} />
        <Bar dataKey="accuracy">
          {data.map((row) => (
            <Cell key={row.topic} fill={colorFor(row.accuracy)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

