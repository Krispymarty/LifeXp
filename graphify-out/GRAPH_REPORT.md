# Graph Report - .  (2026-06-10)

## Corpus Check
- 48 files · ~78,121 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 195 nodes · 248 edges · 11 communities detected
- Extraction: 70% EXTRACTED · 29% INFERRED · 1% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `rebuildProgression()` - 16 edges
2. `Life XP` - 12 edges
3. `Dashboard()` - 11 edges
4. `getDemoDashboard()` - 11 edges
5. `Timeline()` - 9 edges
6. `MongoDB` - 8 edges
7. `Skills()` - 7 edges
8. `getDashboard()` - 7 edges
9. `axios API client (baseURL /api)` - 7 edges
10. `useApi()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `skillLevel()` --semantically_similar_to--> `calculateLevel()`  [INFERRED] [semantically similar]
  client\src\utils\progression.js → server\src\services\progressionService.js
- `getDemoDashboard()` --semantically_similar_to--> `getDashboard()`  [INFERRED] [semantically similar]
  server\src\demo\demoStore.js → server\src\controllers\dashboardController.js
- `computeSkills()` --semantically_similar_to--> `rebuildProgression()`  [INFERRED] [semantically similar]
  server\src\demo\demoStore.js → server\src\services\progressionService.js
- `ExperienceList()` --semantically_similar_to--> `Timeline()`  [INFERRED] [semantically similar]
  client\src\components\ExperienceList.jsx → client\src\pages\Timeline.jsx
- `skillProgress()` --semantically_similar_to--> `getLevelProgress()`  [INFERRED] [semantically similar]
  client\src\utils\progression.js → server\src\services\progressionService.js

## Hyperedges (group relationships)
- **Shared XP category taxonomy and rewards** — constants_categories_list, constants_categories_colors, progressionrules_categoryxp, progressionrules_categoryskillgains [INFERRED 0.90]
- **useApi hook data fetching across pages** — hooks_useapi_useapi, hooks_useapi_load, pages_badges_badges, pages_dashboard_dashboard, pages_skills_skills, pages_timeline_timeline [INFERRED 0.85]
- **Add experience submission and feedback flow** — pages_addexperience_addexperience, addexperience_submit, api_endpoints_createexperience, api_endpoints_badges, components_toast_toast, components_badgeunlockmodal_badgeunlockmodal [EXTRACTED 1.00]
- **Progression Rules Configuration** — rules_categoryxp, rules_skillmapping, rules_badgerules, rules_categories [EXTRACTED 1.00]
- **Demo Mode API Surface** — demoroutes_dashboard_handler, demoroutes_experiences_get_handler, demoroutes_experiences_post_handler, demoroutes_experiences_delete_handler, demoroutes_skills_handler, demoroutes_badges_handler, demo_demostore_getdemodashboard, demo_demostore_getdemoexperiences, demo_demostore_adddemoexperience, demo_demostore_deletedemoexperience, demo_demostore_getdemoskills, demo_demostore_getdemobadges [EXTRACTED 1.00]
- **Mongo Progression Rebuild Flow** — services_progressionservice_rebuildprogression, services_progressionservice_ensurebadges, models_experience_document, models_skill_document, models_userstats_document, models_badge_document, rules_skillmapping, rules_badgerules [INFERRED 0.85]
- **Local MongoDB Docker Setup** — docker_compose_mongo_service, docker_compose_mongo_7, docker_compose_life_xp_mongo_container, docker_compose_life_xp_mongo_volume, docker_compose_port_27017 [EXTRACTED 1.00]
- **Frontend Technology Stack** — readme_react, readme_vite, readme_tailwind_css, readme_react_router, readme_recharts [EXTRACTED 1.00]
- **Backend Technology Stack** — readme_nodejs, readme_expressjs, readme_mongodb, readme_mongoose [EXTRACTED 1.00]
- **Gamification Reward Mechanics** — readme_xp, readme_levels, readme_skills, readme_classes, readme_badges [EXTRACTED 1.00]
- **Adventure Journey Composition** — winding_stone_path, mountain_castle, sunset_lighting, rpg_progression_metaphor [INFERRED 0.82]
- **Magical RPG Aesthetic Elements** — purple_magical_crystals, magical_particles, fantasy_landscape_hero, rpg_progression_metaphor [INFERRED 0.78]
- **Depth and Atmosphere Layering** — atmospheric_perspective, misty_purple_valley, snow_capped_mountains, sunset_lighting [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (30): axios API client (baseURL /api), endpoints.badges(), endpoints.createExperience(), endpoints.dashboard(), endpoints.deleteExperience(), endpoints.experiences(), endpoints.skills(), Badges lucide icon map (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (22): GET / Badges Route Handler, getBadges(), getDashboard(), getSkills(), GET / Dashboard Route Handler, Life Class Ranking System, Badge Document, Experience Document (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (21): client/index.html, main.jsx entry script, #root React mount point, Backend Server (localhost:5000), Badges, Classes, Experience Logging, Express.js (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (16): computeBadges(), computeSkills(), computeStats(), deleteDemoExperience(), getDemoBadges(), getDemoDashboard(), getDemoExperiences(), getDemoSkills() (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (12): newly unlocked badge detection, AddExperience submit handler, BadgeUnlockModal(), Toast(), categories array, Life XP RPG progression system, AddExperience(), Landing() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (17): Atmospheric Perspective, Fantasy Landscape Hero Painting, Landing Page Hero Background, Leading Line Composition, Life XP Hero Image, Light-Dark Thematic Contrast, Magical Glowing Particles, Misty Purple Valley (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (11): life-xp-mongo container, life-xp-mongo volume, mongo:7 Docker image, mongo service, Port 27017, docker compose up -d, MongoDB, MongoDB Atlas (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.31
Nodes (9): createExperience(), deleteExperience(), getExperiences(), addDemoExperience(), POST /experiences Handler, In-Memory Demo Experiences, Experience CRUD Route Handlers, categories (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (5): Demo vs Mongo API Routing, connectDB(), MongoDB Unavailable Demo Fallback, createApp(), start()

### Community 9 - "Community 9"
Cohesion: 0.5
Nodes (3): AppLayout(), AppLayout navItems routes, browser router config

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): endpoints API facade

## Ambiguous Edges - Review These
- `getSkillRules()` → `badgeRules`  [AMBIGUOUS]
  server/src/demo/demoUtils.js · relation: references
- `Mountain Castle` → `Stone Bridge`  [AMBIGUOUS]
  client/src/assets/life-xp-hero.png · relation: conceptually_related_to

## Knowledge Gaps
- **42 isolated node(s):** `Vite /api dev proxy`, `endpoints API facade`, `Badges lucide icon map`, `Dashboard life class mapping`, `Dashboard level title ladder` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 29`** (1 nodes): `endpoints API facade`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `getSkillRules()` and `badgeRules`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Mountain Castle` and `Stone Bridge`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `rebuildProgression()` connect `Community 1` to `Community 3`, `Community 7`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `calculateLevel()` connect `Community 1` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `skillLevel()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `rebuildProgression()` (e.g. with `seed()` and `getBadges()`) actually correct?**
  _`rebuildProgression()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Dashboard()` (e.g. with `useApi()` and `pluralize()`) actually correct?**
  _`Dashboard()` has 2 INFERRED edges - model-reasoned connections that need verification._