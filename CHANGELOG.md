# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.1] - 2026-05-08

### Internal

- Releases are now published from a GitHub Actions workflow (`.github/workflows/release.yml`) on `v*` tag push, with an [npm provenance](https://docs.npmjs.com/generating-provenance-statements) attestation. Required by n8n's verified community node policy effective 2026-05-01 — verified nodes must come from a GitHub Actions publish, not from a local `npm publish`. The 1.1.0 publish was the last one done locally; from this version on the workflow takes over.
- Workflow pins `actions/checkout` and `actions/setup-node` to immutable commit SHAs (with the `# v4` trailing comment so Dependabot can still propose updates), and runs a tag/`package.json` version-match check before installing dependencies so a mismatched tag push fails fast.

No public-surface changes from 1.1.0. The Typecast node's operations, fields, and execute behavior are identical.

## [1.1.0] - 2026-05-08

### Added

- **`voice:getOne` operation** — fetch a single V2 voice by ID via `GET /v2/voices/{voice_id}`. Returns the same enriched metadata shape (gender / age / use_cases / supported models / emotions) as the listing.
- **`subscription` resource** with **`getMy` operation** — read plan tier, credit usage, and concurrency limit at runtime via `GET /v1/users/me/subscription`. Useful for quota-aware batching, plan gating, and rate-limit guards.
- **`speech:textToSpeechStream` operation** — chunked low-latency TTS via `POST /v1/text-to-speech/stream`. The streaming endpoint rejects `volume` and `target_lufs`, so the node intentionally drops both fields from the request body.
- **`speech:textToSpeechWithTimestamps` operation** — TTS with word- or character-level alignment via `POST /v1/text-to-speech/with-timestamps`. New `Granularity` field (`Default (Server Picks)` / `Word` / `Character` / `Both`) shown only for this operation. Audio comes back as a binary attachment; `words` / `characters` / `audio_format` / `audio_duration` go on the JSON side for downstream caption generation.
- **`additionalOptions.targetLufs`** — absolute loudness normalization target in LUFS (`-70.0 ~ 0.0`). Mutually exclusive with `Volume` on the non-streaming endpoint; raises `NodeOperationError` locally if both are set with a non-default volume so the user does not see a confusing 4xx from the server.

### Changed

- All existing speech fields (Voice ID / Text / Model / Emotion Type / Preset / Intensity / Previous Text / Next Text / Additional Options) widen `displayOptions.show.operation` to apply to all three speech operations, reusing the existing UI without duplication.
- `additionalOptions` options are now sorted alphabetically by `displayName` to satisfy the `n8n-nodes-base/node-param-collection-type-unsorted-items` ESLint rule.
- Mutual-exclusion guards throw `NodeOperationError` instead of plain `Error` so the n8n error UI shows proper node attribution (`n8n-nodes-base/node-execute-block-wrong-error-thrown`).

### Fixed

- **`npm install` and the `@n8n/node-cli` `dev` / `release` wrappers now succeed out of the box.** Added a project-level `.npmrc` with `legacy-peer-deps=true` to bypass n8n@2.x's internal zod 3 vs 4 peer-dep tangle (`@ai-sdk/anthropic`, `@ai-sdk/openai`, `langchain`, `@n8n/json-schema-to-zod`). The package itself does not pull any of those dependencies — this was purely an n8n-internal install path that aborted under npm 8+'s strict resolver.
- Decode the `audio` field of the with-timestamps response via `Buffer.from(audioB64, 'base64')` after adding `@types/node` to `devDependencies` (previous build used a `globalThis` cast because the package's tsconfig did not include node typings).

### Dependencies

- `@n8n/node-cli`: pinned to `^0.16.0` (was `*`). The 0.29 line breaks the eslint-plugin layout that `n8n-node lint` expects.
- `@types/node`: bumped to `^25.6.2`.
- `n8n-workflow`: added as `devDependencies` `^2.16.0` (still a `peerDependency` at runtime; the dev entry is needed because `legacy-peer-deps=true` disables peer auto-install and `tsc` / `eslint` would otherwise fail to resolve the import).
- `eslint`, `prettier`, `typescript`: switched from exact pins to caret ranges so patch / minor refreshes land automatically.

### Notes

- The Typecast API endpoint behind streaming TTS does not accept `volume` or `target_lufs` server-side. The node displays `Volume` and `Target LUFS` in `additionalOptions` for all three speech operations because of n8n's per-collection `displayOptions` model, but the streaming branch silently drops both fields. A follow-up may hide the two fields when the operation is `textToSpeechStream` for cleaner UX.
- Quick voice cloning (`POST /v1/voices/clone` / `DELETE /v1/voices/{voice_id}`) is gated on `typecast-sdk` PR #32 / #33 reaching production. The corresponding n8n operations will land in a follow-up release once the endpoint is generally available on `api.typecast.ai`.

## [1.0.4] - 2026-01-28

First version covered by this CHANGELOG. Earlier releases are tagged on the repository (`v1.0.0`, `v1.0.3`, `v1.0.4`).
