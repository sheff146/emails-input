export interface IEmailsInput {
    getAllEmails(): IEmail[];

    replaceEmails(emails: string[]): void;

    subscribe(callback: CallbackFn): ISubscription;
}

export interface IEmail {
    value: string;
    isValid: boolean;
}

export type CallbackFn = (changes: IEmailsChanges) => void;

export interface ISubscription {
    readonly unsubscribe: () => void;
}

export interface IEmailsChanges {
    addedItems: IEmail[];
    removedItems: IEmail[];
}
