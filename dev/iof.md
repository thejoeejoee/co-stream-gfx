# IOF TV Broadcast Graphics — Design Reference

> Consolidated from **IOF Brand Book 2.0**, **IOF TV Manual for Broadcasters** (2022-08-19),
> **IOF GFX Layout Overview** (TWG, Version 1, 2022-05-13), **IOF Map Broadcast Specification 2025**
> (Paradigm.ai), and reference screenshots in `dev/iof-graphics/TV Graphics example pictures/`.

---

## 1. Brand Colors

### Core Palette

| Name            | HEX       | RGB             | CMYK              | Notes                                       |
|-----------------|-----------|-----------------|--------------------|----------------------------------------------|
| **IOF Red**     | `#e30420` | 228 / 5 / 32    | 0 / 100 / 91 / 0  | Vector data shows `#ed1b2d` in some contexts |
| **IOF Green**   | `#00794c` | 0 / 121 / 77    | 100 / 0 / 79 / 28 | Vectors: `#008256`, `#00764b`                |
| **IOF Blue**    | `#307ea1` | 48 / 126 / 162  | 80 / 40 / 25 / 2  | Vectors confirm `#3380a1`, `#307ea2`         |
| Table Green 20% | `#bfdbd0` | 206 / 225 / 216 | —                  | Used for table body rows in print            |
| Dark Text       | `#231f20` | 35 / 31 / 32    | —                  | Near-black; never pure `#000`                |
| White           | `#ffffff` | 255 / 255 / 255 | —                  | Content backgrounds, text on color           |

### TV Graphics Color Usage

In broadcast graphics the three core colors map to specific roles:

| Role                          | Color         | Usage                                                                 |
|-------------------------------|---------------|-----------------------------------------------------------------------|
| **Rank / Time / Highlight**   | IOF Red       | Rank boxes, time-gap cells, value columns, replay wipe accent         |
| **Section headers / Footers** | IOF Blue      | Header bars, split/finish footers, athlete nameplates                 |
| **Accent / Logo**             | IOF Green     | Logo mark, result table top layers, time-gain indicators (split view) |
| **Content base**              | White         | Name fields, label columns, content backgrounds                      |
| **Body text**                 | Dark / Black  | Athlete names, labels, country codes                                  |
| **Dividers**                  | Light gray    | Row separators within tables                                          |

### WOD (World Orienteering Day) Extended Palette

| Name    | PMS             | HEX       | RGB             | CMYK              |
|---------|-----------------|-----------|-----------------|---------------------|
| Grass   | 360 U           | `#63b450` | 100 / 180 / 80  | 65 / 0 / 85 / 0    |
| Ocean   | 2995 U          | `#009ee3` | 0 / 160 / 225   | 100 / 0 / 0 / 0    |
| Sand    | 1585 C          | `#ec6607` | 235 / 100 / 10  | 0 / 70 / 100 / 0   |
| Petunia | Rhodamine Red C | `#e5007d` | 230 / 0 / 126   | 0 / 100 / 0 / 0    |
| Rose    | 185 C           | `#e30613` | 225 / 5 / 20    | 0 / 100 / 100 / 0  |
| Sun     | 7406 U          | `#f9b122` | 250 / 175 / 35  | 0 / 35 / 90 / 0    |
| Lake    | 2945 C          | `#0050a0` | 0 / 80 / 160    | 100 / 70 / 0 / 0   |
| Forrest | 348 C           | `#007d3c` | 0 / 125 / 60    | 100 / 30 / 100 / 0 |

---

## 2. Typography

### Font Families

| Priority    | Typeface                | Weights Available              | Role                     |
|-------------|-------------------------|--------------------------------|--------------------------|
| **Primary** | ITC Franklin Gothic Std | Book, Medium, Demi, Heavy      | All body and heading text  |
| Secondary   | Myriad Pro              | Light, Bold                    | Supplementary text       |
| Tertiary    | Gill Sans               | Regular, SemiBold, Bold        | Alternative / legacy     |
| Fallback    | Arial                   | Regular, Bold                  | When above unavailable   |

### Size Examples (from Brand Book)

| Element  | Font                    | Size / Leading | Color     |
|----------|-------------------------|----------------|-----------|
| Heading  | Franklin Gothic Heavy   | 24 pt          | IOF Green |
| Body     | Franklin Gothic Book    | 9 pt / 13 pt   | Black     |

### TV Graphics Typography (from GFX Layout Overview)

| Element              | Font                  | Size        | Color     |
|----------------------|-----------------------|-------------|-----------|
| Page headings        | Franklin Gothic Heavy | 48 pt       | —         |
| Section titles       | Franklin Gothic Heavy | 16–20 pt    | IOF Blue  |
| Body / descriptions  | Franklin Gothic Book  | 10–13 pt    | Black     |
| Small labels         | Verdana               | 8–10 pt     | Black     |
| Numbers / data       | Arial Bold            | 16 pt       | White     |

### General Rules

- **All text in broadcast graphics is UPPERCASE.**
- Athlete names must be written in full, preferably with a country code.
- Bold, heavy-weight sans-serif for maximum broadcast readability.

### Available Font Files

Located in `dev/iof-graphics/Fonts/`:

```
itcfranklingothicstd-book.otf
itcfranklingothicstd-hvy.otf
itcfranklingothicstd-demi.otf
MyriadPro-Bold.otf
MyriadPro-Light.otf
GillSans.ttc
```

---

## 3. Logo

### Description

The IOF logo consists of two elements:
1. **Red sweep** — a curved triangular wedge / sail-like form on the left, functioning as a stylized "I". Dynamic, implying motion and speed.
2. **Green "OF"** — bold, italicized, rounded letterforms. The "O" has a diagonal cut-out; the "F" has two horizontal arms.

Together they read **IOF** with the red mark leading into the green letters.

### Available Files

| File                                      | Format | Notes               |
|-------------------------------------------|--------|----------------------|
| `IOF Logos/iof logo colour.eps`           | EPS    | Vector, full color   |
| `IOF Logos/iof-logo-colour-withouttext.png` | PNG  | Without "IOF" text   |

### Usage Rules

- Keep the logo **horizontal** at all times.
- Maintain **minimum clear space** of one "a" unit (measured from logo edges) around all sides.
- Keep **proportions intact** — no stretching or distorting.
- Separate from other text/graphics by at least the clear-space distance.
- Available variants: **Colour** and **Negative** (for dark backgrounds).
- Discipline symbols exist separately from discipline logos — do not combine arbitrarily.

### TV Placement Rules

- IOF logotype must be shown during live broadcast.
- Temporary event logo goes in the **lower-right corner**.
- Domestic broadcasters may place their bug/logo **above** the event logo.
- No other broadcaster bugs or logos during live segments.

---

## 4. Screen Layout and Dimensions

### Canvas

| Property                  | Value                                        |
|---------------------------|----------------------------------------------|
| Output resolution         | **1920 × 1080** (Full HD)                    |
| Preferred signal          | 1080i50 (alternative: 720p50)                |
| Design vectors            | 960 × 540 at 150 dpi                        |
| Export                    | PNG at **2× resolution** (= 1920 × 1080)    |
| Broadcast margins         | **100 px** from each screen edge             |

### Graphic Positioning

| Graphic Type           | Screen Position     | Sizing                                      |
|------------------------|---------------------|----------------------------------------------|
| Lower thirds           | **Bottom-left**     | Variable width, compact height               |
| Split comparison panel | **Bottom-right**    | Narrow vertical stack                        |
| Course parameters      | **Bottom-right**    | Compact info box                             |
| Weather conditions     | **Bottom-right**    | Compact horizontal panel                     |
| Results table          | **Upper-center**    | ~59% screen width, ~70% screen height        |
| Start lists            | **Upper-center**    | Similar to results table                     |
| Standings              | **Center overlay**  | Centered over video                          |
| Event ID               | **Lower-center**    | Wide title card                              |
| Event logo / watermark | **Any corner**      | Small, unobtrusive                           |
| Replay wipe            | **Full screen**     | Covers almost the entire screen              |
| Sponsor overlay        | **Variable**        | Flexible size and position                   |

### Design Principle

> Graphics are placed in corners/edges, keeping the **center of the screen clear** for live action footage.
> Unused graphic space must be replaced by video — never left blank.

---

## 5. Graphic Components

### 5.1 Lower Thirds (Name Straps / Split Info)

**Composition: 3 layers stacked vertically.**

| Layer  | Content                              | Background   | Text         |
|--------|--------------------------------------|--------------|--------------|
| Top    | Title holder (main title)            | IOF Blue     | White        |
| Middle | Subtitle holder (secondary info)     | IOF Blue     | White        |
| Bottom | Content background (data rows)       | White        | Black        |

**Long template** — full-width lower third:
1. Main title (variable length)
2. Secondary title (can include sponsors)
3. White content background (variable width, variable text lines)
4. Titles and time data
5. Optional red square logo element
6. Optional event logo + coloured accent line

**Short template** — same vertical spacing, shortened horizontally:
- Left or right justified, depending on screen placement

**Athlete Lower Third (finish/split):**

| Element                | Background | Text  |
|------------------------|------------|-------|
| Rank number            | IOF Red    | White |
| Athlete name           | White      | Black |
| Country flag           | Inline     | —     |
| Time / time gap        | IOF Red    | White |
| Footer (FINISH/SPLIT)  | IOF Blue   | White |
| IOF logo box           | White      | —     |

Typical layout for finish ranking:
```
┌─────┬──────────────────────┬──────┬─────────┐
│  1  │  ALEXANDERSSON       │  SE  │  32:11  │
├─────┼──────────────────────┼──────┼─────────┤
│  2  │  AEBERSOLD           │  CH  │  +0:28  │
├─────┼──────────────────────┼──────┼─────────┤
│  3  │  HIRVONEN            │  FI  │  +0:52  │
├─────┴──────────────────────┴──────┴─────────┤
│  FINISH                          │ IOF logo │
└──────────────────────────────────┴──────────┘
```

### 5.2 Top Scoreboard

Uses the same animation system as lower thirds, with more subtle and slower movements.

Elements:
1. Large event title (variable length)
2. Smaller subtitle (can include sponsors)
3. Team/runners, overall time, leg time (flexible number of text lines)
4. White content background (each line is a separate graphic element)
5. Event title holder
6. Optional red square logo element

### 5.3 Results Tables

**Design system:** White background base, green top layers, event logo.

| Element              | Background | Text  |
|----------------------|------------|-------|
| Header               | IOF Blue   | White |
| IOF logo box         | White      | Color |
| Rank column          | IOF Red    | White |
| Name / Country area  | White      | Black |
| Time / Points column | IOF Red    | White |
| Row dividers         | Light gray | —     |

- No zebra striping — rows use uniform white/light gray with divider lines.
- Results grid is fully editable (colors, layout).
- For updates: export grid as static image, cross-dissolve between states.

### 5.4 Start Lists

Same design system as results tables, but in **columns** rather than rows.

- Grid editable in Canva, each item is a separate text block.
- Prebuilt examples: **3 columns**, up to **21 items**.
- More or fewer columns can be used.

### 5.5 Course Parameters / Weather Conditions

Compact info box with consistent structure:

| Element       | Background | Text  |
|---------------|------------|-------|
| Header bar    | IOF Blue   | White |
| Label column  | White      | Black |
| Value column  | IOF Red    | White |
| Row dividers  | Light gray | —     |

**Course parameters shown:** Controls, Length (km), Climb (m), Estimated winning time, Start interval.
For relays: legs are specified (e.g. "LEG 1-3" or "LEG 1&4" / "LEG 2&3").

**Weather conditions shown:** Condition (text, e.g. "SUNNY"), Temperature (°C), Wind (km/h). No icons — text only.

### 5.6 Event ID / Title Card

- Wide rectangular panel, lower-center of screen.
- Blue header bar with event series name (e.g. "WORLD ORIENTEERING CHAMPIONSHIPS 2022").
- White content area split into two columns:
  - **Left:** IOF logo + event branding logo
  - **Right:** Event name, location, date — all bold, black, uppercase.

### 5.7 Relay Name Graphic

Two-row lower third:
- **Top row:** Red team number box → White team name bar → National flag
- **Bottom row:** IOF Blue bar with white athlete names (initial + surname, comma-separated)

### 5.8 Split Comparison Panel (Bottom-Right)

Vertical stack positioned bottom-right:

| Element          | Background | Text  |
|------------------|------------|-------|
| Control code     | White      | Black |
| Time delta (+)   | IOF Red    | White |
| Time delta (−)   | IOF Green  | White |
| Athlete nameplate| IOF Blue   | White |

Used for showing an individual athlete's split-by-split comparison vs. leader.

### 5.9 Event Logo / Watermark

- Background event logo — can be shown in **any corner**.
- Black corner marker — can be placed in **any corner**.
- Additional logo holder — can be hidden or shown.

### 5.10 Sponsor Overlays

- Variable in size and position.
- Use event graphic colors.
- Simple logo holders included in the package.

### 5.11 Replay Wipe

- Covers **almost the entire screen**.
- **6 colour theme options** (adaptable to event branding).
- Available labels: **REPLAY**, **SLOW MOTION**, **COURSE REVEAL**.
- Can include sponsor logos.

---

## 6. Animation System

### Standard Three-Layer Slide Transition

Used by: Segment titles, lower thirds, results tables, start lists, top scoreboard.

| Layer | Direction                | Color     |
|-------|--------------------------|-----------|
| 1     | Left → Centre            | IOF Red   |
| 2     | Right → Centre           | IOF Green |
| 3     | Top → Bottom             | White     |

- Title text **fades on** after the slide transition completes.
- Top scoreboard uses the **same animation** but with more subtle and slower movements.
- Static versions are marked with **"S"** in the top-right corner.

### Results Update Animation

- Export entire result grid as a **static image** (starting state).
- Duplicate grid with altered results.
- **Cross-dissolve** between the two to show changes or scrolling.

### Replay Wipe Animation

- **Staggered multi-layer scale reveal**.
- Layers scale **left → right**, slightly diagonal.
- Closing transition is **reverse**.
- Text **fades on and off** during the transition.

---

## 7. Time Display Formats

| Context                         | Format             | Example              |
|---------------------------------|--------------------|----------------------|
| Leader / absolute time          | `MM:SS` or `H:MM:SS` | `32:11`, `1:10:12` |
| Time behind leader              | `+M:SS`            | `+0:28`, `+2:03`     |
| Time gain (split comparison)    | `−M:SS`            | `−0:34`              |
| Split label                     | Text               | `SPLIT 2 - CONTROL 14` |
| Relay leg label                 | Text               | `LEG 2 SPLIT 1 - CONTROL 7` |

- No hundredths or milliseconds in broadcast graphics.
- Only athletes **still relevant** in the competition should appear in position/time graphics.
- Passed athletes/teams need some kind of **on-screen indication**.

---

## 8. Timing Data Requirements

The following data should be available for TV graphics:

- Start time and race time
- Running times between split points
- Positions at all split points
- Radio controls and named spectator points
- Time/positions for all athletes and teams still relevant
- Number of athletes/teams passed
- Gaps in relation to leader
- Gaps in relation to relevant teams
- Gaps between athletes/teams at split points
- Time differences in comparison and head-to-head graphics
- Best times, leg times, overall times
- Running speed (if possible)
- Projected times and positions
- Running order in relays

---

## 9. Mandatory vs. Recommended Graphics

### Mandatory (all live broadcasts)

1. Event title graphic (e.g. "Women, final, 10.8 km")
2. Lower thirds and name straps
3. Live clock (as much as possible)
4. Results and standings
5. Split times
6. Starting order
7. Replay wipe with sponsor
8. Pre-made TV clips
9. Event title scene with host city/region and date

### Strongly Recommended (championships)

- Positioning and data visualisation
- Temporary event logo (lower right corner)
- Head-to-head graphics
- Lower thirds on all interview clips
- TV presentation of top athletes
- Newsticker
- Virtual graphics

---

## 10. Broadcast Package Structure (2025 Canva)

The complete IOF graphics package consists of **19 Canva pages**:

1. Front page
2. Segment title overviews (animated + static)
3. Top scoreboard (animated + static)
4. Lower thirds with multiple text options (animated + static)
5. Results tables (animated + static)
6. Event logo / watermark
7. Sponsor overlays
8. Replay wipes with opening and closing transitions (6 colour options)
9. Start list columns (animated + static)

> Based on the **IOF L3 design system**.
> Created by Paradigm.ai (contact: cees@paradigm.ai).
> All details are in Canva; this is a general overview.

---

## 11. GFX Template Folders (TWG 2022 Version)

From the IOF GFX Layout Overview, template assets are organized by folder:

| Page | Graphic Type                    | Folder Reference            |
|------|---------------------------------|-----------------------------|
| 2    | Event Title                     | `002_eventID`               |
| 3    | Weather Conditions              | `004_weather`               |
| 4    | Course Parameters               | `003_courseInfo`             |
| 5    | Individual Start List           | `005_startlist`             |
| 6    | Athlete Presentation (single)   | `007_name`                  |
| 7    | Athlete Presentation (extended) | `008_name_bio`              |
| 8–9  | Intermediate GFX (split times)  | `023_024_individual_splits` |
| 10   | Standings at Finish/Split       | `009_results`               |
| 11   | Finish GFX                      | `011_results`               |
| 13   | Flower/Podium Ceremony          | `014_flower`                |

---

## 12. General Broadcast Rules

- All graphics must be **in English** (unless event-specific agreement says otherwise).
- All graphic/lower third templates must be **approved by IOF**.
- Graphics must match the **established visual identity** of the event and the official graphic package.
- It must always be clear whether the race is **individual start**, **mass start**, **chasing start**, or **relay**.
- Athlete names: written **in full**, preferably with **country code**, **spelt correctly**.
- Test graphics **well in advance** of the event.
- If graphic data is not used, replace with **video** — never leave blank spaces.
- All graphics produced **at source and on-site**.

---

## 13. Flag vs. Country Code Display

From the existing codebase logic:

|                    | National Event  | International Event     |
|--------------------|-----------------|--------------------------|
| **Individual race**| Club logo       | National flag            |
| **Relay race**     | Club logo       | Club logo + National flag|

---

## 14. Source Files Reference

```
dev/iof-graphics/
├── Fonts/
│   ├── GillSans.ttc
│   ├── itcfranklingothicstd-book.otf
│   ├── itcfranklingothicstd-hvy.otf
│   ├── itcfranklingothicstd-demi.otf
│   ├── MyriadPro-Bold.otf
│   └── MyriadPro-Light.otf
├── IOF Logos/
│   ├── iof logo colour.eps
│   └── iof-logo-colour-withouttext.png
├── Manuals/
│   ├── IOF Brand book 2.0.pdf
│   ├── IOF TV Manual for broadcasters_20220819.pdf
│   └── IOF GFX  LAYOUT overview.pdf
├── TV Graphics example pictures/
│   ├── EventIDexample.png
│   ├── Variant2_individualsplit.png
│   ├── coursedetailsindividual.png
│   ├── courseparametersRELAY.png
│   ├── finishwithcomparison.png
│   ├── indivdualsplit_iof_gfx3.png
│   ├── kuopio-woc-2023-euromeeting-1024x396.png
│   ├── kuopio.png
│   ├── relayname.png
│   ├── relayscroll.png
│   ├── relaystartlist.png
│   ├── results.jpg
│   ├── sprintrelaycourses.png
│   ├── standings list.png
│   └── weatherconditions.png
└── vmixeventid.gtzip
```
