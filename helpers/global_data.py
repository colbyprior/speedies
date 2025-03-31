import json

with (open("static/jsondata/henchmen-upgrade-paths.json") as f):
    global_henchmen_upgrade_paths = json.load(f)

with (open("static/jsondata/melee-weapons.json") as f):
    global_melee_weapons_data = json.load(f)

with (open("static/jsondata/ranged-weapons.json") as f):
    global_ranged_weapons_data = json.load(f)

with (open("static/jsondata/armour.json") as f):
    global_armour_data = json.load(f)

with (open("static/jsondata/skills.json") as f):
    global_skills_data = json.load(f)

with (open("static/jsondata/spells.json") as f):
    global_spells_data = json.load(f)
