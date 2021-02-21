window.onload = () => {
  //Check if extension is on
  var state = "";
  var Trigger = document.getElementById("Trigger");
  chrome.storage.local.get(["state"], (result) => {
    state = result.state ? result.state : "OFF";
    document.getElementById("message").innerHTML = `The extension is ${state}`;
  });

  Trigger.addEventListener("click", (event) => {
    var currentState = "";
    //Get Current State from storage
    chrome.storage.local.get(["state"], (result) => {
      currentState = result.state;
      var newState = currentState == "OFF" ? "ON" : "OFF";
      //reverse the value of state in storage
      chrome.storage.local.set({
        state: newState,
      });
      //Update in the UI
      document.getElementById(
        "message"
      ).innerHTML = `The extension is ${newState}`;
      //Send a message to the contents.js to start the extension
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          todo: "changeTrigger",
          state: newState,
        });
      });
    });
  });
};
