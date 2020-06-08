/* TODO: Allow configuration of which pages this is active on.
It'll need to remember this in LocalStorage, or maybe some other
config system (what's best prac for extensions?). Have a context
menu entry or activation that toggles it.
*/
const base = document.querySelector(".chat-scrollable-area__message-container");
//TODO: What if base doesn't yet exist? Wait for it?

const seen = {};
function fix() {
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
		console.log(msg);
	});
}

fix(); //Do the fixes immediately on startup

//Also call fix() any time it appears that a message has been posted.
if (base) new MutationObserver(fix).observe(base, {childList: true, subtree: true});
