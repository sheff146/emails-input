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

function isValidEmail(value: string): boolean {
    return /./.test(value);
}
