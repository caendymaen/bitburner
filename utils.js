/** Class representing some player details */
export class PlayerDetails {
	/**
	 * Description 						create PlayerDetails
	 * 
	 * @param {NSObject} ns_ 			the Netscript object
	 */
	constructor(ns_) {
		this.ns = ns_;
		//all exe files to nuke
		this.exe_files = {
			"BruteSSH.exe": "brutessh",
			"FTPCrack.exe": "ftpcrack",
			"relaySMTP.exe": "relaysmtp",
			"HTTPWorm.exe": "httpworm",
			"SQLInject.exe": "sqlinject"
		};
		//number of hackable ports
		this.hackableports = 0;
		//the players hacking level
		this.hackinglevel = 0;
	}
	/**
	 * Description:						returns the amount of hackable ports
	 * 
	 * @returns {number}				returns the amount of hackable ports
	 */
	get hackablePorts() {
		//calculate hackable ports
		this.calcHackablePorts();
		//return hackable ports
		return this.hackableports;
	}
	/**
	 * Description:						returns the hacking level
	 * 
	 * @returns {number}				returns the hacking level
	 */
	get hackingLevel() {
		//get the actual hacking level
		this.hackinglevel = this.ns.getHackingLevel();
		//return the hacking level
		return this.hackinglevel;
	}
	/**
	 * Description:						returns the exe files list
	 * 
	 * @returns {Object}				returns the exe files list
	 */
	get exeFiles() {
		return this.exe_files;
	}
	/**
	 * Description						calculates the amount of hackable ports based on the count of .exe files on the home server
	 */
	calcHackablePorts() {
		//reset the hackable ports
		this.hackableports = 0;
		//go through the list of exe files
		for(let file of Object.keys(this.exe_files)) {
			//if the file exists on the homeserver increase hackable ports
			if(this.ns.fileExists(file, "home")) {
				this.hackableports++;
			}
		}
	}
}
/** Class representing a list of servers with their details */
export class ServerList {
	/**
	 * Description 						create ServerList
	 * 
	 * @param {NSObject} ns_ 			the Netscript object
	 */
	constructor(ns_) {
		//ns object
		this.ns = ns_;
		/**
		 *	an array which contains servers
		 *	server {
		 *		servername: {string},
		 *		parent: {string},
		 *		rootaccess: {boolean},
		 *		securitylevel: {number},
		 *		requiredports: {number},
		 *		requiredhacking: {number},
		 *		ishackable: {boolean},
		 *		maxram: {number},
		 *		efficiency: {number}
		 * 	}
		 */
		this.serverlist = [];
		//list of purchased servers
		this.purchasedserverlist = [];
		//create a playerdetails object
		this.playerdetails = new PlayerDetails(this.ns);
		//set up the serverlist
		this.setServerList();
	}
	/**
	 * Description:						returns an array of servers, including some information for each of them
	 * 
	 * @returns {array}					returns an array of servers, including some information for each of them
	 */
	get serverList() {
		return this.serverlist;
	}
	/**
	 * Description:						returns an object of PlayerDetails
	 * 
	 * @returns {PlayerDetails}			returns an object of PlayerDetails
	 */
	get playerDetails() {
		return this.playerdetails;
	}
	/**
	 * Description:						returns an object of a server, including some information
	 * 
	 * @param {string} 	servername 		name of a server
	 * @returns {object}				returns the server object
	 */
	getServerInfo(servername) {
		//run through all the servers in the list
		for(let i = 0; i < this.serverlist.length; i++) {
			//if the given server was found, then return true
			if(this.serverlist[i].servername == servername) {
				return this.serverlist[i];
			}
		}
		//if nothing was found, return false
		return undefined;
	}
	/**
	 * Description:						updates the servers programmable attributes
	 * 
	 * @param {string} 	servername 		name of a server
	 */
	updateServer(servername) {
		//run through all the servers in the list
		for(let i = 0; i < this.serverlist.length; i++) {
			//if the given server was found, then do the updates
			if(this.serverlist[i].servername == servername) {
				//update the programmable attributes
				this.serverlist[i].rootaccess = this.ns.hasRootAccess(this.serverlist[i].servername);
				this.serverlist[i].securitylevel = this.ns.getServerSecurityLevel(this.serverlist[i].servername);
				this.serverlist[i].requiredports = this.ns.getServerNumPortsRequired(this.serverlist[i].servername);
				this.serverlist[i].requiredhacking = this.ns.getServer(this.serverlist[i].servername).requiredHackingSkill;
				this.serverlist[i].ishackable = ((this.playerdetails.hackingLevel >= this.serverlist[i].requiredhacking) && (this.playerdetails.hackablePorts >= this.serverlist[i].requiredports));
				this.serverlist[i].maxram = this.ns.getServerMaxRam(this.serverlist[i].servername);
				this.serverlist[i].efficiency = this.serverEfficiency(this.serverlist[i].servername);
			}
		}
	}
	/**
	 * Description:						returns if a servername is already included in the serverlist
	 * 
	 * @param {string} 	servername 		name of a server
	 * @returns {array}					returns true if found and false if not
	 */
	serverListIncludes(servername) {
		//run through all the servers in the list
		for(let i = 0; i < this.serverlist.length; i++) {
			//if the given server was found, then return true
			if(this.serverlist[i].servername == servername) {
				return true;
			}
		}
		//if nothing was found, return false
		return false;
	}
	/**
	 * Description:						sets up an array of servers, including some information for each of them
	 */
	setServerList() {
		//set the purchased servers
		this.purchasedserverlist = this.ns.getPurchasedServers();
		//define the object for every server
		let server = {
			servername: "home",
			parent: "",
			rootaccess: true,
			securitylevel: 0,
			requiredports: 0,
			requiredhacking: 0,
			haschildren: true,
			ishackable: false,
			maxram: 0,
			efficiency: 0
		}
		//add the homeserver to the serverlist array
		this.serverlist.push(Object.assign({}, server));
		//loop through the serverlist
		let servers = this.serverlist.length;
		for(let i = 0; i < servers; i++) {
			//as we now want to add children to the serverlist the parent must be the current server in the list
			let parent = this.serverlist[i].servername;
			//scan for children
			let children = this.ns.scan(parent);
			//if there are children (scan successfull) set the haschildren property to true
			this.serverlist[i].haschildren = false;
			if(children.length > 1 && !children.includes(parent)) {
				this.serverlist[i].haschildren = true;
			}
			//loop through the children (list of servernames only)
			for(let j = 0; j < children.length; j++) {
				//if one of the childrens names is not included in the list and not a purchased server add them
				if(!this.serverListIncludes(children[j]) && !this.purchasedserverlist.includes(children[j])) {
					//set the new server object's attributes
					server.servername = children[j];
					server.parent = parent;
					server.rootaccess = this.ns.hasRootAccess(server.servername);
					server.securitylevel = this.ns.getServerSecurityLevel(server.servername);
					server.requiredports = this.ns.getServerNumPortsRequired(server.servername);
					server.requiredhacking = this.ns.getServer(server.servername).requiredHackingSkill;
					server.haschildren = false;
					server.ishackable = ((this.playerdetails.hackingLevel >= server.requiredhacking) && (this.playerdetails.hackablePorts >= server.requiredports));
					server.maxram = this.ns.getServerMaxRam(server.servername);
					server.efficiency = this.serverEfficiency(server.servername);
					//add the server object to the serverlist
					this.serverlist.push(Object.assign({}, server));
					//to be able to recursively go through new added servers also increase the variable for the serverlist loop to the new length
					servers = this.serverlist.length;
				}
			}
		}
	}
	/**
	 * Description:						returns an array of server names, starting from home to "servername"
	 * 
	 * @param {string} 	servername 		name of a server, for which a path should be created
	 * @param {string} 	servernameFrom	name of a parent server, which could be the starting point of the path. Default server is "home"
	 * @returns {array}					returns an array of server names, starting from home to "servername"
	 */
	getServerPath(servername, servernameFrom) {
		//define variables for path, servername and servernameFrom
		let pathToServer = [];
		let tmp_servername = servername;
		let tmp_from = servernameFrom || "home"; //default: "home"
		//loop through the serverlist
		for(let i = 0; i < this.serverlist.length; i++) {
			//if the servername was found in the serverlist add it to the path
			if(this.serverlist[i].servername == tmp_servername) {
				//add the servername to the path
				pathToServer.push(tmp_servername);
				//if the servername is already the starting point exit the loop
				if(tmp_servername == tmp_from) {
					//exit the loop
					break;
				}
				//if the servername was found and added, also set the servername now to its parents name
				tmp_servername = this.serverlist[i].parent;
				//start the loop from 0 again
				i = -1;
				continue;
			}
		}
		//return the server path
		return pathToServer.reverse();
	}
	/**
	 * Description:						returns a string to copy and paste it into the terminal
	 * 
	 * @param {string} 	servername 		name of a server, for which a path should be created
	 * @returns {string}				returns a string with a pasteable connect path
	 */
	getServerPathString(servername) {
		//define variables for path, pathstring
		let pathToServer = this.getServerPath(servername);
		let pathstring = "";
		for(let i = 0; i < pathToServer.length; i++) {
			if(pathToServer[i] != "home") {
				pathstring += "connect " + pathToServer[i] + "; ";
			}
		}
		return pathstring;
	}
	/**
	 * Description:						returns an array of server names, starting from home to "servername" to get the "real" connection between the servers
	 * 
	 * @param {string} 	servername 		name of a server, for which a path should be created
	 * @param {string} 	servernameTo	name of a parent server, which could be the end point of the path. Default server is "home"
	 * @returns {array}					returns an array of server names, starting from home to "servername"
	 */
	getServerPathBetween(servername, servernameTo) {
		//define variables for path, servername, servernameTo, all connection points, paths to latest connection point
		let pathToServer = [];
		let tmp_servername = servername;
		let tmp_to = servernameTo || "home"; //default: "home"
		let tmp_connection_points = [];
		let tmp_connection_s1 = [];
		let tmp_connection_s2 = [];
		//with getServerPath create to arrays for the whole path to both servers and filter the list to only servers found in both
		tmp_connection_points = this.getServerPath(tmp_servername).filter(value => this.getServerPath(tmp_to).includes(value));
		//create a path for servername to connection point
		tmp_connection_s1 = this.getServerPath(servername, tmp_connection_points[tmp_connection_points.length - 1]).reverse();
		//create a path from servernameTo to connection point
		tmp_connection_s2 = this.getServerPath(tmp_to, tmp_connection_points[tmp_connection_points.length - 1]);
		//delete first entry of the servernameTo path
		tmp_connection_s2.shift();
		//connect both arrays
		pathToServer = tmp_connection_s1.concat(tmp_connection_s2);
		//return the "real" path
		return pathToServer;
	}
	/**
	 * Description:						calculates the efficiency (money/s) for a server
	 * 
	 * @Param {string}					a servername
	 * @returns {number}				returns the efficiency of a server (money/s)
	 */
	serverEfficiency(servername) {
		//set the efficiency variable
		let efficiency = 0;
		//try to calculate the efficiency, but if there is an error efficiency = 0 e.g. when a divided by 0 error occurs
		try {
			//calculate max money, available money and possible money with one hack()
			let maxMoney = this.ns.getServerMaxMoney(servername);
			let avaMoney = this.ns.getServerMoneyAvailable(servername);
			let possMoney = this.ns.hackAnalyze(servername) * maxMoney;
			let multiplierMoney = maxMoney / avaMoney;
			//calculate the amount of grow() you need to get max money
			let threads_to_grow = 0;
			if(!Number.isNaN(multiplierMoney)) {
				threads_to_grow = Math.ceil(this.ns.growthAnalyze(servername, multiplierMoney));
			}
			//calculate the new security level of the server after the needed amount of grow()
			let new_secLvl = this.ns.getServerSecurityLevel(servername) + this.ns.growthAnalyzeSecurity(threads_to_grow);
			//calculate the difference in security level from new to minimum
			let red_secLvl = new_secLvl - this.ns.getServerMinSecurityLevel(servername);
			//calculate the amount of weaken() to reduce the security level to a minimum
			let threads_to_weaken = 0;
			if(this.ns.weakenAnalyze(1) > 0) {
				threads_to_weaken = Math.ceil(red_secLvl / this.ns.weakenAnalyze(1));
			}
			//calculate the grow() time, weaken() time and hack() time
			let gTime = this.ns.getGrowTime(servername) / 1000;
			let wTime = this.ns.getWeakenTime(servername) / 1000;
			let hTime = this.ns.getHackTime(servername) / 1000;
			//calculate the chance of hacking the server 
			let hChance = this.ns.hackAnalyzeChance(servername);
			//calculate the efficiency (money/s)
			//prevent from infinity calculations
			if(threads_to_grow === Infinity) {
				threads_to_grow = 0;
			}
			if(threads_to_weaken === Infinity) {
				threads_to_weaken = 0;
			}
			efficiency = (hChance * possMoney) / (threads_to_grow * gTime + threads_to_weaken * wTime + hTime);
			efficiency = Math.round(efficiency * 100) / 100;
		}
		//else {
		catch(e) {
			efficiency = 0;
		}
		//return efficiency
		return efficiency;
	}
}
/** Class representing functionallities to handle ports */
export class PortHandler {
	/**
	 * Description 						create PortHandler
	 * 
	 * @param {NSObject} ns_ 			the Netscript object
	 * @param {array|number} botports_ 	a number or an array which includes all ports a bot should take care of watching
	 */
	constructor(ns_, botports_) {
		//set the Netscript object
		this.ns = ns_;
		//set the bot ports (standard 1)
		this.botports = botports_ || 1;
	}
	/**
	 * Description:						trys to write a task and target into one port as JSON
	 * 
	 * @Param {string} task				a task to be written into it's port(s)
	 * @Param {string} target			a target to be written into it's port(s)
	 */
	async tryPortWriteTask(task_, target_, attackingthreads_) {
		//define a variable which checks, if ports are array or not (e.g. for backup queueus)
		let multipleports = this.botports.length;
		let taskobject = {
			bottask: task_,
			bottarget: target_,
			attackingthreads: attackingthreads_,
			attackingid: task_.toString().substring(0, 1) + "-" + this.createID()
		}
		let taskJSON = JSON.stringify(taskobject);
		//if there are multiple ports do tryWritePort() for all backup queues
		if(multipleports > 0) {
			//check TaskPort + its backups
			let queue = 1;
			for(let i = (this.botports.length - 1); i >= 0; i--) {
				if(await this.ns.peek(this.botports[i]) == "NULL PORT DATA") {
					queue = this.botports[i];
				}
			}
			await this.ns.tryWritePort(queue, taskJSON);
		}
		//if there is only one port defined do a simple tryWritePort() for this port
		else {
			await this.ns.tryWritePort(this.botports, taskJSON);
		}
	}
	/**
	 * Description:						clears all ports, used for tasks and targets
	 */
	async clearUsedPorts() {
		//define a variable which checks, if ports are array or not (e.g. for backup queueus)
		let multipleports = this.botports.length;
		//if there are multiple ports do tryWritePort() for all backup queues
		if(multipleports > 0) {
			//check TaskPort + its backups
			for(let i = 0; i < this.botports.length; i++) {
				await this.ns.clearPort(this.botports[i]);
			}
		}
		//if there is only one port defined do a simple tryWritePort() for this port
		else {
			await this.ns.clearPort(this.botports);
		}
	}
	/**
	 * Description:						creates a unique ID
	 * 
	 * @returns {string}				the unique ID
	 */
	createID() {
		let partone = Math.ceil(Date.now()*Math.random()).toString(16);
		let parttwo = Math.ceil(Date.now()*Math.random()).toString(16);
		let partthree = Math.ceil(Date.now()*Math.random()).toString(16);
		let partfour = Math.ceil(Date.now()*Math.random()).toString(16);
		return partone.substring(0,5) + "-" + parttwo.substring(0,5) + "-" + partthree.substring(0,5) + "-" + partfour.substring(0,5);
	}
}
/** Class representing functionallities to deliver/deploy scripts */
export class DeliveryService {
	/**
	 * Description 							create DeliveryService
	 * 
	 * @param {NSObject} ns_ 				the Netscript object
	 * @param {array} deployablescripts_	a list of deployable scripts
	 */
	constructor(ns_, deployablescripts_) {
		//set the Netscript object
		this.ns = ns_;
		//set the deployable scripts
		this.deployablescripts = deployablescripts_ || [];
	}
	/**
	 * Description 						create DeliveryService
	 * 
	 * @param {} ns_ 					the Netscript object
	 * @param {} settings_ 				an object of settings for deployment
	 */
	async deployScripts(server_, settings_) {
		//get the servername
		let server = server_ || "";
		//get the settings from the settings parameter like should the scripts be replaced, run after deployment, etc.
		let settings = {
			replace: settings_.replace || false,
			replaceforce: settings_.replaceforce || false,
			runscript: settings_.runscript || "",
			runbuffer: settings_.runbuffer || 0,
			runthreads: settings_.runthreads || 1,
			rundelay: settings_.rundelay || 1000
		};
		//check, if there are any deployable scripts
		if(this.deployablescripts.length > 0) {
			//run through the list of deployable scripts
			for(let scriptname of this.deployablescripts) {
				//if the deployable scripts do not exist, copy them
				if(!this.ns.fileExists(scriptname, server)) {
					await this.ns.scp(scriptname, server);
				}
				else {
					//check, if scripts should generally be replaced
					if(settings.replace) {
						//if the deployable scripts are not running at the moment 
						//remove them and copy them again (in case there were updates done on the home server)
						if(!this.ns.scriptRunning(scriptname, server)) {
							await this.ns.rm(scriptname, server);
							await this.ns.scp(scriptname, server);
						}
					}
					//check, if scripts should be forced to be replaced
					if(settings.replaceforce) {
						//as the replacement should be forced, kill the script, remove it and redeploy it
						await this.ns.scriptKill(scriptname, server);
						await this.ns.rm(scriptname, server);
						await this.ns.scp(scriptname, server);
					}
				}
			}
			//after deployment, check if there is a script to run
			if(settings.runscript && settings.runscript != "") {
				//check, if the script to run is not running on the server AND the server's max ram
				//let it run the runscript and additional scripts depending on the set buffer
				if(!this.ns.scriptRunning(settings.runscript, server) && (this.ns.getServerMaxRam(server) > (this.ns.getScriptRam(settings.runscript, server) + settings.runbuffer))) {
					//run script on the server
					this.ns.exec(settings.runscript, server, settings.runthreads, settings.rundelay);
				}
			}
		}
	}
}
