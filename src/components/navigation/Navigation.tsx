import { Calendar, Home, PieChart, Settings } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "analytics" | "recurring"
  >("overview");
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${activeTab === "overview" ? "active" : ""}`}
        onClick={() => setActiveTab("overview")}
      >
        <Home size={20} />
        Overview
      </button>
      <button
        className={`nav-button ${activeTab === "transactions" ? "active" : ""}`}
        onClick={() => setActiveTab("transactions")}
      >
        <Calendar size={20} />
        Transactions
      </button>
      <button
        className={`nav-button ${activeTab === "analytics" ? "active" : ""}`}
        onClick={() => setActiveTab("analytics")}
      >
        <PieChart size={20} />
        Analytics
      </button>
      <button
        className={`nav-button ${activeTab === "recurring" ? "active" : ""}`}
        onClick={() => setActiveTab("recurring")}
      >
        <Settings size={20} />
        Recurring
      </button>
    </nav>
  );
};
