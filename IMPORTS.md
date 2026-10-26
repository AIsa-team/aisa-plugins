# Source imports

Imported on 2026-10-26 as source snapshots. Full Git histories, issues, pull
requests, releases, repository settings, and distribution credentials remain in
the original repositories. No source repository was transferred or changed.

| Collection package | Original source | Source commit |
| --- | --- | --- |
| `packages/aisa-cursor` | [AIsa-public/AIsa-plugins: plugins/aisa](https://github.com/AIsa-public/AIsa-plugins/tree/1f153e74c208a8d7d835e7ba1a1ab91f15c4d669/plugins/aisa) | `1f153e74c208a8d7d835e7ba1a1ab91f15c4d669` |
| `packages/aisa-search` | [AIsa-public/AIsa-plugins: plugins/aisa-search](https://github.com/AIsa-public/AIsa-plugins/tree/1f153e74c208a8d7d835e7ba1a1ab91f15c4d669/plugins/aisa-search) | `1f153e74c208a8d7d835e7ba1a1ab91f15c4d669` |
| `packages/aisa-gtm-dify` | [AIsa-public/AIsa-plugins: plugins/aisa-gtm](https://github.com/AIsa-public/AIsa-plugins/tree/1f153e74c208a8d7d835e7ba1a1ab91f15c4d669/plugins/aisa-gtm) | `1f153e74c208a8d7d835e7ba1a1ab91f15c4d669` |
| `packages/aisa-gtm-agents` | [AIsa-public/aisa-gtm-plugin](https://github.com/AIsa-public/aisa-gtm-plugin/tree/93caf401a0602d3f703c1389f7b9d81c7f779a49) | `93caf401a0602d3f703c1389f7b9d81c7f779a49` |
| `packages/easy-search-dsh` | [AIsa-public/easy-dsh-plugin: plugins/easy-search](https://github.com/AIsa-public/easy-dsh-plugin/tree/f2cb1792f1dd94ca8f5fa08f46422dddbc16dba8/plugins/easy-search) | `f2cb1792f1dd94ca8f5fa08f46422dddbc16dba8` |

## Collection adjustments

- Package directories, local test paths, documentation links, repository metadata,
  and host catalog paths reflect the new collection.
- Original runtime source, bundled skills, endpoints, plugin IDs, package IDs,
  and release versions are preserved. Existing runtime attribution URLs retain
  their upstream values; migration does not silently change attribution behavior.
- The standalone GTM marketplace catalogs are replaced by the collection's root
  catalogs. Package manifests and local component paths remain with that package.
- Easy Search keeps its original dependency lock graph in a package-local
  `pnpm-lock.yaml`; the importer path changes from `plugins/easy-search` to `.`.
- Original license files from the collection are copied into its three imported
  packages. Easy Search retains its package license. The standalone GTM source
  supplies no standalone license; no new license is imposed by this collection.
- Repository-wide standards, ownership automation, publishing workflows, and live
  contract-audit schedules from the source collections are not imported. This
  collection has small offline checks and independent package tooling.

`AIsa-mcp-server`, the dedicated skills repositories, the models database fork,
and the standalone payment/API test client are outside this plugin collection.
