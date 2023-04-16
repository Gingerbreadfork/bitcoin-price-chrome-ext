function formatBadgeText(price) {
  if (price > 9999) {
    return (price / 1000).toFixed(1) + 'k';
  }
  return price.toFixed(0);
}

async function fetchBitcoinPrice() {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
    const data = await response.json();
    const price = parseFloat(data.bpi.USD.rate.replace(',', ''));
    const badgeText = formatBadgeText(price);
    chrome.action.setBadgeText({ text: badgeText }); // Display the formatted price as badge text
    chrome.action.setBadgeBackgroundColor({ color: '#3A3A3A' }); // Set badge background color
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
  }
}

// Fetch Bitcoin price and update the badge text
function updateBadge() {
  fetchBitcoinPrice();
  chrome.alarms.create('fetchBitcoinPrice', { periodInMinutes: 1 });
}

// Add an event listener for when the alarm fires
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchBitcoinPrice') {
    fetchBitcoinPrice();
  }
});

// Initialize the badge when the extension is loaded
updateBadge();
