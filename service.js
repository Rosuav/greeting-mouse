chrome.contextMenus.create({
	documentUrlPatterns: ["https://*.twitch.tv/*"],
	id: "toggle_active",
	title: "Toggle Greeting-Mouse highlight",
})
chrome.contextMenus.create({
	documentUrlPatterns: ["https://applic.dev/inspect/twitch-elements"],
	id: "toggle_desaturate",
	title: "Toggle Desaturation",
})

const is_desaturated = { }; //Not sure if I can ask the tab whether it's been desaturated or not
chrome.contextMenus.onClicked.addListener((info, tab) => {
	switch (info.menuItemId) {
		case "toggle_active": {
			const key = info.pageUrl; //Must match the corresponding const in highlighter.js
			chrome.storage.sync.get(key, info => {
				chrome.storage.sync.set({[key]: !info[key]},
					() => chrome.tabs.sendMessage(tab.id, {greetingmouse: "reinit"}));
			});
			break;
		}
		case "toggle_desaturate": {
			const active = is_desaturated[tab.id] = !is_desaturated[tab.id];
			chrome.scripting[active ? "insertCSS" : "removeCSS"]({
				css: "html {filter: saturate(0)}",
				target: {tabId: tab.id},
			});
			break;
		}
	}
});
