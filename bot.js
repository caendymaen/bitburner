/** @param {NS} ns **/
export async function main(ns) {
	//define the waiting delay
	let waitingdelay = ns.args[0] || 1000;
	//if the script stops working, show a toast warning
	ns.atExit(function() {
		ns.toast(ns.getScriptName() + " stopped working on " + ns.getHostname(), "error", 5000);
	});
	//define a variable, that checks if the bot is running
	let botrunning = true;
	//run the bot.js
	while(botrunning) {
		try {
			//receive the task via ports
			let task = await ns.readPort(1);
			//receive the target via ports
			let target = await ns.readPort(2);
			if(task != "NULL PORT DATA" && target != "NULL PORT DATA") {
				//calculate the maximum and used ram
				let hostmaxram = ns.getServerMaxRam(ns.getHostname());
				let hostusedram = ns.getServerUsedRam(ns.getHostname());
				//check if the script for the task exists and is already running or not and also if there is available ram (threads > 0)
				if(ns.fileExists(task + ".js", ns.getHostname())) {
					if(!ns.scriptRunning(task + ".js", ns.getHostname())) {
						//calculate the bots script ram
						let scriptram = ns.getScriptRam(task + ".js");
						//calculate the maximum threads that can be used to 
						let threadstouse = Math.floor((hostmaxram - hostusedram) / scriptram);
						if(threadstouse > 0) {
							//if the task is not already running and threads to use is higher than nothing, start it
							ns.exec(task + ".js", ns.getHostname(), threadstouse, target);
						}
					}
				}
			}
		}
		catch(e) {
			botrunning = false;
			ns.exit();
		}
		//wait for the amount of waitingdelay
		await ns.asleep(waitingdelay);
	}
}
