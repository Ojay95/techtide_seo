#!/usr/bin/env python3
"""Clean up the long-form guides.

1. Restores the original publication date (updated: 2026-10-09).
2. Removes every hyphen and dash from the readable text (titles, descriptions,
   headings, paragraphs, lists, tables) while leaving URLs, image paths,
   code, dates in frontmatter and markdown syntax untouched.
3. Copies the generated step images into public/images/guides/<slug>/.

Run from the project root:  python3 scripts/fix-guides.py
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDES = ROOT / "src" / "content" / "guides"
IMAGES_SRC = Path.home() / ".gemini/antigravity-ide/brain/61cc3544-9809-4cb4-8074-f7f8e458c8a8"
IMAGES_DST = ROOT / "public" / "images" / "guides"
ORIGINAL_DATE = "2026-10-09"

PREFIX_TO_SLUG = {
    "gbp_": "google-business-profile-optimization",
    "audit_": "how-to-do-an-seo-audit",
    "local_": "local-seo-guide",
    "tech_": "technical-seo-checklist",
    "onpage_": "on-page-seo-checklist",
    "whatis_": "what-is-seo",
    "cost_": "how-much-does-seo-cost",
    "time_": "how-long-does-seo-take",
}

# Pieces of a line that must never be changed.
PROTECT = re.compile(
    r"(`[^`]*`"                 # inline code
    r"|\]\([^)]*\)"             # markdown link / image targets
    r"|https?://\S+"            # bare URLs
    r"|<[^>]+>)"                # html tags
)

WORD_FIXES = {
    "e-commerce": "ecommerce", "E-commerce": "Ecommerce",
    "e-mail": "email", "E-mail": "Email",
    "co-op": "coop", "re-check": "recheck", "Re-check": "Recheck",
    "re-crawl": "recrawl", "re-index": "reindex", "re-indexed": "reindexed",
    "Wi-Fi": "WiFi", "add-on": "add on", "sign-in": "sign in",
}


def clean_text(text: str) -> str:
    for a, b in WORD_FIXES.items():
        text = text.replace(a, b)
    # number ranges: 2-5, 2–5, 2 – 5  ->  2 to 5
    text = re.sub(r"(\d)\s*[\u2013\u2014-]\s*(\d)", r"\1 to \2", text)
    # parenthetical em/en dashes -> comma
    text = re.sub(r"\s*[\u2014\u2013]\s*", ", ", text)
    text = re.sub(r",\s*,", ",", text)
    text = re.sub(r",\s*([.:;!?)])", r"\1", text)
    # compound words: step-by-step -> step by step
    text = re.sub(r"(?<=\w)-(?=\w)", " ", text)
    # any stray hyphen used as a dash: " - " -> ", "
    text = re.sub(r"\s+-\s+", ", ", text)
    return text


def clean_line(line: str) -> str:
    stripped = line.strip()
    if stripped in ("---", "") or re.fullmatch(r"\|?[\s:\-|]+\|?", stripped):
        return line  # frontmatter fence, horizontal rule, table divider
    m = re.match(r"^(\s*(?:[-*+]|\d+\.)\s+|\s*>\s*|\s*#+\s+)?", line)
    lead = m.group(0) if m else ""
    body = line[len(lead):]
    parts = PROTECT.split(body)
    out = [p if i % 2 else clean_text(p) for i, p in enumerate(parts)]
    return lead + "".join(out)


def process(path: Path) -> None:
    lines = path.read_text(encoding="utf-8").split("\n")
    fm_done, in_fm, in_code = False, False, False
    for i, line in enumerate(lines):
        if not fm_done and line.strip() == "---":
            in_fm = not in_fm
            fm_done = not in_fm and i > 0
            continue
        if in_fm:
            if line.startswith("updated:"):
                lines[i] = f"updated: {ORIGINAL_DATE}"
            elif re.match(r"^(title|metaTitle|description):", line):
                key, val = line.split(":", 1)
                lines[i] = key + ":" + clean_text(val)
            continue
        if line.lstrip().startswith("```"):
            in_code = not in_code
            continue
        if not in_code:
            lines[i] = clean_line(line)
    path.write_text("\n".join(lines), encoding="utf-8")
    print("cleaned", path.name)


def copy_images() -> None:
    for src in sorted(IMAGES_SRC.glob("*.png")):
        for prefix, slug in PREFIX_TO_SLUG.items():
            if src.name.startswith(prefix):
                name = re.sub(r"_\d+\.png$", ".png", src.name)[len(prefix):]
                dst = IMAGES_DST / slug / name
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                print("image", dst.relative_to(ROOT))


if __name__ == "__main__":
    for f in sorted(GUIDES.glob("*.mdx")):
        process(f)
    copy_images()
