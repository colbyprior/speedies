(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function r(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(t){if(t.ep)return;t.ep=!0;const i=r(t);fetch(t.href,i)}})();const Wn=`{
    "Name": "Cultists",
    "Status": "Draft",
    "Complexity": "️★★★",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "Weak units mutate into monstrosities",
    "Preamble": "Embrace the mutations for power",
    "Special Rules": {
        "Mutations": "Heroes can buy up to 2 random mutations. The first costs 30 gold and the second costs 40 gold. These mutations don't count towards their skill limit.",
        "Mutation: Wing": "Can make Agi check before Engaging or Moving to gain the flight properties. Failed flight roll counts as a failed charge if the flight was required to reach the target. Flight Agi checks are made with advantage.",
        "Mutation: Bile-Puker": "Gains Bile Spew: Range 10\\" covering a 2\\" diameter area effect from point. Roll attack per unit in the area of effect. Usable once per 2 turns. Can hit allies and units in melee. If a unit is hit that is in melee, all connected units are also hit.",
        "Mutation: Claw": "Gain one extra attack that must be the Claw, treat as a Sword. Gains Berserker.",
        "Mutation: Extra Arm": "Gain one Melee equipment slot. This lets you wield an extra weapon or Shield as though you had 3 melee Equipment slots. Cannot be taken if this unit has the \\"No Equipment\\" skill.",
        "Mutation: Tentacle": "Gain one extra attack that must be the Tentacle. When attacking with a tentacle the attack always Stuns regardless of the Injury Roll. Enemies have disadvantage against the tentacle.",
        "Mutation: Exploding Husk": "Explodes when Incapacitated, all units within 3\\" diameter take Melee 12 attack.",
        "Mutation: Leechspawn": "Gain one extra wound. If this unit deals a wound to an enemy they can recover one wound up to their maximum wound threshold."
    },
    "Heroes": [
        {
            "Name": "Prophet",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "8",
            "Cost": 90,
            "Skills": [
                "Leader",
                "Cult Magic"
            ]
        },
        {
            "Name": "Acolyte",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "16",
            "Ranged": "16",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": [
                "Cult Magic",
                "Apprentice Spellcaster"
            ]
        },
        {
            "Name": "Mutant",
            "Type": "Hero",
            "Type Cap": "2",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "2",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Free mutation",
                "No Equipment"
            ]
        },
        {
            "Name": "Seeker",
            "Type": "Hero",
            "Type Cap": "",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": []
        }
    ],
    "Henchmen": [
        {
            "Name": "Initiate",
            "Type Cap": "",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "15",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 30,
            "Skills": []
        },
        {
            "Name": "Believer",
            "Type Cap": "",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 0,
            "Skills": [
                "Fear",
                "Berserker"
            ]
        },
        {
            "Name": "Monstrosity",
            "Type Cap": "2",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "15",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 0,
            "Skills": [
                "Free mutation",
                "No Equipment"
            ]
        },
        {
            "Name": "Beastmen",
            "Type Cap": "",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "16",
            "Wounds": "2",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "14",
            "Cost": 0,
            "Skills": []
        }
    ],
    "Available Skills": {
        "Prophet": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Acolyte": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": "X"
        },
        "Mutant": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Seeker": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Initiate": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Believer": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Monstrosity": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Beastmen": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Prophet & Acolytes": {
            "Aliases": ["Prophet", "Acolyte"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword", "Spear"],
            "Ranged Weapons": [],
            "Armour": []
        },
        "Seeker & Initiates": {
            "Aliases": ["Seeker", "Initiate"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword", "Spear", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow"],
            "Armour": ["Light Armour"]
        },
        "Believers": {
            "Aliases": ["Believer"],
            "Melee Weapons": ["Hammer", "Sword", "Great Hammer", "Great Sword"],
            "Ranged Weapons": [],
            "Armour": []
        },
        "Beastmen": {
            "Aliases": ["Beastmen"],
            "Melee Weapons": ["Hammer", "Sword", "Great Hammer", "Great Sword", "Shield"],
            "Ranged Weapons": [],
            "Armour": []
        }
    }
}
`,In=`{
    "Name": "Dwarves",
    "Status": "Released",
    "Complexity": "★★☆",
    "Max Units": "12",
    "Rout Threshold": "6",
    "Play Style": "Rough and Tough",
    "Preamble": "These chonkers go bonkers.",
    "Special Rules": {
        "Hard to Kill": "Dwarves have a -2 to Injury rolls made against them (eg. an unmodified roll of 19 would count as a 17, Stunning rather than Incapacitating the Dwarf).",
        "Dwarven Firearms": "The range of Pistols is increased by 5\\". The range of all other Ranged Weapons (except Blunderbusses) are increased by 10\\". Dwarf Heroes may use any Ranged weapon with a Shield."
    },
    "Heroes": [
        {
            "Name": "Chieftain",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "13",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "5",
            "Cost": 90,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "Builder",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 70,
            "Skills": [
                "Builder"
            ]
        },
        {
            "Name": "Hellion",
            "Type": "Hero",
            "Type Cap": "2",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 75,
            "Skills": [
                "Berserker",
				"Deathwish",
                "Fear"
            ]
        },
        {
            "Name": "Veteran",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 60,
            "Skills": [
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Berserker",
            "Type Cap": "2",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 55,
            "Skills": [
                "Berserker",
				"Deathwish",
                "Fear"
            ]
        },
        {
            "Name": "Youngling",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "15",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 30,
            "Skills": []
        },
        {
            "Name": "Miner",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 45,
            "Skills": []
        },
        {
            "Name": "Runner",
            "Type Cap": "2",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 55,
            "Skills": [
			"Vanguard",
			"Apprentice Builder"
			]
        }
    ],
    "Promotion Options": {
    },
    "Available Skills": {
        "Chieftain": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Builder": {
            "Mel": "",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Hellion": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "X",
            "Mrl": ""
        },
        "Veteran": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Berserker": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Youngling": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Miner": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Runner": {
            "Mel": "",
            "Rng": "",
            "Def": "X",
            "Agi": "X",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Melee-Focused": {
            "Aliases": ["Chieftain", "Builder", "Hellion", "Berserker", "Runner", "Youngling"],
            "Melee Weapons": ["Dagger", "Sword / Axe", "Hammer", "Great Sword / Axe", "Great Hammer", "Shield"],
            "Ranged Weapons": ["Pistol"],
            "Armour": ["Light Armour", "Heavy Armour", "Mithril Armour"]
        },
        "General Warriors": {
            "Aliases": ["Miner", "Veteran"],
            "Melee Weapons": ["Dagger", "Sword / Axe", "Hammer", "Great Sword / Axe", "Great Hammer", "Shield"],
            "Ranged Weapons": ["Crossbow", "Pistol", "Rifle", "Blunderbuss"],
            "Armour": ["Light Armour", "Heavy Armour", "Mithril Armour"]
        }
    }
}
`,Nn=`{
    "Name": "Goblins",
    "Status": "Draft",
    "Complexity": "★★☆",
    "Max Units": "18",
    "Rout Threshold": "7",
    "Play Style": "Sneaky Goblins",
    "Preamble": "",
    "Special Rules": {
        "Totem": "Pick a totem from Mushroom, Goblin Dog and Spider at warband creation. This will impact unit and equipment availability."
    },
    "Heroes": [
        {
            "Name": "Goblin Chief",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Leader",
                "Rage",
                "Recovery",
                "Runner"
            ]
        },
        {
            "Name": "Goblin Shaman",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "11",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage",
                "Green Magic"
            ]
        },
        {
            "Name": "Goblin Stickboss",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage",
                "Animal Leader"
            ]
        },
        {
            "Name": "Goblin Assassin",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "11",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Goblin",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "14",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        },
        {
            "Name": "Goblin Fanatic",
            "Type Cap": "4",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage",
                "Goblin Fanatic"
            ]
        },
        {
            "Name": "Small Mushroom Monster (Mushroom Totem Only)",
            "Type Cap": "5",
            "Move": "6-12",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 0,
            "Skills": [
				"Animal",
                "Bumbling Movement"
            ]
        },
        {
            "Name": "Giant Spider (Spider Totem Only)",
            "Type Cap": "5",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 0,
            "Skills": [
				"Animal"
            ]
        },
        {
            "Name": "Goblin Dog (Goblin Dog Totem Only)",
            "Type Cap": "5",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 0,
            "Skills": [
				"Animal",
                "Pack Tactics"
            ]
        },
        {
            "Name": "Giant Mushroom Monster (Mushroom Totem Only)",
            "Type Cap": "1",
            "Move": "6-12",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "2",
            "Agility": "12",
            "Attacks": "3",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Cowardly",
                "Fear",
                "Large",
                "Animal",
                "Bumbling Movement"
            ]
        },
        {
            "Name": "Troll (Goblin Dog Totem Only)",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "3",
            "Agility": "14",
            "Attacks": "2",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Cowardly",
                "Fear",
                "Large",
                "Regeneration",
                "No Equipment"
            ]
        },
        {
            "Name": "Giant Spider (Spider Totem Only)",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "2",
            "Agility": "8",
            "Attacks": "3",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Fear",
                "Large",
                "Animal"
            ]
        }
    ],
    "Available Skills": {
        "Goblin Chief": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Shaman": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Stickboss": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Assassin": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Fanatic": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Goblin Heroes": {
            "Aliases": ["Goblin Heroes"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Throwing Stars", "Short Bow"],
            "Armour": ["Light Armour"]
        },
        "Goblin Assassin": {
            "Aliases": ["Goblin Assassin"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe"],
            "Ranged Weapons": ["Throwing Stars", "Short Bow"],
            "Armour": ["Light Armour"]
        },
        "Goblin": {
            "Aliases": ["Goblin"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Shield"],
            "Ranged Weapons": ["Short Bow"],
            "Armour": ["Light Armour"]
        },
        "Goblin Fanatics": {
            "Aliases": ["Goblin Fanatics"],
            "Melee Weapons": ["Ball and Chain", "Sword / Axe" ,"Poisoned Dagger"],
            "Ranged Weapons": [],
            "Armour": []
        }
    }
}`,Hn=`{
    "Name": "Inquisitors",
    "Status": "Released",
    "Complexity": "★☆☆",
    "Max Units": "12",
    "Rout Threshold": "6",
    "Play Style": "Powerful heroes with minions",
    "Preamble": "Magic never expects us.",
    "Special Rules": {
        "Incite the Mob": "At the start of each game make a Morale Check once per hero. For each success, a Peasant temporarily joins your warband for this game only. These Peasants do not count towards the rout threshold when Incapacitated and cannot Promote."
    },
    "Heroes": [
        {
            "Name": "High Inquisitor",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "12",
            "Defense": "17",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 85,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "Priest",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 80,
            "Skills": [
                "Divine Magic"
            ]
        },
        {
            "Name": "Inquisitor",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 55,
            "Skills": [
            ]
        },
        {
            "Name": "Doomsayer",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "15",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 65,
            "Skills": [
                "The Rapture is Nigh",
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Fanatic",
            "Type Cap": "5",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": [
                "Fear"
            ]
        },
        {
            "Name": "Zealot",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "16",
            "Ranged": "16",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 20,
            "Skills": []
        },
        {
            "Name": "Peasant",
            "Type Cap": "See Incite the Mob skill",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "17",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "16",
            "Cost": "-",
            "Skills": [
                "Heed the Scripture",
				"Mob Mentality",
				"Fixed Equipment (Farm Tools)"
            ]
        },
        {
            "Name": "Hound",
            "Type Cap": "5",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 20,
            "Skills": [
				"Animal",
                "Pack Tactics"
            ]
        }
    ],
    "Promotion Options": {
    },
    "Available Skills": {
        "High Inquisitor": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "X",
            "Mrl": "X"
        },
        "Priest": {
            "Mel": "",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Inquisitor": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Doomsayer": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": "X"
        },
        "Fanatic": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Zealot": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Inquisitors": {
            "Aliases": ["High Inquisitor", "Inquisitor", "Doomsayer"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Torch", "Great Hammer", "Great Sword / Axe", "Pike"],
            "Ranged Weapons": ["Crossbow", "Hand Crossbow", "Pistol", "Rifle"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Priest": {
            "Aliases": ["Priest"],
            "Melee Weapons": ["Hammer", "Flail / Great Hammer", "Shield"],
            "Ranged Weapons": [],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Fanatics": {
            "Aliases": ["Fanatic"],
            "Melee Weapons": ["Great Sword / Axe", "Flail", "Pike"],
            "Ranged Weapons": [],
            "Armour": []
        },
        "Zealots": {
            "Aliases": ["Zealot"],
            "Melee Weapons": ["Dagger", "Hammer / Club", "Sword / Axe", "Spear", "Torch", "Shield"],
            "Ranged Weapons": ["Crossbow"],
            "Armour": ["Light Armour"]
        }
    }
}
`,jn=`{
    "Name": "Merchants",
    "Status": "Draft",
    "Complexity": "★★☆",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "Sellsword variant",
    "Preamble": "",
    "Special Rules": {
        "Wagon": "Wagon, units can move onto the wagon if they fit. A maximum of 4 units can be on the wagon at a time. A wagon may steer up to 90 degrees in either direction throughout their movement. Units moving on or off the wagon must make an agi check or be knocked down (placed off the wagon)."
    },
    "Heroes": [
        {
            "Name": "Caravan Leader",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "17",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 75,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "Far Traveller",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 40,
            "Skills": [
            ]
        },
        {
            "Name": "Sorcerer",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Sorcery"
            ]
        },
        {
            "Name": "Ogre",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "16",
            "Wounds": "2",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 0,
            "Skills": [
                "Large"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Caravan Guard",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 30,
            "Skills": []
        },
        {
            "Name": "Scout Rider",
            "Type Cap": "2",
            "Move": "9",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "17",
            "Wounds": "2",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": ["Mounted"]
        },
        {
            "Name": "Halfling",
            "Type Cap": "4",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "13",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 35,
            "Skills": [
                "Thief"
            ]
        },
        {
            "Name": "Caravan",
            "Type Cap": "-",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        }
    ],
    "Available Skills": {
        "Caravan Leader": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Far Traveller": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Sorcerer": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Ogre": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Caravan Guard": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Scout Rider": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Halfling": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Heroes": {
            "Aliases": ["Leader, Far Traveller, Caravan Guard & Halflings"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Throwing Stars", "Short Bow", "Bow"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Sorcerer": {
            "Aliases": ["Sorcerer"],
            "Melee Weapons": ["Dagger", "Sword", "Spear / Staff"],
            "Ranged Weapons": [],
            "Armour": []
        },
        "Ogre": {
            "Aliases": ["Ogre"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Pistol"],
            "Armour": []
        }
    }
}`,$n=`{
    "Name": "Ogres",
    "Status": "Draft",
    "Complexity": "★★★",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "Massive Ogres with Sneaky Goblins",
    "Preamble": "",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Head Ogre",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "16",
            "Wounds": "3",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 0,
            "Skills": [
                "Leader",
                "Large",
                "Lobber"
            ]
        },
        {
            "Name": "Ogre Gunner",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "14",
            "Ranged": "13",
            "Defense": "16",
            "Wounds": "3",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Large",
                "Lobber"
            ]
        },
        {
            "Name": "Ogre Big Gut",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "16",
            "Wounds": "3",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Large",
                "Lobber"
            ]
        },
        {
            "Name": "Goblin Assassin",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "11",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Goblin",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "14",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        },
        {
            "Name": "Goblin Bomber",
            "Type Cap": "3",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage",
                "Bomber"
            ]
        },
        {
            "Name": "Goblin Trapper",
            "Type Cap": "4",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "14",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        },
        {
            "Name": "Sabertusk",
            "Type Cap": "2",
            "Move": "7",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "2",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Animal"
            ]
        }
    ],
    "Available Skills": {
        "Head Ogre": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Ogre Gunner": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Ogre Big Gut": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Assassin": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Bomber": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Trapper": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Ogres": {
            "Aliases": ["Head Ogre", "Ogre Big Gut"],
            "Melee Weapons": ["Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike"],
            "Ranged Weapons": ["Pistol"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Ogre Gunner": {
            "Aliases": ["Ogre Gunner"],
            "Melee Weapons": ["Hammer", "Sword / Axe"],
            "Ranged Weapons": ["Mortar", "Rifle"],
            "Armour": []
        },
        "Goblin Assassin": {
            "Aliases": ["Goblin Assassin"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe"],
            "Ranged Weapons": ["Throwing Stars", "Short Bow"],
            "Armour": ["Light Armour"]
        },
        "Goblin": {
            "Aliases": ["Goblin"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Shield"],
            "Ranged Weapons": ["Short Bow"],
            "Armour": ["Light Armour"]
        },
        "Goblin Trapper": {
            "Aliases": ["Goblin Trapper"],
            "Melee Weapons": ["Dagger", "Poisoned Dagger"],
            "Ranged Weapons": ["Throwing Stars"],
            "Armour": ["Light Armour"]
        }
    }
}`,xn=`{
    "Name": "Orcs",
    "Status": "Draft",
    "Complexity": "★☆☆",
    "Max Units": "12",
    "Rout Threshold": "6",
    "Play Style": "Strong Orcs",
    "Preamble": "",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Orc Chief",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "8",
            "Cost": 0,
            "Skills": [
                "Leader",
                "Rage"
            ]
        },
        {
            "Name": "Orc Shaman",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Rage",
                "Green Magic",
                "Apprentice Spellcaster"
            ]
        },
        {
            "Name": "Orc Bonehead",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Rage"
            ]
        },
        {
            "Name": "Orc Barbarian",
            "Type": "Hero",
            "Type Cap": "2",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Rage",
                "Whirlwind"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Orc Charger",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "15",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 45,
            "Skills": [
                "Rage",
                "Berserker"
            ]
        },
        {
            "Name": "Orc Boar Rider",
            "Type Cap": "2",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "2",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 0,
            "Skills": [
                "Mounted",
                "Rage"
            ]
        },
        {
            "Name": "Orc Sniper",
            "Type Cap": "4",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 0,
            "Skills": [
                "Rage"
            ]
        },
        {
            "Name": "Troll",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "3",
            "Agility": "8",
            "Attacks": "2",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Cowardly",
                "Fear",
                "Large",
                "Regeneration",
                "No Equipment"
            ]
        }
    ],
    "Available Skills": {
        "Orc Chief": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Shaman": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Bonehead": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Barbarian": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Charger": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Board Rider": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Sniper": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Orcs": {
            "Aliases": ["Orcs"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Bow", "Crossbow"],
            "Armour": ["Light Armour", "Heavy Armour"]
        }
    }
}`,Xn=`{
    "Name": "Orcs and Goblins",
    "Status": "Draft",
    "Complexity": "★★☆",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "Strong Orcs with Sneaky Goblins",
    "Preamble": "",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Orc Chief",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "8",
            "Cost": 0,
            "Skills": [
                "Leader",
                "Rage"
            ]
        },
        {
            "Name": "Goblin Shaman",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "11",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage",
                "Green Magic"
            ]
        },
        {
            "Name": "Orc Bonehead",
            "Type": "Hero",
            "Type Cap": "2",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 0,
            "Skills": [
                "Rage"
            ]
        },
        {
            "Name": "Goblin Assassin",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "19",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "11",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Goblin",
            "Type Cap": "-",
            "Move": "5",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "14",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Recovery",
                "Runner",
                "Rage"
            ]
        },
        {
            "Name": "Orc Charger",
            "Type Cap": "4",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "15",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 45,
            "Skills": [
                "Rage",
                "Berserker"
            ]
        },
        {
            "Name": "Orc Cleaver",
            "Type Cap": "2",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "15",
            "Defense": "14",
            "Wounds": "1",
            "Agility": "12",
            "Attacks": "1",
            "Morale": "12",
            "Cost": 45,
            "Skills": [
                "Rage",
                "Berserker",
                "Whirlwind"
            ]
        },
        {
            "Name": "Troll",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "14",
            "Wounds": "3",
            "Agility": "14",
            "Attacks": "2",
            "Morale": "14",
            "Cost": 0,
            "Skills": [
                "Cowardly",
                "Fear",
                "Large",
                "Regeneration",
                "No Equipment"
            ]
        }
    ],
    "Available Skills": {
        "Orc Chief": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Shaman": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Bonehead": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin Assassin": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Goblin": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Charger": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Orc Cleaver": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Orcs": {
            "Aliases": ["Orcs"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Bow", "Crossbow"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Goblin Assassin": {
            "Aliases": ["Goblin Assassin"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe"],
            "Ranged Weapons": ["Throwing Stars", "Short Bow"],
            "Armour": ["Light Armour"]
        },
        "Goblin": {
            "Aliases": ["Goblin"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Shield"],
            "Ranged Weapons": ["Short Bow"],
            "Armour": ["Light Armour"]
        }
    }
}`,qn=`{
    "Name": "Paladins",
    "Status": "Released",
    "Complexity": "★★☆",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "Defensive",
    "Preamble": "An order of paladins and others that seek to advance a holy agenda.",
    "Heroes": [
        {
            "Name": "Justicar",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 95,
            "Skills": [
                "Leader",
                "Divine Magic"
            ]
        },
        {
            "Name": "Paladin",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": []
        },
        {
            "Name": "Cleric",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "17",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": ["Healer"]
        },
        {
            "Name": "Standard Bearer",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "3",
            "Melee": "7",
            "Ranged": "-",
            "Defense": "17",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 55,
            "Skills": [
			"Rally the Troops",
			"Fixed Equipment (Holy Standard)"
			]
        }
    ],
    "Henchmen": [
        {
            "Name": "Squire",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 30,
            "Skills": []
        },
        {
            "Name": "Initiate",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "16",
            "Ranged": "16",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 20,
            "Skills": []
        },
        {
            "Name": "Monk",
            "Type Cap": "3",
            "Move": "7",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "2",
            "Morale": "10",
            "Cost": 55,
            "Skills": [
			"Ki Strike",
			"No Equipment"
			]
        },
        {
            "Name": "Cavalier",
            "Type Cap": "2",
            "Move": "9",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "17",
            "Wounds": "2",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 50,
            "Skills": ["Mounted"]
        }
    ],
    "Available Skills": {
        "Justicar": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Paladin": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Cleric": {
            "Mel": "",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Standard Bearer": {
            "Mel": "",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Squire": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Initiate": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Monk": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Cavalier": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": "X"
        }
    },
    "Equipment": {
        "Paladins": {
            "Aliases": ["Justicar", "Paladin", "Cleric", "Initiate", "Squire"],
            "Melee Weapons": ["Hammer", "Flail / Great Hammer", "Divine Hammer", "Divine Great Hammer", "Sword", "Great Sword", "Shield"],
            "Ranged Weapons": ["Sling"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Cavalier": {
            "Aliases": ["Cavalier"],
            "Melee Weapons": ["Hammer", "Divine Hammer", "Sword", "Great Hammer", "Great Sword", "Pike", "Shield"],
            "Ranged Weapons": [],
            "Armour": ["Light Armour", "Heavy Armour"]
        }
    }
}
`,Gn=`{
    "Name": "Ratlings",
    "Status": "Released",
    "Complexity": "★☆☆",
    "Max Units": "18",
    "Rout Threshold": "7",
    "Play Style": "Fast and agile swarm",
    "Preamble": "RAT",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Guildmaster",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 80,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "Ratlock",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 55,
            "Skills": [
                "Blight Magic"
            ]
        },
        {
            "Name": "Enforcer",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 55,
            "Skills": [
            ]
        },
        {
            "Name": "Assassin",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "8",
            "Piercing": "2",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 60,
            "Skills": [
				"Vanguard"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Underrat",
            "Type Cap": "-",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "15",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 30,
            "Skills": []
        },
        {
            "Name": "Blight Host",
            "Type Cap": "2",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 40,
            "Skills": [
			"Spread Blight (Minor)"
			]
        },
        {
            "Name": "Giant Rat",
            "Type Cap": "4",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "18",
            "Cost": 15,
            "Skills": [
                "Animal"
            ]
        },
        {
            "Name": "Rat Monstrosity",
            "Type Cap": "1",
            "Move": "8",
            "Piercing": "3",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "12",
            "Wounds": "3",
            "Agility": "8",
            "Attacks": "3",
            "Morale": "18",
            "Cost": 205,
            "Skills": [
                "Cowardly",
                "Fear",
                "Large",
				"Animal"
            ]
        }
    ],
    "Available Skills": {
        "Guildmaster": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": "X"
        },
        "Ratlock": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": "X"
        },
        "Enforcer": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Assassin": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Underrat": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Blight Host": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Heroes": {
            "Aliases": ["All heroes, including Promoted henchman"],
            "Melee Weapons": ["Dagger", "Hammer / Club", "Sword / Axe", "Spear / Staff", "Glaive", "Flail", "Fighting Claws"],
            "Ranged Weapons": ["Throwing Stars", "Pistol"],
            "Armour": ["Light Armour"]
        },
        "Rat Underlings": {
            "Aliases": ["Underrat", "Blight Host"],
            "Melee Weapons": ["Dagger", "Hammer / Club", "Sword / Axe", "Spear", "Pike", "Shield"],
            "Ranged Weapons": ["Sling"],
            "Armour": []
        }
    }
}
`,Ln=`{
    "Name": "Sellswords",
    "Status": "Released",
    "Complexity": "★☆☆",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "Balanced",
    "Preamble": "",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Captain",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "17",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 75,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "Champion",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 40,
            "Skills": [
            ]
        },
        {
            "Name": "Sniper",
            "Type": "Hero",
            "Type Cap": "2",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "13",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 45,
            "Skills": [
            ]
        },
        {
            "Name": "Knight",
            "Type": "Hero",
            "Type Cap": "2",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "17",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 45,
            "Skills": []
        }
    ],
    "Henchmen": [
        {
            "Name": "Infantry",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 30,
            "Skills": []
        },
        {
            "Name": "Marksman",
            "Type Cap": "6",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 35,
            "Skills": []
        },
        {
            "Name": "Man-at-Arms",
            "Type Cap": "3",
            "Move": "6",
            "Piercing": "2",
            "Injury": "2",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 35,
            "Skills": [
            ]
        },
        {
            "Name": "Defender",
            "Type Cap": "3",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 35,
            "Skills": []
        }
    ],
    "Promotion Options": {
    },
    "Available Skills": {
        "Captain": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Champion": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Sniper": {
            "Mel": "",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Knight": {
            "Mel": "",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        },
        "Infantry": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Marksman": {
            "Mel": "",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Man-at-Arms": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Defender": {
            "Mel": "",
            "Rng": "",
            "Def": "X",
            "Agi": "",
            "Mrl": "X"
        }
    },
    "Equipment": {
        "Hero": {
			"Aliases": ["Captain", "Champion"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow", "Crossbow", "Pistol"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Infantry": {
            "Aliases": ["Infantry", "Man-at-Arms"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow", "Crossbow"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Marksman": {
            "Aliases": ["Marksman", "Sniper"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe"],
            "Ranged Weapons": ["Short Bow", "Bow", "Long Bow", "Crossbow", "Pistol", "Rifle", "Blunderbuss"],
            "Armour": ["Light Armour"]
        },
        "Defender": {
            "Aliases": ["Knight", "Defender"],
            "Melee Weapons": ["Dagger", "Hammer", "Spear", "Sword / Axe", "Shield", "Tower Shield"],
            "Ranged Weapons": [],
            "Armour": ["Light Armour", "Heavy Armour"]
        }
    }
}
`,On=`{
    "Name": "Undead",
    "Status": "Released",
    "Complexity": "★★☆",
    "Max Units": "18",
    "Rout Threshold": "7",
    "Play Style": "Slow and Skelly",
    "Preamble": "Let me off this wild ride Mr. Bones",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Necromancer",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 65,
            "Skills": [
                "Leader",
                "Necromantic Magic"
            ]
        },
        {
            "Name": "Blight Cultist",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 45,
            "Skills": [
                "Spread Blight (Major)"
            ]
        },
        {
            "Name": "Death Knight",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "14",
            "Defense": "16",
            "Wounds": "2",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 75,
            "Skills": [
                "Undead",
                "Fear"
            ]
        },
        {
            "Name": "Reaper",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "9",
            "Piercing": "3",
            "Injury": "3",
            "Melee": "10",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "2",
            "Morale": "13",
            "Cost":85,
            "Skills": [
                "Undead",
                "Fear",
				"Fixed Equipment (Scythe)"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Zombie",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "16",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 25,
            "Skills": [
                "Undead",
                "Fear",
                "No Equipment",
				"Spread Blight (Minor)"
            ]
        },
        {
            "Name": "Skeleton",
            "Type Cap": "-",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "15",
            "Ranged": "15",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "14",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 30,
            "Skills": [
                "Undead",
                "Fear"
            ]
        },
        {
            "Name": "Ghost",
            "Type Cap": "3",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "13",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "13",
            "Cost": 40,
            "Skills": [
                "Undead",
                "Fear",
                "No Equipment",
                "Ethereal"
            ]
        },
        {
            "Name": "Bone Giant",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "3",
            "Injury": "3",
            "Melee": "9",
            "Ranged": "-",
            "Defense": "13",
            "Wounds": "3",
            "Agility": "14",
            "Attacks": "2",
            "Morale": "13",
            "Cost": 200,
            "Skills": [
                "Undead",
                "Fear",
                "No Equipment",
				"Large"
            ]
        }
    ],
    "Available Skills": {
        "Necromancer": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": "X"
        },
        "Blight Cultist": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": "X"
        },
        "Death Knight": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "",
            "Mrl": ""
        },
        "Reaper": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Zombie": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Skeleton": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Ghost": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Undead": {
            "Aliases": ["Skeleton", "Death Knight"],
            "Melee Weapons": ["Dagger", "Spear", "Sword / Axe", "Hammer", "Pike", "Great Sword / Axe", "Great Hammer", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow"],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Cultist": {
            "Aliases": ["Necromancer", "Blight Cultist"],
            "Melee Weapons": ["Dagger", "Spear / Staff", "Sword"],
            "Ranged Weapons": ["Short Bow", "Bow"],
            "Armour": ["Light Armour"]
        }
    }
}
`,_n=`{
    "Name": "Undead Pirates",
    "Status": "Draft",
    "Complexity": "★☆☆",
    "Max Units": "15",
    "Rout Threshold": "6",
    "Play Style": "",
    "Preamble": "",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "",
            "Type": "Leader",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        },
        {
            "Name": "",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        },
        {
            "Name": "",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        },
        {
            "Name": "",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        },
        {
            "Name": "",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        },
        {
            "Name": "",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "0",
            "Ranged": "0",
            "Defense": "0",
            "Wounds": "1",
            "Agility": "0",
            "Attacks": "1",
            "Morale": "0",
            "Cost": 0,
            "Skills": [
            ]
        }
    ],
    "Available Skills": {
        "": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": "X"
        },
        "": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": "X"
        },
        "": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Heroes": {
            "Aliases": ["All"],
            "Melee Weapons": ["Dagger", "Hammer", "Sword / Axe", "Spear", "Great Hammer", "Great Sword / Axe", "Pike", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow", "Long Bow", "Crossbow", "Pistol", "Rifle", "Blunderbuss"],
            "Armour": ["Light Armour", "Heavy Armour"]
        }
    }
}`,Un=`{
    "Name": "Vampires",
    "Status": "Released",
    "Complexity": "★★★",
    "Max Units": "12",
    "Rout Threshold": "6",
    "Play Style": "Powerful leader with minions",
    "Preamble": "This team sucks... your blood!",
    "Special Rules": {
    },
    "Heroes": [
        {
            "Name": "Vampire Noble",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "2",
            "Agility": "7",
            "Attacks": "2",
            "Morale": "7",
            "Cost": 165,
            "Skills": [
                "Leader",
                "Undead",
				"Fear"
            ]
        },
        {
            "Name": "Vampire Seductor",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "2",
            "Agility": "10",
            "Attacks": "2",
            "Morale": "10",
            "Cost": 125,
            "Skills": [
				"Vampiric Magic",
                "Undead",
				"Fear"
            ]
        },
		{
            "Name": "Nosferatu",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "2",
            "Agility": "8",
            "Attacks": "2",
            "Morale": "10",
            "Cost": 125,
            "Skills": [
                "No Equipment",
                "Undead",
				"Fear"
            ]
        },
        {
            "Name": "Vampire Spawn",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "2",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 85,
            "Skills": [
                "Undead",
				"Fear"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Thrall",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "16",
            "Ranged": "16",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "10",
            "Cost": 20,
            "Skills": []
        },
        {
            "Name": "Ghoul",
            "Type Cap": "-",
            "Move": "6",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "2",
            "Morale": "16",
            "Cost": 60,
            "Skills": [
                "Undead",
				"Fear",
                "No Equipment"
            ]
        },
        {
            "Name": "Dire Wolf",
            "Type Cap": "3",
            "Move": "8",
            "Piercing": "0",
            "Injury": "2",
            "Melee": "10",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "10",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 35,
            "Skills": [
                "Ambush",
                "Animal"
            ]
        },
        {
            "Name": "Giant Bat",
            "Type Cap": "3",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "16",
            "Ranged": "-",
            "Defense": "-",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 15,
            "Skills": [
                "Flying",
                "Animal"
            ]
        }
    ],
    "Available Skills": {
        "Vampire Noble": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "X",
            "Mrl": "X"
        },
        "Vampire Seductor": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": "X"
        },
        "Vampire Spawn": {
            "Mel": "X",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Nosferatu": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "X",
            "Mrl": ""
        },
        "Thrall": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "",
            "Mrl": ""
        },
        "Ghoul": {
            "Mel": "X",
            "Rng": "",
            "Def": "X",
            "Agi": "X",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Vampires": {
            "Aliases": ["Vampire Noble", "Vampire Seductor", "Vampire Spawn"],
            "Melee Weapons": ["Dagger", "Sword", "Great Sword"],
            "Ranged Weapons": [],
            "Armour": ["Light Armour", "Heavy Armour"]
        },
        "Thralls": {
            "Aliases": ["Thrall"],
            "Melee Weapons": ["Dagger", "Hammer / Club", "Sword", "Spear", "Great Hammer / Club", "Great Sword", "Pike", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow", "Crossbow"],
            "Armour": ["Light Armour", "Heavy Armour"]
        }
    }
}
`,Vn=`{
    "Name": "Wood Elves",
    "Status": "Released",
    "Complexity": "★★★",
    "Max Units": "12",
    "Rout Threshold": "6",
    "Play Style": "Agile and Fragile",
    "Preamble": "Elves, bleh!",
    "Special Rules": {
        "Elven Agility": "Elves can Jump Across to a maximum distance of 6\\", instead of the usual 3\\"."
    },
    "Heroes": [
        {
            "Name": "Commander",
            "Type": "Leader",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "12",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "5",
            "Cost": 95,
            "Skills": [
                "Leader"
            ]
        },
        {
            "Name": "Mage",
            "Type": "Hero",
            "Type Cap": "1",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 70,
            "Skills": [
                "Life Magic"
            ]
        },
        {
            "Name": "Honour Guard",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "12",
            "Ranged": "13",
            "Defense": "16",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 80,
            "Skills": [
            ]
        },
        {
            "Name": "Ranger",
            "Type": "Hero",
            "Type Cap": "-",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "12",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 75,
            "Skills": [
			"Vanguard"
            ]
        }
    ],
    "Henchmen": [
        {
            "Name": "Citizen",
            "Type Cap": "-",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 45,
            "Skills": []
        },
        {
            "Name": "Scout",
            "Type Cap": "2",
            "Move": "7",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "13",
            "Ranged": "13",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "6",
            "Attacks": "1",
            "Morale": "7",
            "Cost": 60,
            "Skills": [
				"Mark Target"
			]
        },
        {
            "Name": "Woodland Creature",
            "Type Cap": "3",
            "Move": "8",
            "Piercing": "0",
            "Injury": "0",
            "Melee": "14",
            "Ranged": "-",
            "Defense": "18",
            "Wounds": "1",
            "Agility": "8",
            "Attacks": "1",
            "Morale": "16",
            "Cost": 15,
            "Skills": [
                "Follower",
                "Animal"
            ]
        },
        {
            "Name": "Treant",
            "Type Cap": "1",
            "Move": "6",
            "Piercing": "4",
            "Injury": "4",
            "Melee": "12",
            "Ranged": "-",
            "Defense": "9",
            "Wounds": "3",
            "Agility": "16",
            "Attacks": "2",
            "Morale": "7",
            "Cost": 175,
            "Skills": [
                "Fear",
                "Slow",
				"Large",
				"No Equipment"
            ]
        }
    ],
    "Available Skills": {
        "Commander": {
            "Mel": "X",
            "Rng": "X",
            "Def": "X",
            "Agi": "X",
            "Mrl": "X"
        },
        "Mage": {
            "Mel": "",
            "Rng": "",
            "Def": "",
            "Agi": "X",
            "Mrl": "X"
        },
        "Honour Guard": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Ranger": {
            "Mel": "",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Citizen": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        },
        "Scout": {
            "Mel": "X",
            "Rng": "X",
            "Def": "",
            "Agi": "X",
            "Mrl": ""
        }
    },
    "Equipment": {
        "Wood Elf": {
            "Aliases": ["All"],
            "Melee Weapons": ["Dagger", "Spear / Staff", "Sword", "Glaive", "Shield"],
            "Ranged Weapons": ["Short Bow", "Bow", "Long Bow", "Elvish Bow"],
            "Armour": ["Light Armour"]
        }
    }
}
`;var Jn=/[\u1680\u2000-\u200A\u202F\u205F\u3000]/,zn=/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/,Kn=/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/,rn={Space_Separator:Jn,ID_Start:zn,ID_Continue:Kn},b={isSpaceSeparator(n){return typeof n=="string"&&rn.Space_Separator.test(n)},isIdStartChar(n){return typeof n=="string"&&(n>="a"&&n<="z"||n>="A"&&n<="Z"||n==="$"||n==="_"||rn.ID_Start.test(n))},isIdContinueChar(n){return typeof n=="string"&&(n>="a"&&n<="z"||n>="A"&&n<="Z"||n>="0"&&n<="9"||n==="$"||n==="_"||n==="‌"||n==="‍"||rn.ID_Continue.test(n))},isDigit(n){return typeof n=="string"&&/[0-9]/.test(n)},isHexDigit(n){return typeof n=="string"&&/[0-9A-Fa-f]/.test(n)}};let on,T,x,en,G,I,R,cn,z;var Zn=function(e,r){on=String(e),T="start",x=[],en=0,G=1,I=0,R=void 0,cn=void 0,z=void 0;do R=Yn(),ee[T]();while(R.type!=="eof");return typeof r=="function"?ln({"":z},"",r):z};function ln(n,e,r){const a=n[e];if(a!=null&&typeof a=="object")if(Array.isArray(a))for(let t=0;t<a.length;t++){const i=String(t),l=ln(a,i,r);l===void 0?delete a[i]:Object.defineProperty(a,i,{value:l,writable:!0,enumerable:!0,configurable:!0})}else for(const t in a){const i=ln(a,t,r);i===void 0?delete a[t]:Object.defineProperty(a,t,{value:i,writable:!0,enumerable:!0,configurable:!0})}return r.call(n,e,a)}let g,D,J,$,m;function Yn(){for(g="default",D="",J=!1,$=1;;){m=X();const n=Mn[g]();if(n)return n}}function X(){if(on[en])return String.fromCodePoint(on.codePointAt(en))}function u(){const n=X();return n===`
`?(G++,I=0):n?I+=n.length:I++,n&&(en+=n.length),n}const Mn={default(){switch(m){case"	":case"\v":case"\f":case" ":case" ":case"\uFEFF":case`
`:case"\r":case"\u2028":case"\u2029":u();return;case"/":u(),g="comment";return;case void 0:return u(),v("eof")}if(b.isSpaceSeparator(m)){u();return}return Mn[T]()},comment(){switch(m){case"*":u(),g="multiLineComment";return;case"/":u(),g="singleLineComment";return}throw B(u())},multiLineComment(){switch(m){case"*":u(),g="multiLineCommentAsterisk";return;case void 0:throw B(u())}u()},multiLineCommentAsterisk(){switch(m){case"*":u();return;case"/":u(),g="default";return;case void 0:throw B(u())}u(),g="multiLineComment"},singleLineComment(){switch(m){case`
`:case"\r":case"\u2028":case"\u2029":u(),g="default";return;case void 0:return u(),v("eof")}u()},value(){switch(m){case"{":case"[":return v("punctuator",u());case"n":return u(),L("ull"),v("null",null);case"t":return u(),L("rue"),v("boolean",!0);case"f":return u(),L("alse"),v("boolean",!1);case"-":case"+":u()==="-"&&($=-1),g="sign";return;case".":D=u(),g="decimalPointLeading";return;case"0":D=u(),g="zero";return;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":D=u(),g="decimalInteger";return;case"I":return u(),L("nfinity"),v("numeric",1/0);case"N":return u(),L("aN"),v("numeric",NaN);case'"':case"'":J=u()==='"',D="",g="string";return}throw B(u())},identifierNameStartEscape(){if(m!=="u")throw B(u());u();const n=Dn();switch(n){case"$":case"_":break;default:if(!b.isIdStartChar(n))throw mn();break}D+=n,g="identifierName"},identifierName(){switch(m){case"$":case"_":case"‌":case"‍":D+=u();return;case"\\":u(),g="identifierNameEscape";return}if(b.isIdContinueChar(m)){D+=u();return}return v("identifier",D)},identifierNameEscape(){if(m!=="u")throw B(u());u();const n=Dn();switch(n){case"$":case"_":case"‌":case"‍":break;default:if(!b.isIdContinueChar(n))throw mn();break}D+=n,g="identifierName"},sign(){switch(m){case".":D=u(),g="decimalPointLeading";return;case"0":D=u(),g="zero";return;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":D=u(),g="decimalInteger";return;case"I":return u(),L("nfinity"),v("numeric",$*(1/0));case"N":return u(),L("aN"),v("numeric",NaN)}throw B(u())},zero(){switch(m){case".":D+=u(),g="decimalPoint";return;case"e":case"E":D+=u(),g="decimalExponent";return;case"x":case"X":D+=u(),g="hexadecimal";return}return v("numeric",$*0)},decimalInteger(){switch(m){case".":D+=u(),g="decimalPoint";return;case"e":case"E":D+=u(),g="decimalExponent";return}if(b.isDigit(m)){D+=u();return}return v("numeric",$*Number(D))},decimalPointLeading(){if(b.isDigit(m)){D+=u(),g="decimalFraction";return}throw B(u())},decimalPoint(){switch(m){case"e":case"E":D+=u(),g="decimalExponent";return}if(b.isDigit(m)){D+=u(),g="decimalFraction";return}return v("numeric",$*Number(D))},decimalFraction(){switch(m){case"e":case"E":D+=u(),g="decimalExponent";return}if(b.isDigit(m)){D+=u();return}return v("numeric",$*Number(D))},decimalExponent(){switch(m){case"+":case"-":D+=u(),g="decimalExponentSign";return}if(b.isDigit(m)){D+=u(),g="decimalExponentInteger";return}throw B(u())},decimalExponentSign(){if(b.isDigit(m)){D+=u(),g="decimalExponentInteger";return}throw B(u())},decimalExponentInteger(){if(b.isDigit(m)){D+=u();return}return v("numeric",$*Number(D))},hexadecimal(){if(b.isHexDigit(m)){D+=u(),g="hexadecimalInteger";return}throw B(u())},hexadecimalInteger(){if(b.isHexDigit(m)){D+=u();return}return v("numeric",$*Number(D))},string(){switch(m){case"\\":u(),D+=Qn();return;case'"':if(J)return u(),v("string",D);D+=u();return;case"'":if(!J)return u(),v("string",D);D+=u();return;case`
`:case"\r":throw B(u());case"\u2028":case"\u2029":ue(m);break;case void 0:throw B(u())}D+=u()},start(){switch(m){case"{":case"[":return v("punctuator",u())}g="value"},beforePropertyName(){switch(m){case"$":case"_":D=u(),g="identifierName";return;case"\\":u(),g="identifierNameStartEscape";return;case"}":return v("punctuator",u());case'"':case"'":J=u()==='"',g="string";return}if(b.isIdStartChar(m)){D+=u(),g="identifierName";return}throw B(u())},afterPropertyName(){if(m===":")return v("punctuator",u());throw B(u())},beforePropertyValue(){g="value"},afterPropertyValue(){switch(m){case",":case"}":return v("punctuator",u())}throw B(u())},beforeArrayValue(){if(m==="]")return v("punctuator",u());g="value"},afterArrayValue(){switch(m){case",":case"]":return v("punctuator",u())}throw B(u())},end(){throw B(u())}};function v(n,e){return{type:n,value:e,line:G,column:I}}function L(n){for(const e of n){if(X()!==e)throw B(u());u()}}function Qn(){switch(X()){case"b":return u(),"\b";case"f":return u(),"\f";case"n":return u(),`
`;case"r":return u(),"\r";case"t":return u(),"	";case"v":return u(),"\v";case"0":if(u(),b.isDigit(X()))throw B(u());return"\0";case"x":return u(),ne();case"u":return u(),Dn();case`
`:case"\u2028":case"\u2029":return u(),"";case"\r":return u(),X()===`
`&&u(),"";case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":throw B(u());case void 0:throw B(u())}return u()}function ne(){let n="",e=X();if(!b.isHexDigit(e)||(n+=u(),e=X(),!b.isHexDigit(e)))throw B(u());return n+=u(),String.fromCodePoint(parseInt(n,16))}function Dn(){let n="",e=4;for(;e-- >0;){const r=X();if(!b.isHexDigit(r))throw B(u());n+=u()}return String.fromCodePoint(parseInt(n,16))}const ee={start(){if(R.type==="eof")throw O();sn()},beforePropertyName(){switch(R.type){case"identifier":case"string":cn=R.value,T="afterPropertyName";return;case"punctuator":Q();return;case"eof":throw O()}},afterPropertyName(){if(R.type==="eof")throw O();T="beforePropertyValue"},beforePropertyValue(){if(R.type==="eof")throw O();sn()},beforeArrayValue(){if(R.type==="eof")throw O();if(R.type==="punctuator"&&R.value==="]"){Q();return}sn()},afterPropertyValue(){if(R.type==="eof")throw O();switch(R.value){case",":T="beforePropertyName";return;case"}":Q()}},afterArrayValue(){if(R.type==="eof")throw O();switch(R.value){case",":T="beforeArrayValue";return;case"]":Q()}},end(){}};function sn(){let n;switch(R.type){case"punctuator":switch(R.value){case"{":n={};break;case"[":n=[];break}break;case"null":case"boolean":case"numeric":case"string":n=R.value;break}if(z===void 0)z=n;else{const e=x[x.length-1];Array.isArray(e)?e.push(n):Object.defineProperty(e,cn,{value:n,writable:!0,enumerable:!0,configurable:!0})}if(n!==null&&typeof n=="object")x.push(n),Array.isArray(n)?T="beforeArrayValue":T="beforePropertyName";else{const e=x[x.length-1];e==null?T="end":Array.isArray(e)?T="afterArrayValue":T="afterPropertyValue"}}function Q(){x.pop();const n=x[x.length-1];n==null?T="end":Array.isArray(n)?T="afterArrayValue":T="afterPropertyValue"}function B(n){return un(n===void 0?`JSON5: invalid end of input at ${G}:${I}`:`JSON5: invalid character '${En(n)}' at ${G}:${I}`)}function O(){return un(`JSON5: invalid end of input at ${G}:${I}`)}function mn(){return I-=5,un(`JSON5: invalid identifier character at ${G}:${I}`)}function ue(n){console.warn(`JSON5: '${En(n)}' in strings is not valid ECMAScript; consider escaping`)}function En(n){const e={"'":"\\'",'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","	":"\\t","\v":"\\v","\0":"\\0","\u2028":"\\u2028","\u2029":"\\u2029"};if(e[n])return e[n];if(n<" "){const r=n.charCodeAt(0).toString(16);return"\\x"+("00"+r).substring(r.length)}return n}function un(n){const e=new SyntaxError(n);return e.lineNumber=G,e.columnNumber=I,e}var ae=function(e,r,a){const t=[];let i="",l,p,C="",f;if(r!=null&&typeof r=="object"&&!Array.isArray(r)&&(a=r.space,f=r.quote,r=r.replacer),typeof r=="function")p=r;else if(Array.isArray(r)){l=[];for(const o of r){let c;typeof o=="string"?c=o:(typeof o=="number"||o instanceof String||o instanceof Number)&&(c=String(o)),c!==void 0&&l.indexOf(c)<0&&l.push(c)}}return a instanceof Number?a=Number(a):a instanceof String&&(a=String(a)),typeof a=="number"?a>0&&(a=Math.min(10,Math.floor(a)),C="          ".substr(0,a)):typeof a=="string"&&(C=a.substr(0,10)),E("",{"":e});function E(o,c){let s=c[o];switch(s!=null&&(typeof s.toJSON5=="function"?s=s.toJSON5(o):typeof s.toJSON=="function"&&(s=s.toJSON(o))),p&&(s=p.call(c,o,s)),s instanceof Number?s=Number(s):s instanceof String?s=String(s):s instanceof Boolean&&(s=s.valueOf()),s){case null:return"null";case!0:return"true";case!1:return"false"}if(typeof s=="string")return A(s);if(typeof s=="number")return String(s);if(typeof s=="object")return Array.isArray(s)?V(s):k(s)}function A(o){const c={"'":.1,'"':.2},s={"'":"\\'",'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","	":"\\t","\v":"\\v","\0":"\\0","\u2028":"\\u2028","\u2029":"\\u2029"};let y="";for(let M=0;M<o.length;M++){const S=o[M];switch(S){case"'":case'"':c[S]++,y+=S;continue;case"\0":if(b.isDigit(o[M+1])){y+="\\x00";continue}}if(s[S]){y+=s[S];continue}if(S<" "){let W=S.charCodeAt(0).toString(16);y+="\\x"+("00"+W).substring(W.length);continue}y+=S}const h=f||Object.keys(c).reduce((M,S)=>c[M]<c[S]?M:S);return y=y.replace(new RegExp(h,"g"),s[h]),h+y+h}function k(o){if(t.indexOf(o)>=0)throw TypeError("Converting circular structure to JSON5");t.push(o);let c=i;i=i+C;let s=l||Object.keys(o),y=[];for(const M of s){const S=E(M,o);if(S!==void 0){let W=j(M)+":";C!==""&&(W+=" "),W+=S,y.push(W)}}let h;if(y.length===0)h="{}";else{let M;if(C==="")M=y.join(","),h="{"+M+"}";else{let S=`,
`+i;M=y.join(S),h=`{
`+i+M+`,
`+c+"}"}}return t.pop(),i=c,h}function j(o){if(o.length===0)return A(o);const c=String.fromCodePoint(o.codePointAt(0));if(!b.isIdStartChar(c))return A(o);for(let s=c.length;s<o.length;s++)if(!b.isIdContinueChar(String.fromCodePoint(o.codePointAt(s))))return A(o);return o}function V(o){if(t.indexOf(o)>=0)throw TypeError("Converting circular structure to JSON5");t.push(o);let c=i;i=i+C;let s=[];for(let h=0;h<o.length;h++){const M=E(String(h),o);s.push(M!==void 0?M:"null")}let y;if(s.length===0)y="[]";else if(C==="")y="["+s.join(",")+"]";else{let h=`,
`+i,M=s.join(h);y=`[
`+i+M+`,
`+c+"]"}return t.pop(),i=c,y}};const te={parse:Zn,stringify:ae};var re=te;const ie={Name:"Dagger",Effect:"",Cost:"2",Injury:"0",Piercing:"0",Melee:"0",Slots:"1"},se={Name:"Sword",Effect:"",Cost:"5",Injury:"0",Piercing:"3",Melee:"0",Slots:"1"},oe={Name:"Spear",Effect:"Cannot be dual-wielded, but may be used with a shield.",Cost:"5",Injury:"0",Piercing:"0",Melee:"2",Slots:"1"},le={Name:"Hammer",Effect:"",Cost:"5",Injury:"4",Piercing:"0",Melee:"0",Slots:"1"},De={Name:"Pike",Effect:"",Cost:"10",Injury:"3",Piercing:"0",Melee:"7",Slots:"2"},ce={Name:"Shield",Effect:"+4 Def. Cannot be used to attack. Cannot be equipped with a Ranged Weapon that is not 'Light' or without a Melee Weapon.",Cost:"5",Injury:"0",Piercing:"0",Melee:"0",Slots:"1"},de={Name:"Torch",DRAFT:"TRUE",Effect:"This unit has Advantage on Out-Of-Sight Rolls when attempting to Engage.",Cost:"10",Injury:"0",Piercing:"0",Melee:"0",Slots:"1"},fn={Dagger:ie,Sword:se,Spear:oe,Hammer:le,Pike:De,"Great Sword":{Name:"Great Sword",Effect:"",Cost:"10",Injury:"3",Piercing:"3",Melee:"5",Slots:"2"},"Great Hammer":{Name:"Great Hammer",Effect:"",Cost:"10",Injury:"7",Piercing:"0",Melee:"5",Slots:"2"},Shield:ce,"Tower Shield":{Name:"Tower Shield",Effect:"+6 Def. Cannot be used to attack. Cannot be equipped with a Ranged Weapon that is not 'Light' or without a Melee Weapon.",Cost:"15",Injury:"0",Piercing:"0",Melee:"0",Slots:"1"},"Divine Hammer":{Name:"Divine Hammer",Effect:"Advantage against Undead. Only heroes can dual-wield.",Cost:"15",Injury:"4",Piercing:"3",Melee:"0",Slots:"1"},"Divine Great Hammer":{Name:"Divine Great Hammer",Effect:"Advantage against Undead. Only heroes can wield.",Cost:"30",Injury:"7",Piercing:"3",Melee:"5",Slots:"2"},"Fighting Claws":{Name:"Fighting Claws",Effect:"+1 Attack. This unit makes Climb Checks with Advantage.",Cost:"20",Injury:"0",Piercing:"3",Melee:"0",Slots:"2"},Torch:de,"Poisoned Dagger":{Name:"Poisoned Dagger",DRAFT:"TRUE",Effect:"Enemies roll defence with disadvantage.",Cost:"10",Injury:"0",Piercing:"0",Melee:"0",Slots:"1"},"Ball and Chain":{Name:"Ball and Chain",DRAFT:"TRUE",Effect:"TBD: Decide which direction this unit should move when moving or engaging. Roll 1d20 to determine how far this unit should move: 1-5 move 6, 6-10 move 8, 11-15 move 10, 16-20 move 12. This unit may only move in straight lines.",Cost:"25",Injury:"4",Piercing:"3",Melee:"0",Slots:"2"}},ge={Name:"Crossbow",Range:'30"',Effect:"Long Reload",Cost:"20",Slots:"1",Injury:"2",Piercing:"0"},Ae={Name:"Pistol",Range:'10"',Effect:"Long Reload, Close Quarters, Dual-Wield, Blackpowder, Light",Cost:"15",Slots:"1",Injury:"2",Piercing:"3"},pe={Name:"Bow",Range:'25"',Effect:"",Cost:"10",Slots:"1",Injury:"0",Piercing:"0"},Ce={Name:"Rifle",Range:'30"',Effect:"Long Reload, Blackpowder",Cost:"25",Slots:"1",Injury:"2",Piercing:"3"},me={Name:"Blunderbuss",Range:'5"',Effect:"Long Reload, Buckshot, Blackpowder",Cost:"30",Slots:"1",Injury:"-2",Piercing:"0"},fe={Name:"Sling",Range:'15"',Effect:"Light",Cost:"5",Slots:"1",Injury:"0",Piercing:"0"},Fe={Name:"Blowpipe",Range:'15"',Effect:"Precise",Cost:"10",Slots:"1",Injury:"-3",Piercing:"0"},ye={Name:"Mortar",DRAFT:"TRUE",Range:'20"',Effect:"Long Reload, Buckshot, Blackpowder, Scatter",Cost:"0",Slots:"1",Injury:"0",Piercing:"0"},Fn={Crossbow:ge,"Hand Crossbow":{Name:"Hand Crossbow",Range:'10"',Effect:"Long Reload, Close Quarters, Dual-Wield, Light",Cost:"15",Slots:"1",Injury:"2",Piercing:"0"},Pistol:Ae,Bow:pe,"Long Bow":{Name:"Long Bow",Range:'30"',Effect:"",Cost:"15",Slots:"1",Injury:"0",Piercing:"0"},Rifle:Ce,Blunderbuss:me,Sling:fe,"Short Bow":{Name:"Short Bow",Range:'20"',Effect:"Light",Cost:"5",Slots:"1",Injury:"0",Piercing:"0"},"Throwing Stars":{Name:"Throwing Stars",Range:'10"',Effect:"Light, Close Quarters",Cost:"10",Slots:"1",Injury:"0",Piercing:"0"},"Elvish Bow":{Name:"Elvish Bow",Range:'35"',Effect:"",Cost:"20",Slots:"1",Injury:"0",Piercing:"0"},Blowpipe:Fe,Mortar:ye},yn={"Light Armour":{Name:"Light Armour",Defense:"1",Cost:"10"},"Heavy Armour":{Name:"Heavy Armour",Defense:"2",Cost:"20"},"Mithril Armour":{Name:"Mithril Armour",Defense:"3",Cost:"40"}},Me={"Mithril Armour (If warband has Armourer)":"Mithril Armour"},Ee={"Melee Weapons":{"Axe (Sword)":"Sword","Great Axe (Great Sword)":"Great Sword","Club (Hammer)":"Hammer","Hammer / Club":"Hammer","Great Club (Great Hammer)":"Great Hammer","Mace (Hammer)":"Hammer","Great Mace (Great Hammer)":"Great Hammer","Pitchfork (Pike)":"Pike","Scythe (Great Sword)":"Great Sword",Glaive:"Great Sword",Flail:"Great Hammer","Flail / Great Hammer":"Great Hammer","Spear / Staff":"Spear","Great Sword / Axe":"Great Sword","Sword / Axe":"Sword","Great Hammer / Club":"Great Hammer"},"Ranged Weapons":{},Armour:Me},he=Object.assign({"../../static/jsondata/warbands/Cultists.json":Wn,"../../static/jsondata/warbands/Dwarves.json":In,"../../static/jsondata/warbands/Goblins.json":Nn,"../../static/jsondata/warbands/Inquisitors.json":Hn,"../../static/jsondata/warbands/Merchants.json":jn,"../../static/jsondata/warbands/Ogres.json":$n,"../../static/jsondata/warbands/Orcs.json":xn,"../../static/jsondata/warbands/OrcsAndGoblins.json":Xn,"../../static/jsondata/warbands/Paladins.json":qn,"../../static/jsondata/warbands/Ratlings.json":Gn,"../../static/jsondata/warbands/Sellswords.json":Ln,"../../static/jsondata/warbands/Undead.json":On,"../../static/jsondata/warbands/UndeadPirates.json":_n,"../../static/jsondata/warbands/Vampires.json":Un,"../../static/jsondata/warbands/Wood Elves.json":Vn}),H={};for(const n of Object.values(he))try{const e=re.parse(n);e!=null&&e.Name&&(H[e.Name]=e)}catch(e){console.warn("Failed to parse warband file:",e)}const Z=500,hn="blightmeer-builder-v1";function dn(n,e){return(Ee[e]||{})[n]||n}function gn(n){const e=dn(n,"Melee Weapons");return fn[e]||fn[n]||null}function Sn(n){const e=dn(n,"Ranged Weapons");return Fn[e]||Fn[n]||null}function vn(n){const e=dn(n,"Armour");return yn[e]||yn[n]||null}function N(n,e){let r=null;return e==="melee"?r=gn(n):e==="ranged"?r=Sn(n):e==="armour"&&(r=vn(n)),r&&parseInt(r.Cost)||0}function an(n){const e=gn(n);return e&&parseInt(e.Slots)||1}function U(n,e,r){return(r==="hero"?n.Heroes||[]:n.Henchmen||[]).find(t=>t.Name===e)||null}function Se(n,e){const r=n.Equipment||{};for(const a of Object.values(r))if(Array.isArray(a.Aliases)&&a.Aliases.includes(e))return{melee:a["Melee Weapons"]||[],ranged:a["Ranged Weapons"]||[],armour:a.Armour||[]};return{melee:[],ranged:[],armour:[]}}function Bn(n){return(n.Skills||[]).some(e=>e.includes("Magic"))}function bn(n){return(n.Skills||[]).includes("No Equipment")}function Rn(n){const e=n["Type Cap"];return!e||e==="-"?1/0:parseInt(e)||1/0}function nn(n,e,r){if(bn(n))return{meleeMax:0,rangedMax:0,armourMax:0};if(Bn(n))return{meleeMax:1,rangedMax:0,armourMax:0};if(e==="hero")return{meleeMax:2,rangedMax:1,armourMax:1};const a=(r.ranged||[]).length>0?1:0,t=An(r);return{meleeMax:2-a,rangedMax:t<=1?1:0,armourMax:1}}function An(n){return(n.melee||[]).reduce((e,r)=>e+an(r),0)}function pn(n,e){const r=U(e,n.typeName,n.category);if(!r)return 0;let a=parseInt(r.Cost)||0;for(const t of n.equipment.melee||[])a+=N(t,"melee");for(const t of n.equipment.ranged||[])a+=N(t,"ranged");return n.equipment.armour&&(a+=N(n.equipment.armour,"armour")),a}function tn(n){const e=H[n.type];return e?n.units.reduce((r,a)=>r+pn(a,e),0):0}function _(n){return Z-tn(n)}function ve(){try{const n=localStorage.getItem(hn);return n?JSON.parse(n):[]}catch{return[]}}function Cn(){localStorage.setItem(hn,JSON.stringify(d.savedWarbands))}function kn(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}const d={view:"home",savedWarbands:ve(),currentId:null,equipModalUnitId:null,selectedType:null,mobileTab:"hire"};function Y(){return d.savedWarbands.find(n=>n.id===d.currentId)||null}function q(n){const e=Y();e&&(n(e),Cn(),w())}function wn(n,e){const r={id:kn(),name:(e||"").trim()||`${n} Warband`,type:n,createdAt:Date.now(),units:[]};d.savedWarbands.push(r),d.currentId=r.id,d.view="builder",d.mobileTab="hire",Cn(),w()}function Tn(n,e){const r=H[n.type],a=parseInt(r==null?void 0:r["Max Units"])||15;if(n.units.length>=a)return{ok:!1,reason:"Full"};const t=Rn(e),i=n.units.filter(p=>p.typeName===e.Name).length;if(t!==1/0&&i>=t)return{ok:!1,reason:"At Cap"};const l=parseInt(e.Cost)||0;return _(n)<l?{ok:!1,reason:"Can't Afford"}:{ok:!0}}function Be(n,e){const r=Y();if(!r)return;const a=H[r.type],t=U(a,n,e);!t||!Tn(r,t).ok||q(l=>{l.units.push({id:kn(),typeName:n,category:e,equipment:{melee:[],ranged:[],armour:null}})})}function be(n){q(e=>{e.units=e.units.filter(r=>r.id!==n)})}function Re(n,e,r){const a=Y();if(!a)return;const t=a.units.find(C=>C.id===n);if(!t)return;const i=H[a.type],l=U(i,t.typeName,t.category);if(!l)return;const p=t.equipment;if(r==="armour"){if(nn(l,t.category,p).armourMax===0)return;if(p.armour===e)q(f=>{f.units.find(E=>E.id===n).equipment.armour=null});else{const f=N(e,"armour"),E=p.armour?N(p.armour,"armour"):0;if(_(a)<f-E)return;q(A=>{A.units.find(k=>k.id===n).equipment.armour=e})}}else if(r==="melee")if(p.melee.includes(e))q(f=>{const E=f.units.find(A=>A.id===n);E.equipment.melee=E.equipment.melee.filter(A=>A!==e)});else{const f=nn(l,t.category,p),E=An(p),A=an(e);if(E+A>f.meleeMax)return;const k=N(e,"melee");if(_(a)<k)return;q(j=>{j.units.find(V=>V.id===n).equipment.melee.push(e)})}else if(r==="ranged")if(p.ranged.includes(e))q(f=>{const E=f.units.find(A=>A.id===n);E.equipment.ranged=E.equipment.ranged.filter(A=>A!==e)});else{const f=nn(l,t.category,p);if(p.ranged.length>=f.rangedMax)return;const E=N(e,"ranged");if(_(a)<E)return;q(A=>{A.units.find(k=>k.id===n).equipment.ranged.push(e)})}}function ke(n){d.savedWarbands=d.savedWarbands.filter(e=>e.id!==n),Cn(),w()}function F(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(n){return n==="-"||n==null?"—":n}function K(){const n=Object.values(H).filter(i=>i.Status==="Released"),e=Object.values(H).filter(i=>i.Status!=="Released"),r=d.savedWarbands;function a(i){const l=i.Status!=="Released",p=Object.keys(i["Special Rules"]||{}).length;return`
      <button class="type-card" data-action="select-type" data-type="${F(i.Name)}">
        ${l?'<span class="draft-badge">Draft</span>':""}
        <div class="type-card-name">${F(i.Name)}</div>
        <div class="type-card-complexity">${i.Complexity||""}</div>
        <div class="type-card-style">${F(i["Play Style"]||"")}</div>
        <div class="type-card-meta">
          <span>${i["Max Units"]} units max</span>
          ${p>0?'<span class="special-tag">⚡ Special</span>':""}
        </div>
      </button>
    `}return`
    <div class="home-view">
      <header class="home-header">
        <div class="home-logo">⚔</div>
        <div>
          <h1 class="home-title">Warband Builder</h1>
          <p class="home-subtitle">Blightmeer Skirmish</p>
        </div>
      </header>

      ${r.length>0?`
    <section class="home-section">
      <h2 class="section-title">Your Warbands</h2>
      <div class="saved-list">
        ${r.map(i=>{const l=tn(i),p=Z-l;return`
            <div class="saved-card">
              <div class="saved-card-info">
                <div class="saved-card-name">${F(i.name)}</div>
                <div class="saved-card-sub">${F(i.type)} · ${i.units.length} units · ${p}g left</div>
              </div>
              <div class="saved-card-actions">
                <button class="btn btn-primary btn-sm" data-action="open-builder" data-id="${i.id}">Edit</button>
                <button class="btn btn-ghost btn-sm" data-action="open-view" data-id="${i.id}">View</button>
                <button class="btn btn-danger btn-sm" data-action="delete-warband" data-id="${i.id}">✕</button>
              </div>
            </div>
          `}).join("")}
      </div>
    </section>
  `:""}

      <section class="home-section">
        <h2 class="section-title">Choose a Warband</h2>
        <div class="type-grid">
          ${n.map(a).join("")}
        </div>
        ${e.length>0?`
          <details class="draft-details">
            <summary>Draft Warbands (${e.length})</summary>
            <div class="type-grid draft-grid">
              ${e.map(a).join("")}
            </div>
          </details>
        `:""}
      </section>
    </div>
  `}function we(){const n=d.selectedType,e=H[n];if(!e)return"";const r=e["Special Rules"]||{},a=Object.entries(r).map(([t,i])=>`
    <div class="special-rule-entry">
      <strong>${F(t)}:</strong> ${F(i)}
    </div>
  `).join("");return`
    <div class="modal-overlay" data-action="close-select-modal">
      <div class="modal">
        <div class="modal-header">
          <h2>${F(n)}</h2>
          <button class="modal-close" data-action="close-select-modal">✕</button>
        </div>
        <div class="modal-body">
          <div class="wb-details-grid">
            <div class="wb-detail"><span class="wb-detail-label">Complexity</span><span>${e.Complexity||"—"}</span></div>
            <div class="wb-detail"><span class="wb-detail-label">Play Style</span><span>${F(e["Play Style"]||"—")}</span></div>
            <div class="wb-detail"><span class="wb-detail-label">Max Units</span><span>${e["Max Units"]}</span></div>
            <div class="wb-detail"><span class="wb-detail-label">Rout At</span><span>${e["Rout Threshold"]} down</span></div>
          </div>
          ${a?`<div class="special-rules-block">${a}</div>`:""}
          <div class="name-section">
            <label class="name-label" for="wb-name-input">Name your warband</label>
            <input
              id="wb-name-input"
              class="name-input"
              type="text"
              placeholder="${F(n)} Warband"
              maxlength="50"
              autofocus
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-action="close-select-modal">Cancel</button>
          <button class="btn btn-primary" data-action="create-warband" data-type="${F(n)}">
            Start Building →
          </button>
        </div>
      </div>
    </div>
  `}function Te(){const n=Y();if(!n)return K();const e=H[n.type],r=tn(n),a=Z-r,t=parseInt(e==null?void 0:e["Max Units"])||15,i=n.units.length,l=a<0;return`
    <div class="builder-view">
      <header class="builder-header">
        <button class="btn btn-ghost btn-back" data-action="nav-home">← Back</button>
        <div class="builder-header-center">
          <div class="builder-wb-name">${F(n.name)}</div>
          <div class="builder-wb-type">${F(n.type)}</div>
        </div>
        <div class="builder-stats-row">
          <div class="stat-chip ${l?"stat-chip--danger":a<50?"stat-chip--warn":""}">
            <span class="stat-chip-label">Gold</span>
            <span class="stat-chip-value">${a}g</span>
          </div>
          <div class="stat-chip ${i>=t?"stat-chip--danger":""}">
            <span class="stat-chip-label">Units</span>
            <span class="stat-chip-value">${i}/${t}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" data-action="open-view" data-id="${n.id}">View ↗</button>
      </header>

      <nav class="mobile-tabs">
        <button class="tab-btn ${d.mobileTab==="hire"?"active":""}" data-action="set-tab" data-tab="hire">
          Hire Units
        </button>
        <button class="tab-btn ${d.mobileTab==="roster"?"active":""}" data-action="set-tab" data-tab="roster">
          Roster${i>0?` <span class="tab-count">${i}</span>`:""}
        </button>
      </nav>

      <div class="builder-panels">
        <aside class="panel hire-panel ${d.mobileTab==="hire"?"panel--active":""}">
          ${Pe(n,e)}
        </aside>
        <main class="panel roster-panel ${d.mobileTab==="roster"?"panel--active":""}">
          ${We(n,e)}
        </main>
      </div>
    </div>
    ${d.equipModalUnitId?Ne(n,e):""}
  `}function Pe(n,e){_(n);const r=parseInt(e["Max Units"])||15;n.units.length>=r;function a(t,i){var A;const l=n.units.filter(k=>k.typeName===t.Name).length,p=Rn(t),C=Tn(n,t),f=t.Type==="Leader",E=parseInt(t.Cost)||0;return`
      <div class="hire-card${C.ok?"":" hire-card--disabled"}">
        <div class="hire-card-top">
          <div class="hire-card-title">
            <span class="hire-card-name">${F(t.Name)}</span>
            ${f?'<span class="leader-tag">Leader</span>':""}
          </div>
          <div class="hire-card-count-cost">
            <span class="hire-card-cap">${p===1/0?`${l} hired`:`${l} / ${p}`}</span>
            <span class="hire-card-cost">${E===0?"Free":`${E}g`}</span>
          </div>
        </div>
        <div class="hire-card-stats">
          <span title="Move">Mov ${P(t.Move)}</span>
          <span title="Melee">Mel ${P(t.Melee)}</span>
          <span title="Ranged">Rng ${P(t.Ranged)}</span>
          <span title="Defense">Def ${P(t.Defense)}</span>
          <span title="Agility">Agi ${P(t.Agility)}</span>
          <span title="Attacks">Atk ${P(t.Attacks)}</span>
          <span title="Wounds">Wnd ${P(t.Wounds)}</span>
        </div>
        ${((A=t.Skills)==null?void 0:A.length)>0?`
          <div class="hire-card-skills">${t.Skills.map(k=>`<span class="skill-tag">${F(k)}</span>`).join("")}</div>
        `:""}
        <button
          class="btn ${C.ok?"btn-primary":"btn-ghost"} btn-sm hire-btn"
          data-action="add-unit"
          data-unit-name="${F(t.Name)}"
          data-unit-cat="${i}"
          ${C.ok?"":"disabled"}
        >${C.ok?"+ Hire":C.reason}</button>
      </div>
    `}return`
    <div class="hire-inner">
      <div class="hire-section">
        <h3 class="hire-section-title">Heroes</h3>
        ${(e.Heroes||[]).map(t=>a(t,"hero")).join("")}
      </div>
      <div class="hire-section">
        <h3 class="hire-section-title">Henchmen</h3>
        ${(e.Henchmen||[]).map(t=>a(t,"henchman")).join("")}
      </div>
    </div>
  `}function We(n,e){return n.units.length===0?`
      <div class="empty-roster">
        <div class="empty-icon">⚔</div>
        <p>No units hired yet.</p>
        <button class="btn btn-primary" data-action="set-tab" data-tab="hire">Hire Units</button>
      </div>
    `:`
    <div class="roster-list">
      ${n.units.map(r=>Ie(r,n,e)).join("")}
    </div>
  `}function Ie(n,e,r){const a=U(r,n.typeName,n.category);if(!a)return"";const t=pn(n,r),i=n.equipment,l=bn(a),p=(i.melee||[]).map(A=>({name:A,icon:"⚔",cat:"melee",cost:N(A,"melee"),slots:an(A)})),C=(i.ranged||[]).map(A=>({name:A,icon:"🏹",cat:"ranged",cost:N(A,"ranged")})),f=i.armour?[{name:i.armour,icon:"🔰",cat:"armour",cost:N(i.armour,"armour")}]:[],E=[...p,...C,...f];return`
    <div class="roster-unit">
      <div class="roster-unit-header">
        <div class="roster-unit-left">
          <span class="roster-unit-name">${F(n.typeName)}</span>
          <span class="roster-unit-cat roster-cat--${n.category}">${n.category}</span>
        </div>
        <div class="roster-unit-right">
          <span class="roster-unit-cost">${t}g</span>
          <button class="btn btn-danger btn-xs" data-action="remove-unit" data-unit-id="${n.id}" title="Remove unit">✕</button>
        </div>
      </div>
      ${E.length>0?`
        <ul class="equip-list">
          ${E.map(A=>`
            <li class="equip-list-item">
              <span class="equip-icon">${A.icon}</span>
              <span class="equip-name">${F(A.name)}</span>
              <span class="equip-cost">${A.cost}g</span>
            </li>
          `).join("")}
        </ul>
      `:""}
      ${l?'<div class="no-equip-tag">No Equipment</div>':`
        <button class="btn btn-ghost btn-sm equip-open-btn" data-action="open-equip" data-unit-id="${n.id}">
          ✚ Manage Equipment
        </button>
      `}
    </div>
  `}function Ne(n,e){const r=d.equipModalUnitId,a=n.units.find(o=>o.id===r);if(!a)return"";const t=U(e,a.typeName,a.category);if(!t)return"";const i=Se(e,a.typeName),l=a.equipment,p=nn(t,a.category,l),C=An(l),f=_(n);function E(){return Bn(t)?'<div class="slot-bar">Spellcaster: 1 melee slot, no ranged, no armour</div>':a.category==="hero"?`<div class="slot-bar">Melee ${[C>=1,C>=2].map(s=>`<span class="slot-pip ${s?"slot-pip--used":""}"></span>`).join("")} ${C}/2 slots · ${(l.ranged||[]).length>0?"🏹 1/1":"🏹 0/1"} ranged · ${l.armour?"🔰 armoured":"🔰 no armour"}</div>`:`<div class="slot-bar">Weapon slots: ${C+((l.ranged||[]).length>0?1:0)}/2 used · ${l.armour?"🔰 armoured":"🔰 no armour"}</div>`}function A(o){const c=gn(o),s=an(o),y=c&&parseInt(c.Cost)||0,h=l.melee.includes(o),M=h||C+s<=p.meleeMax,S=h||f>=y,W=!M||!S,Pn=M?S?"":"Can't afford":"No slots";return`
      <div class="equip-row ${h?"equip-row--on":""} ${W?"equip-row--off":""}"
        ${W?"":`data-action="toggle-equip" data-unit-id="${r}" data-item="${F(o)}" data-cat="melee"`}
        title="${Pn}"
      >
        <span class="equip-row-check">${h?"✓":""}</span>
        <div class="equip-row-info">
          <span class="equip-row-name">${F(o)}</span>
          ${c!=null&&c.Effect?`<span class="equip-row-effect">${F(c.Effect)}</span>`:""}
        </div>
        <div class="equip-row-meta">
          <span class="equip-row-slot">${s}-slot</span>
          <span class="equip-row-cost">${y===0?"Free":`${y}g`}</span>
        </div>
      </div>
    `}function k(o){const c=Sn(o),s=c&&parseInt(c.Cost)||0,y=(l.ranged||[]).includes(o),h=y||(l.ranged||[]).length<p.rangedMax,M=y||f>=s,S=!h||!M,W=h?M?"":"Can't afford":"No ranged slot";return`
      <div class="equip-row ${y?"equip-row--on":""} ${S?"equip-row--off":""}"
        ${S?"":`data-action="toggle-equip" data-unit-id="${r}" data-item="${F(o)}" data-cat="ranged"`}
        title="${W}"
      >
        <span class="equip-row-check">${y?"✓":""}</span>
        <div class="equip-row-info">
          <span class="equip-row-name">${F(o)}</span>
          <span class="equip-row-effect">${c?`${F(c.Effect||"")}${c.Range?` · Range ${c.Range}`:""}`:""}</span>
        </div>
        <div class="equip-row-meta">
          <span class="equip-row-cost">${s===0?"Free":`${s}g`}</span>
        </div>
      </div>
    `}function j(o){const c=vn(o),s=c&&parseInt(c.Cost)||0,y=l.armour===o,h=p.armourMax>0,M=y||f>=s,S=(!h||!M)&&!y,W=h?M?"":"Can't afford":"No armour slot";return`
      <div class="equip-row ${y?"equip-row--on":""} ${S?"equip-row--off":""}"
        ${S?"":`data-action="toggle-equip" data-unit-id="${r}" data-item="${F(o)}" data-cat="armour"`}
        title="${W}"
      >
        <span class="equip-row-check">${y?"✓":""}</span>
        <div class="equip-row-info">
          <span class="equip-row-name">${F(o)}</span>
          ${c?`<span class="equip-row-effect">+${c.Defense} Defense</span>`:""}
        </div>
        <div class="equip-row-meta">
          <span class="equip-row-cost">${s===0?"Free":`${s}g`}</span>
        </div>
      </div>
    `}const V=i.melee.length>0||i.ranged.length>0||i.armour.length>0;return`
    <div class="modal-overlay" data-action="close-equip">
      <div class="modal equip-modal">
        <div class="modal-header">
          <div>
            <h3>${F(a.typeName)} — Equipment</h3>
            ${E()}
          </div>
          <button class="modal-close" data-action="close-equip">✕</button>
        </div>
        <div class="modal-body equip-modal-body">
          ${V?"":'<p class="no-equip-msg">No equipment available for this unit.</p>'}

          ${i.melee.length>0?`
            <div class="equip-group">
              <div class="equip-group-title">⚔ Melee Weapons</div>
              ${i.melee.map(A).join("")}
            </div>
          `:""}

          ${i.ranged.length>0?`
            <div class="equip-group ${p.rangedMax===0?"equip-group--unavail":""}">
              <div class="equip-group-title">🏹 Ranged Weapons${p.rangedMax===0?" — no ranged slot":""}</div>
              ${p.rangedMax>0?i.ranged.map(k).join(""):""}
            </div>
          `:""}

          ${i.armour.length>0?`
            <div class="equip-group ${p.armourMax===0?"equip-group--unavail":""}">
              <div class="equip-group-title">🔰 Armour${p.armourMax===0?" — no armour slot":""}</div>
              ${p.armourMax>0?i.armour.map(j).join(""):""}
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" data-action="close-equip">Done</button>
        </div>
      </div>
    </div>
  `}function He(){const n=Y();if(!n)return K();const e=H[n.type],r=tn(n),a=Z-r,t=n.units.filter(C=>C.category==="hero"),i=n.units.filter(C=>C.category==="henchman");function l(C){const f=U(e,C.typeName,C.category),E=pn(C,e),A=C.equipment,k=[...(A.melee||[]).map(j=>`⚔ ${j}`),...(A.ranged||[]).map(j=>`🏹 ${j}`),...A.armour?[`🔰 ${A.armour}`]:[]];return`
      <tr>
        <td class="view-unit-cell">
          <div class="view-unit-name">${F(C.typeName)}</div>
          ${k.length?`<div class="view-unit-equip">${k.map(F).join("  ·  ")}</div>`:""}
        </td>
        ${f?`
          <td>${P(f.Move)}"</td>
          <td>${P(f.Melee)}</td>
          <td>${P(f.Ranged)}</td>
          <td>${P(f.Defense)}</td>
          <td>${P(f.Agility)}</td>
          <td>${P(f.Attacks)}</td>
          <td>${P(f.Wounds)}</td>
        `:'<td colspan="7">—</td>'}
        <td class="view-cost-cell">${E}g</td>
      </tr>
    `}const p=`
    <thead><tr>
      <th>Unit</th><th>Mov</th><th>Mel</th><th>Rng</th>
      <th>Def</th><th>Agi</th><th>Atk</th><th>Wnd</th><th>Cost</th>
    </tr></thead>
  `;return`
    <div class="view-warband">
      <header class="view-header">
        <button class="btn btn-ghost" data-action="nav-builder">← Edit</button>
        <div class="view-header-center">
          <h1 class="view-title">${F(n.name)}</h1>
          <div class="view-type">${F(n.type)}</div>
        </div>
        <button class="btn btn-ghost" onclick="window.print()">🖨 Print</button>
      </header>

      <div class="view-summary-bar">
        <div class="summary-item">
          <span class="summary-label">Units</span>
          <span class="summary-value">${n.units.length} / ${(e==null?void 0:e["Max Units"])||"?"}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Spent</span>
          <span class="summary-value">${r}g / ${Z}g</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Remaining</span>
          <span class="summary-value ${a<0?"text-danger":""}">${a}g</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Rout At</span>
          <span class="summary-value">${(e==null?void 0:e["Rout Threshold"])||"—"} down</span>
        </div>
      </div>

      ${t.length>0?`
        <section class="view-unit-section">
          <h2>Heroes</h2>
          <div class="table-wrap">
            <table class="unit-table">${p}<tbody>${t.map(l).join("")}</tbody></table>
          </div>
        </section>
      `:""}

      ${i.length>0?`
        <section class="view-unit-section">
          <h2>Henchmen</h2>
          <div class="table-wrap">
            <table class="unit-table">${p}<tbody>${i.map(l).join("")}</tbody></table>
          </div>
        </section>
      `:""}

      ${n.units.length===0?`
        <div class="view-empty">
          <p>No units in this warband.</p>
          <button class="btn btn-primary" data-action="nav-builder">Add Units</button>
        </div>
      `:""}

      ${e!=null&&e["Special Rules"]&&Object.keys(e["Special Rules"]).length>0?`
        <section class="view-special-rules">
          <h2>Special Rules</h2>
          ${Object.entries(e["Special Rules"]).map(([C,f])=>`
            <div class="view-special-rule"><strong>${F(C)}:</strong> ${F(f)}</div>
          `).join("")}
        </section>
      `:""}
    </div>
  `}function w(){const n=document.getElementById("app");if(n)switch(d.view){case"home":n.innerHTML=K();break;case"select-type":n.innerHTML=K()+we();break;case"builder":n.innerHTML=Te();break;case"view-warband":n.innerHTML=He();break;default:n.innerHTML=K()}}document.addEventListener("click",n=>{const e=n.target.closest("[data-action]");if(!e)return;switch(e.dataset.action){case"select-type":d.selectedType=e.dataset.type,d.view="select-type",w();break;case"close-select-modal":if(e.classList.contains("modal-overlay")&&n.target.closest(".modal"))break;d.view="home",d.selectedType=null,w();break;case"create-warband":{const a=document.getElementById("wb-name-input");wn(e.dataset.type,(a==null?void 0:a.value)||"");break}case"open-builder":d.currentId=e.dataset.id,d.view="builder",d.mobileTab="roster",d.equipModalUnitId=null,w(),window.scrollTo(0,0);break;case"open-view":e.dataset.id&&(d.currentId=e.dataset.id),d.view="view-warband",d.equipModalUnitId=null,w(),window.scrollTo(0,0);break;case"delete-warband":confirm("Delete this warband? This cannot be undone.")&&ke(e.dataset.id);break;case"nav-home":d.view="home",d.equipModalUnitId=null,w(),window.scrollTo(0,0);break;case"nav-builder":d.view="builder",d.equipModalUnitId=null,w(),window.scrollTo(0,0);break;case"add-unit":Be(e.dataset.unitName,e.dataset.unitCat);break;case"remove-unit":be(e.dataset.unitId);break;case"set-tab":d.mobileTab=e.dataset.tab,w();break;case"open-equip":d.equipModalUnitId=e.dataset.unitId,w();break;case"close-equip":if(e.classList.contains("modal-overlay")&&n.target.closest(".modal"))break;d.equipModalUnitId=null,w();break;case"toggle-equip":Re(e.dataset.unitId,e.dataset.item,e.dataset.cat);break}});document.addEventListener("keydown",n=>{if(n.key==="Escape"&&(d.equipModalUnitId?(d.equipModalUnitId=null,w()):d.view==="select-type"&&(d.view="home",w())),n.key==="Enter"&&d.view==="select-type"){const e=document.getElementById("wb-name-input");e&&document.activeElement===e&&wn(d.selectedType,e.value)}});w();
