function formatBadgeText(price) {
  if (price >= 10000) {
    return (price / 1000).toFixed(1);
  }
  return Math.floor(price * 10) / 10;
}

let currentPrice = 0;

async function fetchBitcoinPrice() {
  try {
    const response = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
    );
    const data = await response.json();
    currentPrice = parseFloat(data.bpi.USD.rate.replace(",", ""));
    const badgeText = formatBadgeText(currentPrice);
    chrome.action.setBadgeText({ text: badgeText }); // Display the formatted price as badge text
    chrome.action.setBadgeBackgroundColor({ color: "#3A3A3A" }); // Set badge background color
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
  }
}

// Fetch Bitcoin price and update the badge text
function updateBadge() {
  fetchBitcoinPrice();
  chrome.alarms.create("fetchBitcoinPrice", { periodInMinutes: 1 });
}

// Add an event listener for when the alarm fires
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchBitcoinPrice") {
    fetchBitcoinPrice();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCurrentPrice") {
    sendResponse({ price: currentPrice });
  }
});

// Initialize the badge when the extension is loaded
updateBadge();
