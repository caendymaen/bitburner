/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0] || ns.getHostname();
	await ns.grow(target);
}
