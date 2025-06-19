import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import "./AlertsArea.css";
import SearchBar from "../SearchBar/SearchBar";
import AlertsManager from "../AlertsManager/AlertsManager";
import AuthContext from "../../contexts/AuthContext";
import { fetchWithAuth } from "../../utils/api";

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
        const api_response = await fetchWithAuth(
          `${apiUrl}/alerts?search_term=${trimmed}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );

        if (!api_response.ok) {
          const errorData = await api_response.json();
          throw new Error(errorData.message || "An error occurred");
        }

        const retrieved_alerts = await api_response.json();
        console.log("Retrieved alerts:", retrieved_alerts);
        setAlerts(retrieved_alerts);
      } catch (err) {
        // If error message is "Unauthorized", it means that the session has expired
        // In that case, error notification has already been handled by fetchWithAuth
        if (err.message !== "Unauthorized") {
          console.error(err);
          toast.error("Failed to fetch alerts. Please try again.");
        }
      }
    }
  };

  const deleteHandler = async (alert_id) => {
    try {
      const api_response = await fetchWithAuth(
        `${apiUrl}/alerts?id=${alert_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (!api_response.ok) {
        const errorData = await api_response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      // Refresh alerts after successful deletion
      toast.dismiss();
      toast.success("Alert deleted successfully!", {
        style: {
          marginTop: "66px",
        },
      });
      searchHandler(alertsSearchInput);
    } catch (err) {
      if (err.message !== "Unauthorized") {
        console.error(err);
        toast.error("Failed to delete alert. Please try again.");
      }
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
