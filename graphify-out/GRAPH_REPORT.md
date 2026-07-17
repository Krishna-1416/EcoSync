# Graph Report - Virtual Promptwar 4  (2026-07-17)

## Corpus Check
- 44 files · ~38,827 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 78 nodes · 35 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `TelemetryRepository` - 5 edges
2. `LlmService` - 4 edges
3. `BaseController` - 3 edges
4. `ChatController` - 2 edges
5. `TelemetryController` - 2 edges
6. `TransitController` - 2 edges
7. `TransitService` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (1): TelemetryRepository

### Community 1 - "Community 1"
Cohesion: 0.5
Nodes (1): LlmService

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (1): BaseController

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (1): ChatController

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (1): TelemetryController

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (1): TransitController

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (1): TransitService

## Knowledge Gaps
- **Thin community `Community 0`** (6 nodes): `TelemetryRepository.ts`, `TelemetryRepository`, `.constructor()`, `.getInstance()`, `.getTelemetry()`, `.updateTelemetry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 1`** (5 nodes): `llmService.ts`, `LlmService`, `.constructor()`, `.fallbackRuleEngine()`, `.generateResponse()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (4 nodes): `baseController.ts`, `BaseController`, `.sendError()`, `.sendSuccess()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (3 nodes): `chatController.ts`, `ChatController`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (3 nodes): `telemetryController.ts`, `TelemetryController`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (3 nodes): `transitController.ts`, `TransitController`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (3 nodes): `transitService.ts`, `TransitService`, `.getTransitData()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._