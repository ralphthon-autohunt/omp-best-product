#!/usr/bin/env python3
"""
Persona Generator for oh-my-pmf v3
Generates 250 personas: 125 target + 125 non-target
"""
import json
import random
from datetime import datetime
from pathlib import Path

# Seed for reproducibility
random.seed(42)

# Product context
PRODUCT_ID = "idea-20260329-170000"
TARGET_SEGMENT = {
    "demographics": "자취/1-2인 가구, 20-40대, 식재료 낭비에 불편함을 느끼는 사람들",
    "needs": "냉장고 재고 파악, 유통기한 관리, 식재료 낭비 감소",
    "pain_points": "냉장고 뒤에서 썩은 음식 발견, 중복 구매, 유통기한 기억 못함"
}

# Name pools
FIRST_NAMES = ["Alex", "Jamie", "Taylor", "Morgan", "Jordan", "Casey", "Riley", "Avery",
               "Parker", "Quinn", "Skylar", "Rowan", "Sage", "River", "Dakota", "Phoenix",
               "Charlie", "Drew", "Harper", "Hayden", "Jessie", "Kendall", "Logan", "Reese",
               "Sam", "Sawyer", "Stevie", "Tatum", "Blake", "Cameron", "Dylan", "Ellis",
               "Emerson", "Finley", "Grey", "Indigo", "Justice", "Kit", "Lane", "Lennon",
               "Marley", "Nico", "Ocean", "Oakley", "Payton", "Peyton", "Raven", "Robin",
               "Rory", "Ryan", "Scout", "Shay", "Sidney", "Sloane", "Spencer", "Storm",
               "Eden", "Jade", "Jules", "Kai", "Lee", "Max", "Micah", "Pat", "Ray", "Sky"]

LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
              "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
              "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Walker", "Hall",
              "Allen", "Young", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
              "Flores", "Green", "Adams", "Nelson", "Baker", "Rivera", "Campbell", "Mitchell",
              "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
              "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
              "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey"]

# Target jobs (food waste concerned)
TARGET_JOBS = [
    "Software Engineer", "Marketing Manager", "Product Designer", "Data Analyst",
    "Freelance Writer", "UX Researcher", "Content Creator", "Graphic Designer",
    "Sales Representative", "HR Specialist", "Financial Analyst", "Consultant",
    "Teacher", "Nurse", "Pharmacist", "Physical Therapist", "Social Worker",
    "Event Planner", "Real Estate Agent", "Personal Trainer", "Yoga Instructor",
    "Barista", "Restaurant Server", "Chef", "Baker", "Photographer"
]

# Non-target jobs (diverse, not food-focused)
NONTARGET_JOBS = [
    "Construction Worker", "Electrician", "Plumber", "Mechanic", "Truck Driver",
    "Security Guard", "Warehouse Worker", "Factory Worker", "Janitor", "Landscaper",
    "Retired", "Student", "Unemployed", "Stay-at-home Parent", "Delivery Driver",
    "Taxi Driver", "Bus Driver", "Postal Worker", "Cashier", "Receptionist",
    "Bank Teller", "Insurance Agent", "Accountant", "Lawyer", "Doctor",
    "Dentist", "Veterinarian", "Pilot", "Flight Attendant", "Police Officer",
    "Firefighter", "Military Personnel", "Artist", "Musician", "Actor"
]

CITIES = [
    "Seoul, South Korea", "New York, USA", "London, UK", "Tokyo, Japan",
    "Singapore", "San Francisco, USA", "Berlin, Germany", "Toronto, Canada",
    "Sydney, Australia", "Paris, France", "Amsterdam, Netherlands", "Stockholm, Sweden",
    "Copenhagen, Denmark", "Helsinki, Finland", "Oslo, Norway", "Zurich, Switzerland",
    "Barcelona, Spain", "Milan, Italy", "Dublin, Ireland", "Vienna, Austria",
    "Melbourne, Australia", "Vancouver, Canada", "Seattle, USA", "Austin, USA",
    "Boston, USA", "Chicago, USA", "Los Angeles, USA", "Portland, USA"
]

# Target pain points
TARGET_PAIN_POINTS = [
    "Found rotten food in the back of fridge",
    "Bought duplicate items already at home",
    "Can't remember expiration dates",
    "Throwing away expired groceries weekly",
    "Forgot about fresh produce until it spoiled",
    "Wasted money on food that went bad",
    "Fridge is disorganized and chaotic",
    "Don't know what to cook with current ingredients"
]

# Non-target pain points (unrelated to food waste)
NONTARGET_PAIN_POINTS = [
    "Traffic commute takes too long",
    "Hard to find parking",
    "Need better sleep schedule",
    "Want to exercise more regularly",
    "Too many work meetings",
    "Social media takes too much time",
    "Need to save more money",
    "House cleaning takes forever",
    "Too many streaming subscriptions",
    "Want to learn a new language",
    "Need better work-life balance",
    "Dating apps are frustrating",
    "Laundry piles up too fast",
    "Can't find good shows to watch"
]

# Innovation adoption distributions
INNOVATION_TARGET = {
    "innovator": 3,
    "early_adopter": 16,
    "early_majority": 43,
    "late_majority": 43,
    "laggard": 20
}

INNOVATION_NONTARGET = {
    "innovator": 1,
    "early_adopter": 5,
    "early_majority": 20,
    "late_majority": 50,
    "laggard": 49
}

def generate_ocean_values():
    """Generate OCEAN personality values"""
    return {
        "openness": round(random.uniform(0.3, 0.9), 2),
        "conscientiousness": round(random.gauss(0.6, 0.2), 2),
        "extraversion": round(random.uniform(0.2, 0.9), 2),
        "agreeableness": round(random.uniform(0.3, 0.9), 2),
        "neuroticism": round(random.uniform(0.2, 0.7), 2)
    }

def generate_innovation_adoption(segment_type):
    """Generate innovation adoption category based on segment"""
    dist = INNOVATION_TARGET if segment_type == "target" else INNOVATION_NONTARGET
    pool = []
    for category, count in dist.items():
        pool.extend([category] * count)
    return random.choice(pool)

def generate_name(used_names):
    """Generate unique name"""
    max_attempts = 100
    for _ in range(max_attempts):
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        if name not in used_names:
            used_names.add(name)
            return name
    # Fallback
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} {random.randint(1, 999)}"

def generate_target_persona(persona_id, tier, used_names):
    """Generate a target segment persona"""
    age = random.randint(20, 40)

    # Income correlates with age and job
    base_income = 35000 + (age - 20) * 2000
    income = int(base_income + random.uniform(-10000, 15000))

    ocean = generate_ocean_values()
    innovation = generate_innovation_adoption("target")

    # Tech savviness correlates with innovation adoption
    tech_map = {"innovator": 0.9, "early_adopter": 0.8, "early_majority": 0.6,
                "late_majority": 0.4, "laggard": 0.2}
    tech_base = tech_map[innovation]
    tech_savviness = round(tech_base + random.uniform(-0.1, 0.1), 2)

    persona = {
        "persona_id": persona_id,
        "tier": tier,
        "segment_type": "target",
        "demographics": {
            "name": generate_name(used_names),
            "age": age,
            "job": random.choice(TARGET_JOBS),
            "income_usd": income,
            "location": random.choice(CITIES)
        },
        "behavioral": {
            "tech_savviness": max(0.1, min(0.95, tech_savviness)),
            "price_sensitivity": round(random.uniform(0.3, 0.8), 2),
            "competing_products": []
        },
        "psychographic": {
            "ocean": ocean,
            "risk_attitude": random.choice(["moderate", "moderate", "aggressive", "conservative"]),
            "innovation_adoption": innovation
        },
        "pain_points": random.sample(TARGET_PAIN_POINTS, k=random.randint(2, 4)),
        "background_story": "" if tier != "deep" else f"Lives alone/with partner, grocery shops {random.choice(['weekly', 'bi-weekly', '2-3 times per week'])}, concerned about food waste impact",
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

    return persona

def generate_nontarget_persona(persona_id, tier, used_names):
    """Generate a non-target segment persona (general public)"""
    age = random.randint(18, 65)

    # Wider income range
    income = int(random.uniform(25000, 120000))

    ocean = generate_ocean_values()
    innovation = generate_innovation_adoption("nontarget")

    # Lower tech savviness on average
    tech_map = {"innovator": 0.8, "early_adopter": 0.6, "early_majority": 0.5,
                "late_majority": 0.3, "laggard": 0.15}
    tech_base = tech_map[innovation]
    tech_savviness = round(tech_base + random.uniform(-0.15, 0.1), 2)

    persona = {
        "persona_id": persona_id,
        "tier": tier,
        "segment_type": "nontarget",
        "demographics": {
            "name": generate_name(used_names),
            "age": age,
            "job": random.choice(NONTARGET_JOBS),
            "income_usd": income,
            "location": random.choice(CITIES)
        },
        "behavioral": {
            "tech_savviness": max(0.05, min(0.9, tech_savviness)),
            "price_sensitivity": round(random.uniform(0.4, 0.95), 2),
            "competing_products": []
        },
        "psychographic": {
            "ocean": ocean,
            "risk_attitude": random.choice(["conservative", "conservative", "moderate", "aggressive"]),
            "innovation_adoption": innovation
        },
        "pain_points": random.sample(NONTARGET_PAIN_POINTS, k=random.randint(1, 3)),
        "background_story": "" if tier != "deep" else f"Age {age}, works as {NONTARGET_JOBS[random.randint(0, len(NONTARGET_JOBS)-1)]}, not concerned with food inventory management",
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

    return persona

def assign_networks(personas):
    """Assign network connections (2-3 connections per persona)"""
    persona_ids = [p["persona_id"] for p in personas]

    for persona in personas:
        # Same segment connections
        same_segment = [p["persona_id"] for p in personas
                       if p["segment_type"] == persona["segment_type"]
                       and p["persona_id"] != persona["persona_id"]]

        if len(same_segment) >= 2:
            network_size = random.randint(2, min(3, len(same_segment)))
            persona["network"] = random.sample(same_segment, network_size)

def validate_persona(persona):
    """QA filter for inconsistent personas"""
    # Check age-income inconsistency
    if persona["demographics"]["age"] < 22 and persona["demographics"]["income_usd"] > 80000:
        persona["demographics"]["income_usd"] = random.randint(25000, 50000)

    # Check laggard tech savviness
    if persona["psychographic"]["innovation_adoption"] == "laggard" and persona["behavioral"]["tech_savviness"] > 0.6:
        persona["behavioral"]["tech_savviness"] = round(random.uniform(0.1, 0.4), 2)

    # Clamp OCEAN values
    for key in persona["psychographic"]["ocean"]:
        val = persona["psychographic"]["ocean"][key]
        persona["psychographic"]["ocean"][key] = max(0.0, min(1.0, val))

    return persona

def generate_personas():
    """Main generation function"""
    personas = []
    used_names = set()
    persona_count = 0

    print("Generating 125 TARGET personas...")
    # Target: 25 deep, 40 mid, 60 lite
    for i in range(25):
        persona_id = f"p-{persona_count:03d}"
        persona = generate_target_persona(persona_id, "deep", used_names)
        personas.append(validate_persona(persona))
        persona_count += 1

    for i in range(40):
        persona_id = f"p-{persona_count:03d}"
        persona = generate_target_persona(persona_id, "mid", used_names)
        personas.append(validate_persona(persona))
        persona_count += 1

    for i in range(60):
        persona_id = f"p-{persona_count:03d}"
        persona = generate_target_persona(persona_id, "lite", used_names)
        personas.append(validate_persona(persona))
        persona_count += 1

    print("Generating 125 NON-TARGET personas...")
    # Non-target: 15 deep, 40 mid, 70 lite
    for i in range(15):
        persona_id = f"p-{persona_count:03d}"
        persona = generate_nontarget_persona(persona_id, "deep", used_names)
        personas.append(validate_persona(persona))
        persona_count += 1

    for i in range(40):
        persona_id = f"p-{persona_count:03d}"
        persona = generate_nontarget_persona(persona_id, "mid", used_names)
        personas.append(validate_persona(persona))
        persona_count += 1

    for i in range(70):
        persona_id = f"p-{persona_count:03d}"
        persona = generate_nontarget_persona(persona_id, "lite", used_names)
        personas.append(validate_persona(persona))
        persona_count += 1

    print("Assigning network connections...")
    assign_networks(personas)

    # Create output structure
    output = {
        "product_id": PRODUCT_ID,
        "persona_mode": "target_and_nontarget",
        "total_count": len(personas),
        "target_count": sum(1 for p in personas if p["segment_type"] == "target"),
        "nontarget_count": sum(1 for p in personas if p["segment_type"] == "nontarget"),
        "market_phase": "innovators",
        "viral_coefficient": 0.0,
        "personas": personas,
        "chasm_phases": {
            "innovators": {
                "count": len(personas),
                "unlocked_at": datetime.utcnow().isoformat() + "Z"
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
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }

    return output

def main():
    print(f"Generating 250 personas for {PRODUCT_ID}")
    print(f"Target segment: {TARGET_SEGMENT['demographics']}")
    print()

    output = generate_personas()

    # Save to file
    output_dir = Path("/Users/peter/lansik/omp/oh-my-pmf/state/personas")
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / f"{PRODUCT_ID}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Generated {output['total_count']} personas")
    print(f"  - Target: {output['target_count']}")
    print(f"  - Non-target: {output['nontarget_count']}")
    print(f"\n✓ Saved to: {output_path}")

    # Stats
    target_personas = [p for p in output['personas'] if p['segment_type'] == 'target']
    nontarget_personas = [p for p in output['personas'] if p['segment_type'] == 'nontarget']

    print("\n=== TARGET SEGMENT STATS ===")
    print(f"Deep: {sum(1 for p in target_personas if p['tier'] == 'deep')}")
    print(f"Mid: {sum(1 for p in target_personas if p['tier'] == 'mid')}")
    print(f"Lite: {sum(1 for p in target_personas if p['tier'] == 'lite')}")

    innovation_dist = {}
    for p in target_personas:
        cat = p['psychographic']['innovation_adoption']
        innovation_dist[cat] = innovation_dist.get(cat, 0) + 1
    print(f"Innovation adoption: {innovation_dist}")

    print("\n=== NON-TARGET SEGMENT STATS ===")
    print(f"Deep: {sum(1 for p in nontarget_personas if p['tier'] == 'deep')}")
    print(f"Mid: {sum(1 for p in nontarget_personas if p['tier'] == 'mid')}")
    print(f"Lite: {sum(1 for p in nontarget_personas if p['tier'] == 'lite')}")

    innovation_dist_nt = {}
    for p in nontarget_personas:
        cat = p['psychographic']['innovation_adoption']
        innovation_dist_nt[cat] = innovation_dist_nt.get(cat, 0) + 1
    print(f"Innovation adoption: {innovation_dist_nt}")

    print(f"\nPERSONA_DONE: {PRODUCT_ID}")

if __name__ == "__main__":
    main()
