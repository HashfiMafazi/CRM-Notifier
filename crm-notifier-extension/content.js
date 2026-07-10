// === WATCHER: Runs inside your CRM tab ===
// Analogy: A guard inside the building watching for new visitors

const BADGE_SELECTOR = '.bg-n-teal-9';
const CHECK_INTERVAL = 400;

let lastBadgeText = '';

function checkForNewMessages() {
  // Get ALL teal badges on screen at once
  // Analogy: Guard counts everyone wearing a teal badge,
  // not just the first person they see
  const badges = document.querySelectorAll(BADGE_SELECTOR);

  // Add up all badge numbers together
  let totalCount = 0;
  badges.forEach(badge => {
    const num = parseInt(badge.textContent.trim());
    if (!isNaN(num)) totalCount += num;
  });

    const currentText = totalCount > 0 ? String(totalCount) : '';

    // New message detected if total changed
    if (currentText !== '' && currentText !== '0' && currentText !== lastBadgeText) {
      console.log('CRM Notifier: New message detected —', currentText);
      chrome.runtime.sendMessage({
        type: 'NEW_MESSAGE',
        count: currentText
      });
      lastBadgeText = currentText;
    }

    // Reset when all badges clear
    if (currentText === '' || currentText === '0') {
      lastBadgeText = '';
    }
}

// Start watching
setInterval(checkForNewMessages, CHECK_INTERVAL);

// Register this tab with background.js
chrome.runtime.sendMessage({
  type: 'WATCHER_STARTED',
  url: window.location.href
});

console.log('CRM Notifier: Watcher active ✅');
