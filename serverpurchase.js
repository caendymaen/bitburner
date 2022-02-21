import {DeployableScripts, GeneralDelay, BotDelayMultiplier, BotScript, AttackMaxRAM} from "const.js"
import {DeliveryService} from "utils.js";
/** @param {NS} ns **/
export async function main(ns) {
	//define a general delay for looping
	let purchasedelay = GeneralDelay;
	//define variable for running the purchasing loop
	let purchasing = true;
	//create the DeliveryService
	let deliveryservice = new DeliveryService(ns, DeployableScripts);
	//create the list of servers
	let servers = ns.getPurchasedServers();
	//run through the list of servers
	for(let i = 0; i < servers.length; i++) {
		//get the current server
		let servername = servers[i];
		//redeploy the scripts and run the botscript if possible
		let deliverysettings = {
			replace: true,
			runscript: BotScript,
			runbuffer: AttackMaxRAM,
			rundelay: (purchasedelay * BotDelayMultiplier)
		};
		await deliveryservice.deployScripts(servername, deliverysettings);
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
			botram = Math.pow(2,Math.ceil(Math.log(botram)/Math.log(2)));
			//if there is enough money to buy a server, do so
			if(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(botram)) {
				await ns.purchaseServer("serv-" + servers.length, botram);
				//after purchasing a server, reload the list of purchased servers
				servers = ns.getPurchasedServers();
				//run through the list of servers
				for(let i = 0; i < servers.length; i++) {
					//get the current server
					let servername = servers[i];
					//redeploy the scripts and run the botscript if possible
					let deliverysettings = {
						replace: true,
						runscript: BotScript,
						runbuffer: AttackMaxRAM,
						rundelay: (purchasedelay * BotDelayMultiplier)
					};
					await deliveryservice.deployScripts(servername, deliverysettings);
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
				if(serverram < ns.getPurchasedServerMaxRam()) {
					if(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(serverram * 2)) {
						await ns.killall(servername);
						await ns.deleteServer(servername);
						await ns.purchaseServer(servername, (serverram * 2));
						//redeploy the scripts and run the botscript if possible
						let deliverysettings = {
							replace: true,
							runscript: BotScript,
							runbuffer: AttackMaxRAM,
							rundelay: (purchasedelay * BotDelayMultiplier)
						};
						await deliveryservice.deployScripts(servername, deliverysettings);
						await ns.toast("upgraded server " + servername + " and deployed bot.js", "info", 5000);
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
