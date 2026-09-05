# Tab Purpose / Redundancy Audit

Status: LOCKED PRODUCT BOUNDARY
Date: 2026-09-05

## Purpose

Prevent Reason, Anatomy, Move, Observe, and Sessions from gradually becoming duplicate libraries that happen to use different labels.

The app follows one architecture rule:

**One canonical record, many entrances.**

A muscle, movement, observation, or saved episode should have one authoritative record. Other tabs may point to that record, use it in context, or explain why it matters, but should not recreate it.

## Audit conclusion

The current five-tab structure is valid and should remain.

No tab needs to be removed or merged at this stage. The existing implementation already demonstrates the intended separation reasonably well:

- Reason uses questions, hypotheses, comparison, safety exits, and reassessment.
- Anatomy owns canonical muscle reference records.
- Move owns movement-specific analysis and links back to muscles.
- Observe owns visible/functional patterns and what they make worth comparing next.
- Sessions owns saved reasoning episodes and reassessment history.

The primary risk is **future content duplication**, not a fundamental routing problem.

## Locked tab contracts

### Reason

**Job:** active clinical-reasoning pathway.

Reason may:
- accept a complaint in ordinary language
- ask adaptive discriminating questions
- preserve known facts and avoid re-asking them
- rank structures or relationships worth examining
- explain why something is being considered
- suggest what to compare next
- route to canonical Anatomy or Move records
- record reassessment and revise the working hypothesis
- leave the ordinary self-care pathway when safety criteria require it

Reason must not become:
- a duplicate anatomy encyclopedia
- a movement/exercise catalog
- a static observation library
- a session archive
- a diagnosis engine

A Reason card may summarize enough anatomy or movement context to explain the reasoning, but detailed reference content belongs to its canonical record.

### Anatomy

**Job:** canonical anatomical/reference library.

Anatomy owns:
- canonical muscle identity
- anatomy / referred-pain two-state muscle card
- origins and insertions
- action/function
- innervation
- verified anatomical visuals
- referral visualization and provenance
- relevant nerve relationships when materially useful
- functional roles
- related structures
- related movements
- relationship map entry
- conservative-options entry
- deeper reference and sources

Anatomy must not become:
- a second Reason pathway
- a duplicate movement-analysis library
- a stored-session view

Every route to a muscle must resolve to this same canonical muscle record.

### Move

**Job:** movement as a functional event.

Move owns:
- planes
- joints/regions
- muscular demands
- stabilizers
- neuromuscular and mobility demands
- common compensations
- regression/progression concepts when appropriate
- links to canonical muscle records
- observations that are meaningful during that movement

Move must not duplicate muscle anatomy. If a movement mentions Serratus anterior, Scalenes, Piriformis, or another structure, tapping that structure should open the canonical Anatomy record.

Move is not intended to become a giant exercise database. Movement entries exist because they help explain function, comparison, reassessment, or clinical reasoning.

### Observe

**Job:** reusable observations that may alter reasoning.

Observe owns:
- what is actually being noticed
- possible categories of contributors
- what to compare next
- contextual cautions when a visible pattern is not specific

Observe must preserve the rule:

**Observation is evidence to interpret, not a diagnosis.**

An observation such as scapular winging, early shrug, pelvic drop, or difficulty standing upright may point toward several structures, movement relationships, pain-avoidance strategies, or neurological considerations.

Observe must not recreate full Anatomy or Move records. Where a contributor corresponds to a canonical muscle or movement, future normalization should prefer linked record IDs over duplicate prose.

### Sessions

**Job:** longitudinal episode/history layer.

Sessions owns:
- saved complaint/reasoning episodes
- answers and known facts from that episode
- reassessment results
- notes/context
- timestamps and history
- export/import/share behavior
- future comparison across episodes

Sessions must not become another reference library. A saved session should point back to current canonical Anatomy, Move, or Observation records rather than storing independent copies of those records.

## Cross-tab routing rules

### Reason → Anatomy
Open the canonical muscle card directly. Do not route through a generic regional anatomy placeholder.

### Reason → Move
Open the canonical movement analysis and preserve a usable return path.

### Move → Anatomy
Muscle names resolve to canonical muscle cards.

### Observe → Anatomy / Move
When structured links exist, open canonical records rather than restating them.

### Sessions → current records
A saved episode preserves what happened at that time, but reference links should resolve to the canonical current record unless historical versioning is intentionally added later.

## Known architectural debt

The Observation starter data still contains several contributor descriptions as plain text rather than normalized canonical IDs. This is acceptable for the current prototype, but future expansion should distinguish:

1. canonical record links, such as `serratus-anterior`
2. non-record explanatory categories, such as `pain-avoidance strategy`
3. safety/context concepts, such as neurological contributors

Do not create fake muscle records merely to normalize every phrase.

## Duplication test

Before adding content to a tab, ask:

1. Is this information already owned by another canonical record?
2. Does this tab need the fact itself, or only enough context plus a link?
3. If the underlying anatomy/movement fact changes, would we have to update it in more than one place?

If the answer to #3 is yes, the architecture is probably duplicating source-of-truth content.

## Product Contract Matrix — tab layer

| Promise | Owner | Verification intent |
| --- | --- | --- |
| Complaint-driven adaptive reasoning | Reason | Live flow tests |
| Canonical muscle record | Anatomy | All muscle entrances resolve to same record |
| Movement-specific functional analysis | Move | Movement detail tests + canonical muscle links |
| Observation without diagnosis | Observe | Observation copy/relationship tests |
| Saved episode and reassessment history | Sessions | Persistence/export/import tests |
| No duplicate canonical anatomy records | Cross-tab architecture | Routing/source-of-truth tests |

## Locked summary

**Reason decides what may be worth examining next.**  
**Anatomy explains the structure.**  
**Move explains the functional event.**  
**Observe captures patterns that can change reasoning.**  
**Sessions preserves what happened over time.**

Those purposes are complementary, not interchangeable.
