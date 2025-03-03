const equipmentList = {
    "Dagger": {
        "Name": "Dagger",
        "Effect": "None",
        "Cost": "2",
        "Hands": "One-handed"
    },
    "Sword": {
        "Name": "Sword / Axe",
        "Effect": "-3 Def to target",
        "Cost": "5",
        "Hands": "One-handed"
    },
    "Spear": {
        "Name": "Spear",
        "Effect": "+3 Hit",
        "Cost": "5",
        "Hands": "One-handed"
    },
    "Hammer": { 
        "Name": "Hammer", 
        "Effect": "+1 Injury", 
        "Cost": "5", 
        "Hands": "One-handed" 
      }, 
      "Great Spear": { 
        "Name": "Great Spear", 
        "Effect": "+7 to Hit, +4 to Injury", 
        "Cost": "10", 
        "Hands": "Two-handed" 
      }, 
      "Great Sword": { 
        "Name": "Great Sword", 
        "Effect": "+4 to Hit, +4 to Injury, -3 Def to target", 
        "Cost": "10", 
        "Hands": "Two-handed" 
      }, 
      "Great Hammer": { 
        "Name": "Great Hammer", 
        "Effect": "+4 to Hit, +5 to Injury", 
        "Cost": "10", 
        "Hands": "Two-handed" 
      }, 
      "Crossbow": { 
        "Name": "Crossbow", 
        "Effect": "30\" Range, Long Reload, Deadly", 
        "Cost": "20", 
        "Hands": "Two-handed" 
      }, 
      "Pistol": { 
        "Name": "Pistol", 
        "Effect": "10\" Range, Prepare Shot, Deadly, Armour Piercing, Close Quarters", 
        "Cost": "15",
        "Hands": "One-handed" 
      }, 
      "Bow": { 
        "Name": "Bow", 
        "Effect": "25\" Range", 
        "Cost": "10", 
        "Hands": "Two-handed" 
      },  
      "Long Bow": { 
        "Name": "Long Bow", 
        "Effect": "30\" Range", 
        "Cost": "15", 
        "Hands": "Two-handed" 
      },  
      "Rifle": { 
        "Name": "Rifle", 
        "Effect": "25\" Range, Prepare Shot, Long Reload, Deadly, Armour Piercing", 
        "Cost": "25", 
        "Hands": "Two-handed" 
      },  
      "Blunderbuss": { 
        "Name": "Blunderbuss", 
        "Effect": "Massive Shot, Fire Once, Deadly", 
        "Cost": "25", 
        "Hands": "Two-handed" 
      }, 
      "Light Armour": { 
        "Name": "Light Armour", 
        "Effect": "+1 Def", 
        "Cost": "15", 
        "Hands": "-" 
      }, 
      "Heavy Armour": { 
        "Name": "Heavy Armour", 
        "Effect": "+2 Def", 
        "Cost": "30", 
        "Hands": "-" 
      }, 
      "Shield": { 
        "Name": "Shield", 
        "Effect": "+4 Def", 
        "Cost": "5", 
        "Hands": "One-handed" 
      }
}

const expandedSkills = {
    "Prepare Shot": "You may only fire every other turn",
    "Deadly": "Increase Injury modifier by 2",
    "Armour Piercing": "Reduce enemy defense by 3",
    "Close Quarters": "You may make an attack in the first round of combat. Use Melee skill. Deadly and Armour Piercing apply to this shot"
}

async function equipmentLoop(){
    await new Promise(r => setTimeout(r, 1000));
    var equipmentDivs = document.getElementsByName('equipment');
    if (equipmentDivs == null){
        return equipmentLoop()
    }
    equipmentDivs.forEach(equipmentSplit);
}

function equipmentSplit(item) {
    var equipmentItemsRaw = item.textContent;
    var equipmentItems = equipmentItemsRaw.split(", ");
    var tbl = document.createElement('table');
    const trHeading = tbl.insertRow();
    const tdNameHeading = trHeading.insertCell();
    tdNameHeading.appendChild(document.createTextNode("Name"));
    const tdEffectHeading = trHeading.insertCell();
    tdEffectHeading.appendChild(document.createTextNode("Effect"));
    const tdHandsHeading = trHeading.insertCell();
    tdHandsHeading.appendChild(document.createTextNode("Hands"));
    const tdCostHeading = trHeading.insertCell();
    tdCostHeading.appendChild(document.createTextNode("Cost"));
    for (let index = 0; index < equipmentItems.length; ++index) {
        const element = equipmentItems[index];
        const tr = tbl.insertRow();
        const tdName = tr.insertCell();
        tdName.innerHTML = "<a href=\"/docs/Rules/Equipment/weapons\">" + equipmentList[element].Name + "</a>";
        // tdName.appendChild(document.createTextNode(equipmentList[element].Name));
        const tdEffect = tr.insertCell();

        var effect = equipmentList[element].Effect;
        if (!!effect) {
            for (var key in expandedSkills){
                var value = expandedSkills[key];
                if (effect.includes(key)) {
                    effect = effect.replace(key, "<br>" + key + ": " + value);
                }
            }
        }

        tdEffect.innerHTML = "<p>" + effect + "</p>"
        // tdEffect.appendChild(document.createTextNode(equipmentList[element].Effect));
        const tdHands = tr.insertCell();
        tdHands.appendChild(document.createTextNode(equipmentList[element].Hands));
        const tdCost = tr.insertCell();
        tdCost.appendChild(document.createTextNode(equipmentList[element].Cost));
    }
    item.innerHTML = tbl.outerHTML;
}

equipmentLoop();