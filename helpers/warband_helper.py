from helpers.global_data import (global_henchmen_upgrade_paths, global_skills_data, global_melee_weapons_data,
                                 global_ranged_weapons_data, global_armour_data, global_spells_data)


def clean_link(name):
    return name.lower().replace(" ", "-").replace("\"", "")


def get_unit_skills(all_skills, units):
    for unit in units:
        for ability in unit.get("Abilities"):
            if ability not in all_skills:
                all_skills.append(ability)
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


def heroes_table(warband):
    out_data = "## Heroes\n"
    out_data += f"| Units | Type | Cap | Mov | Mel | Rng | Def | Wnd | Agi | Atk | Mrl | Cost | Abilities | Skill Types |\n"
    out_data += f"| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n"
    for hero in warband.get("Heroes"):
        abilities = []
        for ability in hero.get("Abilities"):
            abilities += [f"[{ability}](#{clean_link(ability)})"]
        abilities_str = ", ".join(abilities)
        skill_types = ", ".join(hero.get('Skill Types'))
        type_cap = hero.get('Type Cap')
        if not type_cap:
            type_cap = "None"
        out_data += f"| {hero.get('Name')} | {hero.get('Type')} | {type_cap}  | {hero.get('Move')} | {hero.get('Melee')} | {hero.get('Ranged')} | {hero.get('Defense')} | {hero.get('Wounds')} | {hero.get('Agility')} | {hero.get('Attacks')} | {hero.get('Morale')} | {hero.get('Cost')} | {abilities_str} | {skill_types} |\n"
    return out_data


def henchmen_table(warband):
    out_data = "\n## Henchmen\n"
    out_data += f"| Units | Cap | Mov | Mel | Rng | Def | Wnd | Agi | Atk | Mrl | Cost | Abilities |\n"
    out_data += f"| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n"
    for henchmen in warband.get("Henchmen"):
        abilities = []
        for ability in henchmen.get("Abilities"):
            abilities += [f"[{ability}](#{clean_link(ability)})"]
        abilities_str = ", ".join(abilities)
        type_cap = henchmen.get('Type Cap')
        if not type_cap:
            type_cap = "None"
        out_data += f"| {henchmen.get('Name')} | {type_cap}  | {henchmen.get('Move')} | {henchmen.get('Melee')} | {henchmen.get('Ranged')} | {henchmen.get('Defense')} | {henchmen.get('Wounds')} | {henchmen.get('Agility')} | {henchmen.get('Attacks')} | {henchmen.get('Morale')} | {henchmen.get('Cost')} | {abilities_str} |\n"
    return out_data


def equipment_block(warband):
    out_data = "\n## Equipment\n"
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


def skills_block(all_skills):
    spell_schools = []
    out_data = f"\n## Skills & Abilities \n"
    for ability in all_skills:
        skill_data = global_skills_data.get(ability)
        if not skill_data:
            print(f"ERR: {ability}")
        if skill_data.get("Type") == "Spellcasting":
            spell_schools.append(ability)
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
