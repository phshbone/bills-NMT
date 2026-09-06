# Anatomy Artwork Qualification Contract v1.0

Status: LOCKED FOR QUALIFICATION
Scope: manual artwork qualification before building ANATOMY-ARTWORK-BUILDER

## Core authority rule

Anatomical facts drive the artwork; artwork never determines anatomical facts.

The canonical anatomy library v0.3 is the factual base. Existing richer verified app overlays may add clinically useful structure detail, but they must not contradict the canonical record. Any conflict stops publication until resolved.

## Visual direction

Clinical atlas first. Vintage medical character second.

Use:
- cream/parchment field
- dark navy/ink linework and labels
- restrained muted burgundy to identify the target muscle or clinically relevant overlay
- classic anatomical engraving / medical-atlas character without copying any protected source plate
- sufficient bone and neighboring anatomy to orient the target structure
- readable composition at phone-card scale
- original artwork only

Avoid:
- decorative anatomy that obscures attachments
- photorealistic gore
- exaggerated muscle bulk
- generic fitness-poster aesthetics
- false precision
- copied Travell/Simons, TriggerPoints.net, atlas, or other protected artwork

## Required output states

Every qualified muscle must treat these independently:

1. Anatomy artwork
2. Referral artwork

Anatomy artwork may be approved while referral artwork remains gated.

No image changes factual or referral status by itself.

## Visual-load tiers

### Tier 1 — Standard
One principal anatomy view. Use when one view can show the clinically material origin/insertion relationship and orientation without hiding essential anatomy.

### Tier 2 — Multi-view
Two materially useful views, typically Main + Attachment Detail. Use when a second angle materially improves attachment, subdivision, or neurovascular understanding. Scalenes are the qualification reference.

### Tier 3 — Extended atlas
Three or more materially distinct required views, subdivisions, or referral patterns. Phone presents one primary view at a time with labeled access to the others; never a tiny mosaic. Trapezius is the first stress-test reference.

Always use the lowest tier that preserves clinically material information.

## Anatomy artwork gates

A candidate anatomy image cannot become approved unless all applicable checks pass:

- correct target muscle identity
- correct side/orientation where side matters
- origin landmarks materially correct
- insertion landmarks materially correct
- muscle course and gross geometry materially plausible
- neighboring bones/structures do not introduce anatomical contradictions
- subdivisions represented when clinically/materially required
- nearby nerves/vessels shown only when spatially useful and evidence-supported
- proximity is not presented as compression, entrapment, injury, or causation
- required landmarks remain visible at phone scale
- image uses object-fit contain / no important crop in the app
- original visual composition; no copied protected plate

If any check fails, status remains Artwork_pending and the image is regenerated or revised.

## Referral artwork gates

Referral artwork is a separate original schematic based on supported referral neighborhoods.

Requirements:
- no copying of Travell/Simons, TriggerPoints.net, Flip Chart, or other protected plate geometry
- distinguish direct Travell evidence from derivative TriggerPoints.net evidence in metadata
- preserve broad neighborhood uncertainty when exact essential/spillover boundaries are not independently supported
- do not convert a referral pattern into diagnosis or causal certainty
- no publication when source access is insufficient; use Needs Travell review where appropriate

## Neurovascular rule

Include nearby nerves or vessels visually only when all are true:
- spatial relationship is clinically high-yield
- relationship is supported by the structured record/source set
- inclusion improves orientation or reasoning
- image remains legible at target size

Otherwise keep the relationship in text/deeper reference.

## Card behavior rule

The original locked muscle-card UI remains the primary source of truth for presentation.

Preserve:
- Anatomy / Referred Pain two-state behavior
- title hierarchy
- main illustration area
- reciprocal context inset
- proximal/distal orientation compass
- compact Origin / Insertion / Action / Innervation essentials
- Relationship Map and Conservative Options promotion
- reference drawer / bottom-sheet behavior on phone

Artwork adapts to the card. The card does not get redesigned around each artwork specimen.

## Qualification set

The manual production method must pass three cases before automation:

1. Tier 1 — Extensor carpi radialis brevis (ECRB)
2. Tier 2 — Scalenes
3. Tier 3 — Trapezius

The method is not eligible to become ANATOMY-ARTWORK-BUILDER until these three demonstrate repeatable anatomical fidelity, consistent visual language, responsive readability, and proper gating.

## Tier-1 qualification brief: ECRB

Runtime ID: extensor-carpi-radialis-brevis
Purpose: prove the ordinary one-view case.

Required visible anatomy:
- distal humerus / lateral epicondyle region
- common extensor origin context without implying the whole tendon is ECRB
- posterior-lateral forearm course of ECRB
- radius and ulna sufficient for orientation
- wrist / carpal context sufficient to understand distal course
- third metacarpal base insertion context

Verified app facts to preserve:
- origin: lateral epicondyle via common extensor tendon
- insertion: base of third metacarpal
- actions: wrist extension; assists radial deviation; wrist stabilization during gripping
- innervation: deep branch radial nerve / posterior interosseous pathway

Qualification artwork should emphasize the target muscle in muted burgundy and keep neighboring musculature in restrained atlas linework/neutral tissue tones. It should not attempt referral mapping in the anatomy plate.

## Qualification result states

Each exemplar must finish as one of:
- PASS — suitable to lock as production reference
- REVISE — method is sound but image needs correction
- FAIL — production rule itself is inadequate and must be changed

Only after all three exemplars PASS may the process be encoded as a reusable artwork-builder skill.
