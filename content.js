chrome.runtime.sendMessage({ todo: "showPageAction" }); //Send message to eventPage to highlight Icon

//On startup check if the extension is enabled
chrome.storage.local.get(["state"], (result) => {
  // console.log("STARTUP CHECK")
  state = result.state ? result.state : "OFF";
  if (state == "ON") {
    applyButtons();
  }
});

//Enable the extension when triggered
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("GOT THE MESSAGE", request);
  //When a new page is loaded
  if (request.todo == "NewPageLoaded") {
    //Check the document and if new nodes are added then apply the evet listener on them
    MutationObserver = window.MutationObserver;
    var observer = new MutationObserver((mutation, observer) => {
      console.log("MUTATION");
      //console.log("MUTATION",mutation,observer);
      chrome.storage.local.get(["state"], (result) => {
        var state = result.state ? result.state : "OFF";
        if (state == "ON") {
          applyButtons();
        }
      });
    });
    //Observe the entire product list node for any changes
    observer.observe(
      document.querySelector(
        ".s-main-slot.s-result-list.s-search-results.sg-row"
      ),
      {
        subtree: true,
        childList: true,
      }
    );
    // console.log("READY STATE",document.readyState)
  } else if (request.todo == "changeTrigger") {
    if (request.state == "ON") {
      //Apply the EventListener(Click event) on all the <a> tags
      applyButtons();
    } else {
      //Remove the EventListener(Click Event) on all the <a> tags
      remove();
    }
  }
});
// To get the <a> tag
const getParentAnchor = function (element) {
  while (element !== null) {
    if (element.tagName.toUpperCase() === "A") {
      return element;
    }
    element = element.parentNode;
  }
  return null;
};

// To handle the click event
const handleEvent = (event) => {
  var anchor = getParentAnchor(event.target);
  // console.log("anchor", anchor);
  event.preventDefault(); //Prevent the href from loading the new page
  var url = `https://www.amazon.com/${anchor.getAttribute("href")}`; //Generate our product info link
  getDetails(url); //Get the details of the product and display the alert
};

//Make a button on all products
const applyButtons = () => {
  var divs = document.querySelectorAll(`h2 .a-link-normal.a-text-normal`);
  divs.forEach((div) => {
    var buttonElement =
      div.parentNode.parentNode.querySelector(`.addedButton`) === null; //Check if button already exists
    if (buttonElement) {
      //If it doesnt exist then add it
      var button = document.createElement("input");
      var url = `https://www.amazon.com${div.getAttribute("href")}`;
      button.setAttribute("type", "button");
      button.setAttribute("value", "Get Details");
      button.setAttribute("class", "addedButton");
      button.setAttribute("name", "CLICK MEEEEEEEE");
      button.addEventListener("click", () => {
        getDetails(url);
      });
      div.parentNode.parentNode.append(button);
    }
  });
};
//Apply Event Listener on <a> Tags
const apply = () => {
  //Get all the clickable links for products
  var aTag = document.querySelectorAll("h2 .a-link-normal.a-text-normal");
  // console.log("THE A TAGS ARE", aTag);
  // Add an event listener to check when the link is pressed
  aTag.forEach((item) => {
    // console.log("forEach")
    item.addEventListener("click", handleEvent);
  });
};

//Remove Event Listener on <a> Tags
const remove = () => {
  //Get all the clickable links for products
  var aTag = document.querySelectorAll("h2 .a-link-normal.a-text-normal");
  // Add an event listener to check when the link is pressed
  aTag.forEach((item) => {
    item.removeEventListener("click", handleEvent);
  });
};

// Get the details of the product
const getDetails = (url) => {
  fetch(url) //Get request of the generated url
    .then((res) => res.text()) // use the .text() of res (object) to convert the byte stream into plain text
    .then((text) => {
      var parser = new DOMParser(); //DomParser API
      var doc = parser.parseFromString(text, "text/html"); //parse into DOM query-able form
      var items = doc.querySelectorAll(
        ".a-unordered-list.a-vertical.a-spacing-mini span.a-list-item"
      ); //Query the details of the product
      var info = "";
      //Generate the new info to be displayed on the alert
      items.forEach((element) => {
        info += element.innerHTML;
      });
      alert(info); // Make an alert to display the product info
    })
    // If there is an error catch it and display it as an alert
    .catch((err) => alert(err));
};
