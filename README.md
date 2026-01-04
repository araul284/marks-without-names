# ASCII Canvas

A quiet, anonymous drawing space built from text.

ASCII Canvas is a monochrome web experiment where drawings are made not with pixels, but with repetition. The more you draw over a place, the heavier it becomes. Marks accumulate. Shapes emerge. Nothing is erased.

It is part sketchbook, part museum, part terminal window left open at night.

---

## ✦ What is this?

ASCII Canvas is a website where:

* Users draw on a blank ASCII grid
* Each stroke increases the *density* of a cell
* Density maps to heavier ASCII characters
* Finished artworks can be downloaded or published anonymously
* Published works live in a public, scrollable gallery

There are no accounts, no likes, no comments, and no names.

Just marks, weight, and time.

---

## ✦ How it works

### Drawing

* The canvas is a fixed grid of characters
* Drawing is done via mouse or touch
* Each cell stores an intensity value
* Repeated strokes increase intensity

Example density mapping:

```
0 → ' '
1 → '.'
2 → ':'
3 → '*'
4 → '#'
5 → '█'
```

(Exact mapping may vary.)

There is **no eraser**. This is intentional.

---

### Gallery (Museum)

* The homepage is a gallery of all published drawings
* Each artwork is anonymous
* Clicking an artwork opens a full-view mode
* Users can scroll or navigate through works like archived pages

The gallery is meant to be wandered through, not consumed.

---

### Exporting

When finished drawing, users can:

* Download their artwork as:

  * `.txt`
  * `.png`
* Publish it anonymously to the gallery

Once published, artworks cannot be edited or deleted.

---

## ✦ Design Philosophy

* **Monochrome only** (black & white)
* **Text-first** visuals
* ASCII borders, doodled frames, terminal-like layouts
* Minimal UI, generous whitespace

The site should feel like:

* A notebook margin
* An old manuscript
* A forgotten terminal session

---

## ✦ Tech Stack (MVP)

This project is intentionally simple and vibecode-friendly.

* HTML
* CSS
* Vanilla JavaScript

Optional backend:

* Static JSON or minimal API for storing artworks

No frameworks required.

---

## ✦ Running locally

```bash
# clone the repo
git clone <repo-url>

# open index.html in your browser
```

(For MVP, no build step is required.)

---

## ✦ Folder Structure (Suggested)

```
/
├── index.html        # Gallery view
├── canvas.html       # Drawing view
├── styles.css
├── script.js
├── data/             # Stored artworks (JSON)
└── README.md
```

---

## ✦ Non-Goals

* No user profiles
* No social metrics
* No AI-generated art
* No optimization for virality

This project is not trying to scale attention.

---

## ✦ Future Ideas

* Inverted color mode
* Time-based fading drawings
* Collaborative anonymous canvases
* Daily prompt canvas
* SVG export

---

## ✦ Why this exists

Some drawings are not meant to be shared loudly.

They are made because the hand needed to move,
because a thought needed to sit somewhere,
because returning to the same place makes it darker.

ASCII Canvas exists for those moments.

---

Made with care, slowness, and intention.
