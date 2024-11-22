import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  // Prepare the chart data
  const data = {
    labels: expenses.map((expense) => expense.title), // Use expense titles as labels
    datasets: [
      {
        label: "Expense Amount",
        data: expenses.map((expense) => expense.amount), // Expense amounts
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expenses Overview",
      },
    },
  };

  return (
    <div>
      <h2>Expense Chart</h2>
      <Bar data={data} options={options} key={JSON.stringify(data)} /> {/* Force re-render */}
    </div>
  );
}

export default ExpenseChart;
