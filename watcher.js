import {DeployableScripts, TaskPort, TargetPort, ServerList} from "utils.js";
/** @param {NS} ns **/
export async function main(ns) {
	//define a general delay for looping/watching
	let watchdelay = 50;
	//clear ports that are important for watcher<>bot communication
	await ns.clearPort(TaskPort);
	await ns.clearPort(TargetPort);
	//loop infinitely
	while(true) {
		//create the list of servers
		let servers = new ServerList(ns);
		//create a list of servers, which have minimum security level and maximum money
		let hackableservers = [];
		//run through the list of servers
		for(let i = 0; i < servers.serverList.length; i++) {
			//get the current server
			let server = servers.serverList[i];
			//if there is root access to the server and it has more than 0 gb ram
			if(server.rootaccess && server.maxram > 0 && server.servername != "home") {
				//check, if deployable scripts are already on the server, if not copy them
				for(let scriptname of DeployableScripts) {
					//if the deployable scripts do not exist, copy them
					if(!ns.fileExists(scriptname, server.servername)) {
						await ns.scp(scriptname, server.servername);
					}
					else {
						//if the deployable scripts are not running at the moment 
						//remove them and copy them again (in case there were updates done on the home server)
						if(!ns.scriptRunning(scriptname, server.servername)) {
							ns.rm(scriptname, server.servername);
							await ns.scp(scriptname, server.servername);
						}
					}
				}
				//check, if bot.js is not running on the server AND the server's max ram
				//let it run bot.js and any additional script (weaken.js, grow.js, hack.js)
				if(!ns.scriptRunning("bot.js", server.servername) && (server.maxram > ((ns.getScriptRam("bot.js", server.servername) + ns.getScriptRam("weaken.js", server.servername))))) {
					//run bot.js on the server
					ns.exec("bot.js", server.servername, 1, (watchdelay * 2));
				}
			}
			//if there is root access to the server and it has more than 0 gb ram and sever is hackable
			if(server.rootaccess && server.ishackable && server.maxram > 0 && server.servername != "home") {
				//if the server's security level is equal or bigger than its base security level, try to queue
				if(server.securitylevel > ns.getServerMinSecurityLevel(server.servername)) {
					await ns.tryWritePort(TaskPort, "weaken");
					await ns.tryWritePort(TargetPort, server.servername);
				}
				//if min security level was reached and max money not, grow
				else if(ns.getServerMoneyAvailable(server.servername) < ns.getServerMaxMoney(server.servername)) {
					await ns.tryWritePort(TaskPort, "grow");
					await ns.tryWritePort(TargetPort, server.servername);
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
				await ns.tryWritePort(TaskPort, "hack");
				await ns.tryWritePort(TargetPort, server.servername);
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
					if(server.securitylevel > ns.getServerMinSecurityLevel(server.servername)) {
						await ns.tryWritePort(TaskPort, "weaken");
						await ns.tryWritePort(TargetPort, server.servername);
					}
					//if minimum security level is reached, hack
					else {
						await ns.tryWritePort(TaskPort, "hack");
						await ns.tryWritePort(TargetPort, server.servername);
					}
				}
			}
		}
		//wait for the watchdelay
		await ns.asleep(watchdelay);
	}
}
