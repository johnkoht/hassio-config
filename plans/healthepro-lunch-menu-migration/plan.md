---
title: Migrate Primary School Lunch Menu from Choosi to HealthePro
slug: healthepro-lunch-menu-migration
status: built-pending-verification
created: 2026-08-24
has_pre_mortem: false
has_review: false
---

# Migrate Primary School Lunch Menu from Choosi to HealthePro

## Problem

`packages/school/primary_school/primary_school_lunch_menu.yaml` fetches Nino's lunch
menu from `api.getchoosi.com`. The district has moved to HealthePro
(`menus.healthepro.com`), so that endpoint is dead and
`sensor.primary_school_lunch_menu` is stale or unavailable.

One consumer depends on it — `packages/reminders/morning_update.yaml:119` reads
`states.sensor.primary_school_lunch_menu.attributes.lunch_menu`, lowercases it, and
substring-matches Nino's favorites to decide what the morning announcement says.

## API investigation (findings)

I reverse-engineered the public API by pulling the site's JS bundle
(`/build/assets/app-fUN4zoww.js`) and extracting every route it calls. The full
public surface is 13 endpoints. Relevant identifiers:

| Thing | Value |
|---|---|
| Organization | `3878` (district) |
| Site | `18853` — Lyon Elementary |
| Menu | `136529` — "26-27 Lunch K-2" (`meal_type_id: 2`) |
| Breakfast menu (unused) | `140159` — "26-27 Breakfast LY" |

### The two endpoints you found are not enough

**`/api/organizations/3878/sites/18853/menus/`** — lists the menus available at the
site (breakfast + lunch). Useful once, to confirm the menu ID. Not needed at runtime.

**`.../menus/136529/start_date/{start}/end_date/{end}/recipes/`** — **the date range is
ignored.** I verified this: requesting `2026-08-24`→`2026-08-24`, `2026-08-25`→`2026-08-25`,
and even a Saturday all return the identical 44-recipe payload (119 KB) — the whole
month's recipe *pool*, with no day assignment on any record. Union of keys across all 44
records contains no date field. This endpoint is a recipe dictionary (allergens,
nutrients, images), not a calendar. **Using it alone cannot answer "what's for lunch
today."**

### The endpoint we actually need

```
GET /api/organizations/3878/menus/136529/year/2026/month/8/date_overwrites
```

~33 KB, `content-type: application/json`, no auth, no cookies. Returns one entry per
school weekday:

```json
{"data": [
  {"id": 1452528263, "day": "2026-08-20", "meal_id": 19508712,
   "setting": "{\"current_display\":[...],\"days_off\":[], ...}",
   "overwritten": false}
]}
```

Two things to know about the shape:

1. **`setting` is a JSON-encoded string**, not an object — it needs `| from_json` in
   Jinja before you can index it.
2. **`days_off` is polymorphic.** On a school day it is an empty *list* `[]`; on a
   break it is a *dict* `{"status": 1, "description": "Summer Break"}`. A naive
   `setting.days_off.description` errors on school days — guard with `is mapping`.

`current_display` is an ordered list that already carries item names inline, so the
`/recipes/` endpoint is not needed at all:

```json
[{"item": "Lunch Entree", "weight": 0, "name": "Lunch Entree", "type": "category"},
 {"item": 2181464, "weight": 1, "name": "Beef and Cheese Nachos", "type": "recipe"},
 {"item": "Vegetables", "weight": 5, "name": "Vegetables", "type": "category"},
 {"item": 2181172, "weight": 6, "name": "Baby Carrots", "type": "recipe"}]
```

Entries of `type: category` are section headers; every `type: recipe` after one belongs
to that section. Walking the list in order yields both the flat item list and the
entrées-only list.

Decoded output for the current month, to confirm it is real data:

```
2026-08-20  Beef and Cheese Nachos, Cheese Quesadilla, Uncrustable Lunch…, Yogurt Lunch
2026-08-21  Bosco Sticks, Pizza Kit (Build your Own), Uncrustable Lunch…, Yogurt Lunch
2026-08-24  Uncrustable Lunch…, French Toast with Turkey Sausage, Yogurt Lunch, French Toast with Veggie Sausage
2026-08-25  Uncrustable Lunch…, Chicken Tenders with Cornbread, Yogurt Lunch, Plant Based Nuggets with Cornbread
2026-08-26  Uncrustable Lunch…, Personal Cheese Pizza, Yogurt Lunch
2026-08-27  Uncrustable Lunch…, Pasta with Meat Sauce, Yogurt Lunch, Pasta and Marinara with Mozzarella
2026-08-28  Uncrustable Lunch…, Cheddar Burger, Yogurt Lunch, Hamburger, Plant Based Burger, Pizza Kit
2026-08-31  Belgian Waffle with Chicken Sausage, Belgian Waffle with Veggie Sausage, Uncrustable Lunch…, Yogurt Lunch
```

Aug 3–19 are all `days_off: Summer Break` — school started Aug 20.

### Unpublished months return HTTP 400

`year/2026/month/7` and `year/2026/month/9` both return **HTTP 400** with body
`{"message":""}` — the menu's `published_months` is currently only `["2026-08-01"]`.
So over summer, and at the start of any month the district hasn't published yet, the
fetch fails. The sensor must not blank itself out when that happens.

## Design

One file replaced. Same entity ID, same `unique_id`, same `rest_command` name, and the
`lunch_menu` attribute keeps its current contract (list of item names) so
`morning_update.yaml` keeps working even before its favorites list is touched.

Changes beyond the URL swap, each earning its place:

- **`homeassistant.start` trigger.** The current sensor only has `time_pattern: /1`, so
  after a restart it is `unknown` until the top of the hour. If that lands during the
  morning update, the announcement loses the menu.
- **Hold-last-value on failure.** Guard on `response.status == 200` and fall back to
  `this.state` / `this.attributes.*`. Without this, every summer-month 400 and every
  transient network blip would overwrite a good menu with an empty list.
- **`entrees` attribute.** Every day's menu includes "Uncrustable Lunch with Cheese and
  Crackers" and "Yogurt Lunch" as standing alternates, plus carrots and milk. Matching
  favorites against entrées only is much less noisy than against all 8–13 items.
- **`day_off` attribute.** Lets the morning update say "Summer Break" instead of
  guessing from an empty menu.

### `packages/school/primary_school/primary_school_lunch_menu.yaml`

```yaml
# Primary School Lunch Menu
#
# Nino's district replaced Choosi with HealthePro (menus.healthepro.com).
# Fetches Lyon Elementary's "26-27 Lunch K-2" calendar for the current month
# and exposes today's lunch items.
#
# org 3878 = district, site 18853 = Lyon Elementary, menu 136529 = 26-27 Lunch K-2
#

rest_command:
  fetch_primary_daily_menu:
    url: >-
      https://menus.healthepro.com/api/organizations/3878/menus/136529/year/{{ now().year }}/month/{{ now().month }}/date_overwrites
    method: GET
    headers:
      Accept: "application/json"
    timeout: 30

template:
  - trigger:
      - trigger: time_pattern
        hours: /1
      - trigger: homeassistant
        event: start
    action:
      - alias: "Fetch this month's menu calendar"
        action: rest_command.fetch_primary_daily_menu
        response_variable: response
        continue_on_error: true
      - variables:
          ok: "{{ response is defined and (response.status | default(0)) == 200 }}"
          today: "{{ now().strftime('%Y-%m-%d') }}"
          day: >-
            {{ (response.content.data | default([], true) if ok else [])
               | selectattr('day', 'eq', today) | first | default(none) }}
          setting: "{{ (day.setting | from_json) if day else {} }}"
          display: "{{ setting.current_display | default([], true) }}"
          items: >-
            {{ display | selectattr('type', 'eq', 'recipe')
                       | map(attribute='name') | list }}
          entrees: >-
            {% set ns = namespace(category='', out=[]) %}
            {% for i in display %}
              {% if i.type == 'category' %}
                {% set ns.category = i.name %}
              {% elif i.type == 'recipe' and 'Entree' in ns.category %}
                {% set ns.out = ns.out + [i.name] %}
              {% endif %}
            {% endfor %}
            {{ ns.out }}
          day_off: >-
            {{ setting.days_off.description | default('', true)
               if setting.days_off is mapping else '' }}
    sensor:
      - name: Primary School Lunch Menu
        unique_id: primary_school_lunch_menu
        state: "{{ items | count if ok else this.state }}"
        icon: mdi:food-apple
        attributes:
          lunch_menu: "{{ items if ok else this.attributes.lunch_menu | default([], true) }}"
          entrees: "{{ entrees if ok else this.attributes.entrees | default([], true) }}"
          menu_date: "{{ today if ok else this.attributes.menu_date | default('', true) }}"
          day_off: "{{ day_off if ok else this.attributes.day_off | default('', true) }}"
          last_fetch: "{{ now().isoformat() if ok else this.attributes.last_fetch | default('', true) }}"
```

State becomes the item count (0 = no school / no menu) instead of the old
`now().isoformat()`, which was never read by anything. No `unit_of_measurement` or
`state_class`, deliberately — the `this.state` fallback can be `unknown` on first run
and HA rejects that for a numeric sensor.

## The favorites list is stale — this is the part that silently breaks

`morning_update.yaml:120` matches these substrings:

```yaml
{% set favorites = ['chicken nugget', 'pizza', 'cheeseburger', 'caesar salad', 'beef nachos'] %}
```

Against HealthePro's vocabulary, **three of the five never match and one is gone**:

| Old favorite | Reality on the new menu |
|---|---|
| `chicken nugget` | ✗ — it's "Chicken **Tenders** with Cornbread" / "Plant Based **Nuggets**" |
| `cheeseburger` | ✗ — it's "**Cheddar** Burger" / "Hamburger" / "Plant Based Burger" |
| `beef nachos` | ✗ — it's "Beef **and Cheese** Nachos" |
| `caesar salad` | ✗ — not on the menu at all |
| `pizza` | ✓ — "Personal Cheese Pizza", "Pizza Kit (Build your Own)" |

Run against the live month, the current list matches on only 3 of 8 school days, and
every one of those is `pizza`. The URL swap alone would leave the morning update quietly
under-reporting.

### Replacement (John's list, Aug 24)

John added bosco sticks, watermelon, and "French Toast with Turkey Sausage (not veggie
sausage)", plus a fallback: when nothing matches, recommend the bag lunch (the
Uncrustable). Two of those forced design changes:

- **Watermelon is a fruit, not an entrée.** The first draft matched against the
  `entrees` attribute only. Matching now runs against the full `lunch_menu`. Noise isn't
  a concern because the favorites list is explicit — "Baby Carrots" appears every day and
  simply never matches.
- **`french toast` as a substring hits both versions** — "French Toast with Turkey
  Sausage" *and* "French Toast with Veggie Sausage". Rather than special-casing that one
  item, an `exclude` list drops any item containing `plant based` or `veggie`. That
  generalizes John's stated preference: it also picks "Cheddar Burger"/"Hamburger" over
  "Plant Based Burger", and "Belgian Waffle with Chicken Sausage" over the veggie one.
  **If Nino actually does want the plant-based options, drop the `exclude` list.**

```yaml
{% set menu = state_attr('sensor.primary_school_lunch_menu', 'lunch_menu') | default([], true) %}
{% set entrees = state_attr('sensor.primary_school_lunch_menu', 'entrees') | default([], true) %}
{% set favorites = ['nachos', 'pizza', 'burger', 'chicken tenders', 'bosco sticks',
                    'quesadilla', 'french toast', 'waffle', 'watermelon'] %}
{# Nino wants the real-meat version, not the plant based / veggie sausage one #}
{% set exclude = ['plant based', 'veggie'] %}
```

`pasta` was in the first draft as my guess and John removed it — Nino doesn't eat school
pasta.

Matching now reports the **actual menu item name** rather than the favorite keyword, so
the announcement says "French Toast with Turkey Sausage" instead of "french toast".
Rendered against every school day this month (real Jinja, real payload):

```
2026-08-20  Beef and Cheese Nachos, Cheese Quesadilla, Watermelon
2026-08-21  Bosco Sticks, Pizza Kit (Build your Own)
2026-08-24  French Toast with Turkey Sausage
2026-08-25  Chicken Tenders with Cornbread
2026-08-26  Personal Cheese Pizza
2026-08-27  → bag lunch: Uncrustable Lunch with Cheese and Crackers   (pasta day)
2026-08-28  Cheddar Burger, Hamburger, Pizza Kit (Build your Own)
2026-08-31  Belgian Waffle with Chicken Sausage
```

Dropping `pasta` gives the bag-lunch branch real coverage this month: 08-27 is a
pasta-only entrée day, so it now recommends the Uncrustable. An empty menu falls through
to the original "don't forget to check the lunch menu" line rather than recommending a
bag lunch that isn't listed.

Also note `state_attr(...)` replaces `states.sensor.X.attributes.Y`, which throws if the
entity is missing rather than returning `None`.

## Risks

- **`rest_command` behavior on HTTP 400 is assumed, not verified.** The design assumes
  `continue_on_error: true` plus a `response.status` check is enough. If `rest_command`
  raises before populating `response`, the `response is defined` guard covers it — but
  this needs a live test, easiest by temporarily pointing the URL at `month/7`.
- **DNS.** I hit one transient `getaddrinfo` failure for `menus.healthepro.com` from
  this machine (it resolves via CNAME to `msm-production.us-west-2.elasticbeanstalk.com`).
  It resolved fine on retry, but the HA Yellow uses the LAN DNS servers
  (192.168.1.152/163) — worth confirming resolution from the HA host before blaming the
  template.
- **Menu ID is per school year.** `136529` is "26-27 Lunch K-2". It will change next
  August, and again when Nino ages out of K-2. Same class of breakage as Choosi, just
  slower. The IDs are in one `rest_command` block, so it's a one-line fix.
- **Unverified against a published future month.** Only August is published, so the
  month-rollover path can't be tested until the district publishes September.

## Steps

1. ~~Rewrite `packages/school/primary_school/primary_school_lunch_menu.yaml`.~~ **Done.**
   Dead Choosi URL and the commented-out `ns.menu_items` block removed (the latter
   referenced an undefined `item` and never worked).
2. ~~Update favorites and switch to `state_attr()` in
   `packages/reminders/morning_update.yaml`.~~ **Done.**
3. ~~YAML parses.~~ **Done** — both files load clean. `ha core check` is **not** run
   locally; the `ha` CLI only exists on the Yellow, so it still has to run there.
4. ~~Render the sensor's templates against the live payload.~~ **Done** offline with
   Jinja 3.1.6 + the real API response, for a school day (9 items), Summer Break
   (`day_off: "Summer Break"`), a Saturday absent from `data`, a date in an unpublished
   month, and an `ok == false` API failure. All produce empty/falsy values, so the
   `this.*` fallback holds the prior value. **Offline rendering is not HA** — steps 5–8
   still stand.
5. `ha core check` on the Yellow.
6. Reload template entities; confirm `sensor.primary_school_lunch_menu` state and
   attributes against the live API.
7. Failure test: temporarily set the URL to `month/7`, reload, confirm the sensor holds
   its previous value instead of going to 0. **This is the one assumption offline
   simulation cannot cover** — whether `rest_command` populates `response` with
   `status: 400` or raises before assigning it.
8. Trigger `script.morning_update` (or render its template) and confirm the lunch
   section reads correctly.
9. Commit, push, then `./deploy.sh` — the Yellow pulls from GitHub, so push first.
