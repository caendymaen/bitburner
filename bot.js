import {GeneralMultipliers} from "const.js"
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
					if(!ns.isRunning(task + ".js", ns.getHostname(), target)) {
						//calculate the bots script ram
						let scriptram = ns.getScriptRam(task + ".js");
						//calculate the maximum threads that can be used to 
						let threadstouse = Math.floor((hostmaxram - hostusedram) / scriptram);
						//calculate a thread limit in case of grow or weaken
						let threadlimit = threadstouse;
						switch(task) {
							case "weaken":
								//calculate the new security level of the server after the needed amount of grow()
								let new_secLvl = ns.getServerSecurityLevel(target);
								//calculate the difference in security level from new to minimum
								let red_secLvl = new_secLvl - (ns.getServerMinSecurityLevel(target) * GeneralMultipliers.minServerSecurity);
								//calculate the amount of weaken() to reduce the security level to a minimum
								if(ns.weakenAnalyze(1) > 0 && red_secLvl > 0) {
									threadlimit = Math.ceil(red_secLvl / ns.weakenAnalyze(1));
								}
								else {
									threadlimit = threadstouse;
								}
								break;
							case "grow":
								let maxMoney = ns.getServerMaxMoney(target) * GeneralMultipliers.maxServerMoney;
								let avaMoney = ns.getServerMoneyAvailable(target);
								if(maxMoney > 0 && avaMoney > 0 && maxMoney > avaMoney) {
									let multiplierMoney = maxMoney / avaMoney;
									threadlimit = Math.ceil(ns.growthAnalyze(target, multiplierMoney));
								}
								else {
									threadlimit = threadstouse;
								}
								break;
							default:
								threadlimit = threadstouse;
								break;
						}
						if(threadstouse > threadlimit) {
							threadstouse = threadlimit;
						}
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
