function findGetParameter(parameterName) {
    var res = "";
    var tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) {
                result = decodeURIComponent(tmp[1]);
                if (res !== "") {
                    res += ","
                }
                res += decodeURIComponent(tmp[1]);
            }
        });
    return res;
}

async function skillsLoop(){
    await new Promise(r => setTimeout(r, 1000));
    var skillDivs = document.getElementsByName('skillsearch');
    if (skillDivs == null){
        return skillsLoop()
    }
    await skillDivs.forEach(skillSplit);
    await new Promise(r => setTimeout(r, 1000));
    return skillsLoop();
}

async function skillSplit(item) {
    var skillList = await fetch('/jsondata/skills.json').then((res) => res.json());
    var filterStr = findGetParameter("filter");
    if (filterStr == "") {
        item.innerHTML = "Please select skill types to filter."
        item.setAttribute("name", "skillssearchdone");
        return;
    }
    var filterItems = filterStr.split(",");
    console.log("fff" + filterItems);
    var filterCheckboxes = document.getElementsByName('filter');
    for (var f=0; f < filterCheckboxes.length; f++){
        var filterCheckbox = filterCheckboxes[f];
        if (filterItems.includes(filterCheckbox.value)) {
            filterCheckbox.checked = true;
        }
    }
    // console.log(filterCheckboxes[filterCheckboxes.length - 1].outerHTML)
    // var finalRow = document.getElementById('finalrow');
    // var newFilterLine= "<td>Pal</td><td>checkbox</td>";
    // var newFilterNode = document.createElement('tr');
    // newFilterNode.innerHTML = "<td>Pal</td><td>checkbox</td>";
    // finalRow.parentNode.insertBefore(newFilterNode, finalRow);
    // filterCheckboxes[filterCheckboxes.length - 1].appendChild(newFilterLine);

    item.innerHTML = "";
    for(var i = 0; i < filterItems.length; i++) {
        var filterItem = filterItems[i];
        item.innerHTML += "<h2>" + filterItem + "</h2>";
        if (!(filterItems.includes("Other")) && !(['Inherent', 'Melee', 'Ranged', 'Agility', 'Defence', 'Morale', 'Spellcasting', 'Other'].includes(filterItem))) {
            var newFilterNode = document.createElement('tr');
            newFilterNode.innerHTML = "<td>" + filterItem + "</td><td><input type=\"checkbox\" value=\"" + filterItem + "\" name=\"filter\" checked></td>";
            var finalRow = document.getElementById('finalrow');
            finalRow.parentNode.insertBefore(newFilterNode, finalRow);
        }
        for (var skillName in skillList) {
            if (skillList[skillName]['Type'] === filterItem || (filterItem === "Other" && !(['Inherent', 'Melee', 'Ranged', 'Agility', 'Defence', 'Morale', 'Spellcasting'].includes(skillList[skillName]['Type'])))) {
                item.innerHTML += "<h3 class='anchor'>" + skillList[skillName]['Name'] + "</h3>";
                item.innerHTML += "<p><em>" + skillList[skillName]['Type'] + "</em></p>";
                item.innerHTML += "<p>" + skillList[skillName]['Description'] + "</p>";
            }
        }
        item.innerHTML += "<br>"
    }
    item.setAttribute("name", "skillssearchdone");
}

if (typeof document !== 'undefined') {
    skillsLoop();
}