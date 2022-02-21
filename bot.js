import {BotPorts, BotMaxHacksPerTarget} from "const.js"
/** @param {NS} ns **/
export async function main(ns) {
	//define the waiting delay
	let waitingdelay = ns.args[0] || 1000;
	//if the script stops working, show a toast warning, if possible
	try {
		ns.atExit(function() {
			ns.toast(ns.getScriptName() + " stopped working on " + ns.getHostname(), "error", 5000);
		});
	}
	catch(e) {}
	//define a variable, that checks if the bot is running
	let botrunning = true;
	//run the bot.js
	while(botrunning) {
		try {
			//receive the task via ports
			let task;
			//receive the target via ports
			let target;
			//receive the amount of threads to run via ports
			let threads;
			//receive the delay for weaken/grow/hack
			let attackdelay;
			//receive the unique attackingid
			let attackid;
			//check TaskPort + its backups
			for(let i = 0; i < BotPorts.length; i++) {
				let peektask = await ns.peek(BotPorts[i]);
				if(peektask != "NULL PORT DATA") {
					//as soon as Formulas.exe exists, this part needs a little update
					//then instead of the watcher.js an overseer.js will be created
					//this will then create batches, therefore the ports will be filled
					//with an array of tasks to do: weaken -> grow -> weaken -> hack
					//all with a delay for the tasks .js
					//e.g. if the taskobject is an array, write everything in an array
					let taskJSON = await ns.readPort(BotPorts[i]);
					let taskobject = JSON.parse(taskJSON);
					task = taskobject.bottask;
					target = taskobject.bottarget;
					threads = taskobject.attackingthreads;
					attackdelay = taskobject.attackingdelay;
					if(!attackdelay) {
						attackdelay = 0;
					}
					attackid = taskobject.attackingid;
					break;
				}
			}
			if(task && target) {
				//calculate the maximum and used ram
				let hostmaxram = ns.getServerMaxRam(ns.getHostname());
				let hostusedram = ns.getServerUsedRam(ns.getHostname());
				//check if the script for the task exists and is already running or not and also if there is available ram (threads > 0)
				if(ns.fileExists(task + ".js", ns.getHostname())) {
					if(!ns.isRunning(task + ".js", ns.getHostname(), target, attackid)) {
						//calculate the bots script ram
						let scriptram = ns.getScriptRam(task + ".js");
						//calculate the maximum threads that can be used to 
						let threadsmax = Math.floor((hostmaxram - hostusedram) / scriptram);
						//if the received threads is equal to 0, calculate the limit by dividing the maximum threads through the constant
						if(!threads || threads == 0) {
							threads = Math.ceil(threadsmax / BotMaxHacksPerTarget);
						}
						//if the given threads are to big for this server, throttle it to the server maximum
						if(threadsmax < threads) {
							threads = threadsmax;
						}
						//only if there were no errors in calculating the threads run the script with the amount of threads
						if(threads > 0) {
							//if the task is not already running and threads to use is higher than nothing, start it
							ns.exec(task + ".js", ns.getHostname(), threads, target, attackdelay, attackid);
						}
					}
					else {}
				}
			}
			else {}
		}
		catch(e) {
			botrunning = false;
			ns.exit();
		}
		//wait for the amount of waitingdelay
		await ns.asleep(waitingdelay);
	}
}
