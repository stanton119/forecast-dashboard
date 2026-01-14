export function formatDataForCsv(data) {
  if (!data || data.length === 0) {
    return "Date,Time,Outdoor Humidity (%),Outdoor Temp (C),Indoor RH (%)";
  }

  const headers = "Date,Time,Outdoor Humidity (%),Outdoor Temp (C),Indoor RH (%)";

  const rows = data.map(item => {
    const date = new Date(item.timestamp_iso).toLocaleDateString();
    const time = new Date(item.timestamp_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const outdoorHumidity = item.outside_humidity_percent;
    const outdoorTemp = item.outside_temp_c;
    const indoorRH = item.inside_relative_humidity_percent ? item.inside_relative_humidity_percent.toFixed(1) : '';

    return `${date},${time},${outdoorHumidity},${outdoorTemp},${indoorRH}`;
  });

  return [headers, ...rows].join('\n');
}

export function downloadCsv(filename, data) {
  const csvString = formatDataForCsv(data);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  // Create a link and programmatically click it to trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) { // Feature detection for HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}