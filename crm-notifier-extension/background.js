// === CONTROL ROOM: Runs 24/7 even when CRM tab is not visible ===
// Analogy: Security office that never closes,
// receives radio calls from the guard inside

let crmTabId = null;
let crmWindowId = null;

// === STEP 1: RECEIVE MESSAGES FROM content.js ===
chrome.runtime.onMessage.addListener((message, sender) => {

  // Guard just started shift — save their location
  if (message.type === 'WATCHER_STARTED') {
    crmTabId = sender.tab.id;
    crmWindowId = sender.tab.windowId;
    console.log('CRM Notifier: Registered tab', crmTabId);
  }

  // Guard spotted a new visitor — fire the alarm!
  if (message.type === 'NEW_MESSAGE') {
    fireNotification(
      'New Customer Message! 💬',
      `${message.count} unread message(s) waiting for your reply.`
    );
  }

});

// === STEP 2: FIRE POPUP NOTIFICATION ===
function fireNotification(title, body) {
  chrome.notifications.create('crm_' + Date.now(), {
    type: 'basic',
    iconUrl: 'icon.png',
    title: title,
    message: body,
    priority: 2,
    requireInteraction: true
  });
}

// === STEP 3: CLICK NOTIFICATION → JUMP TO CRM TAB ===
// Works even from another virtual desktop!
chrome.notifications.onClicked.addListener((notificationId) => {

  chrome.notifications.clear(notificationId);

  if (crmTabId !== null) {
    // We know exactly where the CRM tab is — go straight there
    chrome.tabs.update(crmTabId, { active: true }, () => {
      chrome.windows.update(crmWindowId, { focused: true });
    });
  } else {
    // Fallback: search for CRM tab if we lost track
    chrome.tabs.query({ url: 'https://dev.cs.bpakr.wecar.ai/*' }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true }, () => {
          chrome.windows.update(tabs[0].windowId, { focused: true });
        });
      }
    });
  }

});

// === STEP 4: AUTO RE-REGISTER WHEN CRM TAB REFRESHES ===
// Analogy: If the guard changes uniform (page refresh),
// control room recognizes them again automatically
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.includes('dev.cs.bpakr.wecar.ai')
  ) {
    crmTabId = tabId;
    crmWindowId = tab.windowId;
    console.log('CRM Notifier: CRM tab re-registered after refresh', tabId);
  }
});

// === STEP 5: RESET IF CRM TAB IS CLOSED ===
// Analogy: Guard left the building — wipe their record
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === crmTabId) {
    crmTabId = null;
    crmWindowId = null;
    console.log('CRM Notifier: CRM tab closed — reset.');
  }
});
