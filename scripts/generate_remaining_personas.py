#!/usr/bin/env python3
import json
import random
from datetime import datetime

# Set seed for reproducibility
random.seed(20260329143000)

def generate_ocean_target():
    """Generate OCEAN values following target distribution"""
    return {
        "openness": round(random.uniform(0.55, 0.95), 2),
        "conscientiousness": round(max(0.1, min(0.95, random.gauss(0.6, 0.2))), 2),
        "extraversion": round(random.uniform(0.3, 0.8), 2),
        "agreeableness": round(random.uniform(0.45, 0.75), 2),
        "neuroticism": round(random.uniform(0.25, 0.55), 2)
    }

def generate_ocean_nontarget():
    """Generate OCEAN values for non-target (general population)"""
    return {
        "openness": round(random.uniform(0.3, 0.8), 2),
        "conscientiousness": round(max(0.1, min(0.95, random.gauss(0.5, 0.25))), 2),
        "extraversion": round(random.uniform(0.2, 0.85), 2),
        "agreeableness": round(random.uniform(0.35, 0.80), 2),
        "neuroticism": round(random.uniform(0.2, 0.7), 2)
    }

# Target jobs (knowledge workers experiencing multitasking burnout)
target_jobs = [
    "Product Manager", "Freelance Designer", "PhD Candidate", "Software Engineering Manager",
    "Content Strategist", "UX Researcher", "Marketing Analyst", "Startup Founder",
    "Freelance Writer", "Operations Manager", "Data Analyst", "Product Designer",
    "Social Media Manager", "Strategy Consultant", "Graduate Student", "Software Engineer",
    "Event Coordinator", "Growth Marketer", "HR Specialist", "DevOps Engineer",
    "Customer Success Manager", "Business Analyst", "Project Manager", "Financial Analyst",
    "Junior Developer", "Sales Engineer", "Content Creator", "Technical Writer",
    "UX Designer", "Account Manager", "Backend Developer", "Marketing Manager",
    "Product Owner", "Research Assistant", "Risk Analyst", "QA Engineer",
    "Solutions Architect", "Brand Designer", "Documentation Lead", "UI Designer",
    "Sales Director", "ML Engineer", "Digital Marketing Specialist", "Scrum Master",
    "Postdoc Researcher", "Compliance Officer", "Test Automation Engineer"
]

# Non-target jobs (general population, NOT knowledge workers with multitasking issues)
nontarget_jobs = [
    "Retail Manager", "Elementary Teacher", "Nurse", "Mechanic", "Chef",
    "Police Officer", "Electrician", "Real Estate Agent", "Pharmacist", "Dentist",
    "Construction Foreman", "Flight Attendant", "Physical Therapist", "Veterinarian",
    "Truck Driver", "Hairdresser", "Firefighter", "Accountant", "Librarian",
    "Social Worker", "Plumber", "Fitness Trainer", "Photographer", "Graphic Designer",
    "Barista", "Bank Teller", "Insurance Agent", "Paramedic", "Journalist",
    "Customer Service Rep", "Web Developer", "Video Editor", "Translator",
    "Museum Curator", "Travel Agent", "Nutritionist", "Lab Technician",
    "Civil Engineer", "Architect", "Interior Designer", "Music Teacher",
    "Marketing Coordinator", "Fashion Buyer", "Restaurant Manager", "Sound Engineer",
    "Copywriter", "Art Director", "Pilot", "Marine Biologist"
]

target_locations = [
    "San Francisco, USA", "Austin, USA", "Cambridge, UK", "Seattle, USA", "London, UK",
    "Toronto, Canada", "Singapore", "Dublin, Ireland", "Mumbai, India", "Melbourne, Australia",
    "Barcelona, Spain", "Seoul, South Korea", "Berlin, Germany", "New York, USA", "Boston, USA",
    "Mexico City, Mexico", "Los Angeles, USA", "Ho Chi Minh City, Vietnam", "Vancouver, Canada",
    "Copenhagen, Denmark", "Dubai, UAE", "São Paulo, Brazil", "Auckland, New Zealand", "Cairo, Egypt",
    "Paris, France", "Chicago, USA", "Bangalore, India", "Portland, USA", "Lisbon, Portugal",
    "Atlanta, USA", "San Jose, USA", "Montreal, Canada", "Oxford, UK", "Stockholm, Sweden",
    "Taipei, Taiwan", "Tokyo, Japan", "Washington DC, USA", "Milan, Italy", "Dallas, USA",
    "Oslo, Norway", "Madrid, Spain", "Lagos, Nigeria", "Zurich, Switzerland", "Edinburgh, UK",
    "Shanghai, China", "Amsterdam, Netherlands", "Osaka, Japan", "Helsinki, Finland"
]

nontarget_locations = [
    "Detroit, USA", "Birmingham, UK", "Lyon, France", "Cologne, Germany", "Phoenix, USA",
    "Nashville, USA", "Liverpool, UK", "Valencia, Spain", "Krakow, Poland", "Prague, Czech Republic",
    "Budapest, Hungary", "Athens, Greece", "Porto, Portugal", "Brisbane, Australia", "Cape Town, South Africa",
    "Istanbul, Turkey", "Bangkok, Thailand", "Manila, Philippines", "Jakarta, Indonesia", "Kuala Lumpur, Malaysia",
    "Hanoi, Vietnam", "Mexico City, Mexico", "Guadalajara, Mexico",
    "Bogota, Colombia", "Buenos Aires, Argentina", "Santiago, Chile", "Lima, Peru", "Nairobi, Kenya",
    "Johannesburg, South Africa", "Tel Aviv, Israel", "Riyadh, Saudi Arabia", "Warsaw, Poland"
]

innovation_adoption_target = (["innovator"] * 3 + ["early_adopter"] * 8 +
                              ["early_majority"] * 21 + ["late_majority"] * 21 + ["laggard"] * 10)
innovation_adoption_nontarget = (["innovator"] * 1 + ["early_adopter"] * 5 +
                                 ["early_majority"] * 20 + ["late_majority"] * 50 + ["laggard"] * 49)

random.shuffle(innovation_adoption_target)
random.shuffle(innovation_adoption_nontarget)

# Extend to 125 each
while len(innovation_adoption_target) < 125:
    innovation_adoption_target.append(random.choice(["early_majority", "late_majority"]))
while len(innovation_adoption_nontarget) < 125:
    innovation_adoption_nontarget.append(random.choice(["late_majority", "laggard"]))

personas = []
persona_id = 77  # Continue from p-076

# Generate remaining 49 Lite target personas (to reach 125 total target)
for i in range(49):
    age = random.randint(25, 45)
    job = random.choice(target_jobs)

    persona = {
        "persona_id": f"p-{persona_id:03d}",
        "tier": "lite",
        "segment_type": "target",
        "demographics": {
            "name": f"Target Person {persona_id}",
            "age": age,
            "job": job,
            "income_usd": random.randint(45000, 150000),
            "location": random.choice(target_locations)
        },
        "behavioral": {
            "tech_savviness": round(random.uniform(0.65, 0.92), 2),
            "price_sensitivity": round(random.uniform(0.25, 0.75), 2),
            "competing_products": [],
            "competing_details": []
        },
        "psychographic": {
            "ocean": generate_ocean_target(),
            "risk_attitude": random.choice(["conservative", "moderate", "moderate", "aggressive"]),
            "innovation_adoption": innovation_adoption_target[i] if i < len(innovation_adoption_target) else "early_majority"
        },
        "background_story": "",
        "network": [f"p-{random.randint(1, 65):03d}"],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }
    personas.append(persona)
    persona_id += 1

# Generate 15 Deep non-target personas
for i in range(15):
    age = random.randint(18, 65)
    job = random.choice(nontarget_jobs)

    persona = {
        "persona_id": f"p-{persona_id:03d}",
        "tier": "deep",
        "segment_type": "nontarget",
        "demographics": {
            "name": f"NonTarget Deep {persona_id}",
            "age": age,
            "job": job,
            "income_usd": random.randint(25000, 120000),
            "location": random.choice(nontarget_locations)
        },
        "behavioral": {
            "tech_savviness": round(random.uniform(0.3, 0.75), 2),
            "price_sensitivity": round(random.uniform(0.4, 0.85), 2),
            "competing_products": [],
            "competing_details": []
        },
        "psychographic": {
            "ocean": generate_ocean_nontarget(),
            "risk_attitude": random.choice(["conservative", "conservative", "moderate"]),
            "innovation_adoption": innovation_adoption_nontarget[i] if i < len(innovation_adoption_nontarget) else "late_majority"
        },
        "background_story": f"Works in {job.lower()}. Has no interest in productivity apps or focus tools. Different daily challenges unrelated to context-switching or digital overload.",
        "network": [f"p-{random.randint(126, 200):03d}", f"p-{random.randint(126, 200):03d}"],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }
    personas.append(persona)
    persona_id += 1

# Generate 40 Mid non-target personas
for i in range(40):
    age = random.randint(18, 65)
    job = random.choice(nontarget_jobs)

    persona = {
        "persona_id": f"p-{persona_id:03d}",
        "tier": "mid",
        "segment_type": "nontarget",
        "demographics": {
            "name": f"NonTarget Mid {persona_id}",
            "age": age,
            "job": job,
            "income_usd": random.randint(25000, 100000),
            "location": random.choice(nontarget_locations)
        },
        "behavioral": {
            "tech_savviness": round(random.uniform(0.25, 0.70), 2),
            "price_sensitivity": round(random.uniform(0.45, 0.90), 2),
            "competing_products": [],
            "competing_details": []
        },
        "psychographic": {
            "ocean": generate_ocean_nontarget(),
            "risk_attitude": random.choice(["conservative", "conservative", "moderate"]),
            "innovation_adoption": innovation_adoption_nontarget[15 + i] if (15 + i) < len(innovation_adoption_nontarget) else "late_majority"
        },
        "background_story": "",
        "network": [f"p-{random.randint(126, 200):03d}", f"p-{random.randint(126, 200):03d}"],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }
    personas.append(persona)
    persona_id += 1

# Generate 70 Lite non-target personas
for i in range(70):
    age = random.randint(18, 65)
    job = random.choice(nontarget_jobs)

    persona = {
        "persona_id": f"p-{persona_id:03d}",
        "tier": "lite",
        "segment_type": "nontarget",
        "demographics": {
            "name": f"NonTarget Lite {persona_id}",
            "age": age,
            "job": job,
            "income_usd": random.randint(20000, 95000),
            "location": random.choice(nontarget_locations)
        },
        "behavioral": {
            "tech_savviness": round(random.uniform(0.2, 0.65), 2),
            "price_sensitivity": round(random.uniform(0.5, 0.95), 2),
            "competing_products": [],
            "competing_details": []
        },
        "psychographic": {
            "ocean": generate_ocean_nontarget(),
            "risk_attitude": random.choice(["conservative", "conservative", "conservative", "moderate"]),
            "innovation_adoption": innovation_adoption_nontarget[55 + i] if (55 + i) < len(innovation_adoption_nontarget) else "laggard"
        },
        "background_story": "",
        "network": [f"p-{random.randint(126, 230):03d}"],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }
    personas.append(persona)
    persona_id += 1

# Output as JSON
print(json.dumps(personas, indent=2))
