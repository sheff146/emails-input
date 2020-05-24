export class Email {
  private readonly _value: string;
  private readonly _isValid: boolean;

  get value(): string {
    return this._value;
  }

  get isValid(): boolean {
    return this._isValid;
  }

  constructor(value: string) {
    this._value = value;
    this._isValid = isValidEmail(value);
  }
}

// Taken from https://emailregex.com/
// Works 99.99%
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}
