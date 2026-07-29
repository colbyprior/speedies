import json
import sys

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Spacer, KeepInFrame, Table, TableStyle
from reportlab.platypus.frames import Frame
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfgen import canvas as pdfcanvas

from helpers.global_data import global_ranged_weapons_data, global_aliases, global_ranged_weapon_effects


def load_agents(json_file):
    """Load agent data from JSON file."""
    with open(json_file, 'r') as f:
        neutral_heroes = json.load(f)
    return dict(sorted(neutral_heroes.items(), key=lambda x: x[1]['Type']))


def load_skills(skills_file):
    """Load skills data from JSON file."""
    try:
        with open(skills_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: {skills_file} not found. Skills will not have descriptions.")
        return {}


def create_card_content(name, agent_data, skills_db, card_width=3.5 * inch, card_padding=0.1 * inch):
    """Create content for a single agent card."""
    styles = getSampleStyleSheet()

    # Scale fonts based on card width (baseline: 3.5" = full size)
    scale = min(1.0, card_width / (3.5 * inch))
    s = lambda base: max(5, int(base * scale))

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=s(16),
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=1,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=s(18)
    )

    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=s(10),
        textColor=colors.HexColor('#7f8c8d'),
        spaceAfter=2,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique',
        leading=s(12)
    )

    cost_style = ParagraphStyle(
        'CostStyle',
        parent=styles['Normal'],
        fontSize=s(11),
        textColor=colors.HexColor('#e74c3c'),
        spaceAfter=2,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=s(13)
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=s(9),
        spaceAfter=2,
        alignment=TA_LEFT,
        leading=s(11)
    )

    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=s(10),
        textColor=colors.HexColor('#34495e'),
        spaceAfter=1,
        spaceBefore=1,
        fontName='Helvetica-Bold',
        leading=s(12)
    )

    card_data = []

    # Title section
    title = Paragraph(f"<b>{name}</b>", title_style)
    subtitle_text = f"<b>{agent_data['Type']}"
    if agent_data.get("Species") and agent_data.get("Position"):
        subtitle_text += f":</b> <i>{agent_data['Species']} {agent_data['Position']}</i>"
    elif agent_data.get("Species"):
        subtitle_text += f":</b> <i>{agent_data['Species']}</i>"
    else:
        subtitle_text += f":</b> <i>{agent_data['Position']}</i>"
    subtitle = Paragraph(subtitle_text, subtitle_style)
    card_data.append(title)
    card_data.append(subtitle)

    # Neutral Support Cost
    cost = Paragraph(f"<b>Cost: {agent_data['Neutral Support Cost']}</b>", cost_style)
    card_data.append(cost)
    card_data.append(Spacer(1, 0.03 * inch))

    # About section
    if agent_data.get('About'):
        about = Paragraph(agent_data['About'], body_style)
        card_data.append(about)

    # Compact single-row Blight / Deathtouched strip
    usable_width = card_width - 2 * card_padding
    checkbox_col = 0.65 * inch
    checkbox_table = Table(
        [['[ ] Blight', '[ ] Deathtouched']],
        colWidths=[checkbox_col, checkbox_col]
    )
    checkbox_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), s(7)),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.grey),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))

    card_data.append(Spacer(1, 0.02 * inch))
    card_data.append(checkbox_table)
    card_data.append(Spacer(1, 0.02 * inch))

    # Stats table
    stats_header = ['Mov', 'Run', 'Mel', 'Rgd', 'Def', 'Agi', 'Mrl', 'Atk', 'Wnd', 'Prc', 'Inj']
    run_value = int(agent_data['Move']) + 3
    stats_values = [
        agent_data['Move'],
        run_value,
        agent_data['Melee'],
        agent_data['Ranged'],
        agent_data['Defence'],
        agent_data['Agility'],
        agent_data['Morale'],
        agent_data['Attacks'],
        agent_data['Wounds'],
        agent_data['Piercing'],
        agent_data['Injury']
    ]

    stat_col_width = usable_width / len(stats_header)
    stats_table = Table([stats_header, stats_values], colWidths=[stat_col_width] * len(stats_header))
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34495e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), s(6)),
        ('FONTSIZE', (0, 1), (-1, 1), s(7)),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('TOPPADDING', (0, 0), (-1, 0), 2),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 2),
        ('TOPPADDING', (0, 1), (-1, 1), 2),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ecf0f1')),
    ]))

    card_data.append(Spacer(1, 0.02 * inch))
    card_data.append(stats_table)
    card_data.append(Spacer(1, 0.02 * inch))

    if agent_data.get('Melee Weapon'):
        a = " a"
        if agent_data.get('Melee Weapon')[-1] == "s":
            a = ""
        card_data.append(Paragraph(f"This unit is equipped with{a} {agent_data.get('Melee Weapon')}. This is already included in the stat table above.", body_style))
    if agent_data.get('Ranged Weapon'):
        ranged_weapon_name = agent_data.get('Ranged Weapon')
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
        ranged_weapon_values = [weapon_data.get('Name'), weapon_data.get('Range'), weapon_data.get('Injury'), weapon_data.get('Piercing'), effects_str]
        if weapon_alias:
            ranged_weapon_values = [ranged_weapon_name, weapon_data.get('Range'), weapon_data.get('Injury'), weapon_data.get('Piercing'), effects_str]

        ranged_weapon_header = ["Ranged Weapon", "Rng", "Inj", "Prc", "Special Rules"]
        ranged_weapon_table = Table([ranged_weapon_header, ranged_weapon_values], colWidths=[None, None, None])
        ranged_weapon_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34495e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 6),
            ('FONTSIZE', (0, 1), (-1, 1), 7),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
            ('TOPPADDING', (0, 0), (-1, 0), 2),
            ('BOTTOMPADDING', (0, 1), (-1, 1), 2),
            ('TOPPADDING', (0, 1), (-1, 1), 2),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ecf0f1'))
        ]))

        card_data.append(Spacer(1, 0.02 * inch))
        card_data.append(ranged_weapon_table)
        card_data.append(Spacer(1, 0.02 * inch))


        for effect_name in ranged_weapon_effects:
            effect = global_ranged_weapon_effects[effect_name]
            card_data.append(Paragraph(f"<b>{effect_name}</b>: {effect}\n", body_style))
    card_data.append(Spacer(1, 0.02 * inch))

    # Skills section
    if agent_data.get('Skills'):
        skills_header = Paragraph("<b>Skills</b>", section_style)
        card_data.append(skills_header)

        # Parse skills (can be comma-separated)
        skills_text = agent_data['Skills']
        skill_names = [s.strip() for s in skills_text.split(',') if s.strip()]

        for skill_name in skill_names:
            if skill_name in skills_db:
                skill_info = skills_db[skill_name]
                skill_desc = Paragraph(
                    f"<b>{skill_info['Name']}:</b> {skill_info['Description']}",
                    body_style
                )
                card_data.append(skill_desc)
            else:
                # Fallback if skill not found in database
                skill_desc = Paragraph(f"<b>{skill_name}</b>", body_style)
                card_data.append(skill_desc)

    return card_data


def generate_pdf(json_file, output_pdf='neutral_heroes.pdf', cards_per_row=3, cards_per_col=2,
                 skills_file='static/jsondata/skills.json', playing_card=False):
    """Generate PDF with multiple agent cards per page.

    Set playing_card=True to use standard poker card dimensions (2.5" x 3.5"),
    centered on a portrait A4 page.
    """
    agents = load_agents(json_file)
    skills_db = load_skills(skills_file)

    card_padding = 0.1 * inch

    if playing_card:
        card_width = 2.5 * inch
        card_height = 3.5 * inch
        pagesize = A4  # portrait
        page_width, page_height = A4
    else:
        pagesize = landscape(A4)
        page_width, page_height = landscape(A4)
        card_width = (page_width - (cards_per_row - 1) * 0) / cards_per_row  # no gap, full width split
        # Use all available height split equally
        card_height = page_height / cards_per_col

    # Center the card grid on the page
    grid_width = card_width * cards_per_row
    grid_height = card_height * cards_per_col
    origin_x = (page_width - grid_width) / 2
    origin_y = (page_height - grid_height) / 2

    agent_list = list(agents.items())
    cards_per_page = cards_per_row * cards_per_col

    c = pdfcanvas.Canvas(output_pdf, pagesize=pagesize)

    for page_idx in range(0, len(agent_list), cards_per_page):
        page_cards = agent_list[page_idx:page_idx + cards_per_page]

        for card_idx, (name, data) in enumerate(page_cards):
            col = card_idx % cards_per_row
            row = card_idx // cards_per_row

            x = origin_x + col * card_width
            y = page_height - origin_y - (row + 1) * card_height

            # Draw border
            c.setStrokeColor(colors.black)
            c.setLineWidth(0.5)
            c.rect(x, y, card_width, card_height)

            # Draw card content in a Frame
            frame = Frame(
                x + card_padding, y + card_padding,
                card_width - 2 * card_padding,
                card_height - 2 * card_padding,
                leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
                showBoundary=0
            )
            content = create_card_content(name, data, skills_db, card_width, card_padding)
            inner_w = card_width - 2 * card_padding
            inner_h = card_height - 2 * card_padding
            frame.addFromList([KeepInFrame(inner_w, inner_h, content, mode='shrink')], c)

        c.showPage()

    c.save()

    total_pages = (len(agent_list) + cards_per_page - 1) // cards_per_page
    print(f"PDF generated successfully: {output_pdf}")
    print(f"Generated {len(agent_list)} cards on {total_pages} page(s)")
    print(f"Layout: {cards_per_row} cards per row × {cards_per_col} cards per column")


if __name__ == "__main__":
    # 6 cards on one landscape page
    generate_pdf('static/jsondata/neutral_heroes.json', 'neutral_heroes.pdf', cards_per_row=3, cards_per_col=2)
    # Standard playing card size (2.5" x 3.5"), 3x2 on portrait A4
    # generate_pdf('static/jsondata/neutral_heroes.json', 'neutral_heroes_playing_card.pdf', cards_per_row=3, cards_per_col=2, playing_card=True)
