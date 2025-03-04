const expandedSkills = {
    "Prepare Shot": "You may only fire every other turn",
    "Deadly": "Increase Injury modifier by 2",
    "Armour Piercing": "Reduce enemy defense by 3",
    "Close Quarters": "You may make an attack in the first round of combat. Use Melee skill. Deadly and Armour Piercing apply to this shot"
}

async function equipmentLoop(){
    await new Promise(r => setTimeout(r, 1000));
    var equipmentDivs = document.getElementsByName('ranged-weapons');
    if (equipmentDivs == null){
        return equipmentLoop()
    }
    await equipmentDivs.forEach(equipmentSplit);
    await new Promise(r => setTimeout(r, 1000));
    return equipmentLoop();
}

async function equipmentSplit(item) {
    var equipmentList = await fetch('/jsondata/ranged-weapons.json').then((res) => res.json());
    console.log(equipmentList);
    console.log(equipmentList['Dagger']);
    item.setAttribute("name", "equipmentset");
    var equipmentItemsRaw = item.textContent;
    var equipmentItems = equipmentItemsRaw.split(", ");
    var tbl = document.createElement('table');
    const trHeading = tbl.insertRow();
    const tdNameHeading = trHeading.insertCell();
    tdNameHeading.appendChild(document.createTextNode("Ranged Weapons"));
    const tdRangeHeading = trHeading.insertCell();
    tdRangeHeading.appendChild(document.createTextNode("Range"));
    const tdEffectHeading = trHeading.insertCell();
    tdEffectHeading.appendChild(document.createTextNode("Effects"));
    const tdSlotsHeading = trHeading.insertCell();
    tdSlotsHeading.appendChild(document.createTextNode("Equipment Slots"));
    const tdCostHeading = trHeading.insertCell();
    tdCostHeading.appendChild(document.createTextNode("Cost"));
    for (let index = 0; index < equipmentItems.length; ++index) {
        var element = equipmentItems[index];
        console.log(element);
        const tr = tbl.insertRow();
        const tdName = tr.insertCell();
        tdName.innerHTML = "<a href=\"/docs/Rules/Equipment/weapons\">" + equipmentList[element].Name + "</a>";
        const tdRange = tr.insertCell();
        tdRange.appendChild(document.createTextNode(equipmentList[element].Range));

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
        const tdSlots = tr.insertCell();
        tdSlots.appendChild(document.createTextNode(equipmentList[element].Slots));
        const tdCost = tr.insertCell();
        tdCost.appendChild(document.createTextNode(equipmentList[element].Cost));
    }
    item.innerHTML = tbl.outerHTML;
}

if (typeof document !== 'undefined') {
    equipmentLoop();
}