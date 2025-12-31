from helpers.global_data import (global_faction_agents)

def minimalNumber(x):
    if type(x) is str:
        if x == '':
            x = 0
    f = float(x)
    if f.is_integer():
        return int(f)
    else:
        return f


def generate_faction_agents():
    out_data = "---\n"
    out_data += f"sidebar_label: Faction Agents\n"
    out_data += "---\n"
    out_data += f"# Faction Agents\n"

    for agent_name in global_faction_agents.keys():
        faction_agent = global_faction_agents[agent_name]
        out_data += f"### {agent_name} ({faction_agent['Faction']})\n"
        out_data += f"_{faction_agent['Species']} {faction_agent['Position']}_\n\n"
        out_data += f"{faction_agent['About']}\n\n"
        out_data += f"| Mov | Run | Mel | Rgd | Def | Agi | Mrl | Atk | Wnd | Prc | Inj | Cost | Skills |\n"
        out_data += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
        out_data += f"| {faction_agent['Move']} | {minimalNumber(float(faction_agent['Move'])*1.5)}| {faction_agent['Melee']}| {faction_agent['Ranged']} "
        out_data += f"| {faction_agent['Defense']}| {faction_agent['Agility']}| {faction_agent['Morale']}| {faction_agent['Attacks']} "
        out_data += f"| {faction_agent['Wounds']}| {faction_agent['Piercing']}| {faction_agent['Injury']}| {faction_agent['Faction Support Cost']}| {faction_agent['Skills']}\n\n"
        out_data += f"#### Event\n"
        out_data += f"{faction_agent['Event']}\n"
    return out_data
