/** @param {NS} ns **/
export async function main(ns) {
	//define variables for script names to run
	let hacknetnodesscript = "hacknet-buy.js";
	let watcherscript = "watcher.js";
	let menuscript = "sidebar.js";
	let browserscript = "browser.js";
	//print an alert with some information for this script
	ns.alert(ns.getScriptName() + " was successfully started!\n\n\
			this script will run in the background until you kill it, or following requirements are fullfilled:\n\n\
			1. you bought enough RAM for your home server to run a script that\n\
			automatically upgrades/buys hacknet nodes\n\n\
			2. you bought enough RAM for your home server to run the watcher script\n\n\
			3. you bought enough RAM for your home server to run the " + browserscript + "");
	//define server for startup.js
	let hostname = ns.getHostname();
	//define a variable, which determines, if the script for buying hacknet nodes is already running
	let hacknetnodesrunning = false;
	//define a variable, which determines, if the watcher is already running on the first purchased server
	let watcherrunning = false;
	//define a variable, which determines, if the browser was already added to the sidebar
	let browseradded = false;
	//as long as not everything runs, run
	while(!hacknetnodesrunning && !watcherrunning && !browseradded) {
		//start script to buy hacknet nodes if ram is available
		let hacknetnodesram = false;
		if((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) > (ns.getScriptRam(hacknetnodesscript) + 8)) {
			hacknetnodesram = true
		}
		//check, if there is enough ram to start buying hacknet nodes and the script isn't running yet
		if(hacknetnodesram && !hacknetnodesrunning) {
			if(!ns.scriptRunning(hacknetnodesscript, hostname)) {
				ns.exec(hacknetnodesscript, hostname);
			}
			hacknetnodesrunning = true;
			ns.toast("hacknet nodes are now bought/upgraded automatically!", "success", 5000);
		}
		//if possible try to start the watcher script
		let watcherram = false;
		//if there is enough ram available to run the watcherscript
		if((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) > (ns.getScriptRam(watcherscript) + 8)) {
			watcherram = true;
		}
		//if there is enough ram available to run the watcherscript script
		if(watcherram) {
			//check, if it is running or not
			if(!ns.scriptRunning(watcherscript, hostname)) {
				//start the watcher script
				ns.exec(watcherscript, hostname);
			}
			watcherrunning = true;
			ns.toast(watcherscript + " successfully started!", "success", 5000);
		}
		//if possible add the browser to the menu
		//define a variable, which determines, if there is enough RAM at home for the browser
		let browserram = false;
		//if the server ram at home is able to run adding new menu items AND browser
		if((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) > (ns.getScriptRam(menuscript) + ns.getScriptRam(browserscript) + 8)) {
			browserram = true;
		}
		//check if there is enough browser ram and the browser button wasn't added yet
		if(browserram && !browseradded) {
			ns.scriptKill(menuscript, hostname);
			ns.exec(menuscript, hostname, 1, "browser", browserscript);
			browseradded = true;
			ns.toast("browser successfully added to the game!", "success", 5000);
		}
		await ns.asleep(1000);
	}
	ns.toast(ns.getScriptName() + " now finished it's job!", "info", 5000);
}
