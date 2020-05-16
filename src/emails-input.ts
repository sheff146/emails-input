import { Email, IEmail } from './email';

export interface IEmailsInputOptions {

}

interface ISubscription {
    readonly unsubscribe: () => void;
}

type CallbackFn = (changes: IEmailsChanges) => void;

interface IEmailsChanges {
    addedItems: IEmail[];
    removedItems: IEmail[];
}

export class EmailsInput {
    private _emails: Email[] = [];
    private _callbacks: CallbackFn[] = [];

    constructor(container: HTMLElement, options: IEmailsInputOptions) {
    }

    getAllEmails(): IEmail[] {
        return this._emails.map(email => email.getValue());
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
            addedItems: added.map(email => email.getValue()),
            removedItems: removed.map(email => email.getValue())
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

