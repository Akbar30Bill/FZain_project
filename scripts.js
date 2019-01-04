let memCount = 1;

function addMemberField() {
    if (memCount == 3) {
        alert("There can be a maximum of 3 members in a single group!");
        return
    }
    memCount++;
    let id = "member" + memCount;
    let elem = document.getElementById(id);
    elem.value=""
    elem.style.display = "inline-block";
    document.getElementById("b"+(memCount-1)).style.display="inline-block";
}
function removeMemberField() {
    if (memCount == 1) {
        alert("Your group should have at least one member!");
        return
    }
    let id = "member" + memCount;
    let elem = document.getElementById(id);
    elem.style.display = "none";
    elem.value = "nomember";
    document.getElementById("b"+(memCount-1)).style.display="none";
    memCount--;
}
