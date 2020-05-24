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

export class EmailsInputRenderer {
  private readonly _container: HTMLElement;

  constructor(private wrapper: HTMLElement, private onChanges: CallbackFn<string>) {
    this._container = this.createContainer();
    wrapper.appendChild(this._container);
  }

  render(emails: Email[]) {
    let existingItems = Array.from(
      this._container.querySelectorAll(`.${styles.emailItem}`)
    ) as HTMLElement[];

    existingItems = existingItems.filter(item => {
      const exists = emails.find(email => email.value === item.dataset.email);
      if (!exists) {
        this._container.removeChild(item);
      }

      return exists;
    });

    const itemsToAdd: Email[] = [];
    emails.forEach(email => {
      const exists = existingItems.find(item => email.value === item.dataset.email);
      if (!exists) {
        itemsToAdd.push(email);
      }
    });

    const input = this._container.querySelector(`.${styles.inputItem}`);
    itemsToAdd.forEach(email => {
      const item = this.createEmailItem(email);
      this._container.insertBefore(item, input);
    });
    this._container.scrollTop = this._container.scrollHeight - this._container.clientHeight;
  }

  private createContainer(): HTMLElement {
    const container = document.createElement("ul");

    container.className = styles.container;
    container.innerHTML = `<li class="${styles.item} ${styles.inputItem}"><input type="text" class="${styles.input}" placeholder="add more people..."/></li>`;

    container.addEventListener("click", e => {
      const target = e.target as HTMLElement;

      // istanbul ignore else
      if (target.className === styles.itemRemove) {
        // istanbul ignore next
        const email = target.parentElement?.dataset?.email;
        // istanbul ignore else
        if (email) {
          this.onChanges({ addedItems: [], removedItems: [email] });
        }
      }
    });

    container.addEventListener("keyup", e => {
      const target = e.target as HTMLElement;

      // istanbul ignore else
      if (target.className === styles.input) {
        // istanbul ignore else
        if (e.key === "Enter" || e.key === ",") {
          this.processSubmit(target as HTMLInputElement);
        }
      }
    });

    container.addEventListener(
      "blur",
      e => {
        const target = e.target as HTMLElement;

        // istanbul ignore else
        if (target.className === styles.input) {
          this.processSubmit(target as HTMLInputElement);
        }
      },
      true
    );

    container.addEventListener("paste", e => {
      const target = e.target as HTMLElement;

      // istanbul ignore else
      if (target.className === styles.input) {
        setTimeout(() => {
          this.processSubmit(target as HTMLInputElement);
        }, 0);
      }
    });

    return container;
  }

  private processSubmit(target: HTMLInputElement) {
    const values = target.value
      .split(",")
      .map(v => v.trim())
      .filter(v => v);

    if (values.length) {
      this.onChanges({ addedItems: values, removedItems: [] });
    }

    target.value = "";
  }

  private createEmailItem(email: Email): HTMLElement {
    const item = document.createElement("li");

    item.dataset.email = email.value;
    item.classList.add(styles.item);
    item.classList.add(styles.emailItem);

    if (!email.isValid) {
      item.classList.add(styles.invalidItem);
    }

    item.innerHTML =
      `<span class="${styles.itemTitle}">${email.value}</span>` +
      `<button class="${styles.itemRemove}" aria-label="Remove ${
        email.value
      }">${require("!!html-loader!./remove.svg")}</button>`;

    return item;
  }
}
