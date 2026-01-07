from helpers.global_data import (global_faction_agents, global_skills_data)
from helpers.run_helper import minimalNumber


def generate_faction_agents():
    out_data = "---\n"
    out_data += f"sidebar_label: Faction Agents\n"
    out_data += "---\n"
    out_data += f"# Faction Agents\n"

    sorted_faction_agents = dict(sorted(global_faction_agents.items(), key=lambda x: (x[1]['Faction'], x[1]['Type'])))
    hardcoded_faction_order = ["Law", "Underworld", "Chaos", "Special"]
    for faction_name in hardcoded_faction_order:
        prev_type = ""
        prev_faction = ""
        for agent_name in sorted_faction_agents.keys():
            faction_agent = global_faction_agents[agent_name]
            if faction_name != faction_agent['Faction']:
                continue # Enforce this to go through hardcoded order

            if prev_faction != faction_agent['Faction']:
                out_data += f"# {faction_agent['Faction']}\n"
                out_data += f"## {faction_agent['Faction']} Faction {faction_agent['Type']}s\n"
            elif prev_type != faction_agent['Type']:
                out_data += f"## {faction_agent['Faction']} Faction {faction_agent['Type']}\n"
            prev_type = faction_agent['Type']
            prev_faction = faction_agent['Faction']

            out_data += f"### {agent_name} ({faction_agent['Faction']})\n"
            out_data += f"*{faction_agent['Type']}:* _{faction_agent['Species']} {faction_agent['Position']}_\n\n"
            out_data += f"{faction_agent['About']}\n\n"
            out_data += f"| Mov | Run | Mel | Rgd | Def | Agi | Mrl | Atk | Wnd | Prc | Inj | Cost | Skills |\n"
            out_data += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
            out_data += f"| {faction_agent['Move']} | {minimalNumber(float(faction_agent['Move'])*1.5)}| {faction_agent['Melee']}| {faction_agent['Ranged']} "
            out_data += f"| {faction_agent['Defense']}| {faction_agent['Agility']}| {faction_agent['Morale']}| {faction_agent['Attacks']} "
            out_data += f"| {faction_agent['Wounds']}| {faction_agent['Piercing']}| {faction_agent['Injury']}| {faction_agent['Faction Support Cost']}| {faction_agent['Skills']}\n\n"
            for skill in faction_agent['Skills'].split(", "):
                if skill == "":
                    continue
                out_data += f"##### {skill}\n"
                out_data += global_skills_data[skill]["Description"]
                out_data += "\n"

            out_data += f"#### Event\n"
            out_data += f"{faction_agent['Event']}\n"
    return out_data
