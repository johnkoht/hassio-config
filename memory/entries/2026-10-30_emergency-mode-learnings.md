# Emergency mode, PR 1: audio gate (JK-1149)

**What:** `binary_sensor.emergency_active` (alarmo triggered, smoke detector, or manual `input_boolean.emergency_mode`) now gates the announcement engine and the queue processor. `critical_announcement` starts the engine directly with `script.turn_on`, so a fire or alarm overnight is no longer held by `house_occupied` or quiet-before-9am. TTS wait is `len/14 + 3` s. PR 1 of 4; PR 2-4 (push delivery, alarm lifecycle, polish) follow.

**Metrics:** 5 tasks, +46 tests (445 passing), 8 sabotage checks all went red (one needed a stricter Jinja env first).

**Pre-mortem vs reality:** the review (not the pre-mortem) caught the real design faults: a blocking engine call would make the leak REST notifier time out; quiet-mode halving contradicted "plays in full at any hour"; the engine's default `max` 10 could drop a critical call; a `for: 10 min` timer dies on `automation.reload`. All were folded in before building.

**Learnings:**
- Script `fields:` defaults aren't applied at runtime. A test using plain Jinja (non-strict) can't tell `priority == 'x'` from `priority | default('n') == 'x'`; render with `StrictUndefined`.
- A failed first-step condition in a called script ends only that script; a blocking caller continues and can't tell.
- A REST notifier calling a script service waits for the script. Start long scripts with `script.turn_on`.
- Deploy: Template and Input Boolean aren't reloaded by `deploy.sh --reload`.

**Follow-ups (backlog):** leak notifier has no explicit timeout; `auto` resolving to no speakers is silent; deferral race (ordinary item dropped if an emergency starts while it waits for the engine); a stuck smoke sensor has no override; queue-path critical items still purge the queue in `append.yaml`.
