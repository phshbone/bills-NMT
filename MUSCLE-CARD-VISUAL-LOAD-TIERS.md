# Muscle Card Visual Load Tiers

Status: LOCKED ADJUNCT TO `MUSCLE-CARD-VISUAL-SOURCE-OF-TRUTH.md`
Updated: 2026-09-05

## Purpose

This document defines how the locked muscle-card family handles muscles and muscle groups that require different numbers of anatomy or referred-pain images.

It does **not** create three unrelated card designs. All tiers use the same canonical muscle-card identity, controls, typography, orientation device, Anatomy / Referred Pain relationship, reciprocal context inset, fact hierarchy, navigation, and visual language defined in `MUSCLE-CARD-VISUAL-SOURCE-OF-TRUTH.md`.

The tiers change only the **visual payload and navigation needed to present verified anatomy/referral content without crowding the card**.

Core rule:

**Escalate the visual payload only when the anatomy or referral framework requires it. Do not shrink multiple important figures into unreadable panels merely to preserve one fixed layout.**

## Tier 1 — Standard card

Use when one primary anatomy view and one primary referral view can explain the muscle adequately.

### Anatomy state
- one dominant verified anatomy image
- one small referred-pain context inset
- optional attachment marker/zoom only if it does not function as a separate required view

### Referred Pain state
- one dominant referred-pain image
- one small anatomy-location context inset

### Typical candidates
Smaller or visually straightforward muscles with one principal structural/referral presentation.

Examples may include pectoralis minor, subclavius, teres minor, anconeus, coracobrachialis, or comparable records once their source material is curated.

## Tier 2 — Multi-view card

Use when a muscle requires **two materially useful views** on either Anatomy or Referred Pain to communicate the record correctly.

Examples of reasons to escalate:
- front and back views are both clinically necessary
- superficial and deep relationships cannot be understood from one view
- a second attachment angle is necessary
- one major subdivision has a distinct presentation
- referral distribution cannot be represented adequately in one view

### Anatomy state
- one dominant primary anatomy view
- one secondary verified view, inset, attachment zoom, or breakaway
- small referred-pain context inset remains present

### Referred Pain state
- one dominant referral view
- one additional labeled referral view when needed
- small anatomy-location context inset remains present

### Interaction
The second view may be exposed by:
- a compact labeled toggle
- thumbnail/inset tap
- `View 1 / View 2`
- meaningful labels such as `Front / Back`, `Superficial / Deep`, or `Main / Attachment`

Avoid unlabeled carousel dots when the distinction between views carries clinical meaning.

### Current first reference candidate
**Scalenes** may use Tier 2 if the verified primary three-quarter anatomy view cannot simultaneously show all required attachment and neural relationships legibly. A second attachment/deeper-neural view is permitted without changing the card family.

## Tier 3 — Extended atlas card

Use when the curated source record contains **three or more materially distinct required images, subdivisions, trigger-point/referral patterns, or viewpoints** that should remain individually inspectable.

This is the contingency tier for large or complex muscles/groups.

### Examples of likely Tier 3 candidates from the Travell/Simons flip-chart structure
- trapezius — multiple upper/middle/lower trigger-point/referral presentations
- pectoralis major — multiple fiber sections/regions and referral presentations
- latissimus dorsi — back, front, and uncommon lower trigger-point presentation
- serratus anterior — side, back, and front referral views
- sternocleidomastoid — sternal and clavicular divisions with distinct presentations; may escalate depending on final anatomy/referral treatment
- masseter — superficial/deep and region-specific presentations
- triceps brachii — multiple trigger-point locations across heads/regions
- grouped hand/finger flexor-extensor records where several distinct patterns must remain separately inspectable

Classification is determined by the verified canonical record, not by the size of the muscle alone.

### Anatomy state
- one dominant primary anatomy view
- a compact labeled view selector for additional verified views
- only one secondary view should occupy major card space at a time
- small referred-pain context inset remains present

### Referred Pain state
- one **definitive overview/composite** is selected as the default primary image whenever a clinically faithful composite can be created
- additional distinct referral patterns/views remain accessible through a labeled selector or gallery
- small anatomy-location context inset remains present

### Interaction
Preferred control patterns:
- labeled chips/tabs such as `Overview`, `Upper`, `Middle`, `Lower`
- anatomical labels such as `Anterior`, `Posterior`, `Deep`, `Superficial`
- view labels such as `Front`, `Back`, `Side`
- trigger-point groups such as `TrP 1`, `TrP 2`, etc. only when that labeling is faithful to the curated source framework and useful to the user

Do not display three or more full panels simultaneously on a phone merely because three source figures exist.

The Tier 3 card should still feel calm and intentional: **one primary figure at a time, with obvious access to the rest**.

## Reciprocal inset selection policy

The reciprocal inset must remain a quick visual orientation aid, not a miniature gallery.

### Anatomy-side referral inset
If the referred-pain state has multiple images:
1. prefer a verified overview/composite that best communicates the muscle's overall referral territory
2. if a faithful composite would be misleading, use the most representative/common primary pattern
3. indicate additional content with a small textual cue such as `3 patterns` or `multiple views`
4. never squeeze all referral images into the inset

### Referred-Pain-side anatomy inset
If anatomy has multiple views:
1. use the view that best identifies the muscle's location and orientation
2. do not rotate through views automatically
3. additional anatomy views remain available after switching back to Anatomy

## Definitive-image rule

Every multi-view record must explicitly identify:
- `primaryAnatomyView`
- `primaryReferralView`
- `additionalAnatomyViews[]` when needed
- `additionalReferralViews[]` when needed

For Tier 3 referral records, also record whether `primaryReferralView` is:
- `composite-overview`
- `representative-primary-pattern`

The choice must be justified by the curated source record. It must not be selected merely because one image fits the card better.

## Tier-assignment rule

Assign the lowest tier that can present the verified content without hiding clinically material information.

- Tier 1: one principal view is sufficient
- Tier 2: two materially distinct views are required
- Tier 3: three or more materially distinct views/patterns/subdivisions are required

A card may move upward after source curation reveals additional necessary material. It may move downward if multiple source images can be faithfully consolidated into one independently created verified overview.

Do not force a Tier 3 muscle into Tier 1 for visual neatness.

## Source and copyright boundary

The number of source figures helps determine the required information architecture, but protected source artwork is not copied into the card.

Travell/Simons, the flip charts, and TriggerPoints.net may establish:
- distinct trigger-point groups
- referral territories
- clinically meaningful subdivisions
- number and purpose of necessary viewpoints
- figure cross-references

Final app visuals must be independently constructed and verified according to the main muscle-card source-of-truth rules.

## Responsive rule

All three tiers remain the same card family across phone, tablet, and desktop.

On phone:
- show one dominant figure at a time
- preserve readable labels
- use labeled selectors for additional views
- keep the reciprocal inset subordinate

On larger screens:
- optional side-by-side comparison may be allowed when it improves comparison
- do not turn Tier 3 into an uncontrolled wall of panels

## Verification requirement

Tests for Tier 2 and Tier 3 cards must prove:
- the correct primary view loads by default
- every required additional view is reachable
- labels identify the meaning of each view
- the reciprocal inset remains visible and subordinate
- switching Anatomy / Referred Pain preserves the selected muscle record
- no protected source artwork is used directly
- all production images have passed the anatomical/referral verification gate

## Design intent

The hierarchy is now:

**One muscle-card family → Tier 1 Standard / Tier 2 Multi-view / Tier 3 Extended atlas**

This gives the app enough flexibility for simple muscles and highly complex groups without allowing each muscle to invent its own interface.
