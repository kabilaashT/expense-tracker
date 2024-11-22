import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseChart from "./ExpenseChart";

const API_URL = "http://127.0.0.1:5001/expenses";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}?sort_order=${sortOrder}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [sortOrder]);

  const addExpense = async (newExpense) => {
    try {
      await axios.post(API_URL, newExpense);
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="expenses-container">
      <h2 className="app-title">Expense Tracker</h2>
      <ExpenseForm addExpense={addExpense} />
      <div className="sort-buttons">
        <button
          className="sort-button"
          onClick={() => setSortOrder("asc")}
          disabled={sortOrder === "asc"}
        >
          Sort Ascending
        </button>
        <button
          className="sort-button"
          onClick={() => setSortOrder("desc")}
          disabled={sortOrder === "desc"}
        >
          Sort Descending
        </button>
      </div>
      <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
      <ExpenseChart expenses={expenses} />
    </div>
  );
}

export default Expenses;
