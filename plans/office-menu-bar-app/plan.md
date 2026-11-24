---
title: Office Menu Bar App
slug: office-menu-bar-app
status: draft
created: 2026-11-21
has_pre_mortem: false
has_review: false
has_prd: false
---

# Office Menu Bar App

## Problem

Controlling the office today means opening the Kohbo dashboard or the phone. The common actions (flip to DnD, change focus, skip a track, dim the lights, check temperature and air) are quick glances that don't deserve a browser tab.

## Goal

A native macOS menu bar app on John's personal Mac that shows the office's live state and controls mode, focus, music, lights and the air purifier in one click. Its icon reflects the office state at a glance. It lives in its own repo; `hassio-config` changes only if a small helper script is needed (see Tasks 7).

## Approach

SwiftUI `MenuBarExtra` with `.menuBarExtraStyle(.window)` so the panel is a real popover with sliders and segmented controls, not an NSMenu. Swift 6.2 / Xcode 26.3 are installed; target macOS 15+.

Talk to HA over the WebSocket API (`URLSessionWebSocketTask`, no third-party deps): `auth` → `subscribe_entities` filtered to the office entity list for live state, `call_service` for actions, `media_player/browse_media` for Sonos favorites. Live push beats REST polling — the panel updates when automations change the room, which they do constantly.

Connection: a primary URL (local epicurus) with a fallback (Nabu Casa) so it works away from home; long-lived access token in Keychain, never in the repo. Reconnect with backoff; show a stale/offline state rather than wrong values.

Panel sections, top to bottom:

- **Mode** — segmented Auto / Off / DnD → `input_select.office`
- **Focus** — segmented Deep Work / Task Mode / Tinkering → `input_select.john_focus_mode`. Changing it already makes `office_music_resume` switch to the focus playlist, so this doubles as the playlist "mode".
- **Climate & air** — `sensor.office_awair_temperature`, `sensor.office_feels_like_temperature`, `sensor.office_awair_humidity`, `sensor.office_air_quality` / `sensor.office_awair_score` (with PM2.5, CO₂, VOC on hover/expand), purifier toggle on `fan.office_air_purifier`
- **Music** — `media_player.sonos_office`: now playing + artwork, play/pause/next/prev, volume, and a favorites picker from `browse_media`
- **Lights** — master brightness on `light.office_lights`, scene picker (Bright / Warm / Dim / Focus, `input_select.office_scene`), individual toggles + brightness for `light.office_el_gato_light`, `light.office_shelf_lights`, `light.office_office_lamp`

Menu bar icon: SF Symbol reflecting mode (DnD = filled/red, Off = dimmed) with optional temperature text. Global hotkeys deferred to a later task.

Manual light changes from the app will trip `office_lights_manual_change`; that's intended (it's a manual change).

Entity IDs live in one config struct so a rename in HA is a one-line app change. Rejected: the HA Companion app's menu bar (John wants native + custom); Electron/Tauri (heavier, worse menu bar integration for no gain).

## Tasks

1. Repo scaffold — new private repo `~/code/office-bar` (name TBD), SwiftUI app target, `MenuBarExtra` with an empty panel, `LSUIElement` (no Dock icon), launch-at-login via `SMAppService`.
2. HA client — WebSocket connect/auth, `subscribe_entities` with an entity filter, `call_service`, `browse_media`; reconnect with backoff and primary→fallback URL; unit tests against recorded HA message fixtures.
3. Settings + Keychain — settings window for URLs and token, token stored in Keychain, connection status indicator.
4. Mode, focus and climate/air sections — segmented controls and read-only climate tiles, purifier toggle.
5. Music section — now playing, transport, volume, favorites picker.
6. Lights section — group brightness, per-light toggles/brightness, scene picker.
7. Scene apply (only if needed) — selecting `input_select.office_scene` only records the scene; applying goes through `script.lights_scene_toggle`, which cycles. Either the app shows a "next scene" button (no HA change) or `hassio-config` gets a small `office_lights_apply_scene` script that takes a scene name. Decide at build time; default to the cycle button.
8. Menu bar icon state — icon reflects office mode and offline state; optional temperature text.
9. Signing + install — build a Developer ID or ad-hoc signed `.app` into `/Applications`, document the build/install steps in the repo README.
10. Hotkeys (stretch) — global shortcut to open the panel and toggle DnD.

## Risks

- Focus is calendar-driven: `john_set_focus_mode` overrides a manual pick on the next calendar change or when DnD ends, and `initial: "Task Mode"` resets it on every HA restart. Accept for v1 and show the current value live; a manual-override latch in HA is a separate change if it bothers John.
- Token on disk: a long-lived token grants full HA control. Keychain only, never logged, never committed; revoke from the HA profile page if the laptop is lost.
- Nabu Casa fallback adds latency and depends on the remote UI being enabled; local is primary.
- Entity renames in HA silently break a section: entities missing from `subscribe_entities` render as "unavailable" rather than crashing, and the IDs sit in one config struct.
- Sonos favorites via `browse_media` vary by integration version; if the payload is awkward, fall back to the focus-mode playlist control only.
- Scene picker needs either a cycle-only UX or an HA script (Task 7).

On approval → /approve → /ship office-menu-bar-app
