// Team-Fähigkeiten: Was bringt ein Held ins Team? Werte 0-3 je Kategorie.
// 0 = gar nicht, 1 = ein bisschen, 2 = solide, 3 = eine der Stärken des Helden.
// Reihenfolge und Gewichte orientieren sich an der Wirkung auf die Siegchance (Vorbild: dotafeed.com),
// die Heldenwerte sind unsere eigene Einschätzung. Ändern ist unkritisch: einfach die Zahl anpassen.

window.CAPABILITIES = [
  { id: "scaling",     label: "Late Game",          hint: "Nach 40 Minuten noch gewinnen können",                weight: 3,   target: 4 },
  { id: "roshan",      label: "Roshan",             hint: "Rosh früh legen können (Schaden, Sustain, Tank)",    weight: 2.8, target: 4 },
  { id: "catch",       label: "Catch",              hint: "Jemanden einholen, der wegläuft",                     weight: 2.6, target: 5 },
  { id: "aoe",         label: "Flächenschaden",    hint: "Mehrere Gegner gleichzeitig treffen",                  weight: 2.2, target: 4 },
  { id: "lockdown",    label: "Lockdown",           hint: "Jemanden zuverlässig festhalten (Stuns, Hex, Root)",  weight: 2.2, target: 6 },
  { id: "push",        label: "Turmdruck",          hint: "Türme schnell umschlagen",                            weight: 2,   target: 4 },
  { id: "initiation",  label: "Initiation",         hint: "Den Kampf eröffnen können",                          weight: 1.9, target: 4 },
  { id: "frontline",   label: "Frontline",          hint: "Schaden fressen, vorne stehen",                        weight: 1.8, target: 5 },
  { id: "lane",        label: "Lane-Stärke",       hint: "Die eigene Lane früh gewinnen",                       weight: 1.4, target: 5 },
  { id: "burst",       label: "Burst",              hint: "Ein Ziel schnell wegbrennen",                          weight: 1.4, target: 4 },
  { id: "counterinit", label: "Counter-Initiation", hint: "Gegnerische Initiation bestrafen, Kämpfe drehen",     weight: 1.2, target: 3 },
  { id: "save",        label: "Save",               hint: "Einen Mitspieler aus dem Fokus retten",                weight: 1,   target: 3 }
];

window.HERO_CAPS = {
    1: { scaling: 3, catch: 1, push: 2, lane: 1 },                                                   // Anti-Mage
    2: { roshan: 1, catch: 2, aoe: 1, lockdown: 3, initiation: 3, frontline: 3, lane: 3 },           // Axe
    3: { catch: 2, lockdown: 3, counterinit: 2, save: 2 },                                           // Bane
    4: { roshan: 2, catch: 3, lockdown: 1, lane: 3 },                                                // Bloodseeker
    5: { catch: 3, aoe: 2, lockdown: 3, lane: 2 },                                                   // Crystal Maiden
    6: { scaling: 2, roshan: 1, catch: 2, push: 3, lane: 2 },                                        // Drow Ranger
    7: { catch: 2, aoe: 3, lockdown: 3, initiation: 2, burst: 2, counterinit: 3 },                   // Earthshaker
    8: { scaling: 3, roshan: 2, catch: 2, push: 2, lane: 2, burst: 2, save: 1 },                     // Juggernaut
    9: { catch: 2, aoe: 2, lockdown: 2, save: 2 },                                                   // Mirana
   10: { scaling: 3 },                                                                               // Morphling
   11: { aoe: 3, lane: 2, burst: 2 },                                                                // Shadow Fiend
   12: { scaling: 3, catch: 1, push: 2 },                                                            // Phantom Lancer
   13: { catch: 3, aoe: 2, lockdown: 2, initiation: 3, lane: 1, burst: 3, counterinit: 3 },          // Puck
   14: { catch: 3, lockdown: 3, initiation: 2, frontline: 3 },                                       // Pudge
   15: { roshan: 1, catch: 2, aoe: 1, frontline: 2, lane: 3 },                                       // Razor
   16: { catch: 2, aoe: 3, lockdown: 2, initiation: 3 },                                             // Sand King
   17: { scaling: 2, catch: 3, lane: 2, burst: 3 },                                                  // Storm Spirit
   18: { scaling: 3, roshan: 2, catch: 2, aoe: 2, lockdown: 2 },                                     // Sven
   19: { roshan: 2, catch: 2, lockdown: 2, lane: 1, burst: 3 },                                      // Tiny
   20: { roshan: 1, catch: 2, lockdown: 2, lane: 2, save: 3 },                                       // Vengeful Spirit
   21: { catch: 2, lockdown: 3, burst: 2 },                                                          // Windranger
   22: { catch: 1, aoe: 2, burst: 3 },                                                               // Zeus
   23: { roshan: 1, catch: 2, aoe: 3, lockdown: 3, initiation: 2, frontline: 2, counterinit: 2 },    // Kunkka
   25: { catch: 2, lockdown: 2, lane: 3, burst: 3 },                                                 // Lina
   26: { catch: 3, lockdown: 3, burst: 3 },                                                          // Lion
   27: { roshan: 2, catch: 3, lockdown: 3, push: 3, burst: 2 },                                      // Shadow Shaman
   28: { catch: 3, lockdown: 3, initiation: 2, frontline: 2, lane: 2 },                              // Slardar
   29: { roshan: 1, catch: 1, aoe: 2, lockdown: 3, initiation: 3, frontline: 3, counterinit: 3 },    // Tidehunter
   30: { catch: 2, aoe: 3, lockdown: 2, burst: 2, save: 1 },                                         // Witch Doctor
   31: { roshan: 1, catch: 2, aoe: 2, lane: 2, save: 2 },                                            // Lich
   32: { scaling: 2, roshan: 1, catch: 2, lane: 2, burst: 2 },                                       // Riki
   33: { roshan: 1, catch: 2, aoe: 3, lockdown: 3, push: 2, initiation: 3, counterinit: 3 },         // Enigma
   34: { aoe: 1, push: 3, burst: 3 },                                                                // Tinker
   35: { scaling: 2, catch: 1, push: 2 },                                                            // Sniper
   36: { scaling: 1, roshan: 1, frontline: 3, lane: 2, save: 1 },                                    // Necrophos
   37: { catch: 1, aoe: 3, lockdown: 2, push: 2, counterinit: 2, save: 2 },                          // Warlock
   38: { roshan: 2, catch: 2, lockdown: 2, push: 3, initiation: 1, lane: 3 },                        // Beastmaster
   39: { catch: 2, aoe: 2, lane: 2, burst: 3 },                                                      // Queen of Pain
   40: { catch: 2, aoe: 2, push: 2, lane: 2 },                                                       // Venomancer
   41: { scaling: 3, roshan: 1, catch: 3, lockdown: 3, initiation: 3, counterinit: 3 },              // Faceless Void
   42: { scaling: 2, roshan: 2, catch: 2, lockdown: 2, push: 2, frontline: 3, lane: 2 },             // Wraith King
   43: { aoe: 2, push: 3, frontline: 1 },                                                            // Death Prophet
   44: { scaling: 3, roshan: 2, lane: 1, burst: 2 },                                                 // Phantom Assassin
   45: { catch: 1, push: 3, burst: 3 },                                                              // Pugna
   46: { roshan: 1, push: 3, lane: 1 },                                                              // Templar Assassin
   47: { scaling: 1, catch: 2, frontline: 2, lane: 3, burst: 2 },                                    // Viper
   48: { scaling: 2, roshan: 2, aoe: 3, push: 2 },                                                   // Luna
   49: { roshan: 2, catch: 2, lockdown: 2, push: 3, frontline: 3, lane: 2 },                         // Dragon Knight
   50: { roshan: 2, push: 1, lane: 2, save: 3 },                                                     // Dazzle
   51: { catch: 3, lockdown: 3, initiation: 3, frontline: 2, lane: 2 },                              // Clockwerk
   52: { catch: 1, aoe: 3, lockdown: 2, push: 3, burst: 3 },                                         // Leshrac
   53: { scaling: 2, roshan: 2, catch: 1, push: 3 },                                                 // Nature's Prophet
   54: { scaling: 2, roshan: 3, catch: 2, frontline: 3, lane: 3 },                                   // Lifestealer
   55: { aoe: 3, initiation: 2, lane: 2, counterinit: 2 },                                           // Dark Seer
   56: { push: 3, lane: 1 },                                                                         // Clinkz
   57: { roshan: 2, frontline: 2, lane: 2, save: 3 },                                                // Omniknight
   58: { roshan: 2, push: 3, lane: 3, save: 1 },                                                     // Enchantress
   59: { roshan: 2, lane: 3 },                                                                       // Huskar
   60: { roshan: 2, catch: 2, lockdown: 2, frontline: 2, lane: 3, burst: 2 },                        // Night Stalker
   61: { roshan: 1, push: 3, lane: 3 },                                                              // Broodmother
   62: { catch: 2, lane: 2, burst: 1 },                                                              // Bounty Hunter
   63: { scaling: 3, roshan: 1, catch: 1, lane: 1 },                                                 // Weaver
   64: { catch: 2, aoe: 3, lockdown: 2, push: 2, lane: 2 },                                          // Jakiro
   65: { catch: 3, lockdown: 1, initiation: 3, lane: 1 },                                            // Batrider
   66: { roshan: 2, push: 3, save: 1 },                                                              // Chen
   67: { scaling: 3, roshan: 2, catch: 2, frontline: 3 },                                            // Spectre
   68: { roshan: 1, catch: 2, aoe: 2, lockdown: 2, burst: 2, counterinit: 2 },                       // Ancient Apparition
   69: { roshan: 2, catch: 2, lockdown: 3, frontline: 3, counterinit: 2 },                           // Doom
   70: { scaling: 2, roshan: 3, catch: 2, frontline: 1, lane: 3, burst: 3 },                         // Ursa
   71: { catch: 3, lockdown: 3, initiation: 3, frontline: 2, lane: 2 },                              // Spirit Breaker
   72: { scaling: 3, roshan: 1, aoe: 3 },                                                            // Gyrocopter
   73: { roshan: 3, catch: 1, lockdown: 2, frontline: 3, lane: 1 },                                  // Alchemist
   74: { catch: 2, aoe: 3, lockdown: 3, burst: 3 },                                                  // Invoker
   75: { scaling: 2, catch: 1, lockdown: 3, counterinit: 3 },                                        // Silencer
   76: { lane: 1 },                                                                                  // Outworld Devourer
   77: { roshan: 3, catch: 2, push: 3, lane: 1 },                                                    // Lycan
   78: { roshan: 2, catch: 2, aoe: 3, initiation: 3, frontline: 3, counterinit: 2 },                 // Brewmaster
   79: { catch: 1, aoe: 1, lockdown: 2, save: 3 },                                                   // Shadow Demon
   80: { scaling: 3, roshan: 3, push: 3 },                                                           // Lone Druid
   81: { roshan: 2, catch: 3, lockdown: 2, push: 1, frontline: 3 },                                  // Chaos Knight
   82: { push: 1, lane: 1 },                                                                         // Meepo
   83: { catch: 2, aoe: 1, lockdown: 3, push: 1, counterinit: 2, save: 2 },                          // Treant Protector
   84: { catch: 2, lockdown: 3, frontline: 2, lane: 2, burst: 2 },                                   // Ogre Magi
   85: { catch: 2, lockdown: 2, frontline: 3, lane: 3, counterinit: 1 },                             // Undying
   86: { roshan: 1, catch: 1, lockdown: 2, counterinit: 2, save: 1 },                                // Rubick
   87: { catch: 3, aoe: 2, lockdown: 3, lane: 2, counterinit: 2 },                                   // Disruptor
   88: { catch: 2, lockdown: 2, burst: 2, counterinit: 2 },                                          // Nyx Assassin
   89: { lockdown: 1, push: 3, initiation: 1 },                                                      // Naga Siren
   90: { catch: 1, aoe: 2, push: 2, save: 1 },                                                       // Keeper of the Light
   91: { roshan: 2, initiation: 2, lane: 2, save: 3 },                                               // Io
   92: { roshan: 2, push: 3 },                                                                       // Visage
   93: { scaling: 3, roshan: 1, catch: 2, lane: 1 },                                                 // Slark
   94: { scaling: 3, roshan: 1, catch: 1, aoe: 2, frontline: 1 },                                    // Medusa
   95: { scaling: 3, roshan: 3, push: 1, lane: 2 },                                                  // Troll Warlord
   96: { roshan: 1, catch: 2, aoe: 2, lockdown: 2, initiation: 3, frontline: 3, counterinit: 2 },    // Centaur Warrunner
   97: { catch: 2, aoe: 2, lockdown: 3, initiation: 3, counterinit: 2 },                             // Magnus
   98: { roshan: 1, aoe: 2, frontline: 3, lane: 2 },                                                 // Timbersaw
   99: { roshan: 2, frontline: 3, lane: 3 },                                                         // Bristleback
  100: { catch: 2, lockdown: 2, initiation: 2, counterinit: 2, save: 2 },                            // Tusk
  101: { catch: 2, aoe: 1, lockdown: 2, burst: 3 },                                                  // Skywrath Mage
  102: { roshan: 1, frontline: 3, lane: 2, save: 3 },                                                // Abaddon
  103: { catch: 2, aoe: 2, lockdown: 3, initiation: 2, frontline: 2 },                               // Elder Titan
  104: { scaling: 2, roshan: 2, catch: 2, frontline: 2, lane: 2, burst: 3 },                         // Legion Commander
  105: { catch: 1, push: 3, burst: 3 },                                                              // Techies
  106: { roshan: 1, catch: 2, aoe: 3, lane: 2, burst: 2 },                                           // Ember Spirit
  107: { catch: 3, lockdown: 3, initiation: 3, burst: 3, save: 3 },                                  // Earth Spirit
  108: { aoe: 2, push: 2, frontline: 3, counterinit: 2 },                                            // Underlord
  109: { scaling: 3, roshan: 1, catch: 1, push: 3, save: 1 },                                        // Terrorblade
  110: { catch: 1, aoe: 3, frontline: 2, counterinit: 3, save: 1 },                                  // Phoenix
  111: { roshan: 1, catch: 1, burst: 2, save: 3 },                                                   // Oracle
  112: { catch: 2, aoe: 2, lockdown: 2, counterinit: 3, save: 3 },                                   // Winter Wyvern
  113: { scaling: 3, roshan: 1, push: 3 },                                                           // Arc Warden
  114: { roshan: 2, catch: 2, lockdown: 2, lane: 1 },                                                // Monkey King
  119: { catch: 3, aoe: 2, lockdown: 3, burst: 2 },                                                  // Dark Willow
  120: { catch: 2, aoe: 2, lockdown: 2, initiation: 3, frontline: 2 },                               // Pangolier
  121: { catch: 2, aoe: 2, lockdown: 3, burst: 2 },                                                  // Grimstroke
  123: { catch: 2, lockdown: 3, initiation: 1 },                                                     // Hoodwink
  126: { catch: 3, lockdown: 1, lane: 1, burst: 3 },                                                 // Void Spirit
  128: { catch: 2, aoe: 3, lockdown: 2, lane: 2, burst: 2 },                                         // Snapfire
  129: { catch: 2, aoe: 2, lockdown: 3, initiation: 3, frontline: 3 },                               // Mars
  131: { catch: 2, lockdown: 3, counterinit: 2, save: 3 },                                           // Ring Master
  135: { roshan: 2, catch: 2, aoe: 2, lockdown: 2, initiation: 2, frontline: 3, save: 2 },           // Dawnbreaker
  136: { roshan: 2, catch: 3, lockdown: 2, frontline: 1, burst: 2, save: 2 },                        // Marci
  137: { roshan: 2, catch: 2, aoe: 2, lockdown: 3, initiation: 3, frontline: 3 },                    // Primal Beast
  138: { scaling: 3 },                                                                               // Muerta
  145: { lane: 1 },                                                                                  // Kez
  155: { aoe: 2, counterinit: 2, save: 3 },                                                          // Largo
};
