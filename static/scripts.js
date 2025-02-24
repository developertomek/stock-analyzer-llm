const analyzeBtn = document.getElementById("analyze-btn");
const result = document.getElementById("result");
const modelSelect = document.getElementById("model-select");
const option = document.createElement("option");
const symbol = document.getElementById("symbol");

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
  symbol.disabled = !isSelected;
  analyzeBtn.disabled = !isSelected;
}

async function analyzeStock() {
  try {
    analyzeBtn.disabled = true;
    symbol.disabled = true;
    result.innerHTML = '<div class="loader"></div>';

    const symbolValue = symbol.value;
    const model = modelSelect.value;

    const response = await fetch(
      `/analyze_stock?symbol=${symbolValue}&model=${model}`,
      { method: "POST" }
    );
    const data = await response.json();
    result.innerText = data.response;
  } catch (error) {
    result.innerText = "Error analyzing stock. Please try again.";
  } finally {
    analyzeBtn.disabled = false;
    symbol.disabled = false;
  }
}
