#!/usr/bin/env python3
import json
import random
from datetime import datetime

# OCEAN distribution requirements
def get_ocean_distribution():
    """Generate OCEAN values following specification"""
    distributions = {
        'openness': [],
        'conscientiousness': [],
        'extraversion': [],
        'agreeableness': [],
        'neuroticism': []
    }

    # Openness: low 15%, mid 20%, high 15% (50 total for each segment)
    distributions['openness'].extend([random.uniform(0.1, 0.3) for _ in range(19)])
    distributions['openness'].extend([random.uniform(0.4, 0.6) for _ in range(25)])
    distributions['openness'].extend([random.uniform(0.7, 0.9) for _ in range(19)])

    # Conscientiousness: normal distribution mean=0.6, std=0.2
    distributions['conscientiousness'] = [max(0.1, min(0.9, random.gauss(0.6, 0.2))) for _ in range(63)]

    # Extraversion: uniform
    distributions['extraversion'] = [random.uniform(0.1, 0.9) for _ in range(63)]

    # Agreeableness: critical 15%, neutral 20%, agreeable 15%
    distributions['agreeableness'].extend([random.uniform(0.1, 0.3) for _ in range(19)])
    distributions['agreeableness'].extend([random.uniform(0.4, 0.6) for _ in range(25)])
    distributions['agreeableness'].extend([random.uniform(0.7, 0.9) for _ in range(19)])

    # Neuroticism: lower = higher innovation adoption (inverse correlation)
    distributions['neuroticism'] = [random.uniform(0.1, 0.9) for _ in range(63)]

    # Shuffle each
    for key in distributions:
        random.shuffle(distributions[key])

    return distributions

# Innovation adoption distribution (Rogers Curve)
def get_innovation_adoptions(count):
    adoptions = []
    adoptions.extend(['innovator'] * max(2, int(count * 0.025)))
    adoptions.extend(['early_adopter'] * max(6, int(count * 0.13)))
    adoptions.extend(['early_majority'] * int(count * 0.34))
    adoptions.extend(['late_majority'] * int(count * 0.34))
    adoptions.extend(['laggard'] * int(count * 0.16))

    # Adjust to exact count
    while len(adoptions) < count:
        adoptions.append('early_majority')
    while len(adoptions) > count:
        adoptions.pop()

    random.shuffle(adoptions)
    return adoptions

# Name pools
target_names = [
    "Marcus Chen", "Sarah Williams", "David Kumar", "Emily Rodriguez", "Jason Park",
    "Amanda Foster", "Michael Tanaka", "Lisa Martinez", "Brian O'Connor", "Rachel Kim",
    "Kevin Zhang", "Jessica Brown", "Tom Anderson", "Priya Patel", "Chris Johnson",
    "Nicole Lee", "Ryan Murphy", "Maya Singh", "Alex Thompson", "Sophie Chen",
    "Daniel Kim", "Lauren White", "Eric Wang", "Olivia Garcia", "Nathan Liu",
    "Emma Davis", "Brandon Nguyen", "Chloe Martinez", "Justin Lee", "Megan Park",
    "Tyler Wilson", "Ava Johnson", "Jordan Smith", "Hannah Chang", "Kyle Rodriguez",
    "Isabella Taylor", "Derek Chen", "Samantha Miller", "Andrew Kim", "Grace Lee",
    "Matthew Jones", "Victoria Zhang", "Jake Williams", "Sophia Anderson", "Lucas Brown",
    "Madison Garcia", "Ethan Kumar", "Abigail Patel", "Ryan Lee", "Elizabeth Chen",
    "Connor Davis", "Natalie Wang", "Aaron Martinez", "Julia Kim", "Dylan Thompson",
    "Emma Wilson", "Mason Rodriguez", "Lily Singh", "Logan White", "Zoe Park",
    "Noah Miller", "Ella Johnson", "Blake Taylor", "Aria Lee", "Hunter Garcia"
]

nontarget_names = [
    "Robert Johnson", "Mary Thompson", "William Davis", "Patricia Martinez", "James Wilson",
    "Jennifer Anderson", "John Garcia", "Linda Taylor", "Michael Moore", "Barbara Jackson",
    "David White", "Susan Harris", "Richard Martin", "Jessica Thompson", "Joseph Lee",
    "Sarah Walker", "Thomas Hall", "Karen Allen", "Charles Young", "Nancy King",
    "Christopher Wright", "Lisa Lopez", "Daniel Hill", "Betty Scott", "Matthew Green",
    "Margaret Adams", "Anthony Baker", "Sandra Nelson", "Donald Carter", "Ashley Mitchell",
    "Mark Roberts", "Kimberly Turner", "Steven Phillips", "Emily Campbell", "Paul Parker",
    "Donna Evans", "Joshua Edwards", "Michelle Collins", "Kenneth Stewart", "Carol Sanchez",
    "Kevin Morris", "Amanda Rogers", "Brian Reed", "Melissa Cook", "George Bailey",
    "Deborah Rivera", "Edward Cooper", "Stephanie Richardson", "Ronald Cox", "Rebecca Howard",
    "Timothy Ward", "Laura Torres", "Jason Peterson", "Sharon Gray", "Jeffrey Ramirez",
    "Cynthia James", "Ryan Watson", "Kathleen Brooks", "Jacob Kelly", "Amy Sanders",
    "Gary Price", "Angela Bennett", "Nicholas Wood", "Shirley Barnes", "Eric Ross"
]

target_jobs = [
    "Software Engineer", "Product Manager", "Data Scientist", "Marketing Manager", "Sales Director",
    "Financial Analyst", "Product Designer", "Startup Founder", "Investment Banker", "Consultant",
    "UX Researcher", "Business Analyst", "Account Executive", "Project Manager", "Research Scientist",
    "Engineering Manager", "Growth Marketer", "Strategy Consultant", "Quantitative Analyst", "DevOps Engineer"
]

nontarget_jobs = [
    "Teacher", "Nurse", "Retail Manager", "Accountant", "Electrician",
    "Administrative Assistant", "Customer Service Rep", "Graphic Designer", "Social Worker", "Chef",
    "Mechanic", "Real Estate Agent", "Photographer", "Writer", "Plumber",
    "Pharmacist", "Librarian", "Fitness Trainer", "Hairdresser", "Carpenter",
    "Veterinarian", "Police Officer", "Firefighter", "Construction Worker", "Bartender",
    "Cashier", "Warehouse Worker", "Truck Driver", "Security Guard", "Janitor"
]

locations = [
    "New York, USA", "San Francisco, USA", "Los Angeles, USA", "Chicago, USA", "Austin, USA",
    "Seattle, USA", "Boston, USA", "Denver, USA", "Miami, USA", "Portland, USA",
    "San Diego, USA", "Atlanta, USA", "Phoenix, USA", "Dallas, USA", "Houston, USA",
    "Toronto, Canada", "Vancouver, Canada", "London, UK", "Berlin, Germany", "Paris, France",
    "Singapore", "Tokyo, Japan", "Seoul, South Korea", "Sydney, Australia", "Melbourne, Australia"
]

portfolio_types_options = [
    ["stocks", "ETF"],
    ["stocks", "crypto"],
    ["stocks", "ETF", "crypto"],
    ["stocks", "options"],
    ["stocks"],
    ["crypto"],
    ["ETF"]
]

def generate_target_persona(persona_id, tier, ocean_vals, innovation_adoption):
    age = random.randint(25, 45)
    name = random.choice(target_names)

    base = {
        "persona_id": f"p-{persona_id:03d}",
        "tier": tier,
        "segment": "target",
        "demographics": {
            "name": name,
            "age": age,
            "job": random.choice(target_jobs),
            "income_usd": random.randint(60000, 200000),
            "location": random.choice(locations)
        },
        "behavioral": {
            "tech_savviness": round(random.uniform(0.5, 0.95), 2),
            "price_sensitivity": round(random.uniform(0.2, 0.7), 2),
            "competing_products": [],
            "investment_behavior": {
                "portfolio_types": random.choice(portfolio_types_options),
                "portfolio_size_usd": random.randint(10000, 500000),
                "trading_frequency": random.choice(["daily", "weekly", "bi-weekly", "monthly", "quarterly"]),
                "emotional_trading": random.choice([True, True, False])
            }
        },
        "psychographic": {
            "ocean": {
                "openness": round(ocean_vals['openness'], 2),
                "conscientiousness": round(ocean_vals['conscientiousness'], 2),
                "extraversion": round(ocean_vals['extraversion'], 2),
                "agreeableness": round(ocean_vals['agreeableness'], 2),
                "neuroticism": round(ocean_vals['neuroticism'], 2)
            },
            "risk_attitude": random.choice(["conservative", "moderate", "aggressive"]),
            "innovation_adoption": innovation_adoption
        },
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

    if tier == "deep":
        stories = [
            "Panic-sold during market crash, now tracking emotional patterns",
            "Lost money on emotional trades, seeking self-awareness",
            "Notices anxiety when checking portfolio, wants data proof",
            "Curious if mood affects trading performance",
            "Wants to reduce stress-driven investment decisions",
            "Suspects work stress influences portfolio behavior",
            "Data-driven at work but impulsive in investing"
        ]
        base["background_story"] = random.choice(stories)

    return base

def generate_nontarget_persona(persona_id, tier, ocean_vals, innovation_adoption):
    age = random.randint(18, 75)
    name = random.choice(nontarget_names)

    base = {
        "persona_id": f"p-{persona_id:03d}",
        "tier": tier,
        "segment": "non-target",
        "demographics": {
            "name": name,
            "age": age,
            "job": random.choice(nontarget_jobs),
            "income_usd": random.randint(25000, 90000),
            "location": random.choice(locations)
        },
        "behavioral": {
            "tech_savviness": round(random.uniform(0.2, 0.8), 2),
            "price_sensitivity": round(random.uniform(0.5, 0.9), 2),
            "competing_products": [],
            "investment_behavior": {
                "portfolio_types": [],
                "portfolio_size_usd": 0,
                "trading_frequency": "never",
                "emotional_trading": False
            }
        },
        "psychographic": {
            "ocean": {
                "openness": round(ocean_vals['openness'], 2),
                "conscientiousness": round(ocean_vals['conscientiousness'], 2),
                "extraversion": round(ocean_vals['extraversion'], 2),
                "agreeableness": round(ocean_vals['agreeableness'], 2),
                "neuroticism": round(ocean_vals['neuroticism'], 2)
            },
            "risk_attitude": random.choice(["conservative", "moderate"]),
            "innovation_adoption": innovation_adoption
        },
        "network": [],
        "memory": [],
        "satisfaction_history": [],
        "churned": False,
        "churn_reason": None
    }

    if tier == "deep":
        stories = [
            "Doesn't invest, focuses on savings",
            "Prefers traditional banking",
            "No interest in stock market",
            "Happy with 401k, doesn't actively trade",
            "Thinks investing is too risky"
        ]
        base["background_story"] = random.choice(stories)

    return base

def assign_networks(personas):
    """Assign network connections"""
    for i, persona in enumerate(personas):
        # Deep: 2-3 connections, Mid: 2, Lite: 1
        if persona['tier'] == 'deep':
            count = random.randint(2, 3)
        elif persona['tier'] == 'mid':
            count = 2
        else:
            count = 1

        # Connect to same segment
        same_segment = [p for p in personas if p['segment'] == persona['segment'] and p['persona_id'] != persona['persona_id']]
        if len(same_segment) >= count:
            connections = random.sample(same_segment, count)
            persona['network'] = [c['persona_id'] for c in connections]

def main():
    personas = []

    # TARGET PERSONAS (125)
    target_ocean = get_ocean_distribution()
    target_innovations = get_innovation_adoptions(125)

    persona_id = 1

    # Deep target: 10
    for i in range(10):
        ocean_vals = {k: target_ocean[k][i] for k in target_ocean}
        p = generate_target_persona(persona_id, "deep", ocean_vals, target_innovations[i])
        personas.append(p)
        persona_id += 1

    # Mid target: 40
    for i in range(10, 50):
        ocean_vals = {k: target_ocean[k][i] for k in target_ocean}
        p = generate_target_persona(persona_id, "mid", ocean_vals, target_innovations[i])
        personas.append(p)
        persona_id += 1

    # Lite target: 75
    for i in range(50, 125):
        ocean_vals = {k: target_ocean[k][i % len(target_ocean['openness'])] for k in target_ocean}
        p = generate_target_persona(persona_id, "lite", ocean_vals, target_innovations[i])
        personas.append(p)
        persona_id += 1

    # NON-TARGET PERSONAS (125)
    nontarget_ocean = get_ocean_distribution()
    nontarget_innovations = get_innovation_adoptions(125)

    # Deep non-target: 10
    for i in range(10):
        ocean_vals = {k: nontarget_ocean[k][i] for k in nontarget_ocean}
        p = generate_nontarget_persona(persona_id, "deep", ocean_vals, nontarget_innovations[i])
        personas.append(p)
        persona_id += 1

    # Mid non-target: 40
    for i in range(10, 50):
        ocean_vals = {k: nontarget_ocean[k][i] for k in nontarget_ocean}
        p = generate_nontarget_persona(persona_id, "mid", ocean_vals, nontarget_innovations[i])
        personas.append(p)
        persona_id += 1

    # Lite non-target: 75
    for i in range(50, 125):
        ocean_vals = {k: nontarget_ocean[k][i % len(nontarget_ocean['openness'])] for k in nontarget_ocean}
        p = generate_nontarget_persona(persona_id, "lite", ocean_vals, nontarget_innovations[i])
        personas.append(p)
        persona_id += 1

    # Assign networks
    assign_networks(personas)

    # Create final structure
    output = {
        "product_id": "idea-20260329-cycle12",
        "market_phase": "innovators",
        "viral_coefficient": 0.0,
        "personas": personas,
        "chasm_phases": {
            "innovators": {
                "count": 250,
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

    # Save
    with open('/Users/peter/lansik/omp/oh-my-pmf/state/personas/idea-20260329-cycle12.json', 'w') as f:
        json.dump(output, f, indent=2)

    print(f"Generated {len(personas)} personas")
    print(f"Target: {sum(1 for p in personas if p['segment'] == 'target')}")
    print(f"Non-target: {sum(1 for p in personas if p['segment'] == 'non-target')}")
    print(f"Deep: {sum(1 for p in personas if p['tier'] == 'deep')}")
    print(f"Mid: {sum(1 for p in personas if p['tier'] == 'mid')}")
    print(f"Lite: {sum(1 for p in personas if p['tier'] == 'lite')}")

if __name__ == '__main__':
    main()
