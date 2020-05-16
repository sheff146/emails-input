export interface IEmail {
    readonly value: string;
    readonly isValid: boolean;
}

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

    getValue(): IEmail {
        return {
            value: this.value,
            isValid: this.isValid
        };
    }
}

function isValidEmail(value: string): boolean {
    return /./.test(value);
}
