#!/usr/bin/env python3
import json
import sys

# Read existing personas file
with open('state/personas/idea-20260329-143000.json', 'r') as f:
    existing_data = json.load(f)

# Read new personas from stdin
new_personas = json.load(sys.stdin)

# Merge personas
existing_data['personas'].extend(new_personas)

# Update counts
existing_data['total_count'] = len(existing_data['personas'])
target_count = sum(1 for p in existing_data['personas'] if p['segment_type'] == 'target')
nontarget_count = sum(1 for p in existing_data['personas'] if p['segment_type'] == 'nontarget')
existing_data['target_count'] = target_count
existing_data['nontarget_count'] = nontarget_count

# Write back
with open('state/personas/idea-20260329-143000.json', 'w') as f:
    json.dump(existing_data, f, indent=2)

print(f"✓ Merged successfully: {len(existing_data['personas'])} total personas")
print(f"  - Target: {target_count}")
print(f"  - Non-target: {nontarget_count}")
