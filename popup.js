let currentPrice = 0;
let selectedCurrency = "USD";

function getPrice() {
  chrome.runtime.sendMessage({ action: "getCurrentPrice", currency: selectedCurrency }, (response) => {
    currentPrice = response.price;
    document.getElementById(
      "currentPrice"
    ).textContent = `Price: ${selectedCurrency} ${currentPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    calculateBtcValue();
  });
}

function saveToStorage(key, value) {
  chrome.storage.local.set({ [key]: value });
}

function loadFromStorage(key, callback) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key]);
  });
}

function onCurrencyChange() {
  selectedCurrency = getSelectedCurrency();
  saveToStorage("selectedCurrency", selectedCurrency);
  chrome.runtime.sendMessage({ action: "setSelectedCurrency", currency: selectedCurrency });
  getPrice();
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage("selectedCurrency", (currency) => {
    if (currency) {
      selectedCurrency = currency;
      document.getElementById("currency").value = selectedCurrency;
    }
    getPrice(); // Move this line inside this callback function
  });

  loadFromStorage("btcAmount", (btcAmount) => {
    if (btcAmount) {
      document.getElementById("btcAmount").value = btcAmount;
      calculateBtcValue();
    }
  });

  loadFromStorage("satsAmount", (satsAmount) => {
    if (satsAmount) {
      document.getElementById("satsAmount").value = satsAmount;
      convertSats();
    }
  });

  document
    .getElementById("btcAmount")
    .addEventListener("input", calculateBtcValue);
  document.getElementById("satsAmount").addEventListener("input", convertSats);
  document
    .getElementById("currency")
    .addEventListener("change", onCurrencyChange);
});

function calculateBtcValue() {
  const btcAmount = parseFloat(
    document.getElementById("btcAmount").value.replace(",", ".")
  );
  if (isNaN(btcAmount)) {
    document.getElementById("btcValue").textContent = "Value: Invalid input";
  } else {
    saveToStorage("btcAmount", btcAmount);
    const value = btcAmount * currentPrice;
    document.getElementById(
      "btcValue"
    ).textContent = `Value: ${selectedCurrency} ${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function convertSats() {
  const satsAmount = parseInt(document.getElementById("satsAmount").value);
  if (isNaN(satsAmount)) {
    document.getElementById("satsToBtc").textContent = "BTC: Invalid input";
  } else {
    saveToStorage("satsAmount", satsAmount);
    const btc = satsAmount / 100000000;
    document.getElementById("satsToBtc").textContent = `BTC: ${btc.toLocaleString(undefined, {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    })}`;
  }
}

function getSelectedCurrency() {
  const currencyElement = document.getElementById("currency");
  return currencyElement ? currencyElement.value : "USD";
}

setInterval(getPrice, 1000); // Poll the background script for updates every second
