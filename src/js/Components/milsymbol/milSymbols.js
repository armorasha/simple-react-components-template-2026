/**
 * Named MIL-STD-2525D symbols for <MilSymbol symbol={...} />, used the way FontAwesome icons are (faBell → airFriend).
 * Each holds a 20-digit SIDC and its line color. SIDC position 4 is the standard identity: 0 pending, 1 unknown,
 * 2 assumed friend, 3 friend, 4 neutral, 5 suspect, 6 hostile. Add new symbols here as the project needs them.
 *
 * Every "PDF p.N" below is the PDF's own page index, not the number printed on the page:
 * http://www.mapsymbs.com/MilStd2525D.pdf (append #page=N to jump there).
 */

/** Table I affiliation colors (PDF p.28). */
const FRIEND = "rgb(128,224,255)";
const NEUTRAL = "rgb(170,255,170)";
const HOSTILE = "rgb(255,128,128)";
const UNKNOWN = "rgb(255,255,128)";

/** Table V civilian purple (PDF pp.32-33, RGB from p.58). Civilian hostile and suspect stay red. */
const CIVILIAN = "rgb(255,161,255)";

/** Air frames, no icon (PDF p.28). */
export const airPending = { sidc: "10000100000000000000", monoColor: UNKNOWN };
export const airUnknown = { sidc: "10010100000000000000", monoColor: UNKNOWN };
export const airFriend = { sidc: "10030100000000000000", monoColor: FRIEND };
export const airNeutral = { sidc: "10040100000000000000", monoColor: NEUTRAL };
export const airHostile = { sidc: "10060100000000000000", monoColor: HOSTILE };
export const airAssumedFriend = { sidc: "10020100000000000000", monoColor: FRIEND };
export const airSuspect = { sidc: "10050100000000000000", monoColor: HOSTILE };

/** Air fixed wing (PDF p.68, entity 110100). */
export const airFixedWingFriend = { sidc: "10030100001101000000", monoColor: FRIEND };
export const airFixedWingNeutral = { sidc: "10040100001101000000", monoColor: NEUTRAL };
export const airFixedWingHostile = { sidc: "10060100001101000000", monoColor: HOSTILE };
export const airFixedWingUnknown = { sidc: "10010100001101000000", monoColor: UNKNOWN };

/** Air rotary wing (PDF p.68, entity 110200). */
export const airRotaryWingFriend = { sidc: "10030100001102000000", monoColor: FRIEND };
export const airRotaryWingNeutral = { sidc: "10040100001102000000", monoColor: NEUTRAL };
export const airRotaryWingHostile = { sidc: "10060100001102000000", monoColor: HOSTILE };
export const airRotaryWingUnknown = { sidc: "10010100001102000000", monoColor: UNKNOWN };

/** Air UAV (PDF p.68, entity 110300). */
export const airUavFriend = { sidc: "10030100001103000000", monoColor: FRIEND };
export const airUavNeutral = { sidc: "10040100001103000000", monoColor: NEUTRAL };
export const airUavHostile = { sidc: "10060100001103000000", monoColor: HOSTILE };
export const airUavUnknown = { sidc: "10010100001103000000", monoColor: UNKNOWN };

/** Air lighter than air (PDF p.68, entity 110500). */
export const airLighterThanAirFriend = { sidc: "10030100001105000000", monoColor: FRIEND };
export const airLighterThanAirNeutral = { sidc: "10040100001105000000", monoColor: NEUTRAL };
export const airLighterThanAirHostile = { sidc: "10060100001105000000", monoColor: HOSTILE };
export const airLighterThanAirUnknown = { sidc: "10010100001105000000", monoColor: UNKNOWN };

/** Air missile (PDF p.70, symbol set 02, entity 110000). */
export const airMissileFriend = { sidc: "10030200001100000000", monoColor: FRIEND };
export const airMissileNeutral = { sidc: "10040200001100000000", monoColor: NEUTRAL };
export const airMissileHostile = { sidc: "10060200001100000000", monoColor: HOSTILE };
export const airMissileUnknown = { sidc: "10010200001100000000", monoColor: UNKNOWN };

/** Civilian air frames: bare air frame in purple. Entity 120000 would draw a "CIV" placeholder, so it is not used. */
export const civilianAirPending = { sidc: "10000100000000000000", monoColor: CIVILIAN };
export const civilianAirUnknown = { sidc: "10010100000000000000", monoColor: CIVILIAN };
export const civilianAirFriend = { sidc: "10030100000000000000", monoColor: CIVILIAN };
export const civilianAirNeutral = { sidc: "10040100000000000000", monoColor: CIVILIAN };
export const civilianAirHostile = { sidc: "10060100000000000000", monoColor: HOSTILE };
export const civilianAirAssumedFriend = { sidc: "10020100000000000000", monoColor: CIVILIAN };
export const civilianAirSuspect = { sidc: "10050100000000000000", monoColor: HOSTILE };

/** Civilian air fixed wing (PDF p.68, entity 120100). */
export const civilianAirFixedWingFriend = { sidc: "10030100001201000000", monoColor: CIVILIAN };
export const civilianAirFixedWingNeutral = { sidc: "10040100001201000000", monoColor: CIVILIAN };
export const civilianAirFixedWingHostile = { sidc: "10060100001201000000", monoColor: HOSTILE };
export const civilianAirFixedWingUnknown = { sidc: "10010100001201000000", monoColor: CIVILIAN };

/** Civilian air rotary wing (PDF p.68, entity 120200). */
export const civilianAirRotaryWingFriend = { sidc: "10030100001202000000", monoColor: CIVILIAN };
export const civilianAirRotaryWingNeutral = { sidc: "10040100001202000000", monoColor: CIVILIAN };
export const civilianAirRotaryWingHostile = { sidc: "10060100001202000000", monoColor: HOSTILE };
export const civilianAirRotaryWingUnknown = { sidc: "10010100001202000000", monoColor: CIVILIAN };

/** Civilian air UAV (PDF p.68, entity 120300). */
export const civilianAirUavFriend = { sidc: "10030100001203000000", monoColor: CIVILIAN };
export const civilianAirUavNeutral = { sidc: "10040100001203000000", monoColor: CIVILIAN };
export const civilianAirUavHostile = { sidc: "10060100001203000000", monoColor: HOSTILE };
export const civilianAirUavUnknown = { sidc: "10010100001203000000", monoColor: CIVILIAN };

/** Civilian air lighter than air (PDF p.68, entity 120400). */
export const civilianAirLighterThanAirFriend = { sidc: "10030100001204000000", monoColor: CIVILIAN };
export const civilianAirLighterThanAirNeutral = { sidc: "10040100001204000000", monoColor: CIVILIAN };
export const civilianAirLighterThanAirHostile = { sidc: "10060100001204000000", monoColor: HOSTILE };
export const civilianAirLighterThanAirUnknown = { sidc: "10010100001204000000", monoColor: CIVILIAN };
