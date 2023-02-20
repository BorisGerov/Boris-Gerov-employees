import React, { useState } from "react";
import Papa from "papaparse";

function App() {
  const [pairs, setPairs] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: false,
      complete: function (results) {
        const data = results.data.map((item) => ({
          id: item[0],
          projectId: item[1],
          startDate: item[2] === "NULL" || item[2] === "" ? new Date() : new Date(item[2]),
          endDate: item[3] === "NULL" || item[3] === "" ? new Date() : new Date(item[3]),
        }));
        const pairs = getPairs(data);
        setPairs(pairs);
      },
    });
  };

  const getPairs = (data) => {
    let pairs = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].projectId === data[j].projectId) {
          const start = data[i].startDate > data[j].startDate ? data[i].startDate : data[j].startDate;
          const end = data[i].endDate < data[j].endDate ? data[i].endDate : data[j].endDate;
          const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          if (diff > 0) {
            pairs.push({
              employees: [data[i].id, data[j].id],
              days: diff,
            });
          }
        }
      }
    }
    pairs.sort((a, b) => b.days - a.days);
    return pairs;
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <div>
        {pairs.map((pair, index) => (
          <div key={index}>
            Employees: {pair.employees[0]} and {pair.employees[1]}, Days worked together: {pair.days}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
