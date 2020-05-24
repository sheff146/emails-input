# emails-input

A simple reusable component for e-mail addresses integrated on a demo page. Published on https://sheff146.github.io/emails-input/. 

Requirements are described in this [document](https://docs.google.com/document/d/1VGyYpWzPyaAnJAesaM2I_3ly8s1Tbjf8_tOsML1zGx8/edit). Design can be found [here](https://www.figma.com/file/CWdAs3rN4d2gZpnoN7ZPvj/Share-test).

## Main features

1. No 3rd party dependencies
1. Reusability
1. Cross-browser support (IE 11, Edge, Safari, Firefox, Opera, Chrome)
1. Simple API

## Usage

Include component script on the page.

```html
<script src="emails-input.js"></script>
```
It will add it's unique styles to document head and export EmailsInput function to window object.

After that, you will be able to start using it.
```javascript
// Component will be rendered inside of this element
var wrapper = document.getElementById("input-wrapper");
// Create an instance of component
var emailsInput = new EmailsInput(wrapper);
```

## API

Component has several API methods for communication with the host page.

### replaceEmails(emails)

Takes array of strings and replaces all rendered e-mails with new ones.

```javascript
var newEmails = ["abc@example.com", "1234@gmail.com"]
emailsInput.replaceAllEmails(newEmails);
```

### getAllEmails()

Returns an array of currently rendered e-mails with validity status.

```javascript
var emails = emailsInput.getAllEmails();
console.log(emails); // [{ value: "abc@example.com", isValid: true }, { value: "1234.gmail.com", isValid: false }]
```

### subscribe(callback)

Notifies about changes by calling the callback function. Returns a subscription object.

```javascript
var subscription = emailsInput.subscribe(function(changes) {
  console.log(changes); // { addedItems: [{ value: "abc@example.com", isValid: true }], removedItems: [{ value: "1234.gmail.com", isValid: false }] }
});
// Unsubscribe to not receive updates anymore
subscription.unsubscribe();
```

