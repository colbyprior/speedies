import json
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def load_agents(json_file):
    """Load agent data from JSON file."""
    with open(json_file, 'r') as f:
        return json.load(f)


def create_card_content(name, agent_data):
    """Create content for a single agent card."""
    styles = getSampleStyleSheet()

    # Custom styles - compact
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=12,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=2,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=14
    )

    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#7f8c8d'),
        spaceAfter=3,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique',
        leading=10
    )

    cost_style = ParagraphStyle(
        'CostStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#e74c3c'),
        spaceAfter=3,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=11
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=7,
        spaceAfter=3,
        alignment=TA_LEFT,
        leading=9
    )

    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=8,
        textColor=colors.HexColor('#34495e'),
        spaceAfter=2,
        spaceBefore=2,
        fontName='Helvetica-Bold',
        leading=10
    )

    card_data = []

    # Title section
    title = Paragraph(f"<b>{name}</b> ({agent_data['Faction']})", title_style)
    subtitle = Paragraph(f"<i>{agent_data['Species']} {agent_data['Position']}</i>", subtitle_style)
    card_data.append(title)
    card_data.append(subtitle)

    # Faction Support Cost
    cost = Paragraph(f"<b>Cost: {agent_data['Faction Support Cost']}</b>", cost_style)
    card_data.append(cost)
    card_data.append(Spacer(1, 0.03 * inch))

    # About section
    if agent_data.get('About'):
        about = Paragraph(agent_data['About'], body_style)
        card_data.append(about)

    # Stats table - without Cost column
    stats_header = ['Mov', 'Run', 'Mel', 'Rgd', 'Def', 'Agi', 'Mrl', 'Atk', 'Wnd', 'Prc', 'Inj']
    run_value = str(int(agent_data['Move']) + 4)
    stats_values = [
        agent_data['Move'],
        run_value,
        agent_data['Melee'],
        agent_data['Ranged'],
        agent_data['Defense'],
        agent_data['Agility'],
        agent_data['Morale'],
        agent_data['Attacks'],
        agent_data['Wounds'],
        agent_data['Piercing'],
        agent_data['Injury']
    ]

    stats_table = Table([stats_header, stats_values], colWidths=[0.42 * inch] * 11)
    stats_table.setStyle(TableStyle([
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
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ecf0f1')),
    ]))

    card_data.append(Spacer(1, 0.03 * inch))
    card_data.append(stats_table)
    card_data.append(Spacer(1, 0.03 * inch))

    # Skills section
    if agent_data.get('Skills'):
        skills_header = Paragraph("<b>Skills</b>", section_style)
        card_data.append(skills_header)

        skills_text = agent_data['Skills']
        if skills_text == "Deadly":
            skill_desc = Paragraph("<i>Deadly:</i> +2 to injury rolls in melee", body_style)
            card_data.append(skill_desc)
        else:
            skill_desc = Paragraph(skills_text, body_style)
            card_data.append(skill_desc)

    # Event section
    if agent_data.get('Event'):
        event_header = Paragraph("<b>Event</b>", section_style)
        card_data.append(event_header)

        event_text = agent_data['Event'].replace('\n\n', '<br/><br/>').replace('\n', '<br/>')
        event_desc = Paragraph(event_text, body_style)
        card_data.append(event_desc)

    return card_data


def generate_pdf(json_file, output_pdf='faction_agents.pdf', cards_per_row=2, cards_per_col=2):
    """Generate PDF with multiple agent cards per page.

    Args:
        json_file: Path to the JSON file with agent data
        output_pdf: Output PDF filename
        cards_per_row: Number of cards horizontally per page
        cards_per_col: Number of cards vertically per page
    """
    agents = load_agents(json_file)

    page_width, page_height = landscape(letter)

    # Card dimensions
    margin = 0.3 * inch
    card_padding = 0.1 * inch
    gap = 0.1 * inch  # Gap between cards

    # Calculate card dimensions based on number of cards per page
    card_width = (page_width - 2 * margin - (cards_per_row - 1) * gap) / cards_per_row
    card_height = (page_height - 2 * margin - (cards_per_col - 1) * gap) / cards_per_col

    # Create PDF
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=landscape(letter),
        rightMargin=margin,
        leftMargin=margin,
        topMargin=margin,
        bottomMargin=margin
    )

    story = []
    agent_list = list(agents.items())
    cards_per_page = cards_per_row * cards_per_col

    # Process agents in groups (one group per page)
    for page_idx in range(0, len(agent_list), cards_per_page):
        page_cards = agent_list[page_idx:page_idx + cards_per_page]

        # Build rows for this page
        rows = []
        for row_idx in range(cards_per_col):
            row = []
            for col_idx in range(cards_per_row):
                card_idx = row_idx * cards_per_row + col_idx

                if card_idx < len(page_cards):
                    name, data = page_cards[card_idx]
                    card_content = create_card_content(name, data)
                    row.append(card_content)
                else:
                    # Empty cell
                    row.append([Paragraph('', getSampleStyleSheet()['Normal'])])

            rows.append(row)

        # Create table for this page
        page_table = Table(
            rows,
            colWidths=[card_width] * cards_per_row,
            rowHeights=[card_height] * cards_per_col
        )

        # Build style with borders for each card
        table_style = [
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), card_padding),
            ('RIGHTPADDING', (0, 0), (-1, -1), card_padding),
            ('TOPPADDING', (0, 0), (-1, -1), card_padding),
            ('BOTTOMPADDING', (0, 0), (-1, -1), card_padding),
        ]

        # Add border to each card that has content
        for row_idx in range(cards_per_col):
            for col_idx in range(cards_per_row):
                card_idx = row_idx * cards_per_row + col_idx
                if card_idx < len(page_cards):
                    table_style.extend([
                        ('BOX', (col_idx, row_idx), (col_idx, row_idx), 2, colors.black),
                        ('LINESTYLE', (col_idx, row_idx), (col_idx, row_idx), 'DASHED', (1, 2)),
                    ])

        page_table.setStyle(TableStyle(table_style))
        story.append(page_table)

        # Add page break if not the last page
        if page_idx + cards_per_page < len(agent_list):
            story.append(PageBreak())

    # Build PDF
    doc.build(story)
    total_pages = (len(agent_list) + cards_per_page - 1) // cards_per_page
    print(f"PDF generated successfully: {output_pdf}")
    print(f"Generated {len(agent_list)} cards on {total_pages} page(s)")
    print(f"Layout: {cards_per_row} cards per row × {cards_per_col} cards per column")


if __name__ == "__main__":
    # Example usage - generate with 2x2 grid (4 cards per page)
    # You can change cards_per_row and cards_per_col to fit more cards
    generate_pdf('static/jsondata/faction-agents.json', 'faction_agents.pdf', cards_per_row=2, cards_per_col=3)
