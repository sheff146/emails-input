export interface IEmailsInput {
  getAllEmails(): IEmail[];

  replaceEmails(emails: string[]): void;

  subscribe(callback: CallbackFn<IEmail>): ISubscription;
}

export interface IEmail {
  value: string;
  isValid: boolean;
}

export type CallbackFn<T> = (changes: IChanges<T>) => void;

export interface ISubscription {
  readonly unsubscribe: () => void;
}

export interface IChanges<T> {
  addedItems: T[];
  removedItems: T[];
}
