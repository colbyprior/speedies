from helpers.global_data import (global_henchmen_upgrade_paths, global_skills_data, global_melee_weapons_data,
                                 global_ranged_weapons_data, global_armour_data, global_spells_data,
                                 global_ranged_weapon_effects)
from helpers.warband_helper import clean_link


def melee_weapons_block():
    out_data = f"\n## Melee Weapons \n"
    out_data += f"| Name | Mel | Inj | Prc | Special Rules | Cost | Slots |\n"
    out_data += f"| ---- | ------ | -------- | ----- | ------ | ---- | ----- |\n"
    for weapon_key in global_melee_weapons_data:
        weapon_data = global_melee_weapons_data.get(weapon_key)
        out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Melee')} | {weapon_data.get('Injury')} |{weapon_data.get('Piercing')} |{weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"
    return out_data


def ranged_weapons_block():
    out_data = f"\n## Ranged Weapons \n"
    out_data += f"| Name | Rng | Inj | Prc | Special Rules | Cost | Slots |\n"
    out_data += f"| ---- | ----- | ------ | -------- | ------ | ---- | ----- |\n"
    for weapon_key in global_ranged_weapons_data:
        weapon_data = global_ranged_weapons_data.get(weapon_key)
        effects = []
        for weapon_effect in weapon_data.get('Effect').split(','):
            weapon_effect = weapon_effect.strip()
            effects += [f"[{weapon_effect}](#{clean_link(weapon_effect)})"]
        effects_str = ", ".join(effects)
        out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Range')} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {effects_str} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"
    out_data += f"\n### Ranged Weapon Effects \n"
    for effect_name in global_ranged_weapon_effects:
        effect = global_ranged_weapon_effects[effect_name]
        out_data += f"#### {effect_name} \n"
        out_data += f"{effect}\n"
    return out_data


def armour_block():
    out_data = f"\n## Armour \n"
    out_data += f"| Name | Def | Cost |\n"
    out_data += f"| ---- | --- | ---- |\n"
    for armour_key in global_armour_data:
        armour_data = global_armour_data.get(armour_key)
        out_data += f"| {armour_data.get('Name')} | {armour_data.get('Defense')} | {armour_data.get('Cost')} |\n"
    return out_data


def skills_block():
    out_data = ""
    skill_types_data = {
        "Inherent": [],
        "Melee": [],
        "Ranged": [],
        "Agility": [],
        "Defence": [],
        "Morale": [],
        "Spellcasting": []
    }
    for skill_name in global_skills_data:
        skill_data = global_skills_data[skill_name]
        if skill_data.get('Type') not in skill_types_data:
            skill_types_data[skill_data.get('Type')] = [skill_data]
        else:
            skill_types_data[skill_data.get('Type')].append(skill_data)
    for skill_type in skill_types_data:
        out_data += f"\n## {skill_type} \n"
        skill_types_data[skill_type].sort(key=lambda x: x['Name'])
        if skill_type == "Inherent":
            out_data += "*Inherent skills can never be chosen on level ups. Only certain characters start with these skills.*\n"
        for skill_data in skill_types_data[skill_type]:
            out_data += f"### {skill_data.get('Name')}\n"
            out_data += f"*{skill_data.get('Type')}*\n\n"
            out_data += skill_data.get("Description")
            out_data += "\n"
    return out_data


def spells_block():
    out_data = ""
    spell_schools_data = {}
    for spell_name in global_spells_data:
        spell_data = global_spells_data[spell_name]
        if spell_data.get('School') == "Cult Magic":
          continue
        if spell_data.get('School') not in spell_schools_data:
            spell_schools_data[spell_data.get('School')] = [spell_data]
        else:
            spell_schools_data[spell_data.get('School')].append(spell_data)
    for spell_school in spell_schools_data:
        out_data += f"\n## {spell_school} \n"
        out_data += f"| Name | Diff | Description |\n"
        out_data += f"| ---- | ---- | ----------- |\n"
        for spell_data in spell_schools_data[spell_school]:
            out_data += f"| {spell_data.get('Name')} | {spell_data.get('Check')} | {spell_data.get('Description')} |\n"
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

def generate_skills_page():
    out_data = "---\n"
    out_data += "sidebar_position: 1\n"
    out_data += "sidebar_label: Skills List\n"
    out_data += "---\n"
    out_data += "# Skills List\n"
    out_data += skills_block()
    return out_data

def generate_spells_page():
    out_data = "---\n"
    out_data += "sidebar_position: 1\n"
    out_data += "sidebar_label: Spell List\n"
    out_data += "---\n"
    out_data += "# Spell List\n"
    out_data += spells_block()
    return out_data
