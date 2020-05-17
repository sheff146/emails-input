import { CallbackFn } from './interfaces';
import { Email } from './email';

const emailsInputStyles = require('./emails-input.css');

const styles = {
    wrapper: emailsInputStyles['wrapper'],
    item: emailsInputStyles['wrapper__item'],
    itemInvalid: emailsInputStyles['wrapper__item_invalid'],
    itemTitle: emailsInputStyles['wrapper__item-title'],
    itemRemove: emailsInputStyles['wrapper__item-remove'],
    input: emailsInputStyles['wrapper__input']
};

export class EmailsInputRenderer {
    private readonly _wrapper: HTMLDivElement;

    constructor(private container: HTMLElement, private onChanges: CallbackFn<string>) {
        this._wrapper = this.createWrapper();
        container.appendChild(this._wrapper);
    }

    render(emails: Email[]) {
        let existingItems = Array.from(this._wrapper.querySelectorAll(`.${styles.item}`)) as HTMLElement[];

        existingItems = existingItems.filter((item) => {
            const exists = emails.find(email => email.value === item.dataset.email);
            if (!exists) {
                this._wrapper.removeChild(item);
            }

            return exists;
        });

        const itemsToAdd: Email[] = [];
        emails.forEach(email => {
            const exists = existingItems.find(item => email.value === item.dataset.email);
            if (!exists) {
                itemsToAdd.push(email);
            }
        });

        const input = this._wrapper.querySelector(`.${styles.input}`);
        itemsToAdd.forEach(email => {
            const item = this.createEmailItem(email);
            this._wrapper.insertBefore(item, input);
        });
    }

    private createWrapper(): HTMLDivElement {
        const wrapper = document.createElement('div');

        wrapper.className = styles.wrapper;
        wrapper.innerHTML = `<input type="text" class="${styles.input}" placeholder="add more people..."/>`;

        wrapper.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const element = getAncestorWithClassName(target, styles.itemRemove);
            if (element) {
                const email = element.parentElement?.dataset?.email;
                if (email) {
                    this.onChanges({ addedItems: [], removedItems: [email] });
                }
            }
        });

        wrapper.addEventListener('keyup', (e) => {
            const target = e.target as HTMLElement;

            if (target.className === styles.input) {
                if (e.key === 'Enter' || e.key === ',') {
                    this.processSubmit(target as HTMLInputElement);
                }
            }
        });

        wrapper.addEventListener('blur', (e) => {
            const target = e.target as HTMLElement;

            if (target.className === styles.input) {
                this.processSubmit(target as HTMLInputElement);
            }
        }, true);

        wrapper.addEventListener('paste', (e) => {
            const target = e.target as HTMLElement;

            if (target.className === styles.input) {
                setTimeout(() => {
                    this.processSubmit(target as HTMLInputElement);
                }, 0);
            }
        });

        return wrapper;
    }

    private processSubmit(target: HTMLInputElement) {
        const values = target.value
            .split(',')
            .map(v => v.trim())
            .filter(v => v);

        if (values.length) {
            this.onChanges({ addedItems: values, removedItems: [] });
        }

        target.value = '';
    }

    private createEmailItem(email: Email): HTMLDivElement {
        const item = document.createElement('div');

        item.dataset.email = email.value;
        item.classList.add(styles.item);

        if (!email.isValid) {
            item.classList.add(styles.itemInvalid);
        }

        item.innerHTML =
            `<span class="${styles.itemTitle}">${email.value}</span>` +
            `<button class="${styles.itemRemove}" aria-label="Remove item">${require('!!html-loader!./remove.svg')}</button>`;

        return item;
    }
}

function getAncestorWithClassName(element: HTMLElement | null, className: string): HTMLElement | null {
    if (!element) {
        return null;
    }

    if (element.classList.contains(className)) {
        return element;
    }

    return getAncestorWithClassName(element.parentElement, className);
}
