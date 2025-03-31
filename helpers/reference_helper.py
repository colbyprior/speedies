from helpers.global_data import (global_henchmen_upgrade_paths, global_skills_data, global_melee_weapons_data,
                                 global_ranged_weapons_data, global_armour_data, global_spells_data,
                                 global_ranged_weapon_effects)
from helpers.warband_helper import clean_link


def melee_weapons_block():
    out_data = f"\n## Melee Weapons \n"
    out_data += f"| Name | Effect | Cost | Slots |\n"
    out_data += f"| ---- | ------ | ---- | ----- |\n"
    for weapon_key in global_melee_weapons_data:
        weapon_data = global_melee_weapons_data.get(weapon_key)
        out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"
    return out_data


def ranged_weapons_block():
    out_data = f"\n## Ranged Weapons \n"
    out_data += f"| Name | Range | Effect | Cost | Slots |\n"
    out_data += f"| ---- | ----- | ------ | ---- | ----- |\n"
    for weapon_key in global_ranged_weapons_data:
        weapon_data = global_ranged_weapons_data.get(weapon_key)
        effects = []
        for weapon_effect in weapon_data.get('Effect').split(','):
            weapon_effect = weapon_effect.strip()
            effects += [f"[{weapon_effect}](#{clean_link(weapon_effect)})"]
        effects_str = ", ".join(effects)
        out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Range')} | {effects_str} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"
    out_data += f"\n### Ranged Weapon Effects \n"
    for effect_name in global_ranged_weapon_effects:
        effect = global_ranged_weapon_effects[effect_name]
        out_data += f"#### {effect_name} \n"
        out_data += f"{effect}\n"
    return out_data


def armour_block():
    out_data = f"\n## Armour \n"
    out_data += f"| Name | Effect | Cost |\n"
    out_data += f"| ---- | ------ | ---- |\n"
    for armour_key in global_armour_data:
        armour_data = global_armour_data.get(armour_key)
        out_data += f"| {armour_data.get('Name')} | {armour_data.get('Effect')} | {armour_data.get('Cost')} |\n"
    return out_data


def generate_equipment_page():
    out_data = "---\n"
    out_data += "sidebar_position: 1\n"
    out_data += "sidebar_label: Equipment List\n"
    out_data += "---\n"
    out_data += "# Equipment List\n"
    out_data += melee_weapons_block()
    out_data += ranged_weapons_block()
    out_data += armour_block()
    return out_data
