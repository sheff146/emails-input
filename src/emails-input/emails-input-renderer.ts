import { CallbackFn } from "./interfaces";
import { Email } from "./email";

const emailsInputStyles = require("./emails-input.css");

const styles = {
  container: emailsInputStyles["container"],
  item: emailsInputStyles["container__item"],
  emailItem: emailsInputStyles["container__item_email"],
  invalidItem: emailsInputStyles["container__item_invalid"],
  itemTitle: emailsInputStyles["container__email"],
  itemRemove: emailsInputStyles["container__remove"],
  inputItem: emailsInputStyles["container__item_input"],
  input: emailsInputStyles["container__input"]
};

const SUBMIT_KEYS = ["Enter", ","];

export class EmailsInputRenderer {
  private readonly _container: HTMLElement;

  constructor(private wrapper: HTMLElement, private onChanges: CallbackFn<string>) {
    this._container = this.createContainer();
    wrapper.appendChild(this._container);
  }

  render(emails: Email[]) {
    let existingItems = Array.prototype.slice.call(
      this._container.querySelectorAll(`.${styles.emailItem}`)
    ) as HTMLElement[];

    existingItems = existingItems.filter(item => {
      const hasEmail = emails.some(email => email.value === item.dataset.email);
      if (!hasEmail) {
        this._container.removeChild(item);
      }

      return hasEmail;
    });

    const itemsToAdd: Email[] = [];
    emails.forEach(email => {
      const hasEmail = existingItems.some(item => email.value === item.dataset.email);
      if (!hasEmail) {
        itemsToAdd.push(email);
      }
    });

    const input = this._container.querySelector(`.${styles.inputItem}`);
    itemsToAdd.forEach(email => {
      const item = createEmailItem(email);
      this._container.insertBefore(item, input);
    });
    this._container.scrollTop = this._container.scrollHeight - this._container.clientHeight;
  }

  private createContainer(): HTMLElement {
    const container = document.createElement("ul");

    container.className = styles.container;
    container.innerHTML =
      `<li class="${styles.item} ${styles.inputItem}">` +
      `<input type="text" class="${styles.input}" placeholder="add more people..."/>` +
      `</li>`;

    container.addEventListener("click", this.processButtonEvent.bind(this));
    container.addEventListener("keyup", this.processInputEvent.bind(this));
    container.addEventListener("blur", this.processInputEvent.bind(this), true);
    container.addEventListener("paste", this.processInputEvent.bind(this));

    return container;
  }

  private processButtonEvent(e: Event) {
    const target = e.target as HTMLElement;

    // istanbul ignore else
    if (target.classList.contains(styles.itemRemove)) {
      // istanbul ignore next
      const email = target.parentElement?.dataset?.email;
      // istanbul ignore else
      if (email) {
        this.onChanges({ addedItems: [], removedItems: [email] });
      }
    }
  }

  private processInputEvent(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.classList.contains(styles.input)) {
      return;
    }

    switch (e.type) {
      case "keyup":
        if (SUBMIT_KEYS.indexOf((e as KeyboardEvent).key) >= 0) {
          this.processSubmit(target);
        }
        break;
      case "blur":
        this.processSubmit(target);
        break;
      case "paste":
        setTimeout(() => {
          this.processSubmit(target);
        }, 0);
    }
  }

  private processSubmit(target: HTMLInputElement) {
    // Split, trim, and filter empty values
    const values = target.value
      .split(",")
      .map(v => v.trim())
      .filter(v => v);

    if (values.length) {
      this.onChanges({ addedItems: values, removedItems: [] });
    }

    target.value = "";
  }
}

function createEmailItem(email: Email): HTMLElement {
  const item = document.createElement("li");

  item.dataset.email = email.value;
  item.classList.add(styles.item);
  item.classList.add(styles.emailItem);

  if (!email.isValid) {
    item.classList.add(styles.invalidItem);
  }

  const titleLabel = `${email.value}, ${email.isValid ? "valid" : "invalid"}`;
  const buttonLabel = `Remove ${email.value}`;
  const buttonContent = require("!!html-loader!./remove.svg");

  item.innerHTML =
    `<span class="${styles.itemTitle}" aria-label="${titleLabel}">${email.value}</span>` +
    `<button class="${styles.itemRemove}" aria-label="${buttonLabel}">${buttonContent}</button>`;

  return item;
}
