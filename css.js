/**
 * Description						this is an outsourced function to define some css for the browser
 * 
 * @returns {string} 				returns a string that contains some css
 */
export async function getBrowserCSS() {
	//define the string for css
	//
	// TODO: 	split the string in more parts to make it more readable
	//			split should be done like one string for general, one for titlebar, one for sidemenue, etc.
	//
	let cssstring = "\
		#bitBrowser {\
			border-radius: 0px 0px 0px 0px;\
			box-shadow: 5px 5px 10px #222222;\
			border: 1px solid #444444;\
			position: fixed;\
			left: 30px;\
			left: calc(50% - 800px);\
			top: 100px;\
			top: calc(50% - 450px);\
			width: 1600px;\
			height: 900px;\
			font-family: Lucida Console, Lucida Sans Unicode, Fira Mono, Consolas, Courier New, monospace;\
			display: flex;\
			flex-flow: column;\
			resize: both;\
			max-height: 1200px;\
			overflow: hidden;\
			z-index: 99999;\
			scroll-behavior: smooth;\
		}\
		#bitBrowser::-webkit-resizer {\
			border-bottom: 3px solid #00cc00;\
			border-right: 3px solid #00cc00;\
		}\
		#bitBrowser:hover {\
			border: 1px solid #00cc00;\
		}\
		#bitBrowserTitleBar {\
			border-bottom: 1px solid #444444;\
			background-color: #000000;\
			color: #888888;\
			width: 100%;\
			height: 44px;\
			padding: 0px;\
			margin: 0px;\
			text-align: center;\
			display: flex;\
			justify-content: space-between;\
			align-items: center;\
			cursor: grab;\
		}\
		#closeWindow {\
			flex: 0 0 30px;\
			color: #888888;\
			font-size: 20px;\
			font-weight: bold;\
			padding-right: 5px;\
			cursor: pointer;\
		}\
		#closeWindow:hover {\
			color: #ffffff;\
		}\
		#bitBrowserContent {\
			background-color: rgba(0, 0, 0, 0.9);\
			color: #888888;\
			width: 100%;\
			height: calc(100% - 44px);\
			flex-grow: 1;\
			display: flex;\
			flex-flow: row nowrap;\
		}\
		#bitBrowserMenu {\
			width: 20%;\
			height: 100%;\
			border-right: 1px solid #444444;\
			overflow: auto;\
			overscroll-behavior: contain;\
			flex-grow: 1;\
		}\
		#bitBrowserMenuWindow {\
			width: 100%;\
			height: 100%;\
			color: #888888;\
		}\
		#bitBrowserContentWindow {\
			color: #888888;\
			width: 80%;\
			height: 100%;\
			overflow: auto;\
			overscroll-behavior: contain;\
			padding: 15px;\
  			box-sizing: border-box;\
			text-align: left;\
		}\
		#bitBrowserContentWindow h1 {\
			padding: 25px;\
		}\
		\
		#bitBrowserMenu #bitBrowserMenuWindow ul {\
			list-style-type: none;\
			padding: 0;\
			margin: 0;\
			text-align: left;\
			font-size: 16px;\
			width: 100%;\
			border-bottom: 1px solid #444444;\
		}\
		#bitBrowserMenu #bitBrowserMenuWindow ul li {\
			padding-top: 10px;\
			padding-bottom: 10px;\
			padding-left: 35px;\
			width: 100%;\
  			box-sizing: border-box;\
			text-align: left;\
			display: flex;\
			align-items: center;\
		}\
		#bitBrowserMenu #bitBrowserMenuWindow ul li:first-child {\
			color: #00cc00;\
			cursor: default;\
		}\
		#bitBrowserMenu #bitBrowserMenuWindow ul li:not(:first-child) {\
			cursor: pointer;\
		}\
		#bitBrowserMenu #bitBrowserMenuWindow ul li:not(:first-child):active {\
			color: #00cc00;\
			border-left: 3px solid #00cc00;\
		}\
		#bitBrowserMenu #bitBrowserMenuWindow ul li#activeItem {\
			color: #00cc00;\
			border-left: 3px solid #00cc00;\
			padding-left: 32px;\
		}\
		#bitBrowserMenu #bitBrowserMenuWindow ul li svg {\
			padding-right: 35px;\
			width: 24px;\
			height: 24px;\
		}\
		\
		.buttongood {\
			border: 1px solid #444444;\
			color: #00cc00;\
			padding: 10px;\
			display: inline-block;\
			cursor: pointer;\
		}\
		.buttongood:hover {\
			background-color: #444444;\
		}\
		.buttonbad {\
			border: 1px solid #444444;\
			color: #cc0000;\
			padding: 10px;\
			display: inline-block;\
			cursor: pointer;\
		}\
		.buttonbad:hover {\
			background-color: #444444;\
		}\
		.genericbutton {\
			border: 1px solid #444444;\
			color: #00cc00;\
			padding: 10px;\
			cursor: pointer;\
			text-align: center;\
			margin: 5px;\
			margin-left: 25px;\
			display: inline-block;\
		}\
		.genericbutton:hover {\
			background-color: #444444;\
		}\
		.expandbutton {\
			border: 0px;\
			color: #444444;\
			font-weight: bolder;\
			padding: 5px;\
			margin-bottom: 5px;\
			display: inline-block;\
			cursor: pointer;\
			font-size: 20px;\
		}\
		.expandbutton:hover {\
			color: #ffffff;\
		}\
		.serverinfo {\
			color: #888888;\
			text-align: left;\
			margin: 0px;\
			margin-top: 10px;\
			margin-bottom: 10px;\
		}\
		\
		\
		#bitBrowserContentWindow ul {\
			list-style-type: none;\
			text-align: left;\
			padding: 0px;\
			margin: 0px;\
			padding-left: 15px;\
			margin-bottom: 0px;\
		}\
		#bitBrowserContentWindow li {\
			padding: 0px;\
			margin: 0px;\
			padding-left: 15px;\
			margin-bottom: 10px;\
			border-left: 1px dashed #444444;\
		}\
		.hideIt {\
			display: none;\
		}\
		.serverinfoname {\
			font-family: Lucida Console, Lucida Sans Unicode, Fira Mono, Consolas, Courier New, monospace;\
			font-size: 16px;\
			text-align: left;\
		}\
		.goodcolor {\
			color: #00cc00;\
		}\
		.badcolor {\
			color: #cc0000;\
		}\
		.neutralcolor {\
			color: #f0ca00;\
		}\
		.standardcolor {\
			color: #888888;\
		}\
		.passivecolor {\
			color: #44b2bc;\
		}\
		.serverblock{}\
		#serversearch {\
			font-family: Lucida Console, Lucida Sans Unicode, Fira Mono, Consolas, Courier New, monospace;\
			position: fixed;\
			transform: translate(25px, -120px);\
			border: 1px solid #444444;\
			background-color: rgba(0, 0, 0, 0.8);\
			color: #888888;\
			padding: 5px;\
			width: 300px;\
		}\
		#serversearch:hover, #serversearch:focus, #serversearch:active {\
			border: 1px solid #00cc00;\
			outline: none;\
		}\
		#serversearch::-webkit-search-cancel-button {\
			display: none;\
		}\
	";
	return cssstring;
}
