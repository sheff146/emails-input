import { Email } from "./email";
import { CallbackFn, IEmail, IChanges, IEmailsInput, ISubscription } from "./interfaces";
import { EmailsInputRenderer } from "./emails-input-renderer";

export class EmailsInput implements IEmailsInput {
  private readonly _emails: Email[] = [];
  private readonly _callbacks: CallbackFn<IEmail>[] = [];
  private readonly _renderer: EmailsInputRenderer;

  constructor(wrapper: HTMLElement) {
    this._renderer = new EmailsInputRenderer(wrapper, this.processChanges.bind(this));
  }

  getAllEmails(): IEmail[] {
    return this._emails.map(getEmailValue);
  }

  replaceEmails(emails: string[]): void {
    this.processChanges({
      addedItems: emails,
      removedItems: this._emails.map(email => email.value)
    });
  }

  subscribe(callback: CallbackFn<IEmail>): ISubscription {
    this._callbacks.push(callback);

    return {
      unsubscribe: () => {
        const index = this._callbacks.indexOf(callback);
        this._callbacks.splice(index, 1);
      }
    };
  }

  private processChanges(changes: IChanges<string>) {
    const removedEmails = this.removeItems(changes.removedItems);
    const newEmails = this.addItems(changes.addedItems);

    this._renderer.render(this._emails);

    this.notifySubscribers(newEmails, removedEmails);
  }

  private addItems(addedItems: string[]) {
    const newEmails = addedItems
      .reduce<string[]>((items, newItem) => {
        // filter out empty and duplicate values
        if (newItem) {
          const hasItem =
            items.some(item => item === newItem) ||
            this._emails.some(email => email.value === newItem);
          if (!hasItem) {
            items.push(newItem);
          }
        }
        return items;
      }, [])
      .map(item => new Email(item));

    this._emails.push(...newEmails);

    return newEmails;
  }

  private removeItems(removedItems: string[]) {
    const removedEmails: Email[] = [];

    removedItems.forEach(emailStr => {
      for (let i = 0; i < this._emails.length; i++) {
        const email = this._emails[i];
        // istanbul ignore else
        if (email.value === emailStr) {
          const removedItem = this._emails.splice(i, 1);
          removedEmails.push(...removedItem);
          return;
        }
      }
    });

    return removedEmails;
  }

  private notifySubscribers(added: Email[], removed: Email[]): void {
    const changes: IChanges<IEmail> = {
      addedItems: added.map(getEmailValue),
      removedItems: removed.map(getEmailValue)
    };

    this._callbacks.forEach(cb => {
      try {
        cb(changes);
      } catch (e) {
        // Error in the callback. Log and ignore
        console.error(e);
      }
    });
  }
}

function getEmailValue(email: Email): IEmail {
  return {
    value: email.value,
    isValid: email.isValid
  };
}
