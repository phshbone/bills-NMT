# Anatomy Card Responsive Frame Spec v1.0

Status: LOCKED FOR IMPLEMENTATION

## Core responsive model

One responsive anatomy-card family, with two first-class phone working modes and an expanded desktop mode.

### Portrait phone — compact reference mode
- Target phone width: approximately 390–414 CSS px.
- Portrait-first anatomy viewport; approximately 4:5 to 3:4.
- Title and state controls remain above the artwork.
- Artwork remains contained; no important crop; object-fit: contain.
- Reference content opens from the bottom as a drawer/sheet.
- Drawer may occupy roughly the lower 35–40% of the screen/card area.
- Critical anatomy must remain understandable in the upper/central visible area while the drawer is open.
- Embedded artwork text is limited to spatially necessary labels and short orientation/view cues.
- Tier 1 may use one subordinate inset if it remains clearly secondary and does not widen the composition.

### Landscape phone — expanded atlas workspace
- Default target split: 60% anatomy workspace / 40% reference panel.
- Use the same arrangement regardless of clockwise or counterclockwise device rotation.
- Anatomy stays on the left; reference panel stays on the right.
- Do not merely stretch the portrait card.
- Landscape may use an expanded composition from the same underlying artwork/source set, with more spatial labels, attachment context, secondary view, or supported neurovascular context when useful.
- The reference panel remains visible and scrolls independently.
- Topic navigation sits at the top of the reference panel.
- Topic interaction pattern: topic menu → selected reference page → Back to topics.
- Do not rely on stacked open accordions.
- Anatomy/state controls remain associated with the anatomy workspace.
- Outer margins are allowed; edge-to-edge is not required when readability is better with containment.

### Desktop — expanded workspace
- Desktop uses the same structural logic as landscape phone, with more breathing room.
- Desktop does not define the source artwork dimensions.
- Do not create a visually unrelated desktop card family.

## Information responsibility

Artwork carries spatial anatomy:
- target muscle/course/tendon
- major attachment landmarks
- essential spatial labels
- orientation cues
- optional subordinate detail view/inset

Reference UI carries explanatory anatomy:
- Origin
- Insertion
- Action/function
- Innervation
- Clinical context
- Related structures
- Related movements
- Relationship Map
- Conservative Options
- Sources / deeper reference

Rule: Artwork labels only what must be spatially understood. The card UI explains everything else.

## Landscape reference-panel behavior

The right-side panel is the landscape equivalent of the portrait bottom drawer.

Initial state shows a compact topic menu. Selecting a topic replaces the menu with that topic's content inside the same panel. Content may scroll independently while the anatomy remains fixed. A Back to topics control returns to the topic menu. An X is not the primary navigation model because the user is navigating within a persistent workspace, not dismissing a modal.

## Locked visual framing palette

### Frame color
Use a rich, very dark hunter green for:
- primary header
- footer / bottom navigation framing
- landscape reference-panel toolbar / topic-navigation strip

The green should be deep, restrained, and serious rather than bright, emerald, or saturated forest green.

### Supporting palette
- Main reading/anatomy field: cream / parchment.
- Primary typography and structural ink/linework: dark navy.
- Active/selected controls and target-muscle emphasis: dusty burgundy / maroon.
- Inactive controls: cream/parchment with restrained navy or burgundy border/text.

Visual hierarchy rule:
- dark hunter green = frame
- navy = ink / structure
- burgundy = emphasis / selected state / target anatomy
- cream = workspace / reading field

Header and footer belong to the same dark hunter-green framing system. They may vary subtly in tone if required for hierarchy, but should clearly read as one frame family.

## Qualification rules

A responsive artwork/card candidate is not qualified if:
- it reads like a wide desktop poster on a phone
- critical labels require pinch zoom
- essential anatomy is lost beneath the portrait drawer
- landscape simply stretches the portrait composition without using the additional width intelligently
- the right reference panel becomes a long stacked accordion page
- anatomy is cropped to make the layout fit
- palette changes reduce text/control contrast

## Current qualification sequence

1. Tier 1 — ECRB: provisional production reference for the compact portrait pattern.
2. Tier 2 — Scalenes: first responsive multi-view test across portrait and landscape.
3. Tier 3 — Trapezius: extended-atlas stress test.

Do not finalize the reusable artwork-builder process until all three cases demonstrate the responsive system successfully.
