import json

from pathlib import Path

with (open("static/jsondata/henchmen-upgrade-paths.json") as f):
    global_henchmen_upgrade_paths = json.load(f)

with (open("static/jsondata/melee-weapons.json") as f):
    global_melee_weapons_data = json.load(f)

with (open("static/jsondata/ranged-weapons.json") as f):
    global_ranged_weapons_data = json.load(f)

with (open("static/jsondata/armour.json") as f):
    global_armour_data = json.load(f)

for path in Path('static/jsondata/warbands').rglob('*.json'):
    with (open(str(path)) as f):
        warband = json.load(f)
        out_data = "---\n"
        out_data += f"sidebar_label: {warband.get('Name')}\n"
        out_data += "---\n"
        out_data += f"# {warband.get('Name')}\n"
        out_data += f"{warband.get('Preamble')}\n\n"
        out_data += f"| Max Units | {warband.get('Max Units')} |\n"
        out_data += "| ---- | ---- |\n"
        out_data += f"| Play Style | {warband.get('Play Style')} |\n\n"

        out_data += "## Heroes\n"
        out_data += f"| Units | Type | Type Cap | Move | Melee | Ranged | Defense | Wounds | Agility | Attacks | Morale | Cost | Abilities | Skill Types |\n"
        out_data += f"| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n"
        for hero in warband.get("Heroes"):
            abilities = ", ".join(hero.get('Abilities'))
            skill_types = ", ".join(hero.get('Skill Types'))
            type_cap = hero.get('Type Cap')
            if not type_cap:
                type_cap = "None"
            out_data += f"| {hero.get('Name')} | {hero.get('Type')} | {type_cap}  | {hero.get('Move')} | {hero.get('Melee')} | {hero.get('Ranged')} | {hero.get('Defense')} | {hero.get('Wounds')} | {hero.get('Agility')} | {hero.get('Attacks')} | {hero.get('Morale')} | {hero.get('Cost')} | {abilities} | {skill_types} |\n"

        out_data += "\n## Henchmen\n"
        out_data += f"| Units | Type | Type Cap | Move | Melee | Ranged | Defense | Wounds | Agility | Attacks | Morale | Cost | Abilities |\n"
        out_data += f"| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n"
        for henchmen in warband.get("Henchmen"):
            abilities = ", ".join(hero.get('Abilities'))
            type_cap = hero.get('Type Cap')
            if not type_cap:
                type_cap = "None"
            out_data += f"| {henchmen.get('Name')} | {henchmen.get('Type')} | {type_cap}  | {henchmen.get('Move')} | {henchmen.get('Melee')} | {henchmen.get('Ranged')} | {henchmen.get('Defense')} | {henchmen.get('Wounds')} | {henchmen.get('Agility')} | {henchmen.get('Attacks')} | {henchmen.get('Morale')} | {henchmen.get('Cost')} | {abilities} |\n"

        out_data += "\n## Henchmen upgrades\n"
        out_data += "| Upgrade Trees: | 1       | 2       | 3       | 4   | 5       | 6       | 7       | 8   |\n"
        out_data += "| -------------- | ------- | ------- | ------- | --- | ------- | ------- | ------- | --- |\n"
        for henchmen_upgrade in warband.get("Henchmen Upgrades"):
            upgrade_data = warband.get("Henchmen Upgrades").get(henchmen_upgrade)
            out_data += f"| {henchmen_upgrade} {global_henchmen_upgrade_paths.get(upgrade_data)}\n"


        out_data += "\n## Equipment\n"
        for equipment in warband.get("Equipment"):
            equipment_data = warband.get("Equipment").get(equipment)

            out_data += f"\n### {equipment} Melee Weapons \n"
            aliases = ", ".join(equipment_data.get("Aliases"))
            out_data += f"{equipment} melee weapons are for the unit types: {aliases}\n\n"
            out_data += f"| Name | Effect | Cost | Slots |\n"
            out_data += f"| ---- | ------ | ---- | ----- |\n"
            for weapon_name in equipment_data.get("Melee Weapons"):
                weapon_data = global_melee_weapons_data.get(weapon_name)
                if not weapon_data:
                    print(f"ERR: {weapon_name}")
                out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"

            out_data += f"\n### {equipment} Ranged Weapons \n"
            aliases = ", ".join(equipment_data.get("Aliases"))
            out_data += f"{equipment} ranged weapons are for the unit types: {aliases}\n\n"
            out_data += f"| Name | Range | Effect | Cost | Slots |\n"
            out_data += f"| ---- | ----- | ------ | ---- | ----- |\n"
            for weapon_name in equipment_data.get("Ranged Weapons"):
                weapon_data = global_ranged_weapons_data.get(weapon_name)
                if not weapon_data:
                    print(f"ERR: {weapon_name}")
                out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Range')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"

            out_data += f"\n### {equipment} Armour \n"
            aliases = ", ".join(equipment_data.get("Aliases"))
            out_data += f"{equipment} armour is for the unit types: {aliases}\n\n"
            out_data += f"| Name | Effect | Cost |\n"
            out_data += f"| ---- | ------ | ---- |\n"
            for armour_name in equipment_data.get("Armour"):
                armour_data = global_armour_data.get(armour_name)
                if not armour_data:
                    print(f"ERR: {armour_name}")
                out_data += f"| {armour_data.get('Name')} | {armour_data.get('Effect')} | {armour_data.get('Cost')} |\n"


        print(out_data)
        f = open(f"docs/7. Warbands/{warband.get('Name')}.md", "w")
        f.write(out_data)
        f.close()
