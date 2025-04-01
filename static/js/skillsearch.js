function findGetParameter(parameterName) {
    var result = null,
    tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
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
    if (filterStr == null) {
        item.innerHTML = "Sorry, this page requires parameters and it can't be viewed directly."
        item.setAttribute("name", "skillssearchdone");
        return;
    }
    var filterItems = filterStr.split(",");
    item.innerHTML = "";
    for(var i = 0; i < filterItems.length; i++) {
        var filterItem = filterItems[i];
        item.innerHTML += "<h2>" + filterItem + "</h2>";
        for (var skillName in skillList) {
            if (skillList[skillName]['Type'] === filterItem) {
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