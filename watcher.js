import {ServerList, PortHandler, DeliveryService} from "utils.js";
import {DeployableScripts, BotPorts, GeneralMultipliers, GeneralDelay, BotDelayMultiplier, BotScript, AttackMaxRAM} from "const.js"
/** @param {NS} ns **/
export async function main(ns) {
	//define a general delay for looping/watching
	let watchdelay = GeneralDelay;
	//create the list of servers
	let servers = new ServerList(ns);
	//create the PortHandler
	let porthandler = new PortHandler(ns, BotPorts);
	//create the DeliveryService
	let deliveryservice = new DeliveryService(ns, DeployableScripts);
	//clear ports that are important for watcher<>bot communication
	await porthandler.clearUsedPorts();
	//run through the list of servers
	for(let i = 0; i < servers.serverList.length; i++) {
		//get the current server
		let server = servers.serverList[i];
		//if there is root access to the server and it has more than 0 gb ram
		if(server.rootaccess && server.maxram > 0 && server.servername != "home") {
			//redeploy the scripts and run the botscript if possible
			let deliverysettings = {
				replace: true,
				runscript: BotScript,
				runbuffer: AttackMaxRAM,
				rundelay: (watchdelay * BotDelayMultiplier)
			};
			await deliveryservice.deployScripts(server.servername, deliverysettings);
		}
	}
	//loop infinitely
	while(true) {
		//create the list of servers
		servers = new ServerList(ns);
		//create a list of servers, which have minimum security level and maximum money
		let hackableservers = [];
		//run through the list of servers
		for(let i = 0; i < servers.serverList.length; i++) {
			//get the current server
			let server = servers.serverList[i];
			//if there is root access to the server and it has more than 0 gb ram
			if(server.rootaccess && server.maxram > 0 && server.servername != "home") {
				//deploy the scripts, if not existing and run the botscript
				let deliverysettings = {
					replace: false,
					runscript: BotScript,
					runbuffer: AttackMaxRAM,
					rundelay: (watchdelay * BotDelayMultiplier)
				};
				await deliveryservice.deployScripts(server.servername, deliverysettings);
			}
			//if there is root access to the server and it has more than 0 gb ram and sever is hackable create the strategy
			if(server.rootaccess && server.ishackable && server.servername != "home") {
				//if the server's security level is equal or bigger than its base security level, try to queue
				if(server.securitylevel > (ns.getServerMinSecurityLevel(server.servername) * GeneralMultipliers.minServerSecurity)) {
					//define a variable for threads to use at best case
					let threadstouse = 1;
					//calculate the difference in security level from current to minimum
					let securityleveltoreduce = server.securitylevel - (ns.getServerMinSecurityLevel(server.servername) * GeneralMultipliers.minServerSecurity);
					//calculate the amount of weaken() to reduce the security level to a minimum
					if(ns.weakenAnalyze(1) > 0 && securityleveltoreduce > 0) {
						threadstouse = Math.ceil(securityleveltoreduce / ns.weakenAnalyze(1));
					}
					await porthandler.tryPortWriteTask("weaken", server.servername, threadstouse);
				}
				//if min security level was reached and max money not, grow
				else if(ns.getServerMoneyAvailable(server.servername) < (ns.getServerMaxMoney(server.servername) * GeneralMultipliers.maxServerMoney)) {
					//define a variable for threads to use at best case
					let threadstouse = 1;
					//get max and available money
					let maxmoney = ns.getServerMaxMoney(server.servername) * GeneralMultipliers.maxServerMoney;
					let availablemoney = ns.getServerMoneyAvailable(server.servername);
					//do some additional checks to know that really everything is fine with the money values
					if(maxmoney > 0 && availablemoney > 0 && maxmoney > availablemoney) {
						//calculate the multiplier to grow the money to max
						let multipliermoney = maxmoney / availablemoney;
						//calculate the amount of threads to use to grow to max
						threadstouse = Math.ceil(ns.growthAnalyze(server.servername, multipliermoney));
					}
					await porthandler.tryPortWriteTask("grow", server.servername, threadstouse);
				}
				//if security level is at minimum and money is at maximum add the server to the hackable servers
				else {
					if(server.efficiency > 0) {
						hackableservers.push(Object.assign({}, server));
					}
				}
			}
		}
		//check, if there are hackable servers
		if(hackableservers.length > 0) {
			//sort the hackable servers descending with it's efficiencies
			hackableservers.sort(function(server1, server2) {
				return server2.efficiency - server1.efficiency;
			});
			//go through the hackable servers
			for(let i = 0; i < hackableservers.length; i++) {
				//the efficiency sorted servers are tried to get hacked one after another
				let server = hackableservers[i];
				//threads to use for hack is 0, because bot will calculate the amount of threads when 0 by himself
				let threadstouse = 0;
				await porthandler.tryPortWriteTask("hack", server.servername, threadstouse);
			}
		}
		//if there are no hackable servers
		else {
			//go through the serverlist
			for(let i = 0; i < servers.serverList.length; i++) {
				//create a server object
				let server = servers.serverList[i];
				//if there is root access to the server and it has more than 0 gb ram
				if(server.rootaccess && server.ishackable && server.maxram > 0 && server.servername != "home") {
					//if minimum security level is not reached, weaken
					if(server.securitylevel > (ns.getServerMinSecurityLevel(server.servername) * GeneralMultipliers.minServerSecurity)) {
						//define a variable for threads to use at best case
						let threadstouse = 1;
						//calculate the difference in security level from current to minimum
						let securityleveltoreduce = server.securitylevel - (ns.getServerMinSecurityLevel(server.servername) * GeneralMultipliers.minServerSecurity);
						//calculate the amount of weaken() to reduce the security level to a minimum
						if(ns.weakenAnalyze(1) > 0 && securityleveltoreduce > 0) {
							threadstouse = Math.ceil(securityleveltoreduce / ns.weakenAnalyze(1));
						}
						await porthandler.tryPortWriteTask("weaken", server.servername, threadstouse);
					}
					//if minimum security level is reached, hack
					else {
						//threads to use for hack is 0, because bot will calculate the amount of threads when 0 by himself
						let threadstouse = 0;
						await porthandler.tryPortWriteTask("hack", server.servername, threadstouse);
					}
				}
			}
		}
		//wait for the watchdelay
		await ns.asleep(watchdelay);
	}
}
