let memCount = 1;

function addMemberField () {
    memCount++;
    let fs = document.getElementById("members");
    let buttons = document.getElementById("buttons");
    let btns = buttons.cloneNode(true);
    let inp = document.createElement("input");
    buttons.parentNode.removeChild(buttons);
    inp.type = "text";
    inp.name = "member " + memCount;
    inp.placeholder = "Member " + memCount;
    inp.className = "field";
    fs.appendChild(inp);
    fs.appendChild(document.createElement("br"));
    fs.appendChild(btns);
}

function removeField () {
    if (memCount == 1) {
        alert("Your group should have at least one member!");
        return
    }
    let x = document.getElementById("buttons");
    let y = x.cloneNode(true);
    let fs = document.getElementById("members");
    x.parentNode.removeChild(x);
    for (let i = 0 ; i < 2; i++) {
        console.log(fs.lastChild);
        fs.removeChild(fs.lastChild);
    }
    fs.appendChild(y);
    memCount--;
}

function x () {
    removeField("test");
    removeField("test2");
}