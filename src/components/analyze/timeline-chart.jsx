"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export function TimelineChart({
  data = [],
  title,
  color = "#ec4899",
  gradientId = "colorValue",
  className,
}) {
  // Format data for chart
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      }),
    }));
  }, [data]);

  // Get last 90 days of data for better visualization
  const recentData = useMemo(() => {
    return chartData.slice(-90);
  }, [chartData]);

  if (data.length === 0) {
    return (
      <div className={cn(
        "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
        className
      )}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-sm text-muted-foreground">Veri bulunamadı</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          Son {recentData.length} gün
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={recentData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
            />
            <XAxis
              dataKey="formattedDate"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              itemStyle={{ color: color }}
              formatter={(value) => [value, "Adet"]}
              labelFormatter={(label) => `Tarih: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
