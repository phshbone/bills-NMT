# Muscle Card Visual Source of Truth

Status: LOCKED
Date: 2026-09-04

The canonical visual source of truth for all muscle records is the paired Serratus anterior concept generated and approved in the Neuromuscular Therapy project chat on 2026-09-04:

1. **Serratus anterior — Anatomy card**
2. **Serratus anterior — Referred Pain card**

These two existing approved images are the reference. Do not regenerate, restyle, reinterpret, or replace them without explicit user approval.

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

## Product hierarchy

The muscle record hierarchy is now locked as:

**Muscle → Anatomy / Referred Pain → deeper expandable reference → outward reasoning links**

This restores the original Neuromuscular Therapy concept: the user should be able to open a muscle, immediately understand its anatomy, and immediately flip/toggle to see its referred-pain pattern.

## Safety and source rule

Referral maps must be independently created from permissible, curated source material. Do not copy copyrighted Travell plates or arbitrary web images. Referral patterns are educational pattern references and must not be presented as diagnostic proof.

## Drift rule

Future implementation should be compared against the two approved Serratus anterior cards. If a proposed muscle-card UI materially departs from their hierarchy, visual language, prominence of referral patterns, or Anatomy/Referred Pain relationship, treat that as design drift and stop for review before scaling it across the app.
