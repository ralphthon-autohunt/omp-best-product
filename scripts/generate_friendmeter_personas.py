#!/usr/bin/env python3
import json
import random
from datetime import datetime

# Load existing personas
with open('/Users/peter/lansik/omp/oh-my-pmf/state/personas/idea-cycle10-social-friendmeter.json', 'r') as f:
    data = json.load(f)

existing_personas = data['personas']
print(f"Loaded {len(existing_personas)} existing personas")

# Competitor products
competitors = [
    "Garden: Stay in Touch",
    "Linc - Friendship Tracker",
    "Catchup",
    "카카오톡/문자 수동 관리",
    "Personal CRM (Dex, Clay, Cloze)"
]

# Target persona jobs (20-40세, 바쁜 직장인)
target_jobs = [
    "Software Engineer", "Product Manager", "Marketing Manager", "Sales Executive",
    "Consultant", "Financial Analyst", "Designer", "Data Analyst", "Project Manager",
    "Account Manager", "HR Manager", "Operations Coordinator", "Business Developer",
    "Brand Manager", "Strategy Analyst", "Startup Founder", "Recruiter", "Copywriter",
    "UX Researcher", "Digital Marketer", "Investment Analyst", "Corporate Trainer"
]

# Nontarget jobs
nontarget_jobs = [
    "Retail Cashier", "Taxi Driver", "Chef", "Mechanic", "Hairstylist",
    "Construction Worker", "Security Guard", "Delivery Driver", "Farmer",
    "Factory Worker", "Electrician", "Plumber", "Carpenter", "Janitor",
    "Warehouse Worker", "Bus Driver", "Landscaper", "Welder", "Baker",
    "Barista", "Receptionist", "Librarian", "Postal Worker", "Cleaner",
    "Truck Driver", "Maintenance Worker", "Painter", "Tailor", "Fisherman"
]

cities = [
    "New York, USA", "London, UK", "Tokyo, Japan", "Seoul, South Korea",
    "Berlin, Germany", "Paris, France", "Toronto, Canada", "Sydney, Australia",
    "Singapore", "Hong Kong", "Amsterdam, Netherlands", "Barcelona, Spain",
    "Stockholm, Sweden", "Copenhagen, Denmark", "Zurich, Switzerland",
    "Dublin, Ireland", "Vienna, Austria", "Brussels, Belgium", "Oslo, Norway"
]

first_names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn",
               "Blake", "Cameron", "Dakota", "Harper", "Jesse", "Kendall", "Logan",
               "Mason", "Parker", "Reese", "Ryan", "Skyler", "Drew", "Finley"]

last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Martinez",
              "Davis", "Rodriguez", "Wilson", "Moore", "Taylor", "Anderson", "Thomas",
              "Jackson", "White", "Harris", "Martin", "Thompson", "Lee", "Walker"]

def generate_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def generate_target_mid_lite(start_id, count, tier):
    personas = []
    for i in range(count):
        persona_id = f"p-{start_id + i:03d}"
        age = random.randint(23, 40)

        persona = {
            "persona_id": persona_id,
            "tier": tier,
            "segment_type": "target",
            "demographics": {
                "name": generate_name(),
                "age": age,
                "job": random.choice(target_jobs),
                "income_usd": random.randint(45000, 150000),
                "location": random.choice(cities)
            },
            "behavioral": {
                "tech_savviness": round(random.uniform(0.6, 0.95), 2),
                "price_sensitivity": round(random.uniform(0.25, 0.75), 2),
                "competing_products": random.sample(competitors, min(random.randint(1, 2), len(competitors)))
            },
            "psychographic": {
                "ocean": {
                    "openness": round(random.uniform(0.55, 0.92), 2),
                    "conscientiousness": round(random.uniform(0.6, 0.9), 2),
                    "extraversion": round(random.uniform(0.3, 0.8), 2),
                    "agreeableness": round(random.uniform(0.55, 0.88), 2),
                    "neuroticism": round(random.uniform(0.35, 0.65), 2)
                },
                "risk_attitude": random.choice(["conservative", "moderate", "moderate", "aggressive"]),
                "innovation_adoption": random.choices(
                    ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"],
                    weights=[3, 13, 34, 34, 16]
                )[0]
            },
            "background_story": "",
            "network": [f"p-{random.randint(1, 125):03d}", f"p-{random.randint(1, 125):03d}"],
            "memory": [],
            "satisfaction_history": [],
            "churned": False,
            "churn_reason": None
        }
        personas.append(persona)
    return personas

def generate_nontarget_personas(start_id, count_deep, count_mid, count_lite):
    personas = []
    current_id = start_id

    # Deep nontarget (15)
    for i in range(count_deep):
        persona_id = f"p-{current_id:03d}"
        age = random.randint(18, 65)

        persona = {
            "persona_id": persona_id,
            "tier": "deep",
            "segment_type": "nontarget",
            "demographics": {
                "name": generate_name(),
                "age": age,
                "job": random.choice(nontarget_jobs),
                "income_usd": random.randint(25000, 75000),
                "location": random.choice(cities)
            },
            "behavioral": {
                "tech_savviness": round(random.uniform(0.25, 0.65), 2),
                "price_sensitivity": round(random.uniform(0.6, 0.95), 2),
                "competing_products": []
            },
            "psychographic": {
                "ocean": {
                    "openness": round(random.uniform(0.3, 0.75), 2),
                    "conscientiousness": round(random.uniform(0.45, 0.82), 2),
                    "extraversion": round(random.uniform(0.25, 0.75), 2),
                    "agreeableness": round(random.uniform(0.45, 0.82), 2),
                    "neuroticism": round(random.uniform(0.35, 0.7), 2)
                },
                "risk_attitude": random.choice(["conservative", "conservative", "conservative", "moderate"]),
                "innovation_adoption": random.choices(
                    ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"],
                    weights=[1, 4, 16, 40, 39]
                )[0]
            },
            "background_story": "Has no interest in productivity or relationship tracking apps. Not the target user.",
            "network": [f"p-{random.randint(126, 250):03d}"],
            "memory": [],
            "satisfaction_history": [],
            "churned": False,
            "churn_reason": None
        }
        personas.append(persona)
        current_id += 1

    # Mid nontarget (40)
    for i in range(count_mid):
        persona_id = f"p-{current_id:03d}"
        age = random.randint(18, 65)

        persona = {
            "persona_id": persona_id,
            "tier": "mid",
            "segment_type": "nontarget",
            "demographics": {
                "name": generate_name(),
                "age": age,
                "job": random.choice(nontarget_jobs),
                "income_usd": random.randint(25000, 70000),
                "location": random.choice(cities)
            },
            "behavioral": {
                "tech_savviness": round(random.uniform(0.2, 0.6), 2),
                "price_sensitivity": round(random.uniform(0.65, 0.95), 2),
                "competing_products": []
            },
            "psychographic": {
                "ocean": {
                    "openness": round(random.uniform(0.3, 0.7), 2),
                    "conscientiousness": round(random.uniform(0.4, 0.8), 2),
                    "extraversion": round(random.uniform(0.25, 0.75), 2),
                    "agreeableness": round(random.uniform(0.4, 0.8), 2),
                    "neuroticism": round(random.uniform(0.35, 0.7), 2)
                },
                "risk_attitude": random.choice(["conservative", "conservative", "moderate"]),
                "innovation_adoption": random.choices(
                    ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"],
                    weights=[1, 4, 16, 40, 39]
                )[0]
            },
            "background_story": "",
            "network": [f"p-{random.randint(126, 250):03d}"],
            "memory": [],
            "satisfaction_history": [],
            "churned": False,
            "churn_reason": None
        }
        personas.append(persona)
        current_id += 1

    # Lite nontarget (70)
    for i in range(count_lite):
        persona_id = f"p-{current_id:03d}"
        age = random.randint(18, 65)

        persona = {
            "persona_id": persona_id,
            "tier": "lite",
            "segment_type": "nontarget",
            "demographics": {
                "name": generate_name(),
                "age": age,
                "job": random.choice(nontarget_jobs),
                "income_usd": random.randint(20000, 65000),
                "location": random.choice(cities)
            },
            "behavioral": {
                "tech_savviness": round(random.uniform(0.15, 0.55), 2),
                "price_sensitivity": round(random.uniform(0.7, 0.98), 2),
                "competing_products": []
            },
            "psychographic": {
                "ocean": {
                    "openness": round(random.uniform(0.25, 0.65), 2),
                    "conscientiousness": round(random.uniform(0.35, 0.75), 2),
                    "extraversion": round(random.uniform(0.2, 0.7), 2),
                    "agreeableness": round(random.uniform(0.35, 0.75), 2),
                    "neuroticism": round(random.uniform(0.35, 0.7), 2)
                },
                "risk_attitude": "conservative",
                "innovation_adoption": random.choices(
                    ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"],
                    weights=[1, 4, 16, 40, 39]
                )[0]
            },
            "background_story": "",
            "network": [f"p-{random.randint(126, 250):03d}"],
            "memory": [],
            "satisfaction_history": [],
            "churned": False,
            "churn_reason": None
        }
        personas.append(persona)
        current_id += 1

    return personas

# Generate remaining target personas
# Already have: p-001 to p-030 (25 deep + 5 mid)
# Need: p-031 to p-125 = 95 more (0 deep, 35 mid, 60 lite)

print("Generating target mid personas (p-031 to p-065)...")
target_mid = generate_target_mid_lite(31, 35, "mid")

print("Generating target lite personas (p-066 to p-125)...")
target_lite = generate_target_mid_lite(66, 60, "lite")

# Generate nontarget personas (p-126 to p-250 = 125 total)
print("Generating nontarget personas (p-126 to p-250)...")
nontarget_all = generate_nontarget_personas(126, 15, 40, 70)

# Combine all personas
all_personas = existing_personas + target_mid + target_lite + nontarget_all

print(f"Total personas: {len(all_personas)}")
print(f"Target: {sum(1 for p in all_personas if p['segment_type'] == 'target')}")
print(f"Nontarget: {sum(1 for p in all_personas if p['segment_type'] == 'nontarget')}")

# Update data structure
data['personas'] = all_personas
data['updated_at'] = datetime.utcnow().isoformat() + 'Z'

# Save
with open('/Users/peter/lansik/omp/oh-my-pmf/state/personas/idea-cycle10-social-friendmeter.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Successfully generated 250 personas!")
print(f"Breakdown:")
print(f"  Target (125): Deep=25, Mid=40, Lite=60")
print(f"  Nontarget (125): Deep=15, Mid=40, Lite=70")
