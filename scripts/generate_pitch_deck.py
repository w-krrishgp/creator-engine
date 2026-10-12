import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="Creator_Engine_CodeX_Pitch_Deck.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank layout

    # Design System Color Tokens (matching Creator Engine UI)
    C_BG = RGBColor(248, 250, 252)          # Slate 50
    C_WHITE = RGBColor(255, 255, 255)       # Pure White
    C_CARD_BORDER = RGBColor(226, 232, 240) # Slate 200
    C_NAVY = RGBColor(15, 23, 42)           # Slate 900 (ink typography)
    C_MUTED = RGBColor(71, 85, 105)         # Slate 600
    C_SUBTLE = RGBColor(148, 163, 184)      # Slate 400
    C_BLUE = RGBColor(37, 99, 235)          # Electric Blue 600
    C_DARK_BLUE = RGBColor(29, 78, 216)     # Blue 700
    C_BLUE_BG = RGBColor(239, 246, 255)     # Blue 50
    C_EMERALD = RGBColor(5, 150, 105)       # Emerald 600
    C_EMERALD_BG = RGBColor(236, 253, 245)  # Emerald 50
    C_INDIGO = RGBColor(79, 70, 229)        # Indigo 600
    C_INDIGO_BG = RGBColor(238, 242, 255)   # Indigo 50
    C_AMBER = RGBColor(217, 119, 6)         # Amber 600
    C_AMBER_BG = RGBColor(254, 243, 199)    # Amber 100
    C_ROSE = RGBColor(225, 29, 72)          # Rose 600
    C_ROSE_BG = RGBColor(255, 241, 242)     # Rose 50

    def set_slide_background(slide, color=C_BG):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color

    def add_header(slide, badge_text, title_text, subtitle_text, badge_color=C_BLUE, badge_bg=C_BLUE_BG):
        # Header Badge Pill
        badge_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(3.2), Inches(0.32))
        badge_box.fill.solid()
        badge_box.fill.fore_color.rgb = badge_bg
        badge_box.line.color.rgb = badge_color
        badge_box.line.width = Pt(1)
        tf_b = badge_box.text_frame
        tf_b.word_wrap = False
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.text = badge_text.upper()
        p_b.alignment = PP_ALIGN.CENTER
        p_b.font.size = Pt(9.5)
        p_b.font.bold = True
        p_b.font.color.rgb = badge_color
        p_b.font.name = "Arial"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.55))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_top = tf_t.margin_bottom = tf_t.margin_left = tf_t.margin_right = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = C_NAVY
        p_t.font.name = "Arial"

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.35))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        tf_s.margin_top = tf_s.margin_bottom = tf_s.margin_left = tf_s.margin_right = 0
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle_text
        p_s.font.size = Pt(12)
        p_s.font.color.rgb = C_MUTED
        p_s.font.name = "Arial"

    def add_card(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_CARD_BORDER, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
        return card

    def add_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_WHITE)

    # Top Brand Ribbon
    ribbon = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    ribbon.fill.solid()
    ribbon.fill.fore_color.rgb = C_BLUE
    ribbon.line.fill.background()

    # Title Card Container
    add_card(s1, Inches(0.8), Inches(0.7), Inches(11.733), Inches(6.1), bg_color=C_BG, border_color=C_CARD_BORDER)

    # Hackathon PS3 Badge
    ps_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.05), Inches(5.0), Inches(0.35))
    ps_badge.fill.solid()
    ps_badge.fill.fore_color.rgb = C_BLUE_BG
    ps_badge.line.color.rgb = C_BLUE
    tf = ps_badge.text_frame
    p = tf.paragraphs[0]
    p.text = "CODEX 3.0 HACKATHON • PROBLEM STATEMENT 3 (PS3)"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.alignment = PP_ALIGN.CENTER

    # Title Text
    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(6.8), Inches(1.1))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Creator Engine"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.font.name = "Arial"

    sub_box = s1.shapes.add_textbox(Inches(1.2), Inches(2.6), Inches(6.8), Inches(0.85))
    tf = sub_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "From Creator Profile to Growth, Monetisation & Opportunity Execution"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.font.name = "Arial"

    desc_box = s1.shapes.add_textbox(Inches(1.2), Inches(3.55), Inches(6.8), Inches(1.1))
    tf = desc_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "An ongoing creator execution suite connecting niche audience calibration with "
        "AI-synthesized 30/60/90-day roadmaps, 5 diversified monetisation pathways, and a "
        "deterministic brand opportunity marketplace."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED
    p.font.name = "Arial"

    # Team & Meta Info Card
    meta_card = add_card(s1, Inches(1.2), Inches(4.8), Inches(6.8), Inches(1.6), bg_color=C_WHITE, border_color=C_CARD_BORDER)
    meta_box = s1.shapes.add_textbox(Inches(1.4), Inches(4.9), Inches(6.4), Inches(1.4))
    tf = meta_box.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "PROJECT METADATA & TEAM INFORMATION"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    
    p2 = tf.add_paragraph()
    p2.text = "Team Name: [CodeX 3.0 Finalist Team]    |    Track: Web3 & Creator Economy (PS3)"
    p2.font.size = Pt(11)
    p2.font.color.rgb = C_NAVY
    p2.font.bold = True
    
    p3 = tf.add_paragraph()
    p3.text = "Team Members: [Presenter 1, Presenter 2, Presenter 3]"
    p3.font.size = Pt(10.5)
    p3.font.color.rgb = C_MUTED
    
    p4 = tf.add_paragraph()
    p4.text = "Stack: Next.js 16 Turbopack • React 19 • Supabase RLS • Google Gemini API"
    p4.font.size = Pt(9.5)
    p4.font.color.rgb = C_SUBTLE

    # Right Hero Image / Mockup Card
    right_card = add_card(s1, Inches(8.3), Inches(1.05), Inches(3.9), Inches(5.35), bg_color=C_WHITE, border_color=C_BLUE, border_width=2)
    img_path = r"c:\Users\Dell\creator-engine\screenshot_home.png"
    if os.path.exists(img_path):
        s1.shapes.add_picture(img_path, Inches(8.45), Inches(1.2), Inches(3.6), Inches(4.5))
        lbl_box = s1.shapes.add_textbox(Inches(8.45), Inches(5.8), Inches(3.6), Inches(0.45))
        tf = lbl_box.text_frame
        p = tf.paragraphs[0]
        p.text = "Live Working Prototype — Next.js 16"
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_EMERALD

    add_notes(s1, (
        "Good morning judges. Welcome to Creator Engine, built for CodeX 3.0 Problem Statement 3: "
        "Build a Creator Monetisation and Brand Opportunity Engine. "
        "Today, we are showcasing a fully functioning Next.js 16 application backed by Supabase and the Google Gemini API. "
        "Instead of another passive analytics dashboard, Creator Engine provides an ongoing execution system that tells creators "
        "what content to produce, how to monetize their specific audience, and which brand sponsorships they are genuinely qualified to win."
    ))

    # =========================================================================
    # SLIDE 2: THE PROBLEM (THE FRAGMENTED CREATOR JOURNEY)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_BG)
    add_header(s2, "The Real Creator Dilemma", "Creators Are Drowning in Metrics But Starving for Direction",
               "The creator journey is currently broken into 4 disconnected silos, leading to burnout and monetization failure.")

    col_w = Inches(2.7)
    gap = Inches(0.28)
    top_pos = Inches(1.85)
    h_pos = Inches(5.0)

    problems = [
        ("01", "Content & Format Paralysis", C_ROSE, C_ROSE_BG, [
            "Creators guess what to post daily without algorithmic retention context.",
            "Lacks clear visibility into 3-second hook drop-offs or missing save-rate mechanisms.",
            "Results in sporadic posting schedules and algorithm suppression."
        ]),
        ("02", "Skill & Growth Blindspots", C_AMBER, C_AMBER_BG, [
            "Creators know they must improve, but cannot prioritize specific operational skills.",
            "Unclear whether to focus on video editing, rate negotiation, or slide hierarchy.",
            "No structured 30/60/90-day trajectory aligned to audience stage."
        ]),
        ("03", "Commercial & Pricing Confusion", C_INDIGO, C_INDIGO_BG, [
            "93% of nano/micro creators undervalue their audience or rely solely on low-yield links.",
            "Missing pricing frameworks, media kits, or revision boundary standards.",
            "Uncertain how to package 1 Reel + 3 Stories with commercial usage rights."
        ]),
        ("04", "Scattered Deals & Vanity Metrics", C_BLUE, C_BLUE_BG, [
            "Traditional dashboards (SocialBlade, HypeAuditor) show past graphs, not next steps.",
            "Brand deals are buried in spam DMs with hidden follower and engagement barriers.",
            "Creators waste hours pitching brands where they are fundamentally ineligible."
        ]),
    ]

    for i, (num, title, col, bg_col, bullets) in enumerate(problems):
        x = Inches(0.8) + i * (col_w + gap)
        c = add_card(s2, x, top_pos, col_w, h_pos, bg_color=C_WHITE, border_color=C_CARD_BORDER)
        
        # Header strip
        strip = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_pos, col_w, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = col
        strip.line.fill.background()

        # Step Pill
        pill = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.2), top_pos + Inches(0.25), Inches(0.65), Inches(0.3))
        pill.fill.solid()
        pill.fill.fore_color.rgb = bg_col
        pill.line.color.rgb = col
        tf = pill.text_frame
        p = tf.paragraphs[0]
        p.text = num
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col

        # Card Title
        tb = s2.shapes.add_textbox(x + Inches(0.2), top_pos + Inches(0.65), col_w - Inches(0.4), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        # Bullets
        bb = s2.shapes.add_textbox(x + Inches(0.2), top_pos + Inches(1.5), col_w - Inches(0.4), Inches(3.2))
        tf_b = bb.text_frame
        tf_b.word_wrap = True
        for b in bullets:
            p = tf_b.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(10.5)
            p.font.color.rgb = C_MUTED
            p.space_after = Pt(8)

    add_notes(s2, (
        "Let's look at the core problem. Today, creators don't fail because they lack passion—they fail because their "
        "workflow is totally fragmented. In our research and problem statement analysis, we identified four main bottlenecks: "
        "First, content paralysis: creators don't know why their hooks drop off after 3 seconds. "
        "Second, skill blindspots: they have no roadmap to level up. "
        "Third, monetization confusion: they have no idea what rate card to quote. "
        "And fourth, analytics tools tell them what happened last week, but never what exact action to take today."
    ))

    # =========================================================================
    # SLIDE 3: OUR SOLUTION (THE CREATOR ENGINE EXECUTION LOOP)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_BG)
    add_header(s3, "The Solution Architecture", "Creator Engine: The Ongoing Creator Execution Loop",
               "A continuous 5-stage feedback system that transforms self-reported creator profile parameters into closed deals and daily execution.")

    # Flow Container Card
    add_card(s3, Inches(0.8), Inches(1.85), Inches(11.733), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)

    # 5 Process Columns
    loop_w = Inches(2.15)
    loop_gap = Inches(0.2)
    loop_top = Inches(2.1)
    loop_h = Inches(4.4)

    stages = [
        ("STAGE 1", "Creator Profile", C_BLUE, C_BLUE_BG, 
         "Calibrates stage, niche, audience demographics, primary platform, and monthly income targets."),
        ("STAGE 2", "AI Growth Strategy", C_INDIGO, C_INDIGO_BG, 
         "Google Gemini synthesizes 30/60/90-day roadmaps, algorithmic content gaps, and skill acceleration priorities."),
        ("STAGE 3", "Monetisation Pathway", C_EMERALD, C_EMERALD_BG, 
         "Evaluates viability across 5 diversified revenue channels with realistic readiness scores and first steps."),
        ("STAGE 4", "Opportunity Match", C_AMBER, C_AMBER_BG, 
         "Deterministic algorithms match vetted brand briefs; hard eligibility checks filter unqualified applicants."),
        ("STAGE 5", "Next Best Action", C_NAVY, RGBColor(241, 245, 249), 
         "Prioritizes execution tasks with explainable 'Why It Matters' rationales, deadlines, and real-time velocity tracking."),
    ]

    for i, (stg, name, col, bg_col, desc) in enumerate(stages):
        x = Inches(1.05) + i * (loop_w + loop_gap)
        sub_card = add_card(s3, x, loop_top, loop_w, loop_h, bg_color=bg_col, border_color=col, border_width=1.5)
        
        # Pill
        tb_p = s3.shapes.add_textbox(x + Inches(0.15), loop_top + Inches(0.2), loop_w - Inches(0.3), Inches(0.3))
        tf = tb_p.text_frame
        p = tf.paragraphs[0]
        p.text = stg
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER

        # Stage Name
        tb_n = s3.shapes.add_textbox(x + Inches(0.15), loop_top + Inches(0.6), loop_w - Inches(0.3), Inches(0.7))
        tf = tb_n.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = name
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        p.alignment = PP_ALIGN.CENTER

        # Divider line
        div = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.3), loop_top + Inches(1.35), loop_w - Inches(0.6), Inches(0.02))
        div.fill.solid()
        div.fill.fore_color.rgb = col
        div.line.fill.background()

        # Description
        tb_d = s3.shapes.add_textbox(x + Inches(0.15), loop_top + Inches(1.55), loop_w - Inches(0.3), Inches(2.5))
        tf = tb_d.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.alignment = PP_ALIGN.CENTER

        # Arrow indicator between cards (except last)
        if i < len(stages) - 1:
            arr = s3.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x + loop_w + Inches(0.03), loop_top + Inches(2.0), Inches(0.14), Inches(0.2))
            arr.fill.solid()
            arr.fill.fore_color.rgb = C_SUBTLE
            arr.line.fill.background()

    add_notes(s3, (
        "Here is our solution. Creator Engine is built as a closed-loop execution system with 5 interconnected stages: "
        "Stage 1: The creator defines their profile, verified platforms, and income targets. "
        "Stage 2: Gemini AI analyzes this data to generate tailored 30, 60, and 90-day growth plans. "
        "Stage 3: We evaluate 5 revenue pathways to find the most viable monetisation stream. "
        "Stage 4: Our deterministic matchmaking engine compares creator metrics against vetted brand campaign criteria. "
        "And Stage 5: Everything funnels into the Action Centre—giving the creator a prioritized daily execution queue."
    ))

    # =========================================================================
    # SLIDE 4: HOW THE PRODUCT WORKS (SYSTEM WORKFLOW & WORKING CAPABILITIES)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, C_BG)
    add_header(s4, "Feature Implementation Status", "How Creator Engine Works in the Prototype",
               "Clear transparency: Features confirmed functional in code vs. upcoming production roadmap.")

    # Left Container: Working Capabilities
    add_card(s4, Inches(0.8), Inches(1.85), Inches(7.6), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)
    
    hdr_left = s4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(7.2), Inches(0.4))
    tf = hdr_left.text_frame
    p = tf.paragraphs[0]
    p.text = "FUNCTIONAL IN THE CODEBASE TODAY (VERIFIED PROTOTYPE)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    working_features = [
        ("4-Step Creator Onboarding Wizard", "Collects handles, niches, stages, audience demographics, formats, and income targets (/onboarding)."),
        ("Persona Switcher & Hackathon Demo Bar", "Instant state toggle between Rahul (Fitness, 15k IG) and Priya (Finance, 8k LI) across all 5 core routes."),
        ("30/60/90-Day Phased Growth Roadmap", "Interactive milestone checklists, high-impact content gaps, and skill priorities with overall progress calculation."),
        ("5-Pathway Monetisation Engine", "Evaluates micro-sponsorships, affiliate links, consulting, digital guides, and PR with suitability scores 0-100."),
        ("Deterministic Opportunity Marketplace", "8 vetted brand briefs with mathematical compatibility scoring and hard eligibility checks (e.g. MyProtein vs Wint Wealth)."),
        ("Action Centre & Real-time Velocity", "Status transitions ('Not started' -> 'In progress' -> 'Completed'), velocity tracking, custom action creation, and Supabase sync."),
    ]

    for i, (title, desc) in enumerate(working_features):
        y = Inches(2.45) + i * Inches(0.7)
        # Green tick icon badge
        t_icon = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), y, Inches(0.28), Inches(0.28))
        t_icon.fill.solid()
        t_icon.fill.fore_color.rgb = C_EMERALD_BG
        t_icon.line.color.rgb = C_EMERALD
        tf_i = t_icon.text_frame
        p_i = tf_i.paragraphs[0]
        p_i.text = "✓"
        p_i.alignment = PP_ALIGN.CENTER
        p_i.font.size = Pt(10)
        p_i.font.bold = True
        p_i.font.color.rgb = C_EMERALD

        tb = s4.shapes.add_textbox(Inches(1.4), y - Inches(0.05), Inches(6.8), Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = C_MUTED

    # Right Container: Active Connections & Roadmap
    add_card(s4, Inches(8.6), Inches(1.85), Inches(3.933), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)

    hdr_r = s4.shapes.add_textbox(Inches(8.8), Inches(2.0), Inches(3.5), Inches(0.4))
    tf = hdr_r.text_frame
    p = tf.paragraphs[0]
    p.text = "LIVE INTEGRATION STATUS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    # Live Badges
    conns = [
        ("Supabase Cloud Database", "Connected & Verified", C_EMERALD, C_EMERALD_BG, 
         "PostgreSQL relational schema with RLS policies, 5 tables, and auto updated_at triggers."),
        ("Google Gemini API", "Connected & Verified", C_EMERALD, C_EMERALD_BG, 
         "Server-side /api/recommendations route via @google/genai with candidate model fallback and schema validator."),
        ("Deterministic Match Engine", "Active in App Code", C_BLUE, C_BLUE_BG, 
         "Strict mathematical scoring preventing AI hallucination of brand criteria or campaign availability."),
        ("OAuth Live Scraping", "Planned (Read-Only)", C_AMBER, C_AMBER_BG, 
         "Consent-based official Instagram Graph API & LinkedIn API authentication on production launch."),
    ]

    for i, (name, status, col, bg_col, sub_desc) in enumerate(conns):
        y = Inches(2.45) + i * Inches(1.05)
        box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), y, Inches(3.5), Inches(0.95))
        box.fill.solid()
        box.fill.fore_color.rgb = bg_col
        box.line.color.rgb = col
        box.line.width = Pt(1)

        tf = box.text_frame
        tf.margin_top = tf.margin_bottom = tf.margin_left = tf.margin_right = Inches(0.1)
        p = tf.paragraphs[0]
        p.text = name
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p2 = tf.add_paragraph()
        p2.text = f"Status: {status}"
        p2.font.size = Pt(9.5)
        p2.font.bold = True
        p2.font.color.rgb = col

        p3 = tf.add_paragraph()
        p3.text = sub_desc
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = C_MUTED

    add_notes(s4, (
        "In slide 4, we maintain absolute technical honesty for the hackathon judges. "
        "On the left, you see the working features implemented in our Next.js 16 codebase today: "
        "the onboarding wizard, dynamic persona switcher, phased roadmaps, 5-pathway monetisation engine, opportunity marketplace, and the Action Centre. "
        "On the right is our live integration status: Supabase and the Gemini API are connected and verified. "
        "Our opportunity match scoring is kept strictly deterministic in application code to guarantee zero AI hallucination."
    ))

    # =========================================================================
    # SLIDE 5: AI-POWERED GROWTH ENGINE
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, C_BG)
    add_header(s5, "Strategic AI Guidance", "AI-Powered Growth Engine: Calibrated Roadmap & Gap Analysis",
               "Synthesizing structured strategic guidance via Google Gemini with deterministic fallback.")

    card_w = Inches(5.7)
    card_h = Inches(2.35)

    ai_features = [
        (Inches(0.8), Inches(1.85), "Creator Positioning Thesis", C_BLUE, C_BLUE_BG, [
            "Synthesizes a sharp, defensible market thesis for creator bio and media kit.",
            "Example (Rahul): 'Democratizing accessible fitness for 15,000+ Indian university students through realistic hostel meal preps & zero-equipment bodyweight training.'",
            "Differentiates the creator from generic fitness models by focusing on student dorm realities."
        ]),
        (Inches(6.8), Inches(1.85), "Algorithmic Content Gaps", C_ROSE, C_ROSE_BG, [
            "Identifies specific retention flaws suppressing organic algorithmic distribution.",
            "3-Second Hook Drop-off (Critical): Missing bold on-screen text in frames 0-45; noise-sensitive student viewers swipe past.",
            "Zero Long-term Saves (High): Reels lack a downloadable slide; algorithmic exploration decays within 24 hours."
        ]),
        (Inches(0.8), Inches(4.4), "Skill Acceleration Priorities", C_INDIGO, C_INDIGO_BG, [
            "Categorizes high-leverage skills into Content Production, Commercial Pitching & Strategy.",
            "Visual Retention Hooks (Critical): Add dynamic movement or bold problem statements upfront.",
            "Sponsorship Rate Negotiation (High): Package 1 Reel + 3 Story frames with 30-day organic usage rights."
        ]),
        (Inches(6.8), Inches(4.4), "High-Impact Topic Opportunities", C_EMERALD, C_EMERALD_BG, [
            "Formulates specific video angles with psychological hooks and suggested formats.",
            "Topic 1: '5 High-Protein Hostel Mess Hacks Under ₹40' (Fast-paced vertical reel with price callouts).",
            "Topic 2: 'Zero-Equipment Pull-Up Progression in a Dorm Doorframe' (Step-by-step form tutorial reel)."
        ]),
    ]

    for left, top, title, col, bg_col, bullets in ai_features:
        add_card(s5, left, top, card_w, card_h, bg_color=C_WHITE, border_color=C_CARD_BORDER)
        
        # Pill
        pill = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.2), top + Inches(0.18), Inches(3.2), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = bg_col
        pill.line.color.rgb = col
        tf = pill.text_frame
        p = tf.paragraphs[0]
        p.text = title.upper()
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER

        tb = s5.shapes.add_textbox(left + Inches(0.2), top + Inches(0.55), card_w - Inches(0.4), card_h - Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        for b in bullets:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(10)
            p.font.color.rgb = C_MUTED
            p.space_after = Pt(4)

    # Bottom Transparency Ribbon
    bot_ribbon = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.3))
    bot_ribbon.fill.solid()
    bot_ribbon.fill.fore_color.rgb = C_AMBER_BG
    bot_ribbon.line.color.rgb = C_AMBER
    tf = bot_ribbon.text_frame
    p = tf.paragraphs[0]
    p.text = "Notice: Recommendations synthesized via Gemini API server route (/api/recommendations) with schema sanitization and offline fallback."
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = C_AMBER

    add_notes(s5, (
        "Slide 5 shows the AI-Powered Growth Engine in detail. Notice that Gemini isn't generating generic text prompts—it generates "
        "a tightly structured JSON response containing: "
        "1. A unique Creator Positioning Thesis. "
        "2. Algorithmic Content Gaps with specific reasons, like 3-second hook drop-offs and missing save slides. "
        "3. Clear Skill Priorities with tangible action steps. "
        "And 4. High-impact video topic angles with formats and target demographics. "
        "If external API keys are unavailable, our deterministic fallback engine produces matching high-fidelity recommendations instantly."
    ))

    # =========================================================================
    # SLIDE 6: MONETISATION & OPPORTUNITY MATCHING
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, C_BG)
    add_header(s6, "Revenue & Marketplace Engine", "Monetisation Pathways & Deterministic Opportunity Marketplace",
               "Evaluating 5 distinct revenue streams and connecting creators to transparent brand briefs.")

    # Left Column: 5 Monetisation Pathways (Inches 5.6 wide)
    add_card(s6, Inches(0.8), Inches(1.85), Inches(5.6), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)
    
    tb_m = s6.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(0.35))
    tf = tb_m.text_frame
    p = tf.paragraphs[0]
    p.text = "5 DIVERSIFIED REVENUE PATHWAYS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    channels = [
        ("Micro-Sponsorships & Dedicated Reels", "Score: 94%", "Ready to Launch", C_EMERALD, C_EMERALD_BG, 
         "D2C brands hunt for creators with >4% ER; student dorm setups deliver 3x higher trust than studio shoots."),
        ("Curated Supplement & Gear Affiliate Codes", "Score: 88%", "Ready to Launch", C_EMERALD, C_EMERALD_BG, 
         "Immediate passive revenue answering frequent DM queries with 10-15% commission coupons."),
        ("Dorm Calisthenics Blueprint (Digital Guide)", "Score: 82%", "High Opportunity", C_BLUE, C_BLUE_BG, 
         "₹299 low-friction PDF + unlisted video workout program with zero ongoing delivery overhead."),
        ("1:1 Advisory Calls & Consultations", "Score: 74%", "Scale Phase", C_INDIGO, C_INDIGO_BG, 
         "High suitability for technical/finance creators (e.g. Priya) offering private 30-min strategy sessions."),
        ("Corporate Workshops & PR Speaking", "Score: 68%", "Scale Phase", C_AMBER, C_AMBER_BG, 
         "B2B employee financial wellness seminars charging ₹25k-₹40k per corporate session."),
    ]

    for i, (title, score, badge, col, bg_col, desc) in enumerate(channels):
        y = Inches(2.4) + i * Inches(0.85)
        m_c = add_card(s6, Inches(1.0), y, Inches(5.2), Inches(0.78), bg_color=bg_col, border_color=col, border_width=1)
        tb = s6.shapes.add_textbox(Inches(1.15), y + Inches(0.04), Inches(4.9), Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{title} ({score})"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = C_MUTED

    # Right Column: Brand Marketplace Card (Inches 5.8 wide)
    add_card(s6, Inches(6.7), Inches(1.85), Inches(5.833), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)

    tb_opp = s6.shapes.add_textbox(Inches(6.9), Inches(2.0), Inches(5.4), Inches(0.35))
    tf = tb_opp.text_frame
    p = tf.paragraphs[0]
    p.text = "VETTED OPPORTUNITY CARD BREAKDOWN"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    # Sample Opportunity Box: MyProtein India (Using safe bullet symbol instead of astral emoji)
    opp_box = add_card(s6, Inches(6.9), Inches(2.4), Inches(5.433), Inches(4.25), bg_color=RGBColor(248, 250, 252), border_color=C_BLUE, border_width=1.5)

    opp_tf = s6.shapes.add_textbox(Inches(7.1), Inches(2.55), Inches(5.0), Inches(3.95)).text_frame
    opp_tf.word_wrap = True
    
    p = opp_tf.paragraphs[0]
    p.text = "[BRAND BRIEF] MyProtein India • Campus Fitness Fuel"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p2 = opp_tf.add_paragraph()
    p2.text = "Niche: Fitness & Nutrition  |  Platform: Instagram  |  Budget: ₹25,000 – ₹40,000"
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = C_MUTED
    p2.font.bold = True

    p3 = opp_tf.add_paragraph()
    p3.text = "Deliverables: 2x Instagram Reels (60s) + 3x Story Frames with exclusive discount link."
    p3.font.size = Pt(9.5)
    p3.font.color.rgb = C_NAVY

    # Eligibility Breakdown Box
    p4 = opp_tf.add_paragraph()
    p4.text = "Deterministic Match Score: 96% Match • Status: VERIFIED ELIGIBLE"
    p4.font.size = Pt(11)
    p4.font.bold = True
    p4.font.color.rgb = C_EMERALD
    p4.space_before = Pt(10)

    checks = [
        "✓ Follower Count: 15,000 (Required: >= 10,000)",
        "✓ Engagement Rate: 4.8% (Required: >= 3.5%)",
        "✓ Primary Platform: Instagram (Matches brief platform)",
        "✓ Niche Alignment: Fitness & Nutrition (100% keyword match)",
        "✓ Target Demographic: 18-24 Student audience in India",
    ]
    for chk in checks:
        p = opp_tf.add_paragraph()
        p.text = chk
        p.font.size = Pt(9)
        p.font.color.rgb = C_MUTED

    p_disc = opp_tf.add_paragraph()
    p_disc.text = "*Demo Notice: Fictional campaign brief reflecting standard industry brand deliverables."
    p_disc.font.size = Pt(8)
    p_disc.font.italic = True
    p_disc.font.color.rgb = C_SUBTLE
    p_disc.space_before = Pt(8)

    add_notes(s6, (
        "On slide 6, we examine how monetization works. In Creator Engine, we don't assume brand sponsorships are the only way to earn. "
        "We evaluate 5 diversified pathways with quantitative suitability scores from 0 to 100. "
        "On the right is a live example of our brand opportunity card: MyProtein India. "
        "Look at the eligibility breakdown: Rahul is scored at 96% and verified eligible because he demonstrably passes all 5 criteria. "
        "If a creator does not meet a hard requirement, the engine explicitly marks them ineligible and explains why."
    ))

    # =========================================================================
    # SLIDE 7: PERSONALIZATION DEMO (RAHUL VS. PRIYA)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, C_BG)
    add_header(s7, "Critical Hackathon Demonstration", "Two Creators, Two Completely Different Strategic Playbooks",
               "Demonstrating deep personalization: Recommendations completely invert between Rahul and Priya.")

    card_w2 = Inches(5.7)
    card_h2 = Inches(5.0)

    # Creator A: Rahul
    add_card(s7, Inches(0.8), Inches(1.85), card_w2, card_h2, bg_color=C_WHITE, border_color=C_BLUE, border_width=1.5)
    
    # Creator A Header Badge
    a_badge = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.05), Inches(5.3), Inches(0.4))
    a_badge.fill.solid()
    a_badge.fill.fore_color.rgb = C_BLUE_BG
    a_badge.line.color.rgb = C_BLUE
    tf = a_badge.text_frame
    p = tf.paragraphs[0]
    p.text = "CREATOR A: RAHUL SHARMA (@rahulfit.india) • FITNESS"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.alignment = PP_ALIGN.CENTER

    tb_a = s7.shapes.add_textbox(Inches(1.0), Inches(2.55), Inches(5.3), Inches(2.4))
    tf_a = tb_a.text_frame
    tf_a.word_wrap = True

    rahul_matrix = [
        ("Audience & Scale:", "15,000 Instagram Followers • 4.8% Engagement • 18-24 Students"),
        ("Income Goal:", "₹75,000/month via commercial fitness sponsorships"),
        ("Strategic Positioning:", "Hostel nutrition hacks under ₹40 & dorm-friendly calisthenics"),
        ("Top Monetisation:", "1. Brand Collaborations (94%)  |  2. Affiliate Codes (88%)"),
        ("Top Brand Deal:", "MyProtein India Campus Fuel (96% Match — VERIFIED ELIGIBLE)"),
        ("Disqualified Deal:", "Wint Wealth Bonds (INELIGIBLE — Requires LinkedIn & Finance Niche)"),
        ("Next Best Action:", "Submit customized pitch deck to MyProtein & audit Reels 3-sec hook dropoff"),
    ]

    for k, v in rahul_matrix:
        p = tf_a.add_paragraph()
        p.text = k + " " + v
        p.font.size = Pt(8.8)
        p.font.color.rgb = C_NAVY
        p.space_after = Pt(2)

    # Embedded Rahul Prototype Screenshot Thumbnail
    img_rahul = r"c:\Users\Dell\creator-engine\screenshot_opportunities.png"
    if os.path.exists(img_rahul):
        s7.shapes.add_picture(img_rahul, Inches(1.0), Inches(4.95), Inches(5.3), Inches(1.75))

    # Creator B: Priya
    add_card(s7, Inches(6.8), Inches(1.85), card_w2, card_h2, bg_color=C_WHITE, border_color=C_INDIGO, border_width=1.5)

    # Creator B Header Badge
    b_badge = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(2.05), Inches(5.3), Inches(0.4))
    b_badge.fill.solid()
    b_badge.fill.fore_color.rgb = C_INDIGO_BG
    b_badge.line.color.rgb = C_INDIGO
    tf = b_badge.text_frame
    p = tf.paragraphs[0]
    p.text = "CREATOR B: PRIYA NAIR (@priya.finance) • PERSONAL FINANCE"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_INDIGO
    p.alignment = PP_ALIGN.CENTER

    tb_b = s7.shapes.add_textbox(Inches(7.0), Inches(2.55), Inches(5.3), Inches(2.4))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True

    priya_matrix = [
        ("Audience & Scale:", "8,000 LinkedIn Followers • 3.8% Engagement • 24-35 Tech Pros"),
        ("Income Goal:", "₹1,20,000/month via corporate financial wellness & advisory calls"),
        ("Strategic Positioning:", "Zero-jargon visual frameworks for tax optimization & RSUs"),
        ("Top Monetisation:", "1. 1:1 Advisory Calls (96%)  |  2. Corporate Wellness Webinars (91%)"),
        ("Top Brand Deal:", "Wint Wealth Fixed Income Series (97% Match — VERIFIED ELIGIBLE)"),
        ("Disqualified Deal:", "Cult.fit Home Challenge (INELIGIBLE — Requires Instagram Fitness Videos)"),
        ("Next Best Action:", "Standardize SEBI-compliant disclaimer footer & launch Topmate booking link"),
    ]

    for k, v in priya_matrix:
        p = tf_b.add_paragraph()
        p.text = k + " " + v
        p.font.size = Pt(8.8)
        p.font.color.rgb = C_NAVY
        p.space_after = Pt(2)

    # Embedded Priya Prototype Screenshot Thumbnail
    img_priya = r"c:\Users\Dell\creator-engine\screenshot_priya_opps.png"
    if os.path.exists(img_priya):
        s7.shapes.add_picture(img_priya, Inches(7.0), Inches(4.95), Inches(5.3), Inches(1.75))

    add_notes(s7, (
        "Judges, this slide represents the core requirement of Problem Statement 3: proving that two creators in different niches "
        "receive completely distinct recommendations. "
        "On the left, Rahul is a student fitness creator on Instagram with 15k followers. His top opportunities are MyProtein India and ₹299 digital workout guides. "
        "Wint Wealth is strictly disqualified because he's on Instagram in fitness. "
        "On the right, Priya is a LinkedIn finance educator with 8k connections. For Priya, recommendations completely invert: "
        "her top monetization is corporate wellness webinars and 1:1 strategy calls. Wint Wealth is a 97% match, while Cult.fit is disqualified. "
        "This proves our personalization is real, contextual, and explainable."
    ))

    # =========================================================================
    # SLIDE 8: TECHNOLOGY AND AI ARCHITECTURE
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, C_BG)
    add_header(s8, "Technical Architecture", "Technology Stack & AI Integration Architecture",
               "Engineered for reliability: Server-side API security, deterministic logic, and Row-Level Security.")

    arch_w = Inches(11.733)
    arch_h = Inches(1.1)
    arch_gap = Inches(0.18)
    start_y = Inches(1.85)

    arch_layers = [
        ("PRESENTATION TIER", "Next.js 16.4 (Turbopack) • React 19 • Tailwind CSS v4 • Lucide Icons", C_BLUE, C_BLUE_BG,
         "Client-side App Router with responsive dashboard layouts, Hackathon Demo Bar, Persona Switcher, and stateful Action Centre tracking."),
        ("STATE & CLIENT SERVICES", "CreatorContext.tsx • compatibility.ts • supabaseService.ts", C_INDIGO, C_INDIGO_BG,
         "Global React Context managing active persona state, optimistic UI updates, and deterministic matchmaking algorithm preventing AI hallucination."),
        ("AI RECOMMENDATIONS ROUTE", "Next.js Server API (/api/recommendations) • @google/genai SDK", C_EMERALD, C_EMERALD_BG,
         "Secure server-side route executing Gemini API (gemini-3.5-flash-lite / gemini-3.8-flash) with 20s timeout, schema sanitization, and fallback engine."),
        ("PERSISTENCE & SECURITY", "Supabase PostgreSQL • Row Level Security (RLS) • UUIDs", C_NAVY, RGBColor(241, 245, 249),
         "Relational schema covering creator_profiles, creator_preferences, opportunities, opportunity_applications, and action_items with public demo access policies."),
    ]

    for i, (layer_title, tech_sub, col, bg_col, details) in enumerate(arch_layers):
        y = start_y + i * (arch_h + arch_gap)
        card = add_card(s8, Inches(0.8), y, arch_w, arch_h, bg_color=C_WHITE, border_color=C_CARD_BORDER)

        accent = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), y, Inches(0.15), arch_h)
        accent.fill.solid()
        accent.fill.fore_color.rgb = col
        accent.line.fill.background()

        tb = s8.shapes.add_textbox(Inches(1.15), y + Inches(0.12), arch_w - Inches(0.5), arch_h - Inches(0.24))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"{layer_title}:  {tech_sub}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = details
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(3)

    add_notes(s8, (
        "Slide 8 outlines our technical implementation. We built this with Next.js 16.4 using the Turbopack engine and React 19. "
        "Security was a priority: the Gemini API key is never exposed to the client. All AI generation goes through our server route "
        "`/api/recommendations` with strict output schema validation and a 20-second timeout. "
        "For database storage, we deployed a PostgreSQL relational schema on Supabase configured with Row-Level Security, "
        "allowing public read for demo profiles while ensuring user data is private and secure."
    ))

    # =========================================================================
    # SLIDE 9: DIFFERENTIATION AND RESPONSIBLE DESIGN
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, C_BG)
    add_header(s9, "Market Positioning & Guardrails", "Differentiation Matrix & Responsible Design Principles",
               "Why Creator Engine is uniquely actionable, and how we protect creators and brands.")

    # Left: Comparison Matrix Table (Inches 7.4 wide)
    add_card(s9, Inches(0.8), Inches(1.85), Inches(7.4), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)

    tb_cmp = s9.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(7.0), Inches(0.35))
    tf = tb_cmp.text_frame
    p = tf.paragraphs[0]
    p.text = "PRODUCT COMPARISON MATRIX"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    # Table layout
    rows = [
        ("Capability", "Creator Engine", "Analytics Dashboards", "Caption AI Tools", "Blind Marketplaces"),
        ("Target Output", "Next Best Action", "Historical Graphs", "Isolated Captions", "Spam Listing Boards"),
        ("Growth Roadmap", "30/60/90 Days Phased", "None (Static)", "None", "None"),
        ("Monetisation Model", "5 Viable Pathways", "None", "None", "Bidding Only"),
        ("Matchmaking Logic", "Deterministic & Explainable", "None", "None", "Black-box Bidding"),
        ("Compliance Guidance", "ASCI & SEBI Norms", "None", "None", "Terms-of-Service Only"),
    ]

    for r_idx, r in enumerate(rows):
        y = Inches(2.45) + r_idx * Inches(0.7)
        is_header = (r_idx == 0)
        bg = C_BLUE_BG if is_header else (RGBColor(248, 250, 252) if r_idx % 2 == 1 else C_WHITE)

        row_box = add_card(s9, Inches(1.0), y, Inches(7.0), Inches(0.62), bg_color=bg, border_color=C_CARD_BORDER)
        tb_r = s9.shapes.add_textbox(Inches(1.1), y + Inches(0.08), Inches(6.8), Inches(0.5))
        tf_r = tb_r.text_frame
        tf_r.word_wrap = True
        
        p = tf_r.paragraphs[0]
        p.text = f"{r[0]}  ➔  {r[1]}"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_BLUE if is_header or "Creator Engine" in r[1] else C_NAVY

        p_sub = tf_r.add_paragraph()
        p_sub.text = f"Alternative Tools: {r[2]} vs {r[3]} vs {r[4]}"
        p_sub.font.size = Pt(8.5)
        p_sub.font.color.rgb = C_MUTED

    # Right: Responsible Design Guardrails (Inches 4.1 wide)
    add_card(s9, Inches(8.4), Inches(1.85), Inches(4.133), Inches(5.0), bg_color=C_WHITE, border_color=C_CARD_BORDER)

    tb_g = s9.shapes.add_textbox(Inches(8.6), Inches(2.0), Inches(3.7), Inches(0.35))
    tf = tb_g.text_frame
    p = tf.paragraphs[0]
    p.text = "RESPONSIBLE DESIGN GUARDRAILS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    guardrails = [
        ("No Guaranteed Virality Claims", "Creator Engine explicitly avoids fraudulent promises of follower growth or guaranteed earnings; all price ranges are labeled as illustrative benchmarks."),
        ("No Unauthorized Scraping", "We do not scrape private data or bypass platform anti-bot controls; data is self-reported and consent-driven."),
        ("Zero AI Campaign Hallucination", "Gemini advises strictly on content and strategy; brand campaign criteria are governed deterministically in application code."),
        ("Regulatory Compliance Built-In", "Incorporates statutory disclosure guidelines (ASCI influencer norms, SEBI educational research disclaimers)."),
    ]

    for i, (g_title, g_desc) in enumerate(guardrails):
        y = Inches(2.45) + i * Inches(1.05)
        g_box = add_card(s9, Inches(8.6), y, Inches(3.733), Inches(0.95), bg_color=C_EMERALD_BG, border_color=C_EMERALD, border_width=1)
        tf_g = g_box.text_frame
        tf_g.margin_top = tf_g.margin_bottom = tf_g.margin_left = tf_g.margin_right = Inches(0.08)
        p = tf_g.paragraphs[0]
        p.text = "[GUARDRAIL] " + g_title
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_EMERALD

        p2 = tf_g.add_paragraph()
        p2.text = g_desc
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = C_MUTED

    add_notes(s9, (
        "On slide 9, we highlight our market differentiation and ethical guardrails. "
        "Most creator tools fall into two extremes: either vanity analytics dashboards that don't tell you what to do, "
        "or AI caption generators that provide isolated text. Creator Engine bridges this by being an action-oriented execution system. "
        "Equally important are our responsible design guardrails: we make zero claims of guaranteed virality, "
        "we do not perform unauthorized scraping, and we never allow generative AI to hallucinate brand sponsorship criteria."
    ))

    # =========================================================================
    # SLIDE 10: IMPACT, ROADMAP & CLOSING
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, C_WHITE)

    # Top Ribbon
    ribbon = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    ribbon.fill.solid()
    ribbon.fill.fore_color.rgb = C_BLUE
    ribbon.line.fill.background()

    # Quote Banner Card
    q_card = add_card(s10, Inches(0.8), Inches(0.6), Inches(11.733), Inches(1.5), bg_color=C_BLUE_BG, border_color=C_BLUE, border_width=1.5)
    tb_q = s10.shapes.add_textbox(Inches(1.1), Inches(0.75), Inches(11.1), Inches(1.2))
    tf = tb_q.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = '"Creators don\'t need another analytics dashboard. They need a system that helps them decide what to do next and discover relevant monetisation opportunities."'
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = C_DARK_BLUE
    p.alignment = PP_ALIGN.CENTER

    p2 = tf.add_paragraph()
    p2.text = "— Core Product Thesis, Creator Engine (CodeX 3.0 PS3)"
    p2.font.size = Pt(11)
    p2.font.color.rgb = C_MUTED
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(6)

    # Left: Expected User Benefits
    add_card(s10, Inches(0.8), Inches(2.35), Inches(5.7), Inches(3.6), bg_color=C_BG, border_color=C_CARD_BORDER)
    tb_b = s10.shapes.add_textbox(Inches(1.05), Inches(2.5), Inches(5.2), Inches(3.3))
    tf = tb_b.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "EXPECTED CREATOR & BRAND VALUE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    benefits = [
        ("Faster Time-to-Monetisation:", "Reduces creator ramp-up time by providing immediate rate card benchmarks and pitch templates."),
        ("Higher Sponsorship Conversion:", "Deterministic qualification prevents rejected pitches and protects brand campaign quality."),
        ("Execution Accountability:", "Real-time Action Centre velocity converts strategic intentions into completed operational milestones."),
        ("Regulatory Compliance Protection:", "Educates creators on mandatory ASCI influencer tags and SEBI financial disclosure norms."),
    ]
    for k, v in benefits:
        p = tf.add_paragraph()
        p.text = "• " + k + " "
        p.font.bold = True
        p.font.size = Pt(10)
        p.font.color.rgb = C_BLUE
        p_sub = tf.add_paragraph()
        p_sub.text = v
        p_sub.font.size = Pt(9.5)
        p_sub.font.color.rgb = C_MUTED
        p_sub.space_after = Pt(4)

    # Right: Future Roadmap & Team Thank You
    add_card(s10, Inches(6.8), Inches(2.35), Inches(5.733), Inches(3.6), bg_color=C_BG, border_color=C_CARD_BORDER)
    tb_r = s10.shapes.add_textbox(Inches(7.05), Inches(2.5), Inches(5.2), Inches(3.3))
    tf = tb_r.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "FUTURE DEVELOPMENT ROADMAP"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_INDIGO

    phases = [
        ("Phase 1 (Q2 2026):", "Official OAuth Social Verifications (Read-only Instagram Graph API & LinkedIn API)."),
        ("Phase 2 (Q3 2026):", "Smart Contract Escrow for automated campaign payouts upon approved reel delivery."),
        ("Phase 3 (Q4 2026):", "AI Outbound Co-Pilot for brand negotiation & automated usage rights contracts."),
    ]
    for k, v in phases:
        p = tf.add_paragraph()
        p.text = "• " + k + " " + v
        p.font.size = Pt(10)
        p.font.color.rgb = C_NAVY
        p.space_after = Pt(6)

    p_close = tf.add_paragraph()
    p_close.text = "Thank You! Ready for Questions & Live Demonstration."
    p_close.font.size = Pt(13)
    p_close.font.bold = True
    p_close.font.color.rgb = C_BLUE
    p_close.space_before = Pt(12)

    p_team = tf.add_paragraph()
    p_team.text = "Creator Engine Team • CodeX 3.0 Hackathon"
    p_team.font.size = Pt(10)
    p_team.font.color.rgb = C_MUTED

    # Bottom Footer
    foot = s10.shapes.add_textbox(Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.6))
    tf = foot.text_frame
    p = tf.paragraphs[0]
    p.text = "Creator Engine — Built for CodeX 3.0 (PS3) • Live Prototype at http://localhost:3000 • Fully Editable PowerPoint Presentation"
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(9.5)
    p.font.color.rgb = C_SUBTLE

    add_notes(s10, (
        "To conclude: Creators don't need another passive analytics dashboard. They need a system that helps them decide what to do next "
        "and discover relevant monetisation opportunities. "
        "Creator Engine bridges the gap between creator identity and real revenue. "
        "We are ready for questions and would love to walk you through the live prototype. Thank you!"
    ))

    # Save Presentation
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "Creator_Engine_CodeX_Pitch_Deck.pptx"
    create_deck(out_file)
