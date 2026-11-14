# JK-1253 lunch announcement: one dish

Ticket said "first item on the menu, the main dish". The literal first item of `lunch_menu` is the daily bag-lunch alternate (Uncrustable), so the brief names the first entree that is not a standing alternate or plant based, falling back to the first item, then the no-menu wording. Reviewer caught this by reading the migration plan's sample data. Sensor and dashboard consumers untouched. Reload: scripts only.
