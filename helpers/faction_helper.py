import sys

from helpers.global_data import (global_faction_agents, global_skills_data, global_ranged_weapons_data, global_aliases,
                                 global_ranged_weapon_effects)
from helpers.run_helper import minimalNumber
from helpers.warband_helper import clean_link


def generate_faction_agents():
    out_data = "---\n"
    out_data += f"sidebar_label: Faction Units\n"
    out_data += "---\n"
    out_data += f"# Faction Units\n"

    sorted_faction_agents = dict(sorted(global_faction_agents.items(), key=lambda x: (x[1]['Faction'], x[1]['Type'])))
    hardcoded_faction_order = ["Law", "Chaos", "Underworld", "Special"]
    for faction_name in hardcoded_faction_order:
        prev_type = ""
        prev_faction = ""
        for agent_name in sorted_faction_agents.keys():
            faction_agent = global_faction_agents[agent_name]
            if faction_name != faction_agent['Faction']:
                continue # Enforce this to go through hardcoded order

            if prev_faction != faction_agent['Faction']:
                # out_data += f"# {faction_agent['Faction']}\n"
                out_data += f"## {faction_agent['Faction']} Faction {faction_agent['Type']}s\n"
            elif prev_type != faction_agent['Type']:
                out_data += f"## {faction_agent['Faction']} Faction {faction_agent['Type']}\n"
            prev_type = faction_agent['Type']
            prev_faction = faction_agent['Faction']

            # out_data += f"### {agent_name} ({faction_agent['Faction']})\n"
            out_data += f"### {agent_name}\n"
            out_data += f"*{faction_agent['Type']}:*"
            if faction_agent.get('Species') :
                out_data += f" _{faction_agent['Species']}_"
            if faction_agent.get('Position'):
                out_data += f" _{faction_agent['Position']}_"
            out_data += "\n\n"
            out_data += f"*Cost:* {faction_agent['Faction Support Cost']}\n\n"
            out_data += f"{faction_agent['About']}\n\n"
            out_data += f"| Mov | Mel | Rgd | Def | Agi | Mrl | Atk | Wnd | Prc | Inj | Skills |\n"
            out_data += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
            out_data += f"| {faction_agent['Move']}| {faction_agent['Melee']}| {faction_agent['Ranged']} "
            out_data += f"| {faction_agent['Defense']}| {faction_agent['Agility']}| {faction_agent['Morale']}| {faction_agent['Attacks']} "
            out_data += f"| {faction_agent['Wounds']}| {faction_agent['Piercing']}| {faction_agent['Injury']}| {faction_agent['Skills']}\n\n"

            if faction_agent.get('Melee Weapon'):
                a=" a"
                if faction_agent.get('Melee Weapon')[-1] == "s":
                    a = ""
                out_data += f"This unit is equipped with{a} {faction_agent.get('Melee Weapon')}. This is already included in the stat table above.\n\n"

            if faction_agent.get('Ranged Weapon'):
                ranged_weapon_name = faction_agent.get('Ranged Weapon')
                out_data += f"| Ranged Weapon | Rng | Inj | Prc | Special Rules |\n"
                out_data += f"| ------------- | --- | --- | --- | ------ |\n"
                weapon_data = global_ranged_weapons_data.get(ranged_weapon_name)

                # Get all ranged weapon effects
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

            for skill in faction_agent['Skills'].split(", "):
                if skill == "":
                    continue
                out_data += f"##### {skill}\n"
                out_data += global_skills_data[skill]["Description"]
                out_data += "\n"

            if faction_agent.get('Event'):
                out_data += f"#### *Event Rules*\n"
                out_data += f"{faction_agent['Event']}\n"
    return out_data
