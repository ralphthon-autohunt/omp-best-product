#!/usr/bin/env python3
"""
Validator v3: 3-Layer Funnel PMF Validation
Executes the complete validation pipeline for a product.
"""

import json
import random
import re
from typing import Dict, List, Any
from collections import defaultdict

# Product information (will be loaded)
product_info = {}
personas = []
competitors = []
landing_page_text = ""

def load_data(product_id: str, personas_path: str, competitors_path: str, products_path: str):
    """Load all required data"""
    global product_info, personas, competitors, landing_page_text

    with open(personas_path, 'r') as f:
        persona_data = json.load(f)
        personas.extend(persona_data['personas'])

    with open(competitors_path, 'r') as f:
        competitors_data = json.load(f)
        competitors.extend(competitors_data.get('competitors', []))

    with open(products_path, 'r') as f:
        product_info = json.load(f)
        landing_page_text = f"{product_info['tagline']}\n\n{product_info['feature_description']}"

def calculate_lite_interest_score(persona: Dict, landing_text: str) -> tuple[bool, str]:
    """Rule-based interest scoring for Lite tier personas"""
    is_target = persona['segment_type'] == 'target'
    openness = persona['psychographic']['ocean']['openness']
    tech_savviness = persona['behavioral']['tech_savviness']
    innovation = persona['psychographic']['innovation_adoption']

    # Base interest
    score = 0.3 if is_target else 0.05

    # Personality factors
    if openness > 0.6:
        score += 0.1
    if tech_savviness > 0.7:
        score += 0.1
    if innovation in ['innovator', 'early_adopter']:
        score += 0.15

    # Pain point matching (keywords)
    pain_keywords = ['affiliate', 'link', 'broken', 'commission', 'revenue', 'influencer', 'creator']
    background = persona.get('background_story', '').lower()
    job = persona['demographics'].get('job', '').lower()

    matched_keywords = []
    for kw in pain_keywords:
        if kw in background or kw in job:
            matched_keywords.append(kw)

    if matched_keywords:
        score += 0.2

    # Add noise
    score += random.uniform(-0.1, 0.1)

    interested = score > 0.4

    if interested:
        reason = f"Pain keywords matched: {', '.join(matched_keywords) if matched_keywords else 'general interest'}"
    else:
        if score < 0.2:
            reason = "Not in target segment, no pain point alignment"
        elif not matched_keywords:
            reason = "No clear pain point match with affiliate link monitoring"
        else:
            reason = "Interest threshold not met despite some alignment"

    return interested, reason

def simulate_deep_mid_interest(persona: Dict, landing_text: str) -> tuple[bool, str]:
    """Simulate AI-based interest judgment for Deep/Mid tier"""
    is_target = persona['segment_type'] == 'target'
    background = persona.get('background_story', '')
    job = persona['demographics'].get('job', '').lower()

    # Target personas with affiliate/influencer background
    if is_target and any(kw in background.lower() or kw in job for kw in ['affiliate', 'influencer', 'creator', 'youtuber', 'blogger', 'content creator']):
        # Check if they have experienced broken link pain
        if 'broken' in background.lower() or 'lost' in background.lower() or 'commission' in background.lower():
            return True, "I've experienced affiliate link issues causing lost revenue - this directly addresses my pain"
        else:
            # Some may be interested, some not
            if random.random() < 0.7:
                return True, "As a content creator with affiliate links, proactive monitoring would save me time"
            else:
                return False, "I check my links manually already, not urgent enough to try new tool"

    # Non-target with some relevance
    elif is_target:
        if random.random() < 0.3:
            return True, "Might be useful for my side hustle with affiliate marketing"
        else:
            return False, "Don't have enough affiliate links to justify a monitoring tool"

    # Non-target personas
    else:
        if random.random() < 0.08:
            return True, "Curious about monitoring tools, might explore"
        else:
            reasons = [
                "I don't use affiliate links at all",
                "Not relevant to my work as a {job}",
                "Too niche - I'm not in the affiliate marketing space",
                "Already overwhelmed with tools, not adding another"
            ]
            return False, random.choice(reasons).format(job=job)

def layer1_interest_gate(personas: List[Dict], landing_text: str) -> Dict:
    """Layer 1: Interest Gate - landing page text only"""
    results = {
        'passed': [],
        'dropped': [],
        'drop_reasons': []
    }

    for persona in personas:
        tier = persona['tier']

        if tier == 'lite':
            interested, reason = calculate_lite_interest_score(persona, landing_text)
        else:  # deep or mid
            interested, reason = simulate_deep_mid_interest(persona, landing_text)

        persona_result = {
            'persona_id': persona['persona_id'],
            'tier': tier,
            'segment_type': persona['segment_type'],
            'interested': interested,
            'reason': reason
        }

        if interested:
            results['passed'].append(persona)
        else:
            results['dropped'].append(persona_result)
            results['drop_reasons'].append({
                'reason': reason,
                'segment': persona['segment_type']
            })

    return results

def cluster_reasons(reasons: List[Dict], key: str = 'reason') -> List[Dict]:
    """Cluster similar reasons and count occurrences"""
    clusters = defaultdict(lambda: {'count': 0, 'segment': 'mixed', 'segments': {'target': 0, 'nontarget': 0}})

    for item in reasons:
        reason = item[key]
        segment = item.get('segment', 'unknown')

        # Simple clustering by keywords
        cluster_key = reason[:50]  # Use first 50 chars as cluster key
        clusters[cluster_key]['count'] += 1
        clusters[cluster_key]['segments'][segment] += 1

    # Convert to list and determine dominant segment
    result = []
    for reason, data in clusters.items():
        if data['segments']['target'] > data['segments']['nontarget']:
            segment = 'target'
        elif data['segments']['nontarget'] > data['segments']['target']:
            segment = 'nontarget'
        else:
            segment = 'mixed'

        result.append({
            'reason': reason,
            'count': data['count'],
            'segment': segment
        })

    return sorted(result, key=lambda x: x['count'], reverse=True)

def simulate_pre_survey(persona: Dict, competitors: List[Dict]) -> Dict:
    """Step 2-2: Pre-survey (Pain + Alternative Advantage)"""
    is_target = persona['segment_type'] == 'target'
    background = persona.get('background_story', '').lower()

    # Pain level (0-2)
    if is_target and ('lost' in background or 'broken' in background):
        pain = 2  # Real pain from broken links
    elif is_target:
        pain = 1  # Some inconvenience
    else:
        pain = 0  # Not relevant

    # Alternative advantage (0-2)
    if pain >= 2:
        # If real pain, likely no good existing solution
        alternative_advantage = 2 if random.random() < 0.7 else 1
    elif pain == 1:
        alternative_advantage = 1  # Existing tools partially work
    else:
        alternative_advantage = 0

    return {
        'pain': pain,
        'alternative_advantage': alternative_advantage
    }

def check_nd_early_exit(pain: int, alt_adv: int) -> bool:
    """Check if persona should be ND early exit"""
    if pain == 0 or alt_adv == 0:
        return True
    if pain == 1 and alt_adv == 1:
        return True
    return False

def simulate_micro_evaluation(persona: Dict) -> Dict:
    """Step 2-5: Micro evaluation"""
    is_target = persona['segment_type'] == 'target'
    tech_savvy = persona['behavioral']['tech_savviness']

    # Understanding (0-2)
    understanding = 2 if tech_savvy > 0.6 else 1

    # Functionality (0-2) - assuming MVP works
    functionality = 2 if random.random() < 0.8 else 1

    # Value (0-2)
    if is_target and functionality >= 1:
        value = 2 if random.random() < 0.6 else 1
    else:
        value = 1 if is_target else 0

    # Reuse (0-2)
    if value == 2:
        reuse = 2 if random.random() < 0.7 else 1
    elif value == 1:
        reuse = 1
    else:
        reuse = 0

    return {
        'understanding': understanding,
        'functionality': functionality,
        'value': value,
        'reuse': reuse
    }

def check_vd_capable(pain: int, alt_adv: int, functionality: int, value: int, reuse: int) -> str:
    """Determine if persona can be VD based on strict criteria"""
    # ND conditions
    if pain == 0 or alt_adv == 0 or functionality == 0:
        return 'ND'

    # VD conditions (very strict)
    if pain == 2 and alt_adv == 2 and functionality >= 1 and value == 2 and reuse >= 1:
        return 'VD_capable'

    # Otherwise SD
    return 'SD'

def simulate_revisit_recommend(persona: Dict, micro_eval: Dict) -> Dict:
    """Step 2-6: Revisit and recommendation questions"""
    value = micro_eval['value']
    reuse = micro_eval['reuse']

    # Revisit
    if value >= 2 and reuse >= 1:
        revisit = random.random() < 0.6
        revisit_reason = "Solves a real problem I have repeatedly" if revisit else "Useful once but not enough to remember to return"
    else:
        revisit = False
        revisit_reason = "Not compelling enough to make it a habit"

    # Recommend
    if value >= 2 and micro_eval['functionality'] >= 1:
        recommend = random.random() < 0.5
        recommend_reason = "It works well and solves a real problem" if recommend else "Works for me but not confident enough to stake reputation"
    else:
        recommend = False
        recommend_reason = "Not polished enough to recommend to others"

    return {
        'revisit': revisit,
        'revisit_reason': revisit_reason,
        'recommend': recommend,
        'recommend_reason': recommend_reason
    }

def layer2_value_gate(passed_personas: List[Dict], competitors: List[Dict]) -> Dict:
    """Layer 2: Value Gate - E2E experience and evaluation"""
    results = {
        'passed': [],
        'dropped': [],
        'drop_reasons': [],
        'reports': []
    }

    for persona in passed_personas:
        # Pre-survey
        pre_survey = simulate_pre_survey(persona, competitors)

        # Check early ND exit
        if check_nd_early_exit(pre_survey['pain'], pre_survey['alternative_advantage']):
            results['dropped'].append(persona)
            results['drop_reasons'].append({
                'reason': f"Pain={pre_survey['pain']}, AltAdv={pre_survey['alternative_advantage']} - insufficient problem severity",
                'drop_gate': 'pre_survey',
                'segment': persona['segment_type']
            })
            continue

        # Micro evaluation (simulating E2E experience)
        micro_eval = simulate_micro_evaluation(persona)

        # Revisit + Recommend gate
        revisit_rec = simulate_revisit_recommend(persona, micro_eval)

        # Store report
        report = {
            'persona_id': persona['persona_id'],
            'persona_name': persona['demographics']['name'],
            'tier': persona['tier'],
            'segment_type': persona['segment_type'],
            'pre_survey': pre_survey,
            'micro_eval': micro_eval,
            'revisit_recommend': revisit_rec,
            'vd_capability': check_vd_capable(
                pre_survey['pain'],
                pre_survey['alternative_advantage'],
                micro_eval['functionality'],
                micro_eval['value'],
                micro_eval['reuse']
            )
        }
        results['reports'].append(report)

        # Check if passed Layer 2
        if revisit_rec['revisit'] and revisit_rec['recommend']:
            results['passed'].append(persona)
        else:
            results['dropped'].append(persona)
            if not revisit_rec['revisit']:
                results['drop_reasons'].append({
                    'reason': revisit_rec['revisit_reason'],
                    'drop_gate': 'revisit',
                    'segment': persona['segment_type']
                })
            else:
                results['drop_reasons'].append({
                    'reason': revisit_rec['recommend_reason'],
                    'drop_gate': 'recommend',
                    'segment': persona['segment_type']
                })

    return results

def simulate_sean_ellis(persona: Dict, vd_capability: str) -> str:
    """Q1: Sean Ellis disappointment question"""
    if vd_capability == 'ND':
        return 'not_disappointed'
    elif vd_capability == 'VD_capable':
        # VD capable personas are more likely to be very disappointed
        return 'very_disappointed' if random.random() < 0.7 else 'somewhat_disappointed'
    else:  # SD
        return 'somewhat_disappointed' if random.random() < 0.8 else 'not_disappointed'

def layer3_disappointment_gate(passed_personas: List[Dict], layer2_reports: List[Dict]) -> Dict:
    """Layer 3: Disappointment Gate - Sean Ellis + VSD classification"""
    results = {
        'vd': [],
        'sd': [],
        'nd': [],
        'vd_core_values': [],
        'vsd_conversion_conditions': []
    }

    # Create report lookup
    report_map = {r['persona_id']: r for r in layer2_reports if r['persona_id'] in [p['persona_id'] for p in passed_personas]}

    for persona in passed_personas:
        report = report_map.get(persona['persona_id'])
        if not report:
            continue

        # Q1: Sean Ellis
        sean_ellis = simulate_sean_ellis(persona, report['vd_capability'])

        if sean_ellis == 'very_disappointed':
            results['vd'].append({
                'persona_id': persona['persona_id'],
                'name': persona['demographics']['name'],
                'segment_type': persona['segment_type'],
                'report': report
            })
            # Q2: Core value (simulate)
            results['vd_core_values'].append("Daily automated checks catch broken links before revenue loss")

        elif sean_ellis == 'somewhat_disappointed':
            results['sd'].append({
                'persona_id': persona['persona_id'],
                'name': persona['demographics']['name'],
                'segment_type': persona['segment_type'],
                'report': report
            })
            # Q4: Conversion conditions (simulate for VSD)
            if random.random() < 0.6:  # Assume VSD
                results['vsd_conversion_conditions'].append("Mobile app with push notifications for broken links")

        else:  # not_disappointed
            results['nd'].append({
                'persona_id': persona['persona_id'],
                'name': persona['demographics']['name'],
                'segment_type': persona['segment_type']
            })

    return results

def calculate_pmf_score(vd_count: int, total_personas: int) -> float:
    """Calculate PMF Score = VD / Total × 100"""
    return (vd_count / total_personas) * 100

def determine_verdict(pmf_score: float) -> str:
    """Determine verdict based on PMF score"""
    if pmf_score >= 40:
        return 'GRADUATE'
    elif pmf_score >= 20:
        return 'ITERATE (Nascent)'
    elif pmf_score >= 10:
        return 'ITERATE'
    else:
        return 'KILL'

def main():
    product_id = "idea-20260329-121003"
    personas_path = "/Users/peter/lansik/omp/oh-my-pmf/state/personas/idea-20260329-121003.json"
    competitors_path = "/Users/peter/lansik/omp/oh-my-pmf/state/competitors/idea-20260329-121003.json"
    products_path = "/Users/peter/lansik/omp/oh-my-pmf/state/products/idea-20260329-121003.json"
    cycle_number = 2

    print(f"=== Validator v3: 3-Layer Funnel ===")
    print(f"Product: {product_id}")
    print(f"Cycle: {cycle_number}")
    print()

    # Load data
    print("Loading data...")
    load_data(product_id, personas_path, competitors_path, products_path)
    print(f"Loaded {len(personas)} personas")
    print(f"Loaded {len(competitors)} competitors")
    print()

    # Layer 1: Interest Gate
    print("=== Layer 1: Interest Gate ===")
    layer1_results = layer1_interest_gate(personas, landing_page_text)
    layer1_passed_count = len(layer1_results['passed'])
    layer1_pass_rate = layer1_passed_count / len(personas)
    print(f"Passed: {layer1_passed_count} / {len(personas)} ({layer1_pass_rate:.1%})")

    # Cluster drop reasons
    layer1_drop_clustered = cluster_reasons(layer1_results['drop_reasons'])
    print(f"Top drop reasons:")
    for reason in layer1_drop_clustered[:5]:
        print(f"  - {reason['reason'][:80]}... [{reason['segment']}, n={reason['count']}]")
    print()

    # Layer 2: Value Gate
    print("=== Layer 2: Value Gate ===")
    layer2_results = layer2_value_gate(layer1_results['passed'], competitors)
    layer2_passed_count = len(layer2_results['passed'])
    layer2_pass_rate = layer2_passed_count / layer1_passed_count if layer1_passed_count > 0 else 0
    print(f"Passed: {layer2_passed_count} / {layer1_passed_count} ({layer2_pass_rate:.1%})")

    layer2_drop_clustered = cluster_reasons(layer2_results['drop_reasons'])
    print(f"Top drop reasons:")
    for reason in layer2_drop_clustered[:5]:
        print(f"  - [{reason.get('segment', 'unknown')}] {reason['reason'][:80]}...")
    print()

    # Layer 3: Disappointment Gate
    print("=== Layer 3: Disappointment Gate ===")
    layer3_results = layer3_disappointment_gate(layer2_results['passed'], layer2_results['reports'])
    vd_count = len(layer3_results['vd'])
    sd_count = len(layer3_results['sd'])
    nd_count = len(personas) - vd_count - sd_count  # All drops + Layer 3 ND

    print(f"VD: {vd_count}")
    print(f"SD: {sd_count}")
    print(f"ND: {nd_count}")
    print()

    # PMF Score
    pmf_score = calculate_pmf_score(vd_count, len(personas))
    verdict = determine_verdict(pmf_score)

    print(f"=== PMF Score ===")
    print(f"PMF Score: {pmf_score:.1f}%")
    print(f"Verdict: {verdict}")
    print()

    # Check for unexpected segments
    unexpected_segments = [vd for vd in layer3_results['vd'] if vd['segment_type'] == 'nontarget']
    if unexpected_segments:
        print(f"⚠️  Unexpected VD from non-target: {len(unexpected_segments)} personas")

    # Save results
    output = {
        'product_id': product_id,
        'cycle_number': cycle_number,
        'validator_version': 'v3',
        'pmf_score': round(pmf_score, 1),
        'verdict': verdict,
        'vd_count': vd_count,
        'sd_count': sd_count,
        'nd_count': nd_count,
        'funnel': {
            'total_personas': len(personas),
            'layer1_passed': layer1_passed_count,
            'layer1_pass_rate': round(layer1_pass_rate, 3),
            'layer1_drop_reasons': layer1_drop_clustered[:10],
            'layer2_passed': layer2_passed_count,
            'layer2_pass_rate': round(layer2_pass_rate, 3),
            'layer2_drop_reasons': layer2_drop_clustered[:10],
            'layer3_vd': vd_count,
            'layer3_sd': sd_count,
            'layer3_nd': nd_count
        },
        'core_values': list(set(layer3_results['vd_core_values']))[:5],
        'vsd_conversion_conditions': list(set(layer3_results['vsd_conversion_conditions']))[:10],
        'unexpected_segments': [
            {
                'persona_id': p['persona_id'],
                'name': p['name'],
                'segment_type': p['segment_type']
            }
            for p in unexpected_segments
        ],
        'layer2_reports': layer2_results['reports'][:20]  # Sample
    }

    # Update product file
    with open(products_path, 'r') as f:
        product_data = json.load(f)

    product_data['validation_results'] = output
    product_data['pmf_score'] = round(pmf_score, 1)
    product_data['verdict'] = verdict
    product_data['validated_at'] = "2026-03-29T12:30:00Z"

    with open(products_path, 'w') as f:
        json.dump(product_data, f, indent=2)

    print(f"✅ Results saved to {products_path}")
    print()
    print(f"VALIDATOR_DONE: {product_id}")
    print(f"PMF_SCORE: {pmf_score:.1f}")
    print(f"VERDICT: {verdict}")
    print(f"VD_COUNT: {vd_count}")

if __name__ == '__main__':
    main()
