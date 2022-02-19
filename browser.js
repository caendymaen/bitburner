//import css
import {getBrowserCSS} from "css.js"
//import the function to make something draggable from "dragndrop.js"
import {makeDraggable} from "dragndrop.js"
//import hacking script
import {RootServers} from "root.js"

//global variable for the netscript object
var ns_;
var debug_;
//global variable to track if browser is running
var isBrowserRunning;
//define variables for elements, that need to be accessed
//from anywhere. e.g. browser, menu (menuW - needed to be a subchild, to make css overflow scrolling work) and content
var browser;
var menuW;
var content;
//define the menulist
//menulist items are defined by categories
//within those categories there is a list of items with a name and a function to call
var menulist;

/** 
 * @param {NS} _ns 
 */
export async function main(ns) {
	//set the global netscript object
	ns_ = ns;
	//set debug mode
	debug_ = true;
	//set tracking variable for browser running to true
	isBrowserRunning = true;
	//create the menulist
	menulist = [
		{
			category: "bitBrowser",
			items: [
				{
					itemname: "Home",
					itemfunction: "callHome()",
					icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M21 8.77217L14.0208 1.79299C12.8492 0.621414 10.9497 0.621413 9.77817 1.79299L3 8.57116V23.0858H10V17.0858C10 15.9812 10.8954 15.0858 12 15.0858C13.1046 15.0858 14 15.9812 14 17.0858V23.0858H21V8.77217ZM11.1924 3.2072L5 9.39959V21.0858H8V17.0858C8 14.8767 9.79086 13.0858 12 13.0858C14.2091 13.0858 16 14.8767 16 17.0858V21.0858H19V9.6006L12.6066 3.2072C12.2161 2.81668 11.5829 2.81668 11.1924 3.2072Z" fill="currentColor" />',
					iconVB: "0 0 24 24"
				}
			]
		},
		{
			category: "General Scripts",
			items: [
				{
					itemname: "Hacknet Nodes",
					itemfunction: "callHacknet()",
					icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.88916C13.6569 8.88916 15 10.2323 15 11.8892C15 13.1954 14.1652 14.3066 13 14.7185V19.8892H11V14.7185C9.83481 14.3066 9 13.1954 9 11.8892C9 10.2323 10.3431 8.88916 12 8.88916ZM12 10.8892C12.5523 10.8892 13 11.3369 13 11.8892C13 12.4414 12.5523 12.8892 12 12.8892C11.4477 12.8892 11 12.4414 11 11.8892C11 11.3369 11.4477 10.8892 12 10.8892Z" fill="currentColor" /> <path d="M7.05019 6.93938C5.78348 8.20612 5 9.9561 5 11.8891C5 14.0666 5.99426 16.0119 7.55355 17.2957L8.97712 15.8721C7.7757 14.9589 7 13.5146 7 11.8891C7 10.5084 7.55962 9.25841 8.46441 8.35359L7.05019 6.93938Z" fill="currentColor" /> <path d="M15.5355 8.35348C16.4403 9.25831 17 10.5083 17 11.8891C17 13.5146 16.2243 14.959 15.0228 15.8722L16.4463 17.2958C18.0057 16.012 19 14.0666 19 11.8891C19 9.95604 18.2165 8.20602 16.9497 6.93927L15.5355 8.35348Z" fill="currentColor" /> <path d="M1 11.8891C1 8.85152 2.23119 6.10155 4.22176 4.11095L5.63598 5.52516C4.00733 7.15383 3 9.40381 3 11.8891C3 14.3743 4.00733 16.6243 5.63597 18.2529L4.22175 19.6672C2.23119 17.6766 1 14.9266 1 11.8891Z" fill="currentColor" /> <path d="M19.7781 19.6673C21.7688 17.6767 23 14.9266 23 11.8891C23 8.85147 21.7688 6.10145 19.7781 4.11084L18.3639 5.52505C19.9926 7.15374 21 9.40376 21 11.8891C21 14.3744 19.9926 16.6244 18.3639 18.2531L19.7781 19.6673Z" fill="currentColor" />',
					iconVB: "0 0 24 24"
				},
				{
					itemname: "Server List",
					itemfunction: "callServers()",
					icon: '<path d="M14.8284 6.34313L16.2426 4.92892L12 0.686279L7.75735 4.92892L9.17156 6.34313L12 3.51471L14.8284 6.34313Z" fill="currentColor" /> <path d="M4.92892 16.2426L6.34313 14.8284L3.51471 12L6.34313 9.17156L4.92892 7.75735L0.686279 12L4.92892 16.2426Z" fill="currentColor" /> <path d="M7.75735 19.0711L12 23.3137L16.2426 19.0711L14.8284 17.6568L12 20.4853L9.17156 17.6568L7.75735 19.0711Z" fill="currentColor" /> <path d="M17.6568 9.17156L20.4853 12L17.6568 14.8284L19.0711 16.2426L23.3137 12L19.0711 7.75735L17.6568 9.17156Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor" />',
					iconVB: "0 0 24 24"
				}
			]
		},
		{
			category: "Hacking",
			items: [
				{
					itemname: "Root All",
					itemfunction: "callRootAll()",
					icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C2.34315 3 1 4.34315 1 6V10C1 11.6569 2.34315 13 4 13H20C21.6569 13 23 11.6569 23 10V6C23 4.34315 21.6569 3 20 3H4ZM20 5H4C3.44772 5 3 5.44772 3 6V10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10V6C21 5.44771 20.5523 5 20 5Z" fill="currentColor" /> <path d="M7 20C7 19.4477 7.44772 19 8 19H16C16.5523 19 17 19.4477 17 20C17 20.5523 16.5523 21 16 21H8C7.44772 21 7 20.5523 7 20Z" fill="currentColor" /> <path d="M5 15C4.44772 15 4 15.4477 4 16C4 16.5523 4.44772 17 5 17H19C19.5523 17 20 16.5523 20 16C20 15.4477 19.5523 15 19 15H5Z" fill="currentColor" />',
					iconVB: "0 0 24 24"
				},
				{
					itemname: "Watcher",
					itemfunction: "callTemplate()",
					icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z" fill="currentColor" />',
					iconVB: "0 0 24 24"
				},
				{
					itemname: "test",
					itemfunction: "callTemplate()",
					icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M14.738 19.9964C14.8186 19.9988 14.8994 20 14.9806 20C19.3989 20 22.9806 16.4183 22.9806 12C22.9806 7.58172 19.3989 4 14.9806 4C12.4542 4 10.2013 5.17108 8.73522 7H7.51941C3.92956 7 1.01941 9.91015 1.01941 13.5C1.01941 17.0899 3.92956 20 7.51941 20H14.5194C14.5926 20 14.6654 19.9988 14.738 19.9964ZM16.6913 17.721C19.0415 16.9522 20.9806 14.6815 20.9806 12C20.9806 8.68629 18.2943 6 14.9806 6C11.6669 6 8.98059 8.68629 8.98059 12H6.98059C6.98059 10.9391 7.1871 9.92643 7.56211 9H7.51941C5.03413 9 3.01941 11.0147 3.01941 13.5C3.01941 15.9853 5.03413 18 7.51941 18H14.5194C15.0691 18 15.9041 17.9014 16.6913 17.721Z" fill="currentColor" />',
					iconVB: "0 0 24 24"
				}
			]
		}
	];
	if(debug_) {
		await ns_.tprint("starting " + ns_.getScriptName());
	}
	//show something that the browser is starting
	ns_.toast("starting " + ns_.getScriptName(), "success", 5000);
	//actually start the browser
	await createBrowser();
}

/**
 * Description						create a new browser window
 */
async function createBrowser() {
	//create a new html element for the browser (global)
	browser = document.createElement("div");
	//set up the browser's css
	await setBrowserCSS();
	//create the titlebar of the browser
	await createTitleBar();
	//create the content window for the browser
	await createContent();
	//show the browser
	await showBrowser();
	//as long as the browser is running wait a second (tracking via global variable)
	while(isBrowserRunning) {
		await ns_.asleep(50);
	}
	//some output to say, that the browser is shutting down
	if(debug_) {
		await ns_.tprint("shutting down " + ns_.getScriptName());
	}
	//some output to say, that the browser is shutting down
	ns_.toast("shutting down " + ns_.getScriptName(), "error", 5000);
	if(document.getElementById('bitBrowser')) {
		document.getElementById('bitBrowser').remove();
	}
	menulist = [];
}

/**
 * Description						add the browser HTML element to the "root" div of the game
 */
async function showBrowser() {
	document.getElementById("root").appendChild(browser);
}

/**
 * Description						remove the browser HTML element and set the global tracking variable to false, to exit the script
 */
async function closeBrowser() {
	browser.remove();
	if(document.getElementById('bitBrowser')) {
		document.getElementById('bitBrowser').remove();
	}
	isBrowserRunning = false;
	menulist = [];
}

/**
 * Description						create the titlebar of the browser
 */
async function createTitleBar() {
	//create a new HTML element for the titlebar
	let titlebar = document.createElement("div");
	//do some settings for the titlebar
	await setTitlebar(titlebar);
	//make the browser window dragable
	await makeDraggable(titlebar, browser);
	//append the titlebar to the browser
	browser.appendChild(titlebar);
}

/**
 * Description						create the content window of the browser (directly under the titlebar)
 */
async function createContent() {
	//create a new HTML element for the content window
	let contentWindow = document.createElement("div");
	//do some settings for the content window
	await setContentWindow(contentWindow);
	//set up the content window (create menu and actual content window)
	await setUpContentWindow(contentWindow);
	//append the content window to the browser
	browser.appendChild(contentWindow);
}

/**
 * Description						create the content window for the browser
 * 
 * @param {DOMElement} contentWindow	HTML element for the content window (below titlebar)
 */
async function setUpContentWindow(contentWindow) {
	//had a few troubles to let make the menulist scrollable, therefore needed to nest it
	//create a new HTML element for the left side navigation menu
	let menu = document.createElement("div");
	menu.id = "bitBrowserMenu";
	//create a new HTML element for the actual menu list (global)
	menuW = document.createElement("div");
	menuW.id = "bitBrowserMenuWindow";
	//create a new HTML element for the actual content window! (global)
	content = document.createElement("div");
	content.id = "bitBrowserContentWindow";
	//populate the menulist
	await populateMenu(menuW);
	//add the menulist to the left side navigation
	menu.appendChild(menuW);
	//add the menu and the actual content window 
	contentWindow.appendChild(menu);
	contentWindow.appendChild(content);
	//call the first site to show!
	await callHome();
}

/**
 * Description						populates the menu 
 * 
 * @param {DOMElement} menu			HTML element for the menulist
 */
async function populateMenu(menu) {
	//go through the menulist
	for(let i = 0; i < menulist.length; i++) {
		//create a new HTML element for the list (by category)
		let ulBlock = document.createElement("ul");
		//create a new HTML element for the first list item (category name)
		let liBlock = document.createElement("li");
		liBlock.innerHTML = menulist[i].category;
		//append the list item to the list
		ulBlock.appendChild(liBlock);
		//go through all items within the menulist's category
		for(let j = 0; j < menulist[i].items.length; j++) {
			//create a new list item for all items within this category
			let liiBlock = document.createElement("li");
			//create a new element for the menu item's icon
			let miIcon = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			miIcon.setAttribute("viewBox", menulist[i].items[j].iconVB);
			miIcon.innerHTML = menulist[i].items[j].icon;
			//create a new element for the menu item'sname
			let miName = document.createElement("span");
			miName.innerHTML = menulist[i].items[j].itemname;
			//as "home" is the starting page, activate it at first
			if(menulist[i].items[j].itemname == "Home") {
				liiBlock.setAttribute("id", "activeItem");
				miIcon.setAttribute("id", "activeicon");
			}
			//add an onclick function to the list item
			liiBlock.addEventListener("click", async function(e){
				try {
					e.preventDefault();
					if(debug_) {
						await ns_.toast("testing menu item " + menulist[i].items[j].itemname + " click", "warning", 5000); //<---does not work here!! <--- SLEEP is running!!!!!!!!! <---- ns.asleep(ms) works instead!
					}
					//search, if there already is a clicked list item
					let oldActiveItem = document.getElementById('activeItem');
					let oldActiveIcon = document.getElementById("activeicon");
					//if there already is a clicked item, remove the id from it to format it like all other list items
					if(oldActiveItem) {
						oldActiveItem.removeAttribute("id");
					}
					if(oldActiveIcon) {
						oldActiveIcon.removeAttribute("id");
					}
					//now set the clicked listitem's id to format it otherwise
					liiBlock.setAttribute("id", "activeItem");
					miIcon.setAttribute("id", "activeicon");
					//call the listitem's function to show content
					await eval(menulist[i].items[j].itemfunction);
				} catch(err) {
					content.innerHTML = JSON.stringify(err);
				}
			}, false);
			liiBlock.appendChild(miIcon);
			liiBlock.appendChild(miName);
			//add the list item to the list
			ulBlock.appendChild(liiBlock);
		}
		//add the list to the menu
		menu.appendChild(ulBlock);
	}
}

async function callTemplate() {
	if(debug_) {
		await ns_.toast("showing template", "warning", 5000);
	}
	//reset the content window's content
	content.innerHTML = "";
	//create a content's title and place it
	let title = document.createElement("h1");
	title.innerHTML = "This is a template function!";
	content.appendChild(title);
	//create a div for some content
	let template = document.createElement("div");
	template.innerHTML = "icons within the menu are found here:";
	//add a line break
	template.appendChild(document.createElement("br"));
	//create a div for some content
	let link = document.createElement("div");
	link.innerHTML = '<span class="goodcolor">https://css.gg/app</span> and <span class="goodcolor">https://tabler-icons.io/</span>';
	template.appendChild(link);
	//append all the content to the content window
	content.appendChild(template);
}

/**
 * Description						show a first "home" site
 */
async function callHome() {
	if(debug_) {
		await ns_.toast("showing home", "warning", 5000);
	}
	//reset the content window's content
	content.innerHTML = "";
	content.innerHTML = "<center><h1>Welcome to <span style='color: #00cc00;'>bitBrowser</span>!</h1></center>";
}

/**
 * Description						show the hacknet nodes site
 */
async function callHacknet() {
	if(debug_) {
		await ns_.toast("showing hacknet nodes", "warning", 5000);
	}
	//set the name of the script for buying/upgrading hacknet nodes
	let hacknetnodescript = "hacknet-buy.js";
	//reset the content window's content
	content.innerHTML = "";
	//create a content's title and place it
	let title = document.createElement("h1");
	title.innerHTML = "Hacknet Nodes";
	content.appendChild(title);
	let hacknetbutton = document.createElement("div");
	//check if the hacknet-buy script is running
	if(await ns_.isRunning(hacknetnodescript, "home")) {
		hacknetbutton.className = "buttonbad";
		hacknetbutton.innerHTML = "stop buying hacknet nodes";
		hacknetbutton.addEventListener("click", async function() {
			await ns_.kill(hacknetnodescript, "home");
			await ns_.toast("killed " + hacknetnodescript, "error", 5000);
			await callHacknet();
		}, false);
	}
	else {
		hacknetbutton.className = "buttongood";
		hacknetbutton.innerHTML = "start buying hacknet nodes";
		hacknetbutton.addEventListener("click", async function() {
			await ns_.exec(hacknetnodescript, "home"); //
			await ns_.toast("started " + hacknetnodescript, "success", 5000);
			await callHacknet();
		}, false);
	}
	content.appendChild(hacknetbutton);
}

/**
 * Description						show the root all servers site
 */
async function callRootAll() {
	if(debug_) {
		await ns_.toast("showing root all", "warning", 5000);
	}
	//create a new object from RootServers
	let rootservers = new RootServers(ns_);
	//reset the content window's content
	content.innerHTML = "";
	//create a content's title and place it
	let title = document.createElement("h1");
	title.innerHTML = "Root All Servers";
	content.appendChild(title);
	let hacknetbutton = document.createElement("div");
	//add a button to root all servers
	hacknetbutton.className = "genericbutton";
	hacknetbutton.innerHTML = "root 'em all";
	hacknetbutton.addEventListener("click", async function() {
		await rootservers.rootAllServers();
	}, false);
	content.appendChild(hacknetbutton);
}

/**
 * Description						show the servers list
 */
async function callServers() {
	if(debug_) {
		await ns_.toast("showing servers", "warning", 5000);
	}
	//create a new object from RootServers
	let rootservers = new RootServers(ns_);
	//reset the content window's content
	content.innerHTML = "";
	//create a content's title and place it
	let title = document.createElement("h1");
	title.innerHTML = "ServerList";
	content.appendChild(title);
	//create an array of list items, which is inspected later
	//to make the server-tree work
	let liItems = [];
	//create the initial list
	let ulBlock = document.createElement("ul");
	//run through the list of servers
	for(let i = 0; i < rootservers.serverList.length; i++) {
		//create a list item
		let liBlock = document.createElement("li");
		//give the list item an ID, so a check for sub-nodes is possible
		liBlock.id = "li-" + rootservers.serverList[i].servername;
		//format the list item
		liBlock.classList.add("standardcolor");
		//create an inline element for the servername
		let innerBlock = document.createElement("span");
		innerBlock.classList.add("serverinfoname");
		//insert the server's name into the inline element
		innerBlock.innerHTML = rootservers.serverList[i].servername;
		//add the inline element to the list item
		liBlock.appendChild(innerBlock);
		//check, if the server has children
		if(rootservers.serverList[i].haschildren) {
			//create a button to expand the tree
			let expandbutton = document.createElement("div");
			expandbutton.className = "expandbutton";
			expandbutton.innerHTML = "&#11208;"
			//home isn't hidden at first, therefore give it's expand button another icon
			if(rootservers.serverList[i].servername == "home") {
				expandbutton.innerHTML = "&#11206;"
			}
			//add functionallity to expand a tree node
			expandbutton.addEventListener("click", function(e) {
				//get the parent element of the expand button (list item)
				let tmpparent = e.target.parentElement;
				//if there is an additional list within the parent
				if(tmpparent.getElementsByTagName("ul").length > 0) {
					//get the additional list within the parent
					let innerUl = tmpparent.getElementsByTagName("ul")[0];
					//hide or show the list with toggling the hideIt CSS class (display: none)
					innerUl.classList.toggle("hideIt");
					//change the expand icon with the status of hideIt
					if(innerUl.classList.contains("hideIt")) {
						e.target.innerHTML = "&#11208;";
					} else {
						e.target.innerHTML = "&#11206;";
					}
				}
			}, false);
			//append the expand button to the list item
			liBlock.appendChild(expandbutton);
		}
		//check, if the current servername is not "home"
		if(rootservers.serverList[i].servername != "home") {
			//check if the current server has rootaccess
			if(rootservers.serverList[i].rootaccess) {
				//format the servername to green
				innerBlock.classList.add("goodcolor");
				//create an element for a weakening-button
				let weakbutton = document.createElement("div");
				weakbutton.className = "genericbutton";
				weakbutton.innerHTML = "weaken it!"
				//add functionallity to weaken a server
				weakbutton.addEventListener("click", function() {
					ns_.toast("success", "success");
					ns_.toast("info", "info");
					ns_.toast("warning", "warning");
					ns_.toast("error", "error");
					/**
					 * ---------------------------------------
					 * ---------------------------------------
					 * ---------------------------------------
					 * TODO: weaken it functionallity!!!!!!!!!
					 * ---------------------------------------
					 * ---------------------------------------
					 * ---------------------------------------
					 */
					callServers();
				}, false);
				liBlock.appendChild(weakbutton);			
			} 
			//if there is no rootaccess to the current server
			else {
				//if the server is hackable (gaining rootaccess) -> required hacking level and amount of programs to open ports
				if(rootservers.serverList[i].ishackable) {
					//change the servernames color to green
					innerBlock.classList.toggle("badcolor");
					//create an element for a button to gain rootaccess
					let rootbutton = document.createElement("div");
					rootbutton.className = "genericbutton";
					rootbutton.innerHTML = "get root access"
					//add functionallity for the root-button
					rootbutton.addEventListener("click", function() {
						//call the rootServer function for this server
						rootservers.rootServer(rootservers.serverList[i].servername);
						callServers();
					}, false);
					//add the root-button to the list item
					liBlock.appendChild(rootbutton);
				}
			}
			//add a linebreak to the list item
			liBlock.appendChild(document.createElement("br"));
			//create an element for additional server info
			let infoBlock = document.createElement("div");
			infoBlock.className = "serverinfo";
			infoBlock.innerHTML = "required ports: " + rootservers.serverList[i].requiredports + "\
								<br />required hacking level: " + rootservers.serverList[i].requiredhacking + "\
								<br />max ram: " + rootservers.serverList[i].maxram + "\
								<br />security level: " + rootservers.serverList[i].securitylevel + "\
								<br />min security level: " + ns_.getServerMinSecurityLevel(rootservers.serverList[i].servername) + "\
								<br />available money: " + ns_.getServerMoneyAvailable(rootservers.serverList[i].servername) + "\
								<br />maximum money: " + ns_.getServerMaxMoney(rootservers.serverList[i].servername) + "\
								<br />hack efficiency: " + rootservers.serverList[i].efficiency + " $/s";
			//append the additional server info to the list item
			liBlock.appendChild(infoBlock);
		}
		//create a temporary variable for a list item element
		let tmpBlock;
		//create a variable, if the list item should be appended to the list or a new list should be created
		let append = true;
		//run through the list of list items which was created at the beginning
		for(let j = 0; j < liItems.length; j++) {
			//if the current's servers parent is already within the list
			if(liItems[j].id == "li-"+rootservers.serverList[i].parent) {
				//set append to false, so a new list should be created
				append = false;
				//the temporary block should now be the parent of the current server (as a listitem was found)
				tmpBlock = liItems[j];
			}
		}
		//if no list item with the parent's name was found, as the append variable is still true
		if(append) {
			//append the list item to the list
			ulBlock.appendChild(liBlock);
		}
		//if a list item with the parent's name was found
		else {
			//check if the list item of server's parent already has a list inside
			if(tmpBlock.getElementsByTagName("ul").length > 0) {
				//if the parent has already a list inside just add the server to the last element (should be the list, as it is always appended at the latest stage)
				tmpBlock.lastElementChild.appendChild(liBlock);
			} 
			//if there is no list within the server's parent list item
			else {
				//create a new list element
				let tmpUl = document.createElement("ul");
				//if the server's parent is not home, hide the inside children at first (toggling CSS class hideIt)
				if(rootservers.serverList[i].parent != "home") {
					tmpUl.classList.toggle("hideIt");
				}
				//append the list item to this new list
				tmpUl.appendChild(liBlock);
				//append the new list
				tmpBlock.appendChild(tmpUl);
			}
		}
		//add the list item to already covered list items list
		liItems.push(liBlock);
	}
	//add the whole serverlist to the content window
	content.appendChild(ulBlock);
}

/**
 * Description						sets the CSS for a given element for a "browser"
 * 
 * @param {DOMElement} element 		a DOM element
 */
async function setBrowserCSS() {
	//set the browser's id
	browser.id = "bitBrowser";
	//set browser draggable to false to prevent from strange behaviour while dragging
	browser.draggable = false;
	//create a new HTML style element
	let css = document.createElement("style");
	//set up the CSS
	let csshtml = await getBrowserCSS();
	css.innerHTML = csshtml;
	//append the style block to the browser
	browser.appendChild(css);
}

/**
 * Description						sets up the titlebar
 * 
 * @param {DOMElement} element		a HTML element for the titlebar
 */
async function setTitlebar(element) {
	//give the titlebar an id
	element.id = "bitBrowserTitleBar";
	//set titlebar draggable to false to prevent from strange behaviour while dragging
	element.draggable = false;
	//set up the innerHTML of the titlebar to have a 3 column bar (logo - title - closebutton)
	//element.innerHTML = "<div style=\"flex: '0 0 30px'; font-size: 25px; font-weight: bolder; padding-left: 10px;\">&#8383;</div><div>bitBrowser</div>";
	element.innerHTML = '<div style=\"flex: 0 0 30p; padding-left: 15px; padding-top: 6px;\"><svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <circle cx="12" cy="12" r="9"></circle> <line x1="3.6" y1="9" x2="20.4" y2="9"></line> <line x1="3.6" y1="15" x2="20.4" y2="15"></line><path d="M11.5 3a17 17 0 0 0 0 18"></path> <path d="M12.5 3a17 17 0 0 1 0 18"></path></svg></div><div>bitBrowser</div>';
	//create a HTML element for the closebutton
	let closebutton = document.createElement("div");
	//show a X (or better the unicode cross)
	closebutton.innerHTML = "&#10006;";
	//do some settings for the closebutton
	await setCloseButton(closebutton);
	//add an onclick function to the close button
	closebutton.addEventListener("click", function() {
		//close the browser
		closeBrowser();
	}, false);
	//add the close button to the titlebar (now actually the third column is added at the end)
	element.appendChild(closebutton);
}

/**
 * Description						sets up the close button
 * 
 * @param {DOMElement} element		a HTML element for the closebutton
 */
async function setCloseButton(element) {
	//set the closebutton's id
	element.id = "closeWindow";
	//set closebutton draggable to false to prevent from strange behaviour while dragging
	element.draggable = false;
}

/**
 * Description						sets up the content window
 * 
 * @param {DOMElement} element		a HTML element for the content window
 */
async function setContentWindow(element) {
	//set the content window's id
	element.id = "bitBrowserContent";
	//set contentwindow draggable to false to prevent from strange behaviour while dragging
	element.draggable = false;
}
