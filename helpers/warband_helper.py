from helpers.global_data import (global_henchmen_upgrade_paths, global_skills_data, global_melee_weapons_data,
                                 global_ranged_weapons_data, global_armour_data, global_spells_data, global_aliases)
import sys


def get_skills_link(warband_name, skill_data):
    filter = ""
    if not skill_data:
        sys.stderr.write(f"Failed to find skills for: {warband_name}")
        sys.exit(1)
    for short_name in skill_data.keys():
        if skill_data.get(short_name).lower() == "x":
            if filter:
                filter += ","
            filter += short_to_long(short_name, warband_name)
    return f"[\[Link\]](docs/8.%20Reference/4.%20Skill%20Search.md?filter={filter})"


def clean_link(name):
    return name.lower().replace(" ", "-").replace("\"", "")


def short_to_long(name, warband_name):
    mapping = {
        "Mel": "Melee",
        "Rng": "Ranged",
        "Def": "Defense",
        "Agi": "Agility",
        "Mrl": "Morale",
        "Special": warband_name.replace(" ", "%20"),
    }
    return mapping.get(name)


def get_unit_skills(all_skills, units):
    for unit in units:
        for skill in unit.get("Skills"):
            if skill not in all_skills:
                all_skills.append(skill)
    return all_skills


def get_all_skills_and_spells(warband):
    all_skills = []
    for skill in global_skills_data:
        skill_data = global_skills_data.get(skill)
        if skill_data.get('Type') == warband.get('Name'):
            all_skills.append(skill)
    all_skills = get_unit_skills(all_skills, warband.get("Heroes"))
    all_skills = get_unit_skills(all_skills, warband.get("Henchmen"))
    spell_schools = []
    for skill in all_skills:
        skill_data = global_skills_data.get(skill)
        if not skill_data:
            sys.stderr.write(f"Failed to find skill: {skill}")
            sys.exit(1)
        if skill_data.get("Type") == "Spellcasting":
            spell_schools.append(skill)
    return all_skills, spell_schools


def warband_header(warband):
    out_data = "---\n"
    out_data += f"sidebar_label: {warband.get('Name')}\n"
    out_data += "---\n"
    out_data += f"# {warband.get('Name')}\n"
    out_data += f"{warband.get('Preamble')}\n\n"
    out_data += f"| Max Units | {warband.get('Max Units')} |\n"
    out_data += "| ---- | ---- |\n"
    out_data += f"| Play Style | {warband.get('Play Style')} |\n\n"
    return out_data


def warband_special_rules(warband):
    if not warband.get("Special Rules"):
        return ""
    out_data = "## Special Rules\n"
    for special_rule_name in warband.get("Special Rules"):
        special_rule_data = warband.get("Special Rules").get(special_rule_name)
        out_data += f"### {special_rule_name}\n"
        out_data += f"{special_rule_data}\n"
    return out_data


def heroes_table(warband):
    out_data = "## Heroes\n"
    out_data += f"| Units | Mov | Mel | Rng | Def | Agi | Mrl | Atk | Wound | Inj | Prc | Skills | Cost | Cap | Skill Ups |\n"
    out_data += f"| ----- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | ------ | ---- | --- | --------- |\n"
    for hero in warband.get("Heroes"):
        skills = []
        for skill in hero.get("Skills"):
            skills += [f"[{skill}](#{clean_link(skill)})"]
        skills_str = ", ".join(skills)
        type_cap = hero.get('Type Cap')
        if not type_cap:
            type_cap = "None"
        skill_link = get_skills_link(warband.get("Name"), warband.get("Available Skills").get(hero.get('Name')))
        out_data += f"| {hero.get('Name')} | {hero.get('Move')} | {hero.get('Melee')} | {hero.get('Ranged')} | {hero.get('Defense')} | {hero.get('Agility')}| {hero.get('Morale')} | {hero.get('Attacks')} | {hero.get('Wounds')} | {hero.get('Injury')} | {hero.get('Piercing')} | {skills_str} | {hero.get('Cost')} | {type_cap} | {skill_link} |\n"
    return out_data


def henchmen_table(warband):
    out_data = "\n## Henchmen\n"
    out_data += f"| Units | Mov | Mel | Rng | Def | Agi | Mrl | Atk | Wound | Inj | Prc | Skills | Cost |  Cap |\n"
    out_data += f"| ----- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | ------ | ---- | ---- |\n"
    for henchmen in warband.get("Henchmen"):
        skills = []
        for skill in henchmen.get("Skills"):
            skills += [f"[{skill}](#{clean_link(skill)})"]
        skills_str = ", ".join(skills)
        type_cap = henchmen.get('Type Cap')
        if not type_cap:
            type_cap = "None"
        out_data += f"| {henchmen.get('Name')} | {henchmen.get('Move')} | {henchmen.get('Melee')} | {henchmen.get('Ranged')} | {henchmen.get('Defense')} | {henchmen.get('Agility')}| {henchmen.get('Morale')} | {henchmen.get('Attacks')} | {henchmen.get('Wounds')} | {henchmen.get('Injury')} | {henchmen.get('Piercing')} | {skills_str} | {henchmen.get('Cost')} | {type_cap} |\n"
    return out_data


def warband_promotion_options(warband):
    out_data = "\n## Promotion Options\n"
    out_data += f"| Unit | Stat Ups | Gained Skills |\n"
    out_data += f"| ---- | ---- | ---- |\n"
    for unit in warband.get("Promotion Options"):
        promotion_data = warband.get("Promotion Options").get(unit)
        out_data += f"| {unit} | {promotion_data.get('Stat Ups')} | {promotion_data.get('Gained Skills')} |\n"
    return out_data


def equipment_block(warband):
    out_data = "\n## Equipment\n"
    for equipment in warband.get("Equipment"):
        equipment_data = warband.get("Equipment").get(equipment)

        out_data += f"\n### {equipment} Equipment \n"
        if equipment_data.get("Aliases"):
            aliases = ", ".join(equipment_data.get("Aliases"))
            out_data += f"{equipment} equipment for the unit types: {aliases}\n\n"
        else:
            out_data += f"{equipment_data.get('Description')}\n\n"
        if equipment_data.get("Melee Weapons"):
            out_data += f"| Melee Weapon | Inj | Prc | Mel | Effect | Cost | Slots |\n"
            out_data += f"| ------------ | --- | --- | --- | ------ | ---- | ----- |\n"
        for weapon_name in equipment_data.get("Melee Weapons"):
            weapon_data = global_melee_weapons_data.get(weapon_name)
            weapon_alias=""
            if not weapon_data:
                weapon_alias = global_aliases.get("Melee Weapons").get(weapon_name)
                if not weapon_alias:
                    sys.stderr.write(f"Can't find weapon: {weapon_name}")
                    sys.exit(1)
                weapon_data = global_melee_weapons_data.get(weapon_alias)
            if weapon_alias:
                out_data += f"| {weapon_name} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {weapon_data.get('Melee')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"
            else:
                out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {weapon_data.get('Melee')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"

        if equipment_data.get("Ranged Weapons"):
            out_data += "\n"
            out_data += f"| Ranged Weapon | Rng | Inj | Prc | Effect | Cost | Slots |\n"
            out_data += f"| ------------- | --- | --- | --- | ------ | ---- | ----- |\n"
        for weapon_name in equipment_data.get("Ranged Weapons"):
            weapon_data = global_ranged_weapons_data.get(weapon_name)
            weapon_alias = ""
            if not weapon_data:
                weapon_alias = global_aliases.get("Ranged Weapons").get(weapon_name)
                if not weapon_alias:
                    sys.stderr.write(f"Can't find weapon: {weapon_name}")
                    sys.exit(1)
                weapon_data = global_ranged_weapons_data.get(weapon_alias)
            if weapon_alias:
                out_data += f"| {weapon_name} | {weapon_data.get('Range')} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"
            else:
                out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Range')} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {weapon_data.get('Effect')} | {weapon_data.get('Cost')} | {weapon_data.get('Slots')} |\n"

        if equipment_data.get("Armour"):
            out_data += "\n"
            out_data += f"| Armour | Def | Cost |\n"
            out_data += f"| ------ | --- | ---- |\n"
        for armour_name in equipment_data.get("Armour"):
            armour_data = global_armour_data.get(armour_name)
            armour_alias = ""
            if not armour_data:
                armour_alias = global_aliases.get("Armour").get(armour_name)
                if not armour_alias:
                    sys.stderr.write(f"Can't find armour: {armour_name}")
                    sys.exit(1)
                armour_data = global_armour_data.get(armour_alias)
            if armour_alias:
                out_data += f"| {armour_name} | {armour_data.get('Defense')} | {armour_data.get('Cost')} |\n"
            else:
                out_data += f"| {armour_data.get('Name')} | {armour_data.get('Defense')} | {armour_data.get('Cost')} |\n"
    return out_data


def skills_block(all_skills, warband, warband_only=False):
    spell_schools = []
    if warband_only:
        out_data = f"\n## Warband Special Skills \n"
    else:
        out_data = f"\n## Skills \n"
    for skill_name in all_skills:
        skill_data = global_skills_data.get(skill_name)
        if not skill_data:
            sys.stderr.write(f"Can't find skill: {skill_name}")
            sys.exit(1)
        if skill_data.get("Type") == warband.get("Name") and not warband_only:
            continue  # We want to skip the warband only ones
        if skill_data.get("Type") != warband.get("Name") and warband_only:
            continue # We want only the warband ones
        if skill_data.get("Type") == "Spellcasting":
            spell_schools.append(skill_name)
        out_data += f"### {skill_data.get('Name')}\n"
        out_data += f"*{skill_data.get('Type')}*\n\n"
        out_data += skill_data.get("Description")
        out_data += "\n"
    return out_data


def spells_block(spell_schools):
    out_data = ""
    for spell_school in spell_schools:
        out_data += f"\n## {spell_school} \n\n"
        out_data += f"| Name | Check | Description |\n"
        out_data += f"| ---- | ------ | ---- |\n"
        for spell_name in global_spells_data:
            spell_data = global_spells_data.get(spell_name)
            if spell_school == spell_data.get("School"):
                out_data += f"| {spell_data.get('Name')} | {spell_data.get('Check')} | {spell_data.get('Description')} |\n"
        out_data += "\n"
    return out_data


def warband_available_skills(warband):
    out_data = "\n## Skill Table\n"
    out_data += f"| Units | Mel | Rng | Def | Agi | Mrl | Special | Skills |\n"
    out_data += f"| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n"
    for unit in warband.get("Available Skills"):
        skill_data = warband.get("Available Skills").get(unit)
        skills_link = get_skills_link(warband.get("Name"), skill_data)
        out_data += f"| {unit} | {skill_data.get('Mel')} | {skill_data.get('Rng')} | {skill_data.get('Def')} | {skill_data.get('Agi')} | {skill_data.get('Mrl')} | {skill_data.get('Special')} | {skills_link} |\n"
    return out_data