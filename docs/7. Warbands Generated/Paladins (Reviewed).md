---
sidebar_label: Paladins
---
# Paladins (Reviewed)
Paladins are warriors who come from a holy order.

| Max Units | 15 |
| ---- | ---- |
| Play Style | Defensive |

## Special Rules
### Example special rule
Paladins don't actually have any but this is a test.
## Heroes
| Units | Mov | Mel | Rng | Def | Wnd | Agi | Atk | Mrl | Cost | Abilities | Skill Types | Cap |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Justicar  | 6 | 13 | 12 | 18 | 1 | 8 | 1 | 7 | 70 | [Leader](#leader), [Prayers](#prayers) | 1 |
| Paladin  | 6 | 13 | 14 | 18 | 1 | 11 | 1 | 10 | 35 |  | None |
| Cleric  | 6 | 15 | 14 | 19 | 1 | 11 | 1 | 10 | 30 | [Healer](#healer) | 1 |
| Standard Bearer  | 6 | 15 | 14 | 19 | 1 | 11 | 1 | 7 | 35 | [Holy Standard](#holy-standard) | None |

<!--
Skill Types column still exists above.

Also, I was thinking, Wnd, Atk, and Mov are all different to Mel, Rng, Def, Mrl. I think we should group them together. My suggested order would be:

Mov, Atk, Wnd, Mel, Rng, Def, Agi, Mrl

This way people could see how generally scary a unit is immediately (via Atk and Wnd) and then get a sense of how it performs at each Check.
-->
## Henchmen
| Units | Mov | Mel | Rng | Def | Wnd | Agi | Atk | Mrl | Cost | Abilities | Cap |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Squire | 6 | 15 | 14 | 19 | 1 | 11 | 1 | 10 | 25 |  | None |
| Initiate | 6 | 16 | 16 | - | 1 | 11 | 1 | 13 | 15 |  | None |
| Monk | 7 | 15 | 14 | 19 | 1 | 8 | 1 | 10 | 40 | [Ki Strike](#ki-strike), [No Equipment](#no-equipment) | 3 |
| Cavalier | 9 | 15 | 14 | 19 | 2 | 11 | 1 | 10 | 45 | [Mounted](#mounted) | 3 |

## Promotion Options
| Unit | Stat Ups | Gained Skills |
| ---- | ---- | ---- |
| Paladin | +2 Mel, +1 Def |  |
| Cleric |  | Healer |
| Standard Bearer | +3 Mrl | Holy Standard |

## Equipment

### Paladin Equipment 
Paladin equipment for the unit types: Leader, Hero, Squire, Novice

| Name | Effect | Cost | Slots |
| ---- | ------ | ---- | ----- |
| Hammer | +1 Injury | 5 | 1 |
| Blessed Warhammer | -3 Def to target, +1 Injury, +3 Melee against Undead. Only heroes can dual-wield. | 15 | 1 |
| Whip | +1 Atk in the first round of combat when you charge | 10 | 1 |
| Great Hammer | +4 to Hit, +5 to Injury | 10 | 2 |
| Shield | +4 Def | 5 | 1 |

| Name | Range | Effect | Cost | Slots |
| ---- | ----- | ------ | ---- | ----- |
| Sling | 15" |  | 5 | 1 |

| Name | Effect | Cost |
| ---- | ------ | ---- |
| Light Armour | +1 Def | 15 |
| Heavy Armour | +2 Def | 30 |

<!--
Instead of 'Name' for each column, it could be 'Melee Weapons', 'Ranged Weapons', and 'Armour'?
-->

## Skills 
### Leader
*Inherit*

<!--
Did you mean 'Inherent'?
-->

Allied units with 6" of this unit can use this morale stat for checks instead of their own.
### Prayers
*Spellcasting*

This unit can cast Prayer spells. Immediately pick one spell from this school to be known. They can still use armour and a shield while casting unlike other spells.
### Healer
*Inherit*

This unit can make a morale check in the upkeep phase to remove the dazed or stunned condition from one friendly unit within 3".
### No Equipment
*Inherit*

This unit may not have any equipment, but does not suffer the penalties for fighting Unarmed.
### Mounted
*Inherit*

This unit is a boss dog that rides a mount.

## Prayers 

| Name | Check | Description |
| ---- | ------ | ---- |
| Blessed Weapon | 9 | The wielder gains the following: +3 to melee, 4 armour piercing, +4 to injury rolls in melee until the start of his next turn. The Priest must test on each opponents shooting phase in order to continue to use blessed weapon. |
| Steadfast | 12 | Any allied warriors within 8" of the warrior become immune to Fear. In addition, the whole warband gains +2 on any Morale tests they have to make. The effects of this spell last until the caster is knocked down, stunned or put out of action. If cast again the effects are not cumulative, ie, the maximum bonus to Rout tests remains +2. |
| Bright Blast | 15 | Roll an attack with melee skill 12 against each enemy model within 4", no defence saves are allowed. Undead or mutant models in range suffer the attack with a +2 to wound. |
| Heal | 5 | Any one model within 2" of the caster (including themself) may be healed. The warrior is restored to his full quota of Wounds. In addition, if any friendly models within 2" are stunned or knocked down, they immediately come to their senses, stand up, and continue fighting as normal. |


## Available Skills & Starting Experience
| Units | Mel | Rng | Def | Agi | Mrl | Special | Start Exp |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Justicar | X |  | X |  | X | X | X | 2 |
| Paladin | X |  |  |  | X | X | X |  |
| Cleric |  |  | X |  | X | X | X |  |
| Standard Bearer | X |  |  |  | X | X | X |  |

<!--
Extra column generated above. 'Start exp' is also getting 'X's for some reason? I think we should add some dummy data in.
-->
## Warband Special Skills 
### Determination
*Paladins*

This unit may re-roll their first failed morale check of each battle.
### Ki Strike
*Paladins*

When fighting Unarmed, targets roll their Defense Check with Disadvantage.
### Holy Standard
*Paladins*

Allied units within 6" of this unit can roll Morale Checks with Advantage. Rout Checks cannot gain Advantage in this way.
