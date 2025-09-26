const seen = {};
let active = false;
const key = document.URL; //In case it ever changes.
function fix() {
	if (!active) return;
	//Scan all children and see what names they have.
	//If any name hasn't been seen, add a CSS class to that line.
	//(Note: If it HAS been seen, don't *remove* the class - we
	//will be run more than once.)
	document.querySelectorAll(".chat-line__message").forEach(msg => {
		const dispname = msg.querySelector(".chat-author__display-name");
		if (!dispname) return;
		const user = dispname.innerText.trim();
		if (seen[user]) return;
		seen[user] = true;
		msg.classList.add("first-message");
		//console.log(msg);
		chrome.storage.local.set({["users+" + key]: Object.keys(seen)});
	});
	chrome.storage.local.set({["date+" + key]: +new Date});
}

//Attempt to find the stream chat container. If it isn't there, retry a few
//times in an attempt to let it load; otherwise, just abandon it.
let pristine = true;
function setup(maxretry) {
	const base = document.querySelector(".stream-chat");
	if (base) {
		if (active) console.info("Greeting Mouse active and ready to highlight first messages.");
		fix();
		new MutationObserver(fix).observe(base, {childList: true, subtree: true});
		return;
	}
	if (maxretry > 0) setTimeout(setup, 2000, maxretry - 1);
	else pristine = true; //It's pristine again if we never managed to set up
}
function init() {if (active && pristine) {pristine = false; setup(5);}}

chrome.storage.sync.get(key, info => {
	active = !!info[key];
	init();
});
chrome.storage.local.get(["date+" + key, "users+" + key], info => {
	//If messages have been seen within the last four hours, retain the
	//list of seen users, otherwise leave it empty.
	console.log("Greeting Mouse schedule check:", +info["date+" + key], ">", +new Date() - 3600000 * 4);
	if (+info["date+" + key] > +new Date() - 3600000 * 4) {
		console.log("Greeting Mouse retaining users", info["users+" + key]);
		info["users+" + key].forEach(user => seen[user] = true);
	} else
		console.log("Greeting Mouse not retaining users", info["users+" + key]);
});
chrome.runtime.onMessage.addListener(r => {
	chrome.storage.sync.get(key, info => {
		active = !!info[key];
		init();
		if (active) console.log("Greeting Mouse now active - first messages will be highlighted.");
		else console.log("Greeting Mouse deactivated.");
	});
});
