CRM New Message Notifier

https://github.com/user-attachments/assets/15d7b202-f82c-40ba-8a2f-00cfcabd7dc5

A lightweight browser extension that delivers instant desktop pop-up notifications whenever a new customer message arrives in your CRM — even when you're on another tab, another virtual desktop, or the browser is minimized.

Built by a Customer Support & Field Technical Engineer at WeCar Technology to solve a real workplace problem: the CRM platform only supported sound notifications, with no visual pop-up. This extension fills that gap with zero cost and zero server-side changes required.


📋 Table of Contents


The Problem
The Solution
Features
How It Works
Browser Compatibility
Installation

Desktop (Chrome / Opera)
Android (Kiwi Browser)



Configuration
File Structure
Security & Privacy
Troubleshooting
Known Limitations



❗ The Problem

The internal CRM platform used by the Customer Support team at WeCar Technology:


✅ Supports live chat with customers
✅ Has a built-in sound notification for new messages
❌ Has no visual pop-up notification
❌ Agents miss messages when multitasking or working across virtual desktops
❌ On mobile, minimizing the browser silences all alerts


This created delays in response time and a poor customer experience — especially during high-volume periods.


✅ The Solution

A self-built Chrome/Opera browser extension that:


Watches the CRM's unread message badge in real time
Fires a system-level pop-up notification the moment a new message arrives
Brings you directly to the CRM tab when you click the notification
Works entirely locally — no external servers, no data sent anywhere



✨ Features

FeatureDetails🔔 Instant pop-up notificationAppears over all windows, even on other virtual desktops⚡ Fast detectionChecks for new messages every 500ms🖱️ Click to focusClicking notification jumps directly to the CRM tab🔄 Auto re-registerAutomatically re-attaches if CRM tab refreshes🧹 Auto resetResets cleanly if CRM tab is closed📱 Android supportWorks on Android via Kiwi Browser🔒 Privacy firstZero data sent externally — runs 100% locally🪶 LightweightUses less than 5MB memory, near-zero CPU when idle


⚙️ How It Works

┌─────────────────────────────────────────────────────┐
│                   content.js                        │
│   Runs inside CRM tab                               │
│   Watches .bg-n-teal-9 badge every 500ms            │
│   Detects badge count change → sends message        │
└────────────────────┬────────────────────────────────┘
                     │ chrome.runtime.sendMessage()
                     ▼
┌─────────────────────────────────────────────────────┐
│                  background.js                      │
│   Runs 24/7 in background (Service Worker)          │
│   Receives NEW_MESSAGE signal                       │
│   Fires chrome.notifications.create()              │
│   On click → chrome.tabs.update() to focus CRM     │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
         🖥️ OS-level pop-up notification
         (appears over all windows & virtual desktops)

The extension uses two scripts:


content.js — injected into the CRM tab. Acts as a watcher that polls the unread badge element every 500ms and reports changes to background.js
background.js — a persistent Service Worker that runs regardless of which tab is active. It receives signals from content.js and triggers the actual OS notification



🌐 Browser Compatibility

BrowserPlatformSupportedGoogle ChromeWindows / Mac / Linux✅ YesOperaWindows / Mac / Linux✅ YesMicrosoft EdgeWindows / Mac / Linux✅ YesKiwi BrowserAndroid✅ YesChromeAndroid❌ No (no extension support)OperaAndroid❌ No (no extension support)FirefoxAny❌ No (different API)SafariAny❌ No (different platform)


🚀 Installation

Desktop (Chrome / Opera)


Download or clone this repository


bashgit clone https://github.com/YOUR_USERNAME/crm-notifier-extension.git


Open your browser's extension page



Chrome: chrome://extensions
Opera: opera://extensions



Enable Developer Mode (toggle in the top right corner)
Click "Load unpacked"
Select the project folder (the one containing manifest.json)
The extension will appear in your toolbar ✅
Open your CRM and allow notifications when prompted



Android (Kiwi Browser)


Install Kiwi Browser from the Google Play Store
Transfer the extension folder to your Android device

Compress the folder to a .zip file on your PC
Send via USB cable, Google Drive, or Telegram



Extract the .zip using the Files app on your device
Open Kiwi Browser and go to kiwi://extensions
Enable Developer Mode
Tap "+ (from .zip)" and select your zip file
Tap "Activate the extension"
Open your CRM in Kiwi Browser and allow notifications



Important for Android: To keep notifications working when Kiwi is minimized, go to:
Settings → Apps → Kiwi Browser → Battery → Unrestricted

Also lock Kiwi in Recent Apps by long-pressing its card and selecting Lock




🔧 Configuration

To adapt this extension for a different CRM, edit the top of content.js:

javascriptconst BADGE_SELECTOR = '.bg-n-teal-9'; // CSS class of the unread message badge
const CHECK_INTERVAL = 500;             // How often to check, in milliseconds

How to find your CRM's badge selector


Open your CRM in Chrome/Opera
Press F12 to open DevTools
Click the cursor/inspect icon (top left of DevTools)
Click on the unread message badge in your CRM
Look at the highlighted HTML — copy the class value
Add a . prefix and paste it as BADGE_SELECTOR


Example: if the badge HTML is <span class="unread-count">3</span>, set:

javascriptconst BADGE_SELECTOR = '.unread-count';


📁 File Structure

crm-notifier-extension/
├── manifest.json      # Extension config — permissions, URLs, file references
├── content.js         # Badge watcher — runs inside the CRM tab
└── background.js      # Service worker — fires notifications, handles clicks


🔒 Security & Privacy

This extension is designed with security as a priority:


✅ No external servers — all logic runs locally in your browser
✅ No data collection — customer messages, names, or any CRM content is never read or stored
✅ Scoped permissions — only runs on your specific CRM domain (host_permissions)
✅ No login access — the extension never touches authentication fields or credentials
✅ Open source — every line of code is visible and auditable in this repository
✅ Installed locally — not published to any browser store, reducing supply chain risk


The extension only observes whether a badge element exists and what number it shows — it never reads the content of messages.

Permissions used

PermissionWhy it's needednotificationsTo display the pop-up notificationtabsTo find and focus the CRM tab when notification is clickedscriptingTo inject the watcher script into the CRM tabstorageReserved for future use (e.g. settings persistence)


🛠️ Troubleshooting

Notification doesn't appear


Check that notifications are allowed for your browser in OS settings
Go to chrome://settings/content/notifications and ensure your CRM domain is not blocked
Make sure the extension toggle is enabled (blue) in chrome://extensions


Notification appears but clicking does nothing


Ensure your browser is not in Do Not Disturb mode
On Windows, check Focus Assist settings
On Linux (KDE), check Notification settings in System Settings


Extension loads but no notification on new message


Open your CRM, press F12 → Console
Check for the message: CRM Notifier: Watcher active ✅
If missing, reload the extension and refresh the CRM tab


Badge selector stopped working


Your CRM may have been updated and changed its CSS class names
Re-inspect the badge element using DevTools and update BADGE_SELECTOR in content.js



⚠️ Known Limitations

LimitationReasonRequires browser to be runningExtension needs a host browser to executeScreen must be on to see notificationOS limitation — notifications don't appear on locked screensAndroid: clicking notification may not always open browserAndroid restricts apps from forcing themselves to foreground over other fullscreen appsNo sound notificationRemoved due to browser autoplay policy restrictions on injected audio


💡 Background

This extension was built independently by a CS agent at WeCar Technology after identifying that the team's CRM platform lacked visual notifications — causing agents to miss customer messages during multitasking. The IT team had no plans to add this feature server-side, so this client-side solution was developed as a zero-cost, zero-infrastructure fix.

It was later rolled out to the full CS team across both desktop and Android devices.




