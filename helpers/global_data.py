import json5

path="static/jsondata"

with (open(f"{path}/henchmen-upgrade-paths.json") as f):
    global_henchmen_upgrade_paths = json5.load(f)

with (open(f"{path}/melee-weapons.json") as f):
    global_melee_weapons_data = json5.load(f)

with (open(f"{path}/ranged-weapons.json") as f):
    global_ranged_weapons_data = json5.load(f)

with (open(f"{path}/armour.json") as f):
    global_armour_data = json5.load(f)

with (open(f"{path}/skills.json") as f):
    global_skills_data = json5.load(f)

with (open(f"{path}/spells.json") as f):
    global_spells_data = json5.load(f)

with (open(f"{path}/ranged-weapon-effects.json") as f):
    global_ranged_weapon_effects = json5.load(f)

with (open(f"{path}/aliases.json") as f):
    global_aliases = json5.load(f)
