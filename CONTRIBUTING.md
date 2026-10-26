# Maintaining a plugin

## Add or update

1. Put one independently maintained integration in `packages/<slug>/`. Several
   host manifests can share a package when they ship the same payload; separately
   released implementations can have separate directories.
2. Keep the package's native manifests, dependency files, license notices, tests,
   and assets together. Choose tooling inside that package rather than requiring
   changes to a root dependency workspace.
3. Document installation, configuration, local checks, packaging, and releases in
   the package README. Store example configuration without credentials.
4. Add a row to the root README and a review route in `.github/CODEOWNERS`.
   Code owners need repository write access for GitHub review requests to work.
5. Update a host marketplace catalog only if that host supports the package.
   Catalog sources use paths relative to this repository root.
6. Run `python3 scripts/check_registry.py` and the changed package's offline
   checks. Add a path-scoped CI workflow when the package needs additional tools.

The `plugin.aisa.yaml` files in three imported packages are retained package
metadata used by their existing checks. They are not a required format for new
packages. Native manifests remain the authority for host identity and version.

## Releases

Packages release independently. Update their native version declarations as
required by their hosts, and use tags such as `aisa-search/v0.1.3` or
`easy-search-dsh/v0.3.1`. Preserve existing published plugin IDs and npm names when
moving source directories.

Packaging a plugin and publishing it are separate actions. Follow the package's
host or registry process; this repository does not automatically publish after a
merge. Existing distribution credentials, organization app connections, and
marketplace listings are not copied from the original repositories.

## Source imports and skills

Record imported repositories, source directories, and full commit SHAs in
`IMPORTS.md`. Retain original license files and notices. The original
`AIsa-public` repositories are retained for fallback; do not modify, transfer,
archive, or delete them as part of collection maintenance without a separate
request.

Reusable skills belong in `AIsa-team/agent-skills`. Prefer supported references;
when a host needs bundled skills, record the source commit for the bundled
snapshot and update it explicitly. Preserve imported plugin-specific skills until
a reviewed change intentionally replaces them.
