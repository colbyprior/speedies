import sys

from helpers.global_data import (global_neutral_heroes, global_skills_data, global_ranged_weapons_data, global_aliases,
                                 global_ranged_weapon_effects, global_artifacts_data)


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
        out_data += f"*Cost:* {hero['Cost']}g\n\n"
        if hero.get("Opposed"):
            out_data += f"*Opposed by:* [{hero['Opposed']}](#{hero['Opposed'].lower().replace(' ', '-')})\n\n"
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

        # Units this Hero puts on the board. They get their own card in the deck,
        # so they get their own stat block here.
        for minion in hero.get("Minions") or []:
            out_data += f"\n##### {minion['Name']}\n"
            if minion.get("About"):
                out_data += f"{minion['About']}\n\n"
            out_data += "| Mov | Mel | Rgd | Def | Agi | Mrl | Atk | Wnd | Prc | Inj | Skills |\n"
            out_data += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
            out_data += f"| {minion['Move']}| {minion['Melee']}| {minion['Ranged']} "
            out_data += f"| {minion['Defence']}| {minion['Agility']}| {minion['Morale']}| {minion['Attacks']} "
            out_data += f"| {minion['Wounds']}| {minion['Piercing']}| {minion['Injury']}| {minion['Skills']}\n"

        # A roll table is a lookup, not prose — it gets its own card, and its own
        # table here.
        if hero.get("Spells"):
            out_data += "\n##### Spells\n"
            out_data += "| Roll | Spell | Effect |\n"
            out_data += "| ---- | ----- | ------ |\n"
            for spell in hero["Spells"]:
                out_data += f"| {spell['Roll']} | {spell['Name']} | {spell['Description']} |\n"

        if hero.get("Cast Priority"):
            out_data += "\n##### Cast Priority\n"
            out_data += "When not under a player's control, the first condition met determines the spell Cast.\n\n"
            for i, step in enumerate(hero["Cast Priority"], start=1):
                out_data += f"{i}. {step}\n"

        # How the Hero arrives, how it behaves once it's there, and what the
        # warband has to do for it — the same three blocks printed on its card.
        for section in ("Event", "Behaviour", "Patronage"):
            points = hero.get(section) or []
            if not points:
                continue
            out_data += f"\n##### {section}\n"
            for point in points:
                # A point may be plain text, or text followed by ordered sub-steps
                if isinstance(point, str):
                    out_data += f"* {point}\n"
                    continue
                out_data += f"* {point['text']}\n"
                for i, step in enumerate(point.get("steps") or [], start=1):
                    out_data += f"    {i}. {step}\n"

        out_data += "\n"

    return out_data


def generate_artifacts():
    out_data = "---\n"
    out_data += f"sidebar_label: Artifacts\n"
    out_data += "---\n"
    out_data += f"# Artifacts\n"
    out_data += "\nArtifacts are powerful magical items that can be acquired during campaigns.\n\n"

    for artifact_name, artifact in sorted(global_artifacts_data.items()):
        out_data += f"## {artifact_name}\n"
        if artifact.get('Cursed'):
            out_data += "**Cursed: Cannot unequip**\n"
        out_data += "\n"

        # About text is optional flavour, left blank until written
        if artifact.get('About'):
            out_data += f"{artifact['About']}\n\n"

        if artifact.get('Description'):
            out_data += f"**Effect:** {artifact['Description']}\n\n"

        # Skills granted by the artifact
        if artifact.get('Skills'):
            for skill in artifact['Skills'].split(","):
                skill = skill.strip()
                if skill in global_skills_data:
                    out_data += f"##### {skill}\n"
                    out_data += global_skills_data[skill]["Description"]
                    out_data += "\n"

        out_data += "\n"

    return out_data
