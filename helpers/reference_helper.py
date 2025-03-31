from helpers.global_data import (global_henchmen_upgrade_paths, global_skills_data, global_melee_weapons_data,
                                 global_ranged_weapons_data, global_armour_data, global_spells_data)

def melee_weapons_block():
    out_data = f"\n## Melee Weapons \n"
    out_data += f"| Name | Effect | Cost | Slots |\n"
    out_data += f"| ---- | ------ | ---- | ----- |\n"
    for equipment in global_melee_weapons_data:
        for weapon_name in equipment_data.get("Melee Weapons"):
            weapon_data = global_melee_weapons_data.get(weapon_name)
            if not weapon_data:
                print(f"ERR: {weapon_name}")
            out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"


def equipment_block(warband):
    out_data = ""
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
    return out_data


def generate_equipment_page(global_melee_weapons_data, global_ranged_weapons_data, global_armour_data):
    out_data = "---\n"
    out_data += "sidebar_position: 1"
    out_data += "sidebar_label: Equipment\n"
    out_data += "---\n"
    out_data += "# Equipment List\n"

    return out_data
