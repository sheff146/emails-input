import { CallbackFn } from './interfaces';
import { Email } from './email';

export class EmailsInputRenderer {
    private _wrapper: HTMLDivElement;

    constructor(private container: HTMLElement, private onChanges: CallbackFn<string>) {
        this._wrapper = this.createWrapper();
        container.appendChild(this._wrapper);
    }

    render(emails: Email[]) {
        emails.forEach(email => {
            const item = this.createEmailItem(email);
            this._wrapper.appendChild(item);
        });
    }

    private createWrapper(): HTMLDivElement {
        const wrapper = document.createElement('div');

        wrapper.className = 'wrapper';
        wrapper.innerHTML = `<input type="text" class="wrapper__input" placeholder="add more people..."/>`;

        wrapper.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.className === 'wrapper__item-remove') {
                const email = target.parentElement?.dataset?.email;
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
        });

        wrapper.addEventListener('paste', (e) => {
            debugger;
            const target = e.target as HTMLElement;

            if (target.className === 'wrapper__input') {
                this.processSubmit(target as HTMLInputElement);
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

        item.innerHTML = `<span class="wrapper__item-title">${email.value}</span><button class="wrapper__item-remove">Remove</button>`;

        return item;
    }
}
