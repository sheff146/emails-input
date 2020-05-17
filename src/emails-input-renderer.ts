import { CallbackFn } from './interfaces';
import { Email } from './email';

export class EmailsInputRenderer {
    private readonly _wrapper: HTMLDivElement;

    constructor(private container: HTMLElement, private onChanges: CallbackFn<string>) {
        this._wrapper = this.createWrapper();
        container.appendChild(this._wrapper);
    }

    render(emails: Email[]) {
        let existingItems = Array.from(this._wrapper.querySelectorAll('.wrapper__item')) as HTMLElement[];

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

        const input = this._wrapper.querySelector('.wrapper__input');
        itemsToAdd.forEach(email => {
            const item = this.createEmailItem(email);
            this._wrapper.insertBefore(item, input);
        });
    }

    private createWrapper(): HTMLDivElement {
        const wrapper = document.createElement('div');

        wrapper.className = 'wrapper';
        wrapper.innerHTML = `<input type="text" class="wrapper__input" placeholder="add more people..."/>`;

        wrapper.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const element = getAncestorWithClassName(target, 'wrapper__item-remove');
            if (element) {
                const email = element.parentElement?.dataset?.email;
                if (email) {
                    this.onChanges({ addedItems: [], removedItems: [email] });
                }
            }
        });

        wrapper.addEventListener('keyup', (e) => {
            const target = e.target as HTMLElement;

            if (target.className === 'wrapper__input') {
                if (e.key === 'Enter' || e.key === ',') {
                    this.processSubmit(target as HTMLInputElement);
                }
            }
        });

        wrapper.addEventListener('blur', (e) => {
            const target = e.target as HTMLElement;

            if (target.className === 'wrapper__input') {
                this.processSubmit(target as HTMLInputElement);
            }
        }, true);

        wrapper.addEventListener('paste', (e) => {
            const target = e.target as HTMLElement;

            if (target.className === 'wrapper__input') {
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
        item.classList.add('wrapper__item');

        if (!email.isValid) {
            item.classList.add('wrapper__item_invalid');
        }

        item.innerHTML =
            `<span class="wrapper__item-title">${email.value}</span>` +
            `<button class="wrapper__item-remove" aria-label="Remove item">${require('!!html-loader!./remove.svg')}</button>`;

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
