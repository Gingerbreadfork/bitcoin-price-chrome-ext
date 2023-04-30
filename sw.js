let selectedCurrency = "USD";

function formatBadgeText(price) {
  if (price >= 10000) {
    return (price / 1000).toFixed(1);
  }
  return Math.floor(price * 10) / 10;
}

let currentPrice = 0;

async function fetchBitcoinPrice(currency) {
  try {
    if (!currency) {
      currency = "USD";
    }
    const response = await fetch(
      `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`
    );
    const data = await response.json();
    currentPrice = parseFloat(data.bpi[currency].rate.replace(",", ""));
    const badgeText = formatBadgeText(currentPrice);
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: "#3A3A3A" });
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
  }
}

function updateBadge(currency) {
  fetchBitcoinPrice(currency);
  chrome.alarms.create("fetchBitcoinPrice", { periodInMinutes: 1 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchBitcoinPrice") {
    fetchBitcoinPrice(selectedCurrency);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCurrentPrice") {
    selectedCurrency = request.currency;
    fetchBitcoinPrice(selectedCurrency);
    sendResponse({ price: currentPrice });
  }
});

function loadSelectedCurrencyFromStorage(callback) {
  chrome.storage.local.get(["selectedCurrency"], (result) => {
    if (result.selectedCurrency) {
      selectedCurrency = result.selectedCurrency;
      callback(selectedCurrency);
    } else {
      callback(selectedCurrency);
    }
  });
}

loadSelectedCurrencyFromStorage((selectedCurrency) => {
  updateBadge(selectedCurrency);
});
