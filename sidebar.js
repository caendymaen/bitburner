/** @param {NS} ns **/
export async function main(ns) {
	//get itemname and script to call from args[]
	let itemname = ns.args[0];
	let itemscript = ns.args[1];
	//if there were less than 2 arguments given exit
	if(ns.args.length < 2) {
		ns.toast("could not append new menu items", "error", 5000);
		ns.exit();
	}
	else {
		//define an at exit function for this to delete HTML elements
		ns.atExit(function() {
			//check, if there is already a menu item with this id
			if(document.getElementById(itemid)) {
				//delete the menu item
				document.getElementById(itemid).remove();
			}
			ns.toast("menu item " + itemname + " deleted", "error", 5000);
		});
		//define a variable to know which color and icon to show
		let itemcolor;
		let itemicon;
		switch(itemname) {
			case "browser":
				itemcolor = "#adff2f";
				itemicon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="' + itemcolor + '" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <circle cx="12" cy="12" r="9"></circle> <line x1="3.6" y1="9" x2="20.4" y2="9"></line> <line x1="3.6" y1="15" x2="20.4" y2="15"></line> <path d="M11.5 3a17 17 0 0 0 0 18"></path> <path d="M12.5 3a17 17 0 0 1 0 18"></path> </svg>';
				break;
			default:
				itemcolor = "#9f6cc8";
				itemicon = "";
				break;
		}
		//define a variable for letting the item show up (important to keep the onclick function work)
		let itemshow = false;
		//set the new menu items id
		let itemid = "menu-item-" + itemname;
		//check, if there is already a menu item with this id
		if(document.getElementById(itemid)) {
			//delete the menu item
			document.getElementById(itemid).remove();
			//do not show anything, therefore don't run the loop
			itemshow = false;
		}
		//if there is no menu item with this id
		else {
			//create the new menu item
			let menuitem = document.createElement("div");
			menuitem.id = itemid;
			//create a ruler - add all the CSS classes used by Bitburner for correct formatting
			let menuitemHR = document.createElement("hr");
			menuitemHR.classList.add("MuiDivider-root");
			menuitemHR.classList.add("MuiDivider-fullWidth");
			menuitemHR.classList.add("css-8dakje");
			//create the actual menu item - add all the CSS classes used by Bitburner for correct formatting
			let menuitemDIV = document.createElement("div");
			menuitemDIV.classList.add("MuiButtonBase-root");
			menuitemDIV.classList.add("MuiListItem-root");
			menuitemDIV.classList.add("MuiListItem-gutters");
			menuitemDIV.classList.add("MuiListItem-padding");
			menuitemDIV.classList.add("MuiListItem-button");
			menuitemDIV.classList.add("css-1e1vz9s");
			//create the container for the icon - add all the CSS classes used by Bitburner for correct formatting
			let menuitemIcon = document.createElement("div");
			menuitemIcon.classList.add("MuiListItemIcon-root");
			menuitemIcon.classList.add("css-1f8bwsm");
			menuitemIcon.innerHTML = itemicon;
			//create the container for the item name - add all the CSS classes used by Bitburner for correct formatting
			let menuitemName = document.createElement("div");
			menuitemName.classList.add("MuiListItemText-root");
			menuitemName.classList.add("css-1tsvksn");
			menuitemName.classList.add("MuiTypography-root");
			menuitemName.classList.add("MuiTypography-body1");
			menuitemName.classList.add("css-11wufc6");
			menuitemName.innerHTML = '<span style="color: ' + itemcolor + '; text-transform: capitalize;">' + itemname + '</span>';
			//apend icon and name to the actual menu item
			menuitemDIV.appendChild(menuitemIcon);
			menuitemDIV.appendChild(menuitemName);
			//get the list of sidebar menu items
			let sidebar = document.querySelector(".MuiList-root");
			//append the ruler to the menu item
			menuitem.appendChild(menuitemHR);
			//append the actual menu item
			menuitem.appendChild(menuitemDIV);
			//add functionallity to open the given script
			menuitem.addEventListener("click", async function() {
				//if the script to call is already running, just show a warning
				if(await ns.isRunning(itemscript, ns.getHostname())) {
					await ns.toast(itemscript + " is already running", "warning", 5000);
				}
				else {
					await ns.exec(itemscript, ns.getHostname());
				}
			}, false);
			//append the menu item to the sidebar
			sidebar.appendChild(menuitem);
			//show the menu item, therefore run the loop
			itemshow = true;
			ns.toast("menu item " + itemname + " added", "success", 5000);
		}
		//run as long as the menu item needs to be shown
		while(itemshow) {
			await ns.asleep(1000);
		}
		//delete the menuitem
		//check, if there is already a menu item with this id
		if(document.getElementById(itemid)) {
			//delete the menu item
			document.getElementById(itemid).remove();
		}
	}
}
