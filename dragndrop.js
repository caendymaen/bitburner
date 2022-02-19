/**
 * Description                    function to make a window draggable
 * 
 * @param {DOMElement} titlebar   HTML element which represents the area which is draggable
 * @param {DOMElement} moveWindow HTML element which represents the actual draggable window
 */
export async function makeDraggable(titlebar, moveWindow) {
	//define some variables to track the windows position
	var startX = 0;
	var startY = 0;
	var currentX = 0;
	var currentY = 0;
	var offsetX = 0;
	var offsetY = 0;
	//add the mousedown and mouseup events
	titlebar.addEventListener("mousedown", dragstart, false);
	titlebar.addEventListener("mouseup", dragstop, false);
	//the mousedown function
	function dragstart(e) {
		//set the starting point of the dragging action
		startX = e.clientX - offsetX;
		startY = e.clientY - offsetY;
		//give the titlebar the dragging event
		titlebar.addEventListener("mousemove", drag, false);
		titlebar.addEventListener("mouseout", drag, false);
	}
	//the dragging event
	function drag(e) {
		e.preventDefault();
		//set the current position while dragging
		currentX = e.clientX - startX;
		currentY = e.clientY - startY;
		offsetX = currentX;
		offsetY = currentY;
		//do the positioning
		moveWindow.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
	}
	//the mouseup function
	function dragstop(e) {
		//overwrite the latest starting point
		startX = currentX;
		startY = currentY;
		//remove the dragging functionallity
		titlebar.removeEventListener("mousemove", drag, false);
		titlebar.removeEventListener("mouseout", drag, false);
	}
}
