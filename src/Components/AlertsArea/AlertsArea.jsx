import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import "./AlertsArea.css";
import SearchBar from "../SearchBar/SearchBar";
import AlertsManager from "../AlertsManager/AlertsManager";
import AuthContext from "../../contexts/AuthContext";

function AlertsArea({
  onNewAlert,
  alertsRefresh,
  alertsSearchInput,
  setAlertsSearchInput,
  apiUrl,
}) {
  const { getToken } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);

  const searchHandler = async (search_term) => {
    const trimmed = search_term.trim().toUpperCase();
    setAlertsSearchInput(trimmed);
    const isValidTicker = /^$|^[A-Z]{1,10}$/.test(trimmed);

    if (!isValidTicker) {
      toast.dismiss();
      toast.error("Invalid search.");
    } else {
      try {
        const api_response = await fetch(
          `${apiUrl}/alerts?search_term=${trimmed}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          },
        );
        const retrieved_alerts = await api_response.json();
        console.log("Retrieved alerts:", retrieved_alerts);
        setAlerts(retrieved_alerts);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteHandler = async (alert_id) => {
    try {
      const api_response = await fetch(`${apiUrl}/alerts?id=${alert_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (api_response.ok) {
        toast.dismiss();
        toast.success("Alert deleted.");
        console.log(`Alert #${alert_id} deleted.`);
        // Clear search input
        setAlertsSearchInput("");
        searchHandler(""); // Refresh displayed list of alerts
      } else {
        const error = await api_response.json();
        toast.dismiss();
        toast.error(error.detail || "Failed to delete alert.");
        console.error("Failed to delete alert:", error.detail);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Network error.");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    // Load alerts on mount and when refresh flag changes
    searchHandler("");
  }, [alertsRefresh]);

  return (
    <div id="alerts-area">
      <h3 className="section-label">Stock Price Alerts</h3>
      <div id="glow-divider"></div>
      <SearchBar
        searchHandler={searchHandler}
        searchInput={alertsSearchInput}
        setSearchInput={setAlertsSearchInput}
      />
      <AlertsManager
        onNewAlert={onNewAlert}
        alerts={alerts}
        deleteHandler={deleteHandler}
      />
    </div>
  );
}

export default AlertsArea;
