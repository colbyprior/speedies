import sys

from helpers.global_data import (global_neutral_heroes, global_skills_data, global_ranged_weapons_data, global_aliases,
                                 global_ranged_weapon_effects)


def generate_neutral_heroes():
    out_data = "---\n"
    out_data += f"sidebar_label: Neutral Heroes\n"
    out_data += "---\n"
    out_data += f"# Neutral Heroes\n"
    out_data += "\nNeutral Heroes are special characters that can be hired by any warband for a cost.\n\n"

    sorted_heroes = dict(sorted(global_neutral_heroes.items(), key=lambda x: x[0]))

    for hero_name, hero in sorted_heroes.items():
        out_data += f"## {hero_name}\n"
        out_data += f"*{hero['Type']}*"
        if hero.get('Species'):
            out_data += f" — _{hero['Species']}_"
        if hero.get('Position'):
            out_data += f" — _{hero['Position']}_"
        out_data += "\n\n"
        out_data += f"*Cost:* {hero['Neutral Support Cost']}g\n\n"
        out_data += f"{hero['About']}\n\n"
        out_data += f"| Mov | Mel | Rgd | Def | Agi | Mrl | Atk | Wnd | Prc | Inj | Skills |\n"
        out_data += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
        out_data += f"| {hero['Move']}| {hero['Melee']}| {hero['Ranged']} "
        out_data += f"| {hero['Defence']}| {hero['Agility']}| {hero['Morale']}| {hero['Attacks']} "
        out_data += f"| {hero['Wounds']}| {hero['Piercing']}| {hero['Injury']}| {hero['Skills']}\n\n"

        if hero.get('Melee Weapon'):
            a = " a"
            if hero.get('Melee Weapon')[-1] == "s":
                a = ""
            out_data += f"This unit is equipped with{a} {hero.get('Melee Weapon')}. This is already included in the stat table above.\n\n"

        if hero.get('Ranged Weapon'):
            ranged_weapon_name = hero.get('Ranged Weapon')
            out_data += f"| Ranged Weapon | Rng | Inj | Prc | Special Rules |\n"
            out_data += f"| ------------- | --- | --- | --- | ------ |\n"
            weapon_data = global_ranged_weapons_data.get(ranged_weapon_name)

            ranged_weapon_effects = []
            weapon_effects = weapon_data.get('Effect').split(", ")
            effects_str = ""
            if weapon_effects != [""]:
                effects = []
                for weapon_effect in weapon_effects:
                    weapon_effect = weapon_effect.strip()
                    effects += [f"{weapon_effect}"]
                    if weapon_effect not in ranged_weapon_effects:
                        ranged_weapon_effects += [weapon_effect]
                effects_str = ", ".join(effects)

            weapon_alias = ""
            if not weapon_data:
                weapon_alias = global_aliases.get("Ranged Weapons").get(ranged_weapon_name)
                if not weapon_alias:
                    sys.stderr.write(f"Can't find weapon: {ranged_weapon_name}")
                    sys.exit(1)
                weapon_data = global_ranged_weapons_data.get(weapon_alias)
            if weapon_alias:
                out_data += f"| {ranged_weapon_name} | {weapon_data.get('Range')} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {effects_str} |\n"
            else:
                out_data += f"| {weapon_data.get('Name')} | {weapon_data.get('Range')} | {weapon_data.get('Injury')} | {weapon_data.get('Piercing')} | {effects_str} |\n"

            for effect_name in ranged_weapon_effects:
                effect = global_ranged_weapon_effects[effect_name]
                out_data += f"##### {effect_name} \n"
                out_data += f"{effect}\n"

        for skill in hero['Skills'].split(", "):
            if skill == "":
                continue
            out_data += f"##### {skill}\n"
            out_data += global_skills_data[skill]["Description"]
            out_data += "\n"

        out_data += "\n"

    return out_data
