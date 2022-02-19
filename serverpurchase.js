import {DeployableScripts, GeneralDelay, BotDelayMultiplier} from "const.js"
/** @param {NS} ns **/
export async function main(ns) {
	//define a general delay for looping
	let purchasedelay = GeneralDelay;
	//define variable for running the purchasing loop
	let purchasing = true;
	//create the list of servers
	let servers = ns.getPurchasedServers();
	//run through the list of servers
	for(let i = 0; i < servers.length; i++) {
		//get the current server
		let servername = servers[i];
		//check, if deployable scripts are already on the server, if not copy them
		for(let scriptname of DeployableScripts) {
			//if the deployable scripts do not exist, copy them
			if(!ns.fileExists(scriptname, servername)) {
				await ns.scp(scriptname, servername);
			}
			else {
				//if the deployable scripts are not running at the moment 
				//remove them and copy them again (in case there were updates done on the home server)
				if(!ns.scriptRunning(scriptname, servername)) {
					ns.rm(scriptname, servername);
					await ns.scp(scriptname, servername);
				}
			}
		}
		//check, if bot.js is not running on the server AND the server's max ram
		//let it run bot.js and any additional script (weaken.js, grow.js, hack.js)
		if(!ns.scriptRunning("bot.js", servername) && (ns.getServerMaxRam(servername) > ((ns.getScriptRam("bot.js", servername) + ns.getScriptRam("weaken.js", servername))))) {
			//run bot.js on the server
			ns.exec("bot.js", servername, 1, (purchasedelay * BotDelayMultiplier));
		}
	}
	//loop infinitely
	while(purchasing) {
		//create the list of servers
		servers = ns.getPurchasedServers();
		//if not all of the possible servers are bought, buy a new one
		if(servers.length < ns.getPurchasedServerLimit()) {
			//define a variable for ram cost of bot.js and any additional script (weaken.js, grow.js, hack.js)
			let botram = ns.getScriptRam("bot.js") + ns.getScriptRam("weaken.js");
			//recalculate the needed ram to the next power of 2
			botram = Math.pow(2,Math.floor(Math.log(botram)/Math.log(2)));
			//if there is enough money to buy a server, do so
			if(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(botram)) {
				await ns.purchaseServer("serv-" + servers.length, botram);
				//run through the list of servers
				for(let i = 0; i < servers.length; i++) {
					//get the current server
					let servername = servers[i];
					//check, if deployable scripts are already on the server, if not copy them
					for(let scriptname of DeployableScripts) {
						//if the deployable scripts do not exist, copy them
						if(!ns.fileExists(scriptname, servername)) {
							await ns.scp(scriptname, servername);
						}
						else {
							//if the deployable scripts are not running at the moment 
							//remove them and copy them again (in case there were updates done on the home server)
							if(!ns.scriptRunning(scriptname, servername)) {
								ns.rm(scriptname, servername);
								await ns.scp(scriptname, servername);
							}
						}
					}
					//check, if bot.js is not running on the server AND the server's max ram
					//let it run bot.js and any additional script (weaken.js, grow.js, hack.js)
					if(!ns.scriptRunning("bot.js", servername) && (ns.getServerMaxRam(servername) > ((ns.getScriptRam("bot.js", servername) + ns.getScriptRam("weaken.js", servername))))) {
						//run bot.js on the server
						ns.exec("bot.js", servername, 1, (purchasedelay * BotDelayMultiplier));
					}
				}
			}
		}
		//if all possible servers were bought, begin to upgrade
		else {
			let serversmaxed = 0;
			//run through the list of servers
			for(let i = 0; i < servers.length; i++) {
				//get the current server
				let servername = servers[i];
				//get current server max ram
				let serverram = ns.getServerMaxRam(servername);
				//check, if upgrade from server is possible
				if((serverram * 2) < ns.getPurchasedServerMaxRam()) {
					if(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(serverram * 2)) {
						await ns.killall(servername);
						await ns.deleteServer(servername);
						await ns.purchaseServer(servername, serverram * 2);
						//check, if deployable scripts are already on the server, if not copy them
						for(let scriptname of DeployableScripts) {
							//if the deployable scripts do not exist, copy them
							if(!ns.fileExists(scriptname, servername)) {
								await ns.scp(scriptname, servername);
							}
							else {
								//if the deployable scripts are not running at the moment 
								//remove them and copy them again (in case there were updates done on the home server)
								if(!ns.scriptRunning(scriptname, servername)) {
									ns.rm(scriptname, servername);
									await ns.scp(scriptname, servername);
								}
							}
						}
						//check, if bot.js is not running on the server AND the server's max ram
						//let it run bot.js and any additional script (weaken.js, grow.js, hack.js)
						if(!ns.scriptRunning("bot.js", servername) && (ns.getServerMaxRam(servername) > ((ns.getScriptRam("bot.js", servername) + ns.getScriptRam("weaken.js", servername))))) {
							//run bot.js on the server
							ns.exec("bot.js", servername, 1, (purchasedelay * BotDelayMultiplier));
						}
					}
				}
				else {
					serversmaxed += 1;
				}
			}
			if(serversmaxed >=  ns.getPurchasedServerLimit()) {
				purchasing = false;
			}
		}
		//wait for the watchdelay
		await ns.asleep(purchasedelay);
	}
}
