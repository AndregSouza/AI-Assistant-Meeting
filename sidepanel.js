let portFromCS;

function connected(p) {
    portFromCS = p;

    // portFromCS.postMessage({ greeting: "hi there content script!" });

    portFromCS.onMessage.addListener((m) => {
        console.log(m.user);
        console.log(m.content);
        console.log(m.content);

        const newDiv = document.createElement("div")
        newDiv.setAttribute("style", "background-color:red; font-size:2em;");

        const newDiv2 = document.createElement("div")
        newDiv2.setAttribute("style", "background-color:blue; font-size:2em;");
        
        const newContent = document.createTextNode(m.user);
        console.log(newContent);

        const newContent2 = document.createTextNode(m.content);
        console.log(newContent2);

        newDiv.appendChild(newContent);
        newDiv2.appendChild(newContent2)
        
        const currentDiv = document.getElementById("div");

        document.body.insertBefore(newDiv, currentDiv);
        document.body.insertBefore(newDiv2, currentDiv);        

    });



}

chrome.runtime.onConnect.addListener(connected);



