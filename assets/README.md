# Asset Inventory

This folder stores brand and media assets used by the local Jade Waves website.

## Assets

### `jade-waves-logo-transparent.png`

- Type: PNG image with transparent background
- Original source filename: `transparent logo.png`
- Source location: `/Users/deepmehta/Documents/Jade Waves Enterprise/Logos & sign/Jade Waves Enterprise/transparent logo.png`
- Description: Preferred Jade Waves Enterprise logo with the lotus-and-wave symbol, the "JADE WAVES" wordmark, and the "ENTERPRISE" sub-label on a transparent background.
- Current usage:
  - Header brand mark in the website
  - Footer brand mark in the website
- Notes: The logo is rendered directly on the dark site background with only a soft shadow for separation.

### `deep-mehta-ceo.jpg`

- Type: JPEG portrait image
- Original source filename: `deep_picture.JPG`
- Source location: `/Users/deepmehta/Documents/Jade Waves Enterprise/deep_picture.JPG`
- Description: Cropped CEO portrait of Deep Mehta prepared for the website so the visible chat watermark area does not appear in the site version.
- Current usage:
  - Homepage `From Our CEO` section
- Notes: This is a site-ready cropped derivative stored separately from the original source image.

## Product Visual Workflow

- Raw product photos can be stored in `assets/` using the product name, for example `quartz-sand.png` or `silica-flour.jpg`.
- Use `/Users/deepmehta/Documents/Jadewaves/prepare_product_visual.py` to turn any raw source image into a consistent square product visual for the website.
- Example:

```bash
cd /Users/deepmehta/Documents/Jadewaves
python3 prepare_product_visual.py assets/quartz-sand.png assets/quartz-sand-visual.webp
```

- The generated `*-visual.webp` file is the preferred website asset for product pages and social preview metadata.
