import sys; sys.path.insert(0, '.')
from app.main import app
from fastapi.testclient import TestClient
client = TestClient(app)

# Gate 5: Visitor Flow Agent
resp = client.get('/api/visitor-flow/site-modhera-001')
assert resp.status_code == 200, 'Visitor flow failed: ' + resp.text
d = resp.json()
assert d['status'] in ['LOW','MODERATE','HIGH','CRITICAL']
assert d['data_source'] == 'SIMULATED_DEMO'
assert len(d['zone_breakdown']) >= 3
print('Gate 5 Visitor Flow: status=' + d['status'] + ' occupancy=' + str(d['occupancy_percent']) + ' zones=' + str(len(d['zone_breakdown'])))

resp2 = client.post('/api/visitor-flow/analyze', json={'site_id': 'site-modhera-001', 'override_visitors': 440})
assert resp2.status_code == 200
d2 = resp2.json()
assert d2['status'] in ['HIGH','CRITICAL'], 'Expected HIGH/CRITICAL, got ' + d2['status']
print('Gate 5 Override: status=' + d2['status'] + ' visitors=' + str(d2['current_visitors']))
print('Gate 5: PASS')

# Gate 6: Storytelling Agent
resp = client.post('/api/heritage-guide', json={
    'site_id': 'site-modhera-001',
    'duration_minutes': 60,
    'interests': ['architecture'],
    'crowd_preference': 'avoid_crowds',
    'complexity': 'moderate',
})
assert resp.status_code == 200, 'Heritage guide failed: ' + resp.text
g = resp.json()
assert len(g['recommended_stops']) >= 1
print('Gate 6 Storytelling: stops=' + str(len(g['recommended_stops'])) + ' ai=' + str(g['ai_enhanced']))
print('Gate 6: PASS')

# Gate 7: Conservation Agent
resp = client.post('/api/conservation/report', json={
    'site_id': 'site-modhera-001',
    'include_visitor_flow': True,
    'include_structural': True,
    'include_encroachment': True,
})
assert resp.status_code == 200, 'Conservation failed: ' + resp.text
c = resp.json()
assert c['priority'] in ['LOW','MODERATE','HIGH','CRITICAL']
assert c['human_verification_required'] == True
print('Gate 7 Conservation: priority=' + c['priority'] + ' factors=' + str(len(c['factors'])) + ' recs=' + str(len(c['recommendations'])))
print('Gate 7: PASS')
