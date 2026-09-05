# Muscle Card Visual Source of Truth

Status: LOCKED
Date: 2026-09-04

The canonical visual source of truth for all muscle records is the paired Serratus anterior concept generated and approved in the Neuromuscular Therapy project chat on 2026-09-04:

1. **Serratus anterior — Anatomy card**
2. **Serratus anterior — Referred Pain card**

These two existing approved images are the reference for **visual language, component design, hierarchy, and interaction**. Do not regenerate, restyle, reinterpret, or replace that design without explicit user approval.

## Critical anatomical-accuracy boundary

The approved Serratus concept images are **not** the anatomical-data source of truth.

Generated or illustrative artwork must never be trusted to invent or verify:
- rib numbering
- vertebral level numbering
- origin landmarks
- insertion landmarks
- attachment levels
- nerve labels
- bony landmarks
- side/orientation labels
- trigger-point coordinates
- referred-pain boundaries

Those facts must come first from verified structured anatomy/referral data and appropriate cited sources. The illustration must then conform to those facts.

**Rule: anatomical facts drive the artwork; artwork does not determine anatomical facts.**

Before a labeled anatomy image is treated as production-ready, verify every visible number, label, origin, insertion, and attachment against the canonical data record. If the underlying image conflicts with the verified anatomy, correct or replace the inaccurate visual detail while preserving the locked visual style.

The current approved Serratus concept therefore remains the **style/component source of truth**, while any inaccurate rib numbering, origin/insertion placement, or other anatomical labeling shown in that concept is explicitly **not locked** and must be corrected before production use.

## Core interaction

Every muscle record keeps one stable card/page identity with a prominent two-state control:

**Anatomy | Referred Pain**

The user may tap the control; swipe may be added later as a secondary gesture, but the visible control remains primary for discoverability.

## Anatomy state

The top of the card prioritizes:
- muscle name
- regional anatomical illustration in the approved modernized classical-anatomy style
- clear target-muscle highlighting
- origin callout
- insertion callout
- concise action/function
- concise innervation

Below the primary visual/fact block, deeper material uses expandable sections rather than forcing one uninterrupted textbook page.

Recommended sections:
- Actions & Function
- Innervation
- Relationships
- Movement links
- Clinical reasoning
- Sources

The primary anatomy facts must remain visible without opening an accordion.

## Referred Pain state

Referred pain is a first-class view, not a buried secondary feature.

The referred-pain state uses the approved Serratus anterior Referred Pain card as its direct visual reference and prioritizes:
- large regional body figure appropriate to the muscle
- clearly marked trigger-point/trigger-zone locations when supported by curated sources
- prominent referred-pain distribution overlay
- concise typical-referral description
- pattern note / variability language
- educational, non-diagnostic caution
- source/provenance access

The referral visualization may occupy more screen area than the anatomy illustration because this view exists specifically to make the referral pattern immediately understandable.

## Visual language

Preserve the approved look across all muscle cards:
- modernized classical anatomical textbook character
- off-white / warm paper background
- dark navy typography and controls
- thin restrained rules and borders
- detailed hand-drawn anatomical line work
- muted natural muscle tones
- referral areas shown with restrained warm red/orange overlays
- clean clinical labels and leader lines
- high information density without visual clutter
- professional, educational, not cartoonish, glossy, or 3D-rendered

The intended feeling is a contemporary digital descendant of a traditional anatomy atlas while remaining readable on an iPhone.

## Responsive adaptation rule

Responsive behavior may change the **card frame and arrangement**, but it must not redesign the approved components.

Locked components include:
- typography character and hierarchy
- warm paper treatment
- anatomical illustration style
- muscle highlighting treatment
- trigger-point markers
- referred-pain overlays
- leader lines and anatomical labels
- dividers/rules
- Anatomy / Referred Pain control styling
- fact-block styling
- accordion/detail-section styling once implemented
- relative visual hierarchy between illustration, labels, facts, and referral pattern

Allowed responsive changes include:
- card width, height, and aspect ratio
- portrait vs landscape arrangement
- single-column vs multi-column composition
- line wrapping
- spacing compression or expansion
- moving a fact block below an illustration when horizontal room is insufficient
- allowing the card/page to scroll vertically on phones
- enlarging the referred-pain figure to use more of the phone screen
- changing margins and safe-area spacing

Responsive adaptation must preserve the **same visual components and same design language**. A phone version may be taller and narrower than the approved reference, while a desktop version may be wider, but both should clearly read as the same card system.

Do not shrink an entire desktop card as one bitmap merely to make it fit a phone. Reflow the locked components responsively so text and anatomical detail remain legible.

Rule of thumb:

**Resize and reflow the frame; preserve the components.**

If a responsive implementation requires changing the actual appearance of a locked component rather than merely repositioning/resizing it, stop for design review.

## Product hierarchy

The muscle record hierarchy is now locked as:

**Muscle → Anatomy / Referred Pain → deeper expandable reference → outward reasoning links**

This restores the original Neuromuscular Therapy concept: the user should be able to open a muscle, immediately understand its anatomy, and immediately flip/toggle to see its referred-pain pattern.

## Safety and source rule

Referral maps must be independently created from permissible, curated source material. Do not copy copyrighted Travell plates or arbitrary web images. Referral patterns are educational pattern references and must not be presented as diagnostic proof.

## Drift rule

Future implementation should be compared against the two approved Serratus anterior cards for **style, hierarchy, component appearance, referral prominence, and Anatomy/Referred Pain relationship**. Anatomical facts must instead be compared against the verified canonical data and cited sources.

If a proposed muscle-card UI materially departs from the approved visual language or responsive-adaptation rule, treat that as design drift and stop for review before scaling it across the app. If a proposed illustration conflicts with verified anatomy, the anatomy wins and the inaccurate visual detail must be corrected without treating that correction as design drift.
