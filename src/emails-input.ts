import { Email } from './email';
import { CallbackFn, IEmail, IChanges, IEmailsInput, ISubscription } from './interfaces';
import { EmailsInputRenderer } from './emails-input-renderer';

export class EmailsInput implements IEmailsInput {
    private readonly _emails: Email[] = [];
    private readonly _callbacks: CallbackFn<IEmail>[] = [];
    private readonly _renderer: EmailsInputRenderer;

    constructor(container: HTMLElement) {
        this._renderer = new EmailsInputRenderer(container, this.onViewChanges.bind(this));
    }

    getAllEmails(): IEmail[] {
        return this._emails.map(getEmailValue);
    }

    replaceEmails(emails: string[]): void {
        const newEmails = emails.map(email => new Email(email));
        const removedEmails = this._emails.splice(0, this._emails.length, ...newEmails);

        this._renderer.render(this._emails);

        this.notifySubscribers(newEmails, removedEmails);
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

    private onViewChanges(changes: IChanges<string>) {
        const newEmails = changes.addedItems.map(email => new Email(email));
        const removedEmails: Email[] = [];

        changes.removedItems.forEach(emailStr => {
            const index = this._emails.findIndex(email => email.value === emailStr);
            const removedItem = this._emails.splice(index, 1);
            removedEmails.push(...removedItem);
        });
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
