//import ServerList class
import {ServerList} from "utils.js"
//import delay
import {GeneralDelay} from "const.js"
/** Class representing root server functionallity */
export class RootServers {
	/**
	 * Description 						create RootServers
	 * 
	 * @param {NSObject} ns_ 			the Netscript object
	 */
	constructor(ns_) {
		this.ns = ns_;
		this.servers = new ServerList(this.ns);
	}
	/**
	 * Description:						returns an array of servers, including some information for each of them
	 * 
	 * @returns {array}					returns an array of servers, including some information for each of them
	 */
	get serverList() {
		return this.servers.serverList;
	}
	/**
	 * Description:						trys to get root access to a given server
	 * 
	 * @Param {string}					a servername
	 */
	async rootServer(servername) {
		//get server information for the given servername
		let server = this.servers.getServerInfo(servername);
		//if it is a valid server
		if(server) {
			//check for root access
			if(server.rootaccess) {
				//show a message, that root access is already given
				this.ns.toast("you already have root access to \"" + server.servername + "\"", "info", 5000);
			}
			//if no root access check, if the server is not hackable 
			else if(!server.ishackable) {
				//show an error message, that the requirements to hack a server aren't fullfilled
				this.ns.toast("you do not fullfill the requirements to gain root access to \"" + server.servername + "\"", "error", 5000);
			}
			//if there is no root access to the server and it is hackable 
			else {
				//create a temporary variable for all players .exe files
				let exe_files = this.servers.playerDetails.exeFiles;
				//go through the list of .exe files
				for(let file of Object.keys(exe_files)) {
					//if the file exists on the homeserver run the specific .exe-file
					if(this.ns.fileExists(file, "home")) {
						//run the current .exe-file on the server
						eval("this.ns." + exe_files[file] + "('" + server.servername + "')");
					}
				}
				//run nuke() on the server to grant root access
				this.ns.nuke(server.servername);
				//update the server's information
				this.servers.updateServer(server.servername);
				//show a message, that root access now was gained
				this.ns.toast("gained root access to \"" + server.servername + "\"", "success", 5000);
			}
		}
		//if it wasn't a valid server 
		else {
			//show an error message
			this.ns.toast("the server \"" + server.servername + "\" doesn't exist", "error", 5000);
		}
	}
	/**
	 * Description:						trys to get root access to all servers
	 */
	async rootAllServers() {
		//run through the list of servers
		for(let i = 0; i < this.servers.serverList.length; i++) {
			//wait a little bit to reduce lag
			await this.ns.asleep(GeneralDelay);
			//try to gain root access for the current server
			this.rootServer(this.servers.serverList[i].servername);
		}
	}
}
