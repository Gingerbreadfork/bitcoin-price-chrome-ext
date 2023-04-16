function formatBadgeText(price) {
  if (price > 9999) {
    return (price / 1000).toFixed(1) + 'k';
  }
  return price.toFixed(0);
}

function fetchBitcoinPrice() {
  fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json')
    .then((response) => response.json())
    .then((data) => {
      const price = parseFloat(data.bpi.USD.rate.replace(',', ''));
      const badgeText = formatBadgeText(price);
      chrome.action.setBadgeText({ text: badgeText }); // Display the formatted price as badge text
      chrome.action.setBadgeBackgroundColor({ color: '#3A3A3A' }); // Set badge background color
    })
    .catch((error) => {
      console.error('Error fetching Bitcoin price:', error);
    });
}

// Fetch Bitcoin price and update the badge text
function updateBadge() {
  fetchBitcoinPrice();
  setInterval(fetchBitcoinPrice, 60000); // Update every 60 seconds
}

// Add an event listener for when a new window is created
chrome.windows.onCreated.addListener(() => {
  updateBadge();
});

// Initialize the badge when the extension is loaded
updateBadge();
