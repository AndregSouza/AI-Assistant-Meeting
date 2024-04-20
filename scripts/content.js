let ON_CALL = false;
let last_speaker;
let myPort = chrome.runtime.connect({ name: "port-from-cs" });

const docObserver = new MutationObserver(() => {
  if (document.body.querySelector("div[jscontroller='kAPMuc']")) {
    ON_CALL = true;
    console.log("entrou no meet");
    docObserver.disconnect();
    callStarts();
  }
  else {
    ON_CALL = false;
    console.log("nao esta meet");
  }
})

docObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

function callStarts() {
  const subtitleDiv = document.querySelector("div[jscontroller='D1tHje']");

  const subtitleOnOff = new MutationObserver(() => {
    if (subtitleDiv.style.display === "none") {
      IS_SUBTITLE_ON = false;
      console.log('legenda nao ta ligado');
    }
    else {
      IS_SUBTITLE_ON = true;
      console.log('legenda ta ligado');
      whenSubtitleOn();
    }
  })

  subtitleOnOff.observe(subtitleDiv, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["style"],
  });
}

function whenSubtitleOn() {
  const subtitleDiv = document.querySelector("div[jscontroller='D1tHje']");
  const subtitleObserver = new MutationObserver((mutations) => {
    console.log(mutations);
    mutations.forEach((mutation) => {
      console.log(mutation);
      if (mutation.target.classList && mutation.target.classList.contains("iTTPOb")) {
        if (mutation.addedNodes.length) {
          var newNodes = mutation.addedNodes;

          console.log(mutation.addedNodes);
          console.log(mutation.addedNodes["0"].innerText);

          // enviando o speaker para o sidepanel.js
          var speaker = newNodes["0"].parentNode.parentNode.parentNode.querySelector(".zs7s8d.jxFHg").textContent;

          var messages = newNodes["0"].textContent;

          console.log(messages);
          console.log(newNodes["0"], newNodes["0"].textContent, newNodes["0"].innerText);

          setTimeout(function () {
            console.log(mutation.addedNodes);
            console.log(mutation.addedNodes["0"].innerText);
          }, 5000)

          if (speaker) {
            setTimeout(function () {
              if (newNodes.length) {
                if (last_speaker != speaker) {
                  myPort.postMessage({
                    user: speaker,
                    content: messages
                  });

                  console.log("roi");
                  last_speaker = speaker;
                }
                else {
                  myPort.postMessage({ content: messages });
                  var lastText = script.pop();
                  lastText = lastText.slice(0, -2);
                  lastText = lastText + newNodes["0"].innerText + "\r\n";
                  // script.push(lastText);

                  console.log("roi23");
                }
              }
            }, 1000);
          }
        }
      }
    });
  });

  subtitleObserver.observe(subtitleDiv, {
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: true,
  });
}


