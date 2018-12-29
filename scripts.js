let memCount = 1;

function addMemberField () {
    memCount++;
    let fs = document.getElementById("members");
    let btns = document.getElementById("buttons").cloneNode(true);
    let inp = document.createElement("input");
    inp.type="text";
    inp.name="member " + memCount;
    inp.placeholder = "Member " + memCount;
    inp.className ="field";
    if (memCount == 2)
        for (let i = 0 ; i < 3; i++) fs.removeChild(fs.lastChild);
    else
        for (let i = 0 ; i < 2; i++) fs.removeChild(fs.lastChild);
    fs.appendChild(inp);
    fs.appendChild(document.createElement("br"));
    fs.appendChild(btns);
    fs.appendChild(document.createElement("br"));
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
    let n = 0;
    if (memCount == 2) n = 2;
    else n = 3;
    console.log(n);
    for (let i = 0 ; i < n; i++) {
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