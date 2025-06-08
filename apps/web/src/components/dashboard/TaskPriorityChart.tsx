import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { api } from "~/utils/api";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

const TaskPriorityChart = () => {
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

  if (isLoading || !tasks) return <p>Loading chart...</p>;

  const priorityCounts = tasks.reduce(
    (acc, task) => {
      const priority = task.priority.toLowerCase();
      acc[priority] = (acc[priority] ?? 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<string, number>,
  );

  const chartData = [
    { name: "High", value: priorityCounts.high },
    { name: "Medium", value: priorityCounts.medium },
    { name: "Low", value: priorityCounts.low },
  ];

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TaskPriorityChart;
