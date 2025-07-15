import React, { useState } from "react";
import classes from "./Insights.module.scss";

const TABS = ["Expenses", "Income", "Assets"];

export const Insights = () => {
  const [selectedTab, setSelectedTab] = useState("Expenses");

  return (
    <div className={classes.insightsCard}>
      <h2 className={classes.insightsHeading}>Insights</h2>
      <div className={classes.insightsSubtitle}>
        Visualize your {selectedTab.toLowerCase()} breakdown
      </div>
      <div className={classes.insightsTabs}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={
              classes.insightsTab +
              (selectedTab === tab ? " " + classes.activeTab : "")
            }
            onClick={() => setSelectedTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={classes.pieChartPlaceholder}>
        {/* Replace this with a real pie chart in the future */}
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="#f3f4f6" />
          <path d="M60 60 L60 10 A50 50 0 0 1 110 60 Z" fill="#6366f1" />
          <path d="M60 60 L110 60 A50 50 0 1 1 60 10 Z" fill="#22c55e" />
        </svg>
        <div className={classes.pieChartLabel}>Pie chart for {selectedTab}</div>
      </div>
    </div>
  );
}; 