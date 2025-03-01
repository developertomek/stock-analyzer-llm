const analyzeBtn = document.getElementById("analyze-btn");
const result = document.getElementById("result");
const modelSelect = document.getElementById("model-select");
const option = document.createElement("option");
const symbolSelect = document.getElementById("symbol-select");
let stockChart = null;

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/models");
  const { models } = await response.json();

  models.forEach((el) => {
    option.value = el.model;
    option.textContent = el.model;
    modelSelect.appendChild(option);
  });

  modelSelect.addEventListener("change", (e) => {
    enableSymbolSelect(!!e.target.value);
  });
});

function enableSymbolSelect(isSelected) {
  symbolSelect.disabled = !isSelected;
  analyzeBtn.disabled = !isSelected;
}

async function analyzeStock() {
  try {
    analyzeBtn.disabled = true;
    symbolSelect.disabled = true;
    modelSelect.disabled = true;
    result.innerHTML = '<div class="loader"></div>';

    const symbolValue = symbolSelect.value;
    const model = modelSelect.value;
    const stockResponse = await fetch(`/stock/${symbolValue}`);
    const stockData = await stockResponse.json();

    createChart(stockData);

    const analysisResponse = await fetch(
      `/analyze_stock?symbol=${symbolValue}&model=${model}`,
      { method: "POST" }
    );
    const analysisData = await analysisResponse.json();
    result.innerText = analysisData.response;
  } catch (error) {
    result.innerText = "Error analyzing stock. Please try again.";
  } finally {
    analyzeBtn.disabled = false;
    symbolSelect.disabled = false;
    modelSelect.disabled = false;
  }
}

function createChart(data) {
  const ctx = document.getElementById("stockChart").getContext("2d");

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from(
        { length: data.close.length },
        (_, i) => `Day ${i + 1}`
      ),
      datasets: [
        {
          label: "Closing Price",
          data: data.close,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Stock Closing Prices",
          color: "#fefefe",
          font: { size: 16 },
        },
        tooltip: {
          callbacks: {
            label: (context) => `Price: $${context.raw.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "#666",
          },
          ticks: {
            color: "#fefefe",
          },
        },
        y: {
          grid: {
            color: "#666",
          },
          ticks: {
            color: "#fefefe",
            callback: (value) => `$${value.toFixed(2)}`,
          },
        },
      },
    },
  });
}
