# Muscle Card Visual Source of Truth

Status: LOCKED
Updated: 2026-09-05

## Source-of-truth hierarchy

The muscle-card system now has two distinct visual reference layers.

### Primary source of truth — card system

The canonical card/component source of truth remains the paired Serratus anterior concept generated and approved in the Neuromuscular Therapy project chat on 2026-09-04:

1. **Serratus anterior — Anatomy card**
2. **Serratus anterior — Referred Pain card**

These approved concepts remain authoritative for:
- component design
- interaction
- visual hierarchy
- Anatomy / Referred Pain relationship
- reciprocal inset concept
- overall card identity
- warm-paper / navy / muted-maroon language
- orientation device, including the distinctive proximal/distal compass-like treatment
- responsive component behavior

Do not replace this card system with a newer mock-up merely because a later anatomy illustration is more detailed.

### Secondary source of truth — illustration treatment

The approved 2026-09-05 **Scalenes + brachial plexus** mock-up is a secondary reference for the anatomy artwork **inside** the locked card system.

It establishes useful direction for:
- higher anatomical information density
- close-up attachment visibility
- clearer bone/muscle relationships
- old-atlas illustration character without sacrificing factual detail
- clinically useful nerve visualization
- multi-angle / inset logic when one view is insufficient
- compact cross-reference preview behavior

It is **not** the primary card-layout source of truth and does not replace the Serratus card system.

## Product design principle

The product is a functional clinical/anatomical reference system first and a themed visual experience second.

**Clinical atlas first. Vintage medical character second.**

The historical/atlas visual language should support factual clarity rather than limit it. If a structure requires more labels, a different angle, a second view, or a nerve relationship to explain it correctly, the content may become denser while preserving the locked card identity.

A useful shorthand is:

**Keep the original card's personality. Give it the newer detailed anatomy treatment's brain.**

## Critical anatomical-accuracy boundary

Approved concept images are **not** anatomical-data sources of truth.

Generated or illustrative artwork must never be trusted to invent or verify:
- rib numbering
- vertebral level numbering
- origin landmarks
- insertion landmarks
- attachment levels
- nerve labels or nerve paths
- bony landmarks
- side/orientation labels
- trigger-point coordinates
- referred-pain boundaries

Those facts must come first from verified structured anatomy/referral data and appropriate cited sources. The illustration must then conform to those facts.

**Rule: anatomical facts drive the artwork; artwork does not determine anatomical facts.**

Before a labeled anatomy image is treated as production-ready, verify every visible number, label, origin, insertion, attachment, and clinically relevant nerve relationship against the canonical data record and appropriate source references.

If the underlying image conflicts with verified anatomy, correct or replace the inaccurate visual detail while preserving the locked visual system.

## Anatomy construction/reference hierarchy

Use multiple references according to what they are good at rather than trusting any one source for everything.

### Structural scaffold / geometry
- BodyParts3D / Anatomography may be used as a structural scaffold and view-planning aid when its license and specific model use are verified.
- It is not the sole anatomical authority; geometry and attachments must be cross-checked.

### Public-domain classical reference
- Public-domain Gray's Anatomy plates may be used for structural cross-checking, view logic, and classical-atlas presentation reference.

### Canonical anatomy facts
- Standard anatomy references and the app's verified structured records govern origin, insertion, actions, innervation, landmarks, vertebral/rib levels, and orientation.

### Trigger-point / referred-pain framework
- Travell/Simons is the primary conceptual framework.
- TriggerPoints.net and the Travell/Simons flip-chart reference may support research/navigation and factual cross-reference, subject to copyright and source rules.

### Final rendering
- Final app artwork must be an original rendering in the locked visual language.
- Protected source plates should not be closely traced, copied, or restyled into derivative substitutes.

## Core interaction

Every muscle record keeps one stable card/page identity with a prominent two-state control:

**Anatomy | Referred Pain**

The user may tap the control; swipe may be added later as a secondary gesture, but the visible control remains primary for discoverability.

### Reciprocal context inset

Each primary state keeps the opposite state visible as a smaller contextual inset so the user can spatially compare muscle location and pain referral without sacrificing the legibility of the main figure.

- **Anatomy state:** large anatomy illustration is primary; a smaller referred-pain inset remains visible.
- **Referred Pain state:** large referral-pattern illustration is primary; a smaller anatomy/muscle-location inset remains visible.

The inset is contextual, not a second equal panel. The main state must remain visually dominant.

On phone layouts, preserve this reciprocal-inset pattern rather than shrinking two full-size figures side by side. On larger tablet/desktop layouts, an optional side-by-side **Compare** presentation may be added later, but the two-state card remains the primary interaction model.

## Canonical muscle-card content model

The following is the standard content model. Not every muscle requires every optional visual layer.

### Identity / orientation layer
- muscle name
- region / group
- proximal/distal or equivalent orientation device from the locked primary card design
- useful side/view orientation labels

### Main anatomy visual
- one dominant anatomically verified view
- target muscle clearly distinguished from surrounding structures
- relevant bones and landmarks
- origin/insertion relationship visible where practical
- essential labels only; avoid decorative clutter

### Optional second anatomy view
Use a second view, inset, attachment zoom, or breakaway when one image cannot adequately explain:
- deep vs superficial relationships
- attachment geometry
- structures hidden by bone or another muscle
- anterior/posterior relationships
- clinically important passageways

The card system should accommodate different illustration needs by muscle rather than forcing every muscle into one identical picture composition.

### Referred-pain comparison inset
When validated referral content exists, the Anatomy state keeps a smaller referral preview visible.

The Referred Pain state reverses the hierarchy and keeps a smaller anatomy-location preview visible.

### Essential facts
Keep immediately accessible:
- Origin
- Insertion
- Action / function
- Innervation

These are canonical structured facts, not text copied from the illustration.

### High-yield adjacent structures
When clinically useful, the anatomy image may include selected nearby structures such as:
- nerves / nerve bundles
- bones
- joints
- passageways
- major vessels only when they materially improve understanding and can be presented without clutter

Do not add anatomy merely because it exists nearby.

## Nerve visualization rule

Innervation text remains part of the canonical muscle record even when the nerve is not drawn.

A nerve or nerve bundle should be **visually included** when all of the following are substantially true:
1. it is anatomically close to the muscle/region
2. its spatial relationship materially improves understanding
3. it is useful in functional or clinical-reasoning comparison
4. the path can be shown legibly without overwhelming the muscle card
5. the nerve path and labels can be verified from appropriate sources

Examples likely to benefit from visible nerve relationships include:
- Scalenes — brachial plexus relationship
- Pec minor — brachial plexus / axillary-region relationship where useful
- Piriformis — sciatic nerve relationship
- Pronator teres — median nerve relationship
- Supinator / radial-tunnel region — radial / posterior interosseous relationship
- FCU / cubital-tunnel region — ulnar nerve relationship

This is a **conditional standard**, not a command to turn every card into a nerve atlas.

When a nerve would create visual clutter or adds little reasoning value, keep the innervation in text and/or deeper reference instead.

## Anatomy state

The top of the card prioritizes:
- muscle name and orientation
- detailed regional anatomical illustration in the approved modernized classical-atlas style
- clear target-muscle highlighting
- origin/insertion landmarks where practical
- concise action/function
- concise innervation
- optional clinically useful nerve/pathway visualization
- small referred-pain context inset when validated referral content is available

Below the primary visual/fact block, deeper material uses expandable or navigable sections rather than forcing one uninterrupted textbook page.

Recommended sections/actions:
- Relationship Map
- Conservative Options
- Related Structures
- Related Movements
- Functional Roles
- Deeper Reference
- Sources

The primary anatomy facts must remain visible without opening an accordion.

## Referred Pain state

Referred pain is a first-class view, not a buried secondary feature.

The referred-pain state prioritizes:
- large regional body figure appropriate to the muscle
- clearly marked trigger-point/trigger-zone locations when supported by curated sources
- prominent referred-pain distribution overlay
- concise typical-referral description
- pattern note / variability language
- educational, non-diagnostic caution
- source/provenance access
- small anatomy/muscle-location context inset

The referral visualization may occupy more screen area than the anatomy illustration because this view exists specifically to make the referral pattern immediately understandable.

## Local muscle navigation hierarchy

Immediately below/around the primary card content, preserve the approved hierarchy.

### Popup actions first
- Relationship Map
- Conservative Options

### In-page/reference jumps second
- Related Structures
- Related Movements
- Functional Roles
- Deeper Reference
- Sources

Sections may provide **Back to muscle menu ↑**.

Do not create a second duplicate Relationship Map or Conservative Options section lower on the same record merely because the top actions exist.

## Visual language

Preserve the approved look across all muscle cards:
- modernized classical anatomical textbook character
- off-white / warm paper background
- dark navy typography and controls
- thin restrained rules and borders
- detailed hand-drawn / atlas-like anatomical line work
- muted natural muscle tones, especially restrained maroon/red emphasis
- referral areas shown with restrained warm red/orange overlays
- nerves shown subtly when useful rather than as dominant decoration
- clean clinical labels and leader lines
- high information density without visual clutter
- professional, educational, not cartoonish or glossy

A structural 3D source may assist construction, but the final presentation should not simply look like a raw 3D anatomy renderer unless explicitly chosen for a particular deeper-reference tool.

The intended feeling is a contemporary digital descendant of a traditional anatomy atlas while remaining readable on an iPhone.

## Information-density rule

Do not simplify a card merely to preserve a decorative historical look.

If a muscle requires more factual detail to be useful, increase information density intelligently through:
- a better angle
- a second inset
- attachment zoom
- selective labels
- a clinically relevant nerve overlay
- expandable deeper reference

The theme is allowed to yield to factual clarity. Factual clarity is not allowed to yield to theme.

## Responsive adaptation rule

Responsive behavior may change the **card frame and arrangement**, but it must not redesign the approved components.

Locked components include:
- typography character and hierarchy
- warm paper treatment
- anatomical illustration family/style
- muscle highlighting treatment
- trigger-point markers
- referred-pain overlays
- leader lines and anatomical labels
- dividers/rules
- Anatomy / Referred Pain control styling
- reciprocal context-inset treatment
- fact-block styling
- orientation/proximal-distal device
- local muscle-navigation hierarchy
- relative visual hierarchy between illustration, inset, labels, facts, and referral pattern

Allowed responsive changes include:
- card width, height, and aspect ratio
- portrait vs landscape arrangement
- single-column vs multi-column composition
- line wrapping
- spacing compression or expansion
- moving a fact block below an illustration when horizontal room is insufficient
- allowing the card/page to scroll vertically on phones
- enlarging the referred-pain figure to use more of the phone screen
- repositioning the contextual inset to avoid obscuring labels or anatomy
- changing margins and safe-area spacing
- choosing an alternate verified view when the same content cannot be made legible at a phone width

Responsive adaptation must preserve the **same component family and same design language**. A phone version may be taller and narrower than the approved reference, while a desktop version may be wider, but both should clearly read as the same card system.

Do not shrink an entire desktop card as one bitmap merely to make it fit a phone. Reflow the locked components responsively so text and anatomical detail remain legible.

Rule of thumb:

**Resize and reflow the frame; preserve the components and factual hierarchy.**

If a responsive implementation requires changing the actual appearance of a locked primary-card component rather than merely repositioning/resizing it, stop for design review.

## Product hierarchy

The muscle record hierarchy is locked as:

**Muscle → Anatomy / Referred Pain → reciprocal context inset → essential facts → deeper canonical reference → outward reasoning links**

The user should be able to open a muscle, understand where it is and what it attaches to, see relevant high-yield nearby structures, immediately retain a small spatial hint of its referral pattern, and flip/toggle to make that referral pattern primary while retaining muscle-location context.

## Safety and source rule

Referral maps must be independently created from permissible, curated source material. Do not copy copyrighted Travell plates, TriggerPoints.net artwork, flip-chart plates, or arbitrary web images. Referral patterns are educational pattern references and must not be presented as diagnostic proof.

The same principle applies to anatomy artwork: public-domain/open structural references may support construction according to their licenses; protected medical illustrations may inform factual research and verification but should not be closely reproduced.

## Illustration verification status

Every production visual should have an internal status such as:
- Verified
- Needs correction
- Pending visual
- Text only
- Retired

A structurally useful but anatomically unverified image may remain gated while the written canonical record stays available.

## Drift rule

Future implementation should be compared against:

1. the approved Serratus anterior cards for **primary card identity, component appearance, orientation device, interaction, hierarchy, referral prominence, reciprocal inset behavior, and responsive treatment**
2. the approved Scalenes + brachial plexus concept for **secondary anatomy-illustration density, clinically useful adjacent-structure treatment, and multi-view/inset logic**
3. verified canonical data and cited anatomy/referral sources for **factual correctness**

If a proposed muscle-card UI materially departs from the primary card system, treat that as design drift and stop for review before scaling it across the app.

If a proposed illustration conflicts with verified anatomy, the anatomy wins and the inaccurate visual detail must be corrected without treating that correction as design drift.
