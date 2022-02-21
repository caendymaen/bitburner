/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0] || ns.getHostname();
	let delay = ns.args[1] || 0;
	let id = ns.args[2] || "";
	if(delay > 0) {
		await ns.asleep(delay);
	}
	await ns.weaken(target);
}
