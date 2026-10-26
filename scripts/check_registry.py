#!/usr/bin/env python3
"""Check collection paths and native catalogs without third-party dependencies."""

import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PACKAGES = ROOT / "packages"


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def local_path(base, value):
    path = (base / unquote(value)).resolve()
    if not path.is_relative_to(ROOT):
        raise ValueError(f"Path leaves the collection: {value}")
    if not path.exists():
        raise ValueError(f"Missing local path: {path.relative_to(ROOT)}")
    return path


def check_catalog(relative, manifest):
    catalog = load_json(ROOT / relative)
    names = set()
    for entry in catalog["plugins"]:
        name = entry["name"]
        if name in names:
            raise ValueError(f"Duplicate plugin {name!r} in {relative}")
        names.add(name)
        source = entry["source"]
        if isinstance(source, dict):
            if source.get("source") != "local":
                raise ValueError(f"Expected a local source in {relative}: {name}")
            source = source["path"]
        package = local_path(ROOT, source)
        if package.parent != PACKAGES:
            raise ValueError(f"Catalog source is not a package directory: {source}")
        if load_json(package / manifest)["name"] != name:
            raise ValueError(f"Catalog and native manifest identities differ: {name}")
    return len(names)


def check_readme_links(path):
    text = re.sub(r"```.*?```", "", path.read_text(encoding="utf-8"), flags=re.S)
    for link in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
        target = link.split(' "', 1)[0].strip("<>")
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        local_path(path.parent, parsed.path)


def main():
    packages = sorted(path for path in PACKAGES.iterdir() if path.is_dir())
    if not packages:
        raise ValueError("The collection has no packages")
    for package in packages:
        readme = package / "README.md"
        if not readme.is_file():
            raise ValueError(f"Package needs a README: {package.name}")
        check_readme_links(readme)
        for relative in (".claude-plugin/plugin.json", ".codex-plugin/plugin.json",
                         ".cursor-plugin/plugin.json"):
            manifest_path = package / relative
            if not manifest_path.exists():
                continue
            manifest = load_json(manifest_path)
            for field in ("skills", "mcpServers"):
                component = manifest.get(field)
                if isinstance(component, str):
                    local_path(package, component)
    catalogs = (
        (".claude-plugin/marketplace.json", ".claude-plugin/plugin.json"),
        (".agents/plugins/marketplace.json", ".codex-plugin/plugin.json"),
        (".cursor-plugin/marketplace.json", ".cursor-plugin/plugin.json"),
    )
    entries = sum(check_catalog(*catalog) for catalog in catalogs)
    for name in ("README.md", "CONTRIBUTING.md", "IMPORTS.md"):
        check_readme_links(ROOT / name)
    for path in ROOT.rglob("*.json"):
        if not {"node_modules", ".git", ".pnpm-store"}.intersection(path.parts):
            load_json(path)
    print(f"Registry OK: {len(packages)} packages, {entries} host catalog entries")


if __name__ == "__main__":
    main()
