chrome.runtime.sendMessage({ todo: "showPageAction" }); //Send message to eventPage to highlight Icon

window.onload = () => {
  //Get all the clickable links for products
  var href = document.querySelectorAll(".a-link-normal.a-text-normal");
  // Add an event listener to check when the link is pressed
  href.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault(); //Prevent the href from loading the new page
      var url = `https://www.amazon.com/${item.getAttribute("href")}`; //Generate our product info link
      getDetails(url); //Get the details of the product and display the alert
    });
  });
};

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
