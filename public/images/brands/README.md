# Brands — Logo wall

**Component:** `components/BrandsStats.tsx`
**URL prefix:** `/images/brands/`

By default this section loads live brand logos from
[Clearbit Logo API](https://clearbit.com/logo), so nothing needs to live here
unless you want to override a logo with a local asset.

## When to add a local file

- The Clearbit logo is poor quality or not monochrome enough for the dark theme.
- The brand isn't on Clearbit.
- You want a custom treatment (e.g. knocked-out wordmark in pure white).

## Suggested filenames

| Filename       | Brand       |
|----------------|-------------|
| `sary.svg`     | Sary        |
| `nafas.svg`    | Nafas       |
| `noon.svg`     | Noon        |
| `careem.svg`   | Careem      |
| `deliveroo.svg`| Deliveroo   |
| `tabby.svg`    | Tabby       |
| `bayut.svg`    | Bayut       |
| `souq.svg`     | Souq        |
| `healthigo.svg`| Healthigo   |
| `shorefield.svg`| Shorefield |
| `zain.svg`     | Zain        |
| `sampo.svg`    | Sampo       |

## Specs

- **Format:** SVG (preferred) or monochrome PNG.
- **Target height:** 32–40 px render; provide SVG or ≥ 200 px PNG.
- **Color:** single color, ideally pure white with opacity, so the hover
  brightness effect works cleanly.

## How to swap

Override the URL in the `BRAND_LOGOS` block at the top of
`components/BrandsStats.tsx` (e.g. change `'https://logo.clearbit.com/sary.sa'`
to `'/images/brands/sary.svg'`).
