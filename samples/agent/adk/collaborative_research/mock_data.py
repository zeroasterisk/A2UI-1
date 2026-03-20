# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Realistic mock data for the collaborative research agent."""

CONTACTS = [
    {
        "id": "c1",
        "name": "Marcus Chen",
        "title": "Senior Engineer",
        "team": "FinTech",
        "location": "Austin, TX",
        "email": "m.chen@company.com",
        "phone": "+1-512-555-0142",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        "recentInteractions": ["Payments Integration Review (Feb 15)", "1:1 sync (Feb 10)"],
    },
    {
        "id": "c2",
        "name": "Sarah Lee",
        "title": "Finance Director",
        "team": "Finance",
        "location": "New York, NY",
        "email": "s.lee@company.com",
        "phone": "+1-212-555-0198",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        "recentInteractions": ["Q3 Budget Planning (Feb 22)", "All-hands (Feb 18)"],
    },
    {
        "id": "c3",
        "name": "Sarah Kim",
        "title": "Operations Lead",
        "team": "Operations",
        "location": "San Francisco, CA",
        "email": "s.kim@company.com",
        "phone": "+1-415-555-0167",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahK",
        "recentInteractions": ["Ops Review (Mar 1)"],
    },
    {
        "id": "c4",
        "name": "Dave Rodriguez",
        "title": "Staff Engineer",
        "team": "Platform",
        "location": "Austin, TX",
        "email": "d.rodriguez@company.com",
        "phone": "+1-512-555-0203",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
        "recentInteractions": ["API Redesign Kickoff (Mar 5)", "Architecture Review (Feb 28)"],
    },
    {
        "id": "c5",
        "name": "Priya Sharma",
        "title": "Product Manager",
        "team": "Payments",
        "location": "Seattle, WA",
        "email": "p.sharma@company.com",
        "phone": "+1-206-555-0134",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        "recentInteractions": ["Payment Gateway Planning (Feb 22)", "Sprint Review (Feb 20)"],
    },
    {
        "id": "c6",
        "name": "Alex Torres",
        "title": "Security Engineer",
        "team": "Security",
        "location": "Denver, CO",
        "email": "a.torres@company.com",
        "phone": "+1-303-555-0189",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        "recentInteractions": ["Payment Fraud Review (Mar 1)", "Security Audit (Feb 25)"],
    },
    {
        "id": "c7",
        "name": "Dave Park",
        "title": "Frontend Engineer",
        "team": "Web",
        "location": "Portland, OR",
        "email": "d.park@company.com",
        "phone": "+1-503-555-0211",
        "imageUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=DaveP",
        "recentInteractions": ["UI Review (Mar 3)"],
    },
]

MEETINGS = [
    {
        "id": "m1",
        "title": "Payments Integration Review",
        "date": "2026-02-15",
        "time": "2:00 PM - 3:00 PM",
        "attendees": ["You", "Marcus Chen", "Sarah Lee", "Priya Sharma"],
        "location": "Zoom",
        "topics": ["payments", "stripe", "integration", "migration"],
        "notes": "Discussed Stripe migration timeline. Marcus to send API specs by Feb 20. PCI compliance requirements reviewed. Target: Q3 2026 launch.",
        "actionItems": [
            "Marcus: Send updated API specs",
            "Priya: Draft migration timeline",
            "You: Review PCI checklist",
        ],
    },
    {
        "id": "m2",
        "title": "Q3 Payment Gateway Planning",
        "date": "2026-02-22",
        "time": "10:00 AM - 11:30 AM",
        "attendees": ["You", "Priya Sharma", "Marcus Chen"],
        "location": "Conference Room B",
        "topics": ["payments", "gateway", "Q3", "planning"],
        "notes": "Reviewed gateway options: Stripe vs Adyen. Decision to go with Stripe. Budget approved for $50K integration costs.",
        "actionItems": [
            "Priya: Create Jira epics",
            "Marcus: PoC by March 1",
        ],
    },
    {
        "id": "m3",
        "title": "Payment Fraud Review",
        "date": "2026-03-01",
        "time": "3:00 PM - 4:00 PM",
        "attendees": ["You", "Alex Torres", "Priya Sharma"],
        "location": "Zoom",
        "topics": ["payments", "fraud", "security", "review"],
        "notes": "Reviewed fraud detection rules. 3 false positives last month. Alex suggested ML-based approach. Budget TBD.",
        "actionItems": [
            "Alex: Write ML proposal",
            "Priya: Review vendor options",
        ],
    },
    {
        "id": "m4",
        "title": "API Redesign Kickoff",
        "date": "2026-03-05",
        "time": "1:00 PM - 2:30 PM",
        "attendees": ["You", "Dave Rodriguez", "Sarah Kim"],
        "location": "Conference Room A",
        "topics": ["API", "redesign", "architecture", "platform"],
        "notes": "Kicked off REST-to-gRPC migration. Dave presented new schema. Timeline: 6 months. Phase 1: internal APIs.",
        "actionItems": [
            "Dave: Share proto definitions",
            "Sarah K: Resource allocation plan",
        ],
    },
    {
        "id": "m5",
        "title": "Q3 Budget Reallocation",
        "date": "2026-02-22",
        "time": "4:00 PM - 5:00 PM",
        "attendees": ["You", "Sarah Lee"],
        "location": "Zoom",
        "topics": ["budget", "Q3", "finance", "reallocation"],
        "notes": "Sarah presented reallocation proposal. Moving $200K from legacy maintenance to new platform. Needs VP approval.",
        "actionItems": [
            "Sarah L: Send proposal doc",
            "You: Review and sign off",
        ],
    },
]

DOCUMENTS = [
    {
        "id": "d1",
        "title": "Q3 Budget Reallocation Proposal",
        "author": "Sarah Lee",
        "date": "2026-02-20",
        "type": "proposal",
        "summary": "Proposes moving $200K from legacy system maintenance to new platform development. Covers risk analysis, timeline, and expected ROI of 3x over 18 months.",
        "tags": ["budget", "Q3", "finance", "proposal"],
        "link": "https://docs.google.com/doc/d/fake-q3-budget",
    },
    {
        "id": "d2",
        "title": "Stripe Migration API Specs v2",
        "author": "Marcus Chen",
        "date": "2026-02-18",
        "type": "technical",
        "summary": "Updated API specifications for the Stripe payment integration. Covers endpoints, auth flows, webhook handling, and error codes. Includes SDK examples in Python and TypeScript.",
        "tags": ["API", "stripe", "payments", "migration", "technical"],
        "link": "https://docs.google.com/doc/d/fake-stripe-specs",
    },
    {
        "id": "d3",
        "title": "Platform API Redesign RFC",
        "author": "Dave Rodriguez",
        "date": "2026-03-03",
        "type": "RFC",
        "summary": "Request for comments on migrating internal APIs from REST to gRPC. Covers backward compatibility, versioning strategy, and performance benchmarks showing 3x throughput improvement.",
        "tags": ["API", "redesign", "gRPC", "platform", "RFC"],
        "link": "https://docs.google.com/doc/d/fake-api-redesign",
    },
    {
        "id": "d4",
        "title": "Payment Fraud ML Proposal",
        "author": "Alex Torres",
        "date": "2026-03-05",
        "type": "proposal",
        "summary": "Proposal to replace rule-based fraud detection with ML model. Uses historical transaction data. Estimated 40% reduction in false positives. Requires $30K for model training infrastructure.",
        "tags": ["fraud", "ML", "payments", "security", "proposal"],
        "link": "https://docs.google.com/doc/d/fake-fraud-ml",
    },
    {
        "id": "d5",
        "title": "PCI Compliance Checklist 2026",
        "author": "Alex Torres",
        "date": "2026-02-10",
        "type": "checklist",
        "summary": "Annual PCI DSS compliance requirements checklist. 47 items across 12 categories. Status: 38/47 complete. Blockers: network segmentation, key rotation.",
        "tags": ["PCI", "compliance", "security", "payments"],
        "link": "https://docs.google.com/doc/d/fake-pci-checklist",
    },
]
