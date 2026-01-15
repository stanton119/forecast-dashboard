import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ForecastChart = ({ forecastData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Humidity Forecast Chart</h2>
        <p className="text-blue-500">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Humidity Forecast Chart</h2>
        <p className="text-red-500">Error loading chart: {error}</p>
      </div>
    );
  }

  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Humidity Forecast Chart</h2>
        <p className="text-gray-600">No forecast data available.</p>
      </div>
    );
  }

  // Format data for Recharts: parse timestamp and ensure numbers
  const formattedData = forecastData.map((d) => ({
    ...d,
    timestamp: new Date(d.timestamp_iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    date: new Date(d.timestamp_iso).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    outsideHumidity: parseFloat(d.outside_humidity_percent),
    insideHumidity: parseFloat(d.inside_relative_humidity_percent),
  }));

  // Group data by date to display day on X-axis and time on tooltip
  const getXAxisTick = (value, index) => {
    // Only show date for the first entry of each day
    if (index === 0 || formattedData[index - 1].date !== formattedData[index].date) {
      return formattedData[index].date;
    }
    return '';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white border border-gray-300 rounded shadow-lg text-sm">
          <p className="font-bold">
            {data.date} {data.timestamp}
          </p>
          <p style={{ color: payload[0].stroke }}>Outdoor: {data.outsideHumidity}%</p>
          <p style={{ color: payload[1].stroke }}>Indoor: {data.insideHumidity}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Humidity Forecast</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="timestamp_iso"
            tickFormatter={getXAxisTick}
            height={60}
            angle={-30}
            textAnchor="end"
            interval="preserveStartEnd"
          />
          <YAxis label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="outsideHumidity"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Outdoor Humidity"
          />
          <Line
            type="monotone"
            dataKey="insideHumidity"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
            name="Indoor Humidity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
