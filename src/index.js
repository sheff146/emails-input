var wrapper = document.getElementById("input-wrapper");
var emailsInput = new EmailsInput(wrapper);

var addButton = document.getElementById("add-button");
var countButton = document.getElementById("count-button");

addButton.addEventListener("click", onAddButtonClick);
countButton.addEventListener("click", onCountButtonClick);
emailsInput.subscribe(onEmailsInputChanges);

function onAddButtonClick() {
  var emails = emailsInput.getAllEmails().map(function(email) {
    return email.value;
  });

  var newEmail = generateNewEmail();
  emails.push(newEmail);

  emailsInput.replaceEmails(emails);
}

function generateNewEmail() {
  var number = Math.random();
  return number + "@gmail.com";
}

function onCountButtonClick() {
  var validEmails = emailsInput.getAllEmails().filter(function(email) {
    return email.isValid;
  });

  alert("Number of valid e-mails: " + validEmails.length);
}

function onEmailsInputChanges(changes) {
  console.log("Changes in e-mails input", changes);
}
