import json5
from pathlib import Path
import helpers.warband_helper as warband_helper
import helpers.reference_helper as reference_helper


def generate_warbands():
    for path in Path('static/jsondata/warbands').rglob('*.json'):
        with (open(str(path)) as f):
            warband = json5.load(f)
            all_skills, spell_schools = warband_helper.get_all_skills_and_spells(warband)
            out_data = warband_helper.warband_header(warband)
            out_data += warband_helper.warband_special_rules(warband)
            out_data += warband_helper.heroes_table(warband)
            out_data += warband_helper.henchmen_table(warband)
            out_data += warband_helper.warband_promotion_options(warband)
            out_data += warband_helper.equipment_block(warband)
            out_data += warband_helper.skills_block(all_skills, warband)
            out_data += warband_helper.spells_block(spell_schools)
            out_data += warband_helper.warband_available_skills(warband)
            out_data += warband_helper.skills_block(all_skills, warband, warband_only=True)

            # print(out_data)
            f = open(f"docs/7. Warbands/{warband.get('Name')}.md", "w")
            f.write(out_data)
            f.close()


def generate_reference_pages():
    with (open("docs/8. Reference/1. Equipment List.md", "w") as f):
        out_data = reference_helper.generate_equipment_page()
        f.write(out_data)
        f.close()
    with (open("docs/8. Reference/2. Skill List.md", "w") as f):
        out_data = reference_helper.generate_skills_page()
        f.write(out_data)
        f.close()
    with (open("docs/8. Reference/3. Spell List.md", "w") as f):
        out_data = reference_helper.generate_spells_page()
        f.write(out_data)
        f.close()
    return

generate_warbands()
generate_reference_pages()