# Handoff: Nino Medication Toggles and Alexa

## 1. Deploy, then turn the toggles on

1. Merge to master, then deploy. `./deploy.sh` pulls from GitHub, so use `--skip-ci`, never `--check`.
2. Reload **Input booleans**, **Scripts** and **Automations** (Developer Tools → YAML). **Don't restart.**
3. On Nino's person card, under **Medications → Reminder Settings**, confirm the three toggles exist. If they're missing, the new config didn't load, so stop and check the deploy.
4. **Turn all three on: Reminders, Voice, Push.** They load *off* on first deploy, and while Reminders is off there's no reminder, no push and no 2-hour late alert.

## 2. Alexa: "Nino took his meds"

1. HA → Settings → Voice assistants → **Expose** tab → Alexa → expose **Nino Medication Taken** (`script.nino_medication_taken`). You can give it an Alexa alias such as "Nino Took Meds".
2. Alexa app → Devices → **Discover devices**. The script appears as a **scene**.
3. Alexa app → Routines → **+**:
   - *When this happens* → Voice → "Nino took his meds" (add "Nino took his medicine" too if you like).
   - *Add action* → Smart Home → Scenes → that scene.
   - *Add action* → Alexa Says → Custom → "Got it, Nino's meds are marked taken."

It marks the dose that's currently due. If nothing is due yet, it marks the earliest untaken dose today, so an early dose counts. If both doses are taken, it does nothing, although Alexa still says the confirmation line.

## 3. Verification

| # | Setup | Expect |
|---|-------|--------|
| 1 | Voice off, Push on | Push only, no announcement |
| 2 | Voice on, Push off | Announcement only; the snooze re-prompts after 15 min |
| 3 | Reminders off | No announcement, no push, no late alert; the popup med cards are hidden |
| 4 | "Alexa, Nino took his meds" before the dose time | Next dose shows taken; nothing fires at the dose time |
| 5 | Alexa with both doses taken | Nothing changes |
| 6 | Dashboard ✓ / ZHA button | Still marks the right dose (regression check) |

A quick way to test 1–3 without waiting: set a dose time a minute or two ahead, or run the automation from Settings → Automations. **Run actions** skips conditions, so test with the time instead.

## Known edges

- Turning Reminders back on after a dose time doesn't re-prompt until Nino's next wake-up. The 2-hour late alert still fires.
- At night, with dose 1 skipped and dose 2 taken, Alexa marks dose 1. That's on purpose.
