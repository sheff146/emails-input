import { Email } from './email';
import { CallbackFn, IEmail, IChanges, IEmailsInput, ISubscription } from './interfaces';
import { EmailsInputRenderer } from './emails-input-renderer';

export class EmailsInput implements IEmailsInput {
    private readonly _emails: Email[] = [];
    private readonly _callbacks: CallbackFn<IEmail>[] = [];
    private readonly _renderer: EmailsInputRenderer;

    constructor(container: HTMLElement) {
        this._renderer = new EmailsInputRenderer(container, this.processChanges.bind(this));
    }

    getAllEmails(): IEmail[] {
        return this._emails.map(getEmailValue);
    }

    replaceEmails(emails: string[]): void {
        this.processChanges({ addedItems: emails, removedItems: this._emails.map(email => email.value) })
    }

    subscribe(callback: CallbackFn<IEmail>): ISubscription {
        this._callbacks.push(callback);

        return {
            unsubscribe: () => {
                const index = this._callbacks.findIndex(cb => cb === callback);
                this._callbacks.splice(index, 1);
            }
        };
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
        })
    }

    private processChanges(changes: IChanges<string>) {
        const removedEmails: Email[] = [];
        changes.removedItems.forEach(emailStr => {
            const index = this._emails.findIndex(email => email.value === emailStr);
            const removedItem = this._emails.splice(index, 1);
            removedEmails.push(...removedItem);
        });

        const newEmails = changes.addedItems
            .reduce<string[]>((arr, item) => {
                if (item) {
                    const exists = arr.find(arrItem => arrItem === item) || this._emails.find(email => email.value === item);
                    if (!exists) {
                        arr.push(item);
                    }
                }
                return arr;
            }, [])
            .map(email => new Email(email));

        this._emails.push(...newEmails);

        this._renderer.render(this._emails);

        this.notifySubscribers(newEmails, removedEmails);
    }
}

function getEmailValue(email: Email): IEmail {
    return {
        value: email.value,
        isValid: email.isValid
    };
}
