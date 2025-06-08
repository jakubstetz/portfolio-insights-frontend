import { useState } from "react";
import toast from "react-hot-toast";
import "./ChartArea.css";
import SearchBar from "../SearchBar/SearchBar";
import Chart from "../Chart/Chart";

// HARDCODED VALUES FOR STOCK PRICE HISTORY RETRIEVAL
const startDate = "2024-04-10";
const interval = "daily";

// Uses SearchBar input to fetch and display stock info
function ChartArea({ apiUrl }) {
  const [chartData, setChartData] = useState(null);
  const [chartSearchInput, setChartSearchInput] = useState("");
  const [chartIsLoading, setChartIsLoading] = useState(false);

  const searchHandler = async (ticker_searched) => {
    if (ticker_searched === "") {
      // Empty search
      setChartData(null);
      return;
    }

    const trimmed = ticker_searched.trim().toUpperCase();
    setChartSearchInput(trimmed);
    const isValidTicker = /^[A-Z]{1,10}$/.test(trimmed);

    if (!isValidTicker) {
      toast.dismiss();
      toast.error("Invalid search.");
    } else {
      setChartIsLoading(true);
      try {
        const api_response = await fetch(
          `${apiUrl}/stocks?ticker=${trimmed}&startDate=${startDate}&interval=${interval}`,
        );
        if (api_response.ok) {
          const stock_data = await api_response.json();
          setChartData(stock_data);
        } else {
          toast.dismiss();
          toast.error("Ticker not found.");
          setChartData(false);
        }
      } catch (err) {
        console.error(err);
        setChartData(null);
      } finally {
        setChartIsLoading(false);
      }
    }
  };

  return (
    <div id="chart-area">
      <SearchBar
        searchHandler={searchHandler}
        searchInput={chartSearchInput}
        setSearchInput={setChartSearchInput}
      />
      <Chart chartData={chartData} chartIsLoading={chartIsLoading} />
    </div>
  );
}

export default ChartArea;
