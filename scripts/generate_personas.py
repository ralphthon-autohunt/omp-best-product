#!/usr/bin/env python3
import json
import random
from datetime import datetime

# Configuration
product_id = "idea-20260329-124047"
target_segment = {
    "demographics": "개발자/PM/디자이너, 25-40세, 스크린샷에서 텍스트를 자주 복사해야 하는 사람들",
    "needs": "스크린샷에서 즉시 텍스트 추출, 브라우저에서 바로 처리 (서버 없음, 개인정보 보호)",
    "pain_points": "에러 메시지 스크린샷에서 텍스트 못 복사, 대시보드 수치 수동 재입력, 기존 OCR 앱은 서버 업로드 필요"
}

raw_voices = [
    {"source": "reddit", "text": "I take screenshots of error messages all the time but then have to manually retype them to search", "sentiment": "negative"},
    {"source": "twitter", "text": "Why is there no good browser OCR extension that works offline? Privacy matters", "sentiment": "negative"},
    {"source": "hackernews", "text": "Screenshot OCR tools all require uploading to their servers. No thanks.", "sentiment": "negative"},
    {"source": "stackoverflow", "text": "Copying text from terminal screenshots is painful, wish there was instant OCR", "sentiment": "negative"},
    {"source": "producthunt", "text": "Text Sniper is great but Mac-only, need something cross-platform", "sentiment": "mixed"}
]

# Names pools
target_first_names = ["Marcus", "Emily", "James", "Alicia", "David", "Rachel", "Michael", "Sarah", "Brian", "Jessica",
                      "Alex", "Daniel", "Olivia", "Tyler", "Maya", "Kevin", "Sophie", "Jordan", "Linda", "Chris",
                      "Patricia", "Andre", "Nicole", "Robert", "Hannah", "Emma", "Lucas", "Isabella", "Noah", "Mia",
                      "Ethan", "Ava", "Mason", "Sophia", "Logan", "Charlotte", "Jacob", "Amelia", "Jack", "Harper",
                      "Aiden", "Evelyn", "Ryan", "Abigail", "Luke", "Ella", "Nathan", "Scarlett", "Caleb", "Grace",
                      "Benjamin", "Lily", "Samuel", "Victoria", "Henry", "Zoe", "Owen", "Penelope", "Dylan", "Layla",
                      "Connor", "Nora", "Wyatt", "Riley", "Julian", "Aria", "Gavin", "Ellie", "Aaron", "Aubrey",
                      "Isaac", "Addison", "Eli", "Brooklyn", "Andrew", "Claire", "Joshua", "Skylar", "Christian", "Savannah",
                      "Sebastian", "Anna", "Cooper", "Caroline", "Colton", "Genesis", "Cameron", "Aaliyah", "Landon", "Kennedy",
                      "Adrian", "Kinsley", "Xavier", "Allison", "Dominic", "Maya", "Parker", "Sarah", "Austin", "Madelyn",
                      "Chase", "Adeline", "Jaxon", "Alexa", "Ian", "Ariana", "Carson", "Elena", "Easton", "Gabriella",
                      "Nolan", "Naomi", "Hunter", "Alice", "Thomas", "Hailey", "Tristan", "Eva", "Bentley", "Emilia",
                      "Declan", "Autumn", "Blake", "Quinn", "Max", "Chloe"]

target_last_names = ["Williams", "Rodriguez", "Park", "Thompson", "Nguyen", "Kim", "Chen", "Martinez", "Foster", "Lee",
                     "Rivera", "Zhang", "Brown", "Harris", "Johnson", "Davis", "Garcia", "Miller", "Wilson", "Moore",
                     "Taylor", "Anderson", "Thomas", "Jackson", "White", "Lopez", "Gonzalez", "Hernandez", "Young", "King",
                     "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Carter", "Mitchell", "Perez", "Roberts",
                     "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris"]

nontarget_first_names = ["Richard", "Dorothy", "Frank", "Brenda", "Victor", "Melissa", "Gregory", "Angela", "Steven", "Catherine",
                         "Raymond", "Laura", "Martin", "Diane", "Kenneth", "Carol", "Donald", "Janet", "Gary", "Betty",
                         "Dennis", "Ruth", "Larry", "Virginia", "Terry", "Helen", "Eugene", "Donna", "Russell", "Joyce",
                         "Philip", "Frances", "Albert", "Evelyn", "Harold", "Alice", "Roy", "Jean", "Arthur", "Shirley",
                         "Ralph", "Martha", "Howard", "Gloria", "Willie", "Doris", "Ernest", "Judith", "Carl", "Kathleen"]

nontarget_last_names = ["Blackwood", "Miller", "Gonzalez", "Patterson", "Santos", "Chang", "Walsh", "Foster", "Park", "Liu",
                        "Torres", "Bennett", "Reed", "Murphy", "White", "Coleman", "Jenkins", "Perry", "Powell", "Long",
                        "Hughes", "Flores", "Washington", "Butler", "Simmons", "Bryant", "Alexander", "Russell", "Griffin", "Hayes"]

target_jobs = ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "DevOps Engineer", "Site Reliability Engineer",
               "Product Manager", "Technical Product Manager", "Product Designer", "UX Designer", "UI Designer",
               "QA Engineer", "Software Engineer", "Data Analyst", "Engineering Manager", "Tech Lead",
               "UX Researcher", "Technical Writer", "Solutions Architect", "Data Engineer", "ML Engineer",
               "Business Analyst", "Systems Analyst", "Platform Engineer", "Security Engineer", "Mobile Developer",
               "Web Developer", "Software Architect", "Staff Engineer", "Principal Engineer", "Design Lead"]

nontarget_jobs = ["High School Teacher", "Elementary School Teacher", "Nurse", "Retail Manager", "Sales Associate",
                  "Barista", "Accountant", "Financial Advisor", "Real Estate Agent", "Personal Trainer",
                  "Yoga Instructor", "Chef", "Marketing Manager", "HR Manager", "Customer Service Rep",
                  "Lawyer", "Dentist", "Pharmacist", "Construction Worker", "Electrician",
                  "Plumber", "Truck Driver", "Delivery Driver", "Warehouse Worker", "Librarian",
                  "Social Worker", "Journalist", "Photographer", "Event Planner", "Office Administrator"]

cities = ["Austin", "Seattle", "Portland", "Denver", "San Francisco", "Boston", "New York", "Los Angeles",
          "Chicago", "Miami", "Dallas", "Philadelphia", "San Diego", "Washington DC", "San Jose",
          "Phoenix", "Sacramento", "Indianapolis", "Columbus", "Detroit", "Charlotte", "Milwaukee",
          "Nashville", "Louisville", "Oklahoma City", "Raleigh", "Tampa", "Beverly Hills", "Madison",
          "Houston", "San Antonio", "Ann Arbor", "Atlanta", "Baltimore", "Orlando"]

competing_products_target = ["Text Sniper", "Google Cloud Vision API", "AWS Textract", "macOS OCR", "Snagit",
                             "ShareX", "Copyfish", "Online OCR tools", "Mobile OCR apps", "Screenshot to Text apps"]

def generate_ocean(segment_type, tier, innovation_adoption):
    """Generate OCEAN values following distribution rules"""
    if segment_type == "target":
        openness_options = [random.uniform(0.3, 0.5), random.uniform(0.5, 0.7), random.uniform(0.7, 0.95)]
        openness = random.choice(openness_options)
        conscientiousness = max(0.1, min(0.95, random.gauss(0.6, 0.2)))
        extraversion = random.uniform(0.2, 0.9)
        agreeableness_options = [random.uniform(0.3, 0.5), random.uniform(0.5, 0.7), random.uniform(0.7, 0.95)]
        agreeableness = random.choice(agreeableness_options)

        # Neuroticism inversely correlates with innovation adoption
        if innovation_adoption in ["innovator", "early_adopter"]:
            neuroticism = random.uniform(0.2, 0.45)
        elif innovation_adoption == "early_majority":
            neuroticism = random.uniform(0.35, 0.6)
        else:
            neuroticism = random.uniform(0.5, 0.75)
    else:
        # Nontarget: same statistical distribution
        openness_options = [random.uniform(0.3, 0.5), random.uniform(0.5, 0.7), random.uniform(0.7, 0.95)]
        openness = random.choice(openness_options)
        conscientiousness = max(0.1, min(0.95, random.gauss(0.6, 0.2)))
        extraversion = random.uniform(0.2, 0.9)
        agreeableness_options = [random.uniform(0.3, 0.5), random.uniform(0.5, 0.7), random.uniform(0.7, 0.95)]
        agreeableness = random.choice(agreeableness_options)
        neuroticism = random.uniform(0.3, 0.75)

    return {
        "openness": round(openness, 2),
        "conscientiousness": round(conscientiousness, 2),
        "extraversion": round(extraversion, 2),
        "agreeableness": round(agreeableness, 2),
        "neuroticism": round(neuroticism, 2)
    }

def assign_innovation_adoption(segment_type, index, total_in_segment):
    """Assign innovation adoption category following Rogers curve"""
    ratio = index / total_in_segment

    if segment_type == "target":
        # Target: Standard Rogers curve
        if ratio < 0.025:
            return "innovator"
        elif ratio < 0.16:
            return "early_adopter"
        elif ratio < 0.50:
            return "early_majority"
        elif ratio < 0.84:
            return "late_majority"
        else:
            return "laggard"
    else:
        # Nontarget: Conservative bias
        if ratio < 0.008:
            return "innovator"
        elif ratio < 0.048:
            return "early_adopter"
        elif ratio < 0.208:
            return "early_majority"
        elif ratio < 0.608:
            return "late_majority"
        else:
            return "laggard"

def generate_deep_persona(persona_id, segment_type, index, total_in_segment):
    """Generate Deep tier persona with rich background story"""
    innovation = assign_innovation_adoption(segment_type, index, total_in_segment)
    ocean = generate_ocean(segment_type, "deep", innovation)

    if segment_type == "target":
        name = f"{random.choice(target_first_names)} {random.choice(target_last_names)}"
        age = random.randint(25, 40)
        job = random.choice(target_jobs)
        income = random.randint(65000, 150000)
        tech_savviness = random.uniform(0.7, 0.95)
        price_sensitivity = random.uniform(0.3, 0.7)
        competing = random.sample(competing_products_target, min(2, len(competing_products_target)))

        # Background story grounded in raw_voices
        stories = [
            "Constantly screenshots error messages from production logs but has to manually retype them to search Stack Overflow.",
            "Takes screenshots of Figma designs with text but needs to copy the exact wording for implementation.",
            "Screenshots dashboard metrics for reports but manually retypes numbers into Excel, prone to errors.",
            "Frustrated by having to retype error codes from screenshots during debugging sessions.",
            "Needs to extract text from design mockup screenshots but current OCR tools require server uploads.",
            "Takes meeting screenshots with action items but has to manually copy text into task tracker.",
            "Screenshots competitor product features for analysis but manually extracts text for comparison docs.",
            "Captures console error screenshots but struggles to copy stack traces for bug reports.",
            "Takes screenshots of API responses for documentation but has to retype JSON payloads.",
            "Privacy-conscious user who avoids uploading screenshots to cloud OCR services.",
            "Screenshots Slack messages with code snippets but has to manually copy for testing.",
            "Captures terminal output screenshots but needs to extract commands for documentation.",
            "Takes screenshots of analytics dashboards but manually copies metrics into presentations.",
            "Screenshots code review comments but has to retype feedback into issue tracker.",
            "Frustrated by inaccessible text in screenshot-heavy documentation that can't be searched."
        ]
        background_story = random.choice(stories)

        risk_attitude = "aggressive" if innovation in ["innovator", "early_adopter"] else ("moderate" if innovation == "early_majority" else "conservative")

    else:
        name = f"{random.choice(nontarget_first_names)} {random.choice(nontarget_last_names)}"
        age = random.randint(18, 65)
        job = random.choice(nontarget_jobs)
        income = random.randint(28000, 85000)
        tech_savviness = random.uniform(0.2, 0.6)
        price_sensitivity = random.uniform(0.5, 0.9)
        competing = []

        # Nontarget background: no screenshot OCR pain points
        stories = [
            "Busy teacher focused on lesson planning, rarely uses screenshots.",
            "Retail worker dealing with inventory management, not tech-focused.",
            "Nurse prioritizing patient care, minimal tech tool adoption.",
            "Small business owner focused on operations, not interested in new apps.",
            "Prefers traditional methods, skeptical of new digital tools.",
            "Uses phone for social media only, not interested in productivity tools.",
            "Satisfied with current workflow, doesn't see need for new software.",
            "Rarely takes screenshots, mainly uses phone for calls and texts.",
            "Not comfortable with installing browser extensions or new apps.",
            "Focused on family and hobbies, minimal interest in tech products."
        ]
        background_story = random.choice(stories)
        risk_attitude = "conservative"

    return {
        "persona_id": persona_id,
        "tier": "deep",
        "segment_type": segment_type,
        "demographics": {
            "name": name,
            "age": age,
            "job": job,
            "income_usd": income,
            "location": f"{random.choice(cities)}, USA"
        },
        "behavioral": {
            "tech_savviness": round(tech_savviness, 2),
            "price_sensitivity": round(price_sensitivity, 2),
            "competing_products": competing,
            "competing_details": []
        },
        "psychographic": {
            "ocean": ocean,
            "risk_attitude": risk_attitude,
            "innovation_adoption": innovation
        },
        "background_story": background_story,
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

def generate_mid_persona(persona_id, segment_type, index, total_in_segment):
    """Generate Mid tier persona"""
    innovation = assign_innovation_adoption(segment_type, index, total_in_segment)
    ocean = generate_ocean(segment_type, "mid", innovation)

    if segment_type == "target":
        name = f"{random.choice(target_first_names)} {random.choice(target_last_names)}"
        age = random.randint(25, 40)
        job = random.choice(target_jobs)
        income = random.randint(60000, 140000)
        tech_savviness = random.uniform(0.65, 0.9)
        price_sensitivity = random.uniform(0.3, 0.75)
        competing = random.sample(competing_products_target, min(2, len(competing_products_target)))
        risk_attitude = "moderate" if innovation in ["early_majority", "late_majority"] else ("aggressive" if innovation in ["innovator", "early_adopter"] else "conservative")
    else:
        name = f"{random.choice(nontarget_first_names)} {random.choice(nontarget_last_names)}"
        age = random.randint(18, 65)
        job = random.choice(nontarget_jobs)
        income = random.randint(25000, 80000)
        tech_savviness = random.uniform(0.2, 0.55)
        price_sensitivity = random.uniform(0.6, 0.95)
        competing = []
        risk_attitude = "conservative"

    return {
        "persona_id": persona_id,
        "tier": "mid",
        "segment_type": segment_type,
        "demographics": {
            "name": name,
            "age": age,
            "job": job,
            "income_usd": income,
            "location": f"{random.choice(cities)}, USA"
        },
        "behavioral": {
            "tech_savviness": round(tech_savviness, 2),
            "price_sensitivity": round(price_sensitivity, 2),
            "competing_products": competing,
            "competing_details": []
        },
        "psychographic": {
            "ocean": ocean,
            "risk_attitude": risk_attitude,
            "innovation_adoption": innovation
        },
        "background_story": "",
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

def generate_lite_persona(persona_id, segment_type, index, total_in_segment):
    """Generate Lite tier persona (rule-based)"""
    innovation = assign_innovation_adoption(segment_type, index, total_in_segment)
    ocean = generate_ocean(segment_type, "lite", innovation)

    if segment_type == "target":
        name = f"{random.choice(target_first_names)} {random.choice(target_last_names)}"
        age = random.randint(25, 40)
        job = random.choice(target_jobs)
        income = random.randint(55000, 130000)
        tech_savviness = random.uniform(0.6, 0.85)
        price_sensitivity = random.uniform(0.35, 0.8)
        competing = random.sample(competing_products_target, min(1, len(competing_products_target)))
        risk_attitude = "moderate"
    else:
        name = f"{random.choice(nontarget_first_names)} {random.choice(nontarget_last_names)}"
        age = random.randint(18, 65)
        job = random.choice(nontarget_jobs)
        income = random.randint(22000, 75000)
        tech_savviness = random.uniform(0.15, 0.5)
        price_sensitivity = random.uniform(0.65, 0.95)
        competing = []
        risk_attitude = "conservative"

    return {
        "persona_id": persona_id,
        "tier": "lite",
        "segment_type": segment_type,
        "demographics": {
            "name": name,
            "age": age,
            "job": job,
            "income_usd": income,
            "location": f"{random.choice(cities)}, USA"
        },
        "behavioral": {
            "tech_savviness": round(tech_savviness, 2),
            "price_sensitivity": round(price_sensitivity, 2),
            "competing_products": competing,
            "competing_details": []
        },
        "psychographic": {
            "ocean": ocean,
            "risk_attitude": risk_attitude,
            "innovation_adoption": innovation
        },
        "background_story": "",
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

# Generate all 250 personas
personas = []
persona_counter = 1

# Target 125: Deep 25 + Mid 40 + Lite 60
print("Generating target personas...")
target_deep = 25
target_mid = 40
target_lite = 60
target_total = 125

for i in range(target_deep):
    personas.append(generate_deep_persona(f"p-{persona_counter:03d}", "target", i, target_total))
    persona_counter += 1

for i in range(target_mid):
    personas.append(generate_mid_persona(f"p-{persona_counter:03d}", "target", target_deep + i, target_total))
    persona_counter += 1

for i in range(target_lite):
    personas.append(generate_lite_persona(f"p-{persona_counter:03d}", "target", target_deep + target_mid + i, target_total))
    persona_counter += 1

# Nontarget 125: Deep 15 + Mid 40 + Lite 70
print("Generating nontarget personas...")
nontarget_deep = 15
nontarget_mid = 40
nontarget_lite = 70
nontarget_total = 125

for i in range(nontarget_deep):
    personas.append(generate_deep_persona(f"p-{persona_counter:03d}", "nontarget", i, nontarget_total))
    persona_counter += 1

for i in range(nontarget_mid):
    personas.append(generate_mid_persona(f"p-{persona_counter:03d}", "nontarget", nontarget_deep + i, nontarget_total))
    persona_counter += 1

for i in range(nontarget_lite):
    personas.append(generate_lite_persona(f"p-{persona_counter:03d}", "nontarget", nontarget_deep + nontarget_mid + i, nontarget_total))
    persona_counter += 1

# Assign network connections
print("Assigning network connections...")
for persona in personas:
    segment_peers = [p for p in personas if p["segment_type"] == persona["segment_type"] and p["persona_id"] != persona["persona_id"]]

    if persona["tier"] == "deep":
        network_size = random.randint(2, 3)
    elif persona["tier"] == "mid":
        network_size = 2
    else:
        network_size = 1

    if len(segment_peers) >= network_size:
        persona["network"] = [p["persona_id"] for p in random.sample(segment_peers, network_size)]

# Create final JSON structure
output = {
    "product_id": product_id,
    "persona_mode": "target_and_nontarget",
    "total_count": 250,
    "target_count": 125,
    "nontarget_count": 125,
    "market_phase": "innovators",
    "viral_coefficient": 0.0,
    "personas": personas,
    "chasm_phases": {
        "innovators": {
            "count": 250,
            "unlocked_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        },
        "early_adopters": {
            "count": 0,
            "unlocked_at": None
        },
        "early_majority": {
            "count": 0,
            "unlocked_at": None
        }
    },
    "updated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
}

# Write to file
output_path = "/Users/peter/lansik/omp/oh-my-pmf/state/personas/idea-20260329-121250.json"
with open(output_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n✓ Generated 250 personas:")
print(f"  - Target: {target_total} (Deep {target_deep}, Mid {target_mid}, Lite {target_lite})")
print(f"  - Nontarget: {nontarget_total} (Deep {nontarget_deep}, Mid {nontarget_mid}, Lite {nontarget_lite})")
print(f"  - Saved to: {output_path}")

# Verify innovation adoption distribution
target_personas = [p for p in personas if p["segment_type"] == "target"]
nontarget_personas = [p for p in personas if p["segment_type"] == "nontarget"]

print("\nTarget innovation distribution:")
for category in ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"]:
    count = len([p for p in target_personas if p["psychographic"]["innovation_adoption"] == category])
    print(f"  {category}: {count}")

print("\nNontarget innovation distribution:")
for category in ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"]:
    count = len([p for p in nontarget_personas if p["psychographic"]["innovation_adoption"] == category])
    print(f"  {category}: {count}")
