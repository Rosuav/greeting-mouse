chrome.contextMenus.create({
	documentUrlPatterns: ["https://*.twitch.tv/*"],
	id: "toggle_active",
	title: "Toggle Greeting-Mouse highlight",
})
chrome.contextMenus.onClicked.addListener((info, tab) => {
	const key = info.pageUrl; //Must match the corresponding const in highlighter.js
	chrome.storage.sync.get(key, info => {
		chrome.storage.sync.set({[key]: !info[key]},
			() => chrome.tabs.sendMessage(tab.id, {greetingmouse: "reinit"}));
	});
});
