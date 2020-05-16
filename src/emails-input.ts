import { Email } from './email';
import { CallbackFn, IEmail, IEmailsChanges, IEmailsInput, IEmailsInputOptions, ISubscription } from './interfaces';

export class EmailsInput implements IEmailsInput {
    private _emails: Email[] = [];
    private _callbacks: CallbackFn[] = [];

    constructor(container: HTMLElement, options: IEmailsInputOptions) {
    }

    getAllEmails(): IEmail[] {
        return this._emails.map(getEmailValue);
    }

    replaceEmails(emails: string[]): void {
        const newEmails = emails.map(email => new Email(email));
        const removedEmails = this._emails.splice(0, this._emails.length, ...newEmails);

        this.notifySubscribers(newEmails, removedEmails);
    }

    subscribe(callback: CallbackFn): ISubscription {
        this._callbacks.push(callback);

        return {
            unsubscribe: () => {
                const index = this._callbacks.findIndex(cb => cb === callback);
                this._callbacks.splice(index, 1);
            }
        };
    }

    private notifySubscribers(added: Email[], removed: Email[]): void {
        const changes: IEmailsChanges = {
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
}

function getEmailValue(email: Email): IEmail {
    return {
        value: email.value,
        isValid: email.isValid
    };
}
