let currentPrice = 0;

// Get the current Bitcoin price from the background script
function getPrice() {
  chrome.runtime.sendMessage({ action: "getCurrentPrice" }, (response) => {
    currentPrice = response.price;
    document.getElementById(
      "currentPrice"
    ).textContent = `Price: $${currentPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    calculateBtcValue(); // Update the BTC value whenever the price is updated
  });
}

getPrice();

// Calculate the value of a specific amount of Bitcoin
function calculateBtcValue() {
  const btcAmount = parseFloat(document.getElementById("btcAmount").value);
  if (isNaN(btcAmount)) {
    document.getElementById("btcValue").textContent = "Value: $0";
    return;
  }
  const value = btcAmount * currentPrice;
  document.getElementById(
    "btcValue"
  ).textContent = `Value: $${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Convert Satoshis to Bitcoin and vice versa
function convertSats() {
  const satsAmount = parseInt(document.getElementById("satsAmount").value);
  if (isNaN(satsAmount)) {
    document.getElementById("satsToBtc").textContent = "BTC: 0";
    return;
  }
  const btcAmount = (satsAmount / 100000000).toFixed(8);
  document.getElementById("satsToBtc").textContent = `BTC: ${btcAmount}`;
}

// Add event listeners to the input elements
document
  .getElementById("btcAmount")
  .addEventListener("input", calculateBtcValue);
document.getElementById("satsAmount").addEventListener("input", convertSats);

setInterval(getPrice, 1000); // Poll the background script for updates every second
