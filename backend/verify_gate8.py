import sys; sys.path.insert(0, '.')
from app.main import app
from fastapi.testclient import TestClient
client = TestClient(app)

# Gate 8: Orchestrator
resp = client.post('/api/orchestrator/run', json={
    'site_id': 'site-modhera-001',
    'duration_minutes': 60,
    'interests': ['architecture'],
    'crowd_preference': 'avoid_crowds',
    'complexity': 'moderate',
    'run_conservation': True,
})
assert resp.status_code == 200, 'Orchestrator failed: ' + resp.text
o = resp.json()
print('Orchestrator status: ' + o['status'])
print('Request ID: ' + o['request_id'])
print('Site: ' + o['site_name'])
print('Agent runs: ' + str(len(o['agent_runs'])))
for run in o['agent_runs']:
    print('  ' + run['agent'] + ' -> ' + run['status'] + ' (' + str(run['duration_ms']) + 'ms)')
print('Visitor flow: ' + (o['visitor_flow']['status'] if o['visitor_flow'] else 'MISSING'))
print('Heritage guide stops: ' + str(len(o['heritage_guide']['recommended_stops']) if o['heritage_guide'] else 0))
print('Conservation priority: ' + (o['conservation']['priority'] if o['conservation'] else 'MISSING'))
print('Degraded agents: ' + str(o['degraded_agents']))

# Verify agent runs are persisted in DB
req_id = o['request_id']
runs_resp = client.get('/api/agents/runs?request_id=' + req_id)
assert runs_resp.status_code == 200
runs = runs_resp.json()
print('DB-persisted agent runs for request: ' + str(len(runs)))
assert len(runs) >= 5, 'Expected at least 5 agent run records'

# Orchestrator must not silently hide partial failures
assert o['status'] in ['SUCCESS', 'PARTIAL', 'FAILED']
if o['degraded_agents']:
    assert o['degraded_message'] is not None

print('Gate 8: PASS')
