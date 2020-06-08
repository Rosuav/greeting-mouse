/* TODO: Allow configuration of which pages this is active on.
It'll need to remember this in LocalStorage, or maybe some other
config system (what's best prac for extensions?). Have a context
menu entry or activation that toggles it.
*/
const seen = {};
let active = false;
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
	});
}

//Attempt to find the stream chat container. If it isn't there, retry a few
//times in an attempt to let it load; otherwise, just abandon it.
let pristine = true;
function setup(maxretry) {
	const base = document.querySelector(".stream-chat");
	if (base) {
		console.info("Greeting Mouse active and ready to highlight first messages.");
		fix();
		new MutationObserver(fix).observe(base, {childList: true, subtree: true});
		return;
	}
	if (maxretry > 0) setTimeout(setup, 2000, maxretry - 1);
	else pristine = true; //It's pristine again if we never managed to set up
}
function init() {if (active && pristine) {pristine = false; setup(5);}}

const key = document.URL; //In case it ever changes.
chrome.storage.sync.get(key, info => {
	active = !!info[key];
	init();
});

function toggle() {
	chrome.storage.sync.get(key, info => {
		active = !info[key];
		chrome.storage.sync.set({[key]: active});
		if (active) console.log("Now active on this URL. Will highlight everyone's first messages.");
		else console.log("Deactivated for this URL. Back to normal.");
		init();
	});
}

const nonce = Math.random(); //Unlikely to get a collision
window.addEventListener("message", event => event.data.nonce === nonce && toggle());
const scr = document.createElement("script");
scr.innerHTML = 'window.greet = () => window.postMessage({nonce: ' + nonce + '});';
document.body.appendChild(scr);
