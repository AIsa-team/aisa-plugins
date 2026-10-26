#!/usr/bin/env python3
"""Check AIsa repository conventions for one business skill."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


TEXT_SUFFIXES = {".md", ".yaml", ".yml", ".json", ".py", ".sh", ".toml"}
PLACEHOLDER_RE = re.compile(r"\[TODO(?::|\])|TODO:", re.IGNORECASE)
LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
DIRECT_HTTP_RE = re.compile(
    r"\b(?:curl|wget)\s+(?:-[^\s]+\s+)*https?://|"
    r"\b(?:requests|httpx)\.(?:get|post|put|patch|delete)\s*\(\s*[\"']https?://|"
    r"\burllib\.request\.(?:urlopen|Request)\s*\(\s*[\"']https?://",
    re.IGNORECASE,
)
NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate AIsa-specific structure and static safety invariants."
    )
    parser.add_argument("skill", help="Path to a business skill directory")
    parser.add_argument(
        "--repo-root",
        type=Path,
        help="Repository root; defaults to the root containing this builder",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    return parser.parse_args()


def frontmatter(text: str) -> str | None:
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    return None if end < 0 else text[4:end]


def field(block: str, name: str) -> str | None:
    match = re.search(rf"(?m)^{re.escape(name)}:\s*(.+?)\s*$", block)
    if not match:
        return None
    return match.group(1).strip().strip("\"'")


def markdown_target(raw: str) -> str | None:
    target = raw.strip()
    if target.startswith("<") and ">" in target:
        target = target[1 : target.index(">")]
    else:
        target = target.split()[0]
    if not target or target.startswith("#") or re.match(
        r"^[a-z][a-z0-9+.-]*:", target, re.IGNORECASE
    ):
        return None
    return target.split("#", 1)[0]


def main() -> int:
    args = parse_args()
    script_repo = Path(__file__).resolve().parents[4]
    repo_root = (args.repo_root or script_repo).resolve()
    skill = Path(args.skill)
    if not skill.is_absolute():
        skill = repo_root / skill
    skill = skill.resolve()
    expected_root = (repo_root / "skills").resolve()

    errors: list[str] = []
    warnings: list[str] = []

    try:
        skill.relative_to(expected_root)
    except ValueError:
        errors.append(f"skill must be inside {expected_root}")

    skill_md = skill / "SKILL.md"
    readme = skill / "README.md"
    if not skill_md.is_file():
        errors.append("missing SKILL.md")
    if not readme.is_file():
        errors.append("missing README.md required by the aisa-gtm repository convention")

    entry = skill_md.read_text(encoding="utf-8") if skill_md.is_file() else ""
    block = frontmatter(entry)
    if block is None:
        errors.append("SKILL.md must start with closed YAML frontmatter")
    else:
        name = field(block, "name")
        description = field(block, "description")
        if name != skill.name:
            errors.append(f"frontmatter name must equal folder name {skill.name!r}")
        if name and not NAME_RE.fullmatch(name):
            errors.append("frontmatter name must use lowercase hyphen-case")
        if not description or PLACEHOLDER_RE.search(description):
            errors.append("frontmatter description must be complete and discriminating")
        if not re.search(r"(?m)^\s{2}author:\s*aisa\.one\s*$", block):
            errors.append("metadata.author must be aisa.one")
        if not re.search(
            r"(?m)^\s{2}version:\s*[\"']\d+\.\d+\.\d+[\"']\s*$", block
        ):
            errors.append("metadata.version must be a quoted semantic version")

    files = [path for path in skill.rglob("*") if path.is_file()]
    for path in files:
        if path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8")
        relative = path.relative_to(skill)
        if PLACEHOLDER_RE.search(text):
            errors.append(f"unfinished placeholder in {relative}")
        if DIRECT_HTTP_RE.search(text):
            errors.append(f"direct HTTP command or client call in {relative}")
        if path.suffix.lower() == ".md":
            for raw_target in LINK_RE.findall(text):
                target = markdown_target(raw_target)
                if target and not (path.parent / target).resolve().exists():
                    errors.append(f"broken Markdown link in {relative}: {target}")

    references = skill / "references"
    if references.is_dir():
        for reference in references.rglob("*.md"):
            relative = reference.relative_to(skill).as_posix()
            if relative not in entry:
                errors.append(f"reference is not discoverable from SKILL.md: {relative}")
        if not any(references.iterdir()):
            warnings.append("remove empty references directory")

    scripts = skill / "scripts"
    if scripts.is_dir() and not any(scripts.iterdir()):
        warnings.append("remove empty scripts directory")

    result = {
        "skill": str(skill),
        "ok": not errors,
        "errors": sorted(set(errors)),
        "warnings": sorted(set(warnings)),
    }
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"AIsa skill check: {'PASS' if result['ok'] else 'FAIL'}")
        for error in result["errors"]:
            print(f"ERROR: {error}")
        for warning in result["warnings"]:
            print(f"WARNING: {warning}")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
