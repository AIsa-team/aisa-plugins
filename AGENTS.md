# AIsa plugin collection

This repository groups independent plugin projects. Keep root changes limited to
discovery, ownership, provenance, host catalogs, and package checks. Do not add a
shared runtime or dependency workspace merely to organize packages.

Read package-local instructions before editing a package. Preserve native package
IDs, runtime behavior, endpoint configuration, and release versions unless the
requested change requires otherwise. Run the package's relevant offline checks
and `python3 scripts/check_registry.py` for catalog or layout changes.

The original `AIsa-public` repositories are read-only fallback sources for this
collection. Do not modify, transfer, archive, or delete those repositories without
an explicit separate user request. `AIsa-mcp-server` is outside this collection.

Keep credentials and local dependency caches out of Git. Package installation or
build verification does not authorize paid API calls or publishing new package
versions.
