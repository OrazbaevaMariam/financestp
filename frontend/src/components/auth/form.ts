import {HTTPMethodsEnum} from "../../enums/http-methods.enum";
import {FieldsType} from "../../types/fields.type";
import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {HttpResultType} from "../../types/http-result.type";

export class Form {

    readonly agreeElement: HTMLInputElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: 'signup' | 'login';
    readonly fields: FieldsType[] = [];

    constructor(page: 'signup' | 'login') {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken: string | null = localStorage.getItem(AuthUtils.accessTokenKey);
        if (accessToken) {
            location.href = '/?period=today';
            return;
        }
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
                wasChanged: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
                wasChanged: false
            },
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^([А-Я][а-я]*\s+)+[А-Я][а-я]*\s*$/,
                    valid: false,
                    wasChanged: false
                },
                {
                    name: 'passwordRepeat',
                    id: 'password-repeat',
                    element: null,
                    regex: this.fields.find(item => item.name === 'password')?.regex as RegExp,
                    valid: false,
                    wasChanged: false
                });
        }
        const that: Form = this;
        this.fields.forEach((item: FieldsType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.wasChanged = false;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                };
            }
            if (item.element) {
                item.element.oninput = function () {
                    item.wasChanged = true;
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }

        });

        this.processElement = document.getElementById('process-button');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            };
        }
    }

    private validateField(field: FieldsType, element: HTMLInputElement): void {
        if (element.parentNode) {
            if (!element.value || !element.value.match(field.regex!)) {
                if (field.wasChanged) {
                    (element.parentNode as HTMLElement).style.borderColor = 'red';
                }
                field.valid = false;

            } else {
                if (this.page === 'signup' && field.name === 'password') {
                    if (this.fields) {
                        this.fields.find(item => item.name === 'passwordRepeat')!.regex = new RegExp('^' + element.value + '$');
                    }
                }
                (element.parentNode as HTMLElement).removeAttribute('style');
                field.valid = true;
            }
        }
        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every(item => item.valid);
        // ?????
        const isValid: boolean = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    }

    private async processForm(): Promise<void> {

        window.addEventListener("load", function (event) {
            document.body.style.height = '100vh';
        });
        window.addEventListener('unload', function () {
            document.body.style.height = 'auto';
        });

        if (this.validateForm()) {
            const email: string | undefined = this.fields.find(item => item.name === 'email')?.element?.value;
            const password: string | undefined = this.fields.find(item => item.name === 'password')?.element?.value;
            let rememberMe: boolean = false;

            if (this.page === 'signup') {

                const fullName: string | undefined = this.fields.find(item => item.name === 'name')?.element?.value;
                if (fullName) {
                    const fullNameArr: string[] = fullName.split(' ').filter(elem => elem);
                    if (fullNameArr) {
                        const lastName = fullNameArr[0];
                        const name = fullNameArr[1];
                        const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat')?.element?.value;

                        try {
                            const result: HttpResultType = await HttpUtils.request('/signup', HTTPMethodsEnum.POST, true, {
                                name: name,
                                lastName: lastName,
                                email: email,
                                password: password,
                                passwordRepeat: passwordRepeat
                            });

                            if (result as HttpResultType) {
                                if (result.error || !result.response.user) {
                                    throw new Error((result as HttpResultType).response.message);
                                }
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            } else {
                const checkElement: HTMLInputElement | null = document.getElementById('remember-me') as HTMLInputElement;
                if (checkElement as HTMLInputElement) {
                    rememberMe = checkElement?.checked;
                }
            }

            try {

                const result: HttpResultType = await HttpUtils.request('/login', 'POST', true, {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                });
                if (result as HttpResultType) {
                    console.log(result)

                    if (result.error) {
                        throw new Error(result.response.message);
                    } else {
                        if (result.response.tokens) {
                            AuthUtils.setTokens(result.response.tokens.accessToken, result.response.tokens.refreshToken);
                        }
                        if (result.response.user) {
                            AuthUtils.setUserInfo({
                                // fullName: result.user.fullName,
                                name: result.response.user.name,
                                lastName: result.response.user.lastName,
                                userId: result.response.user.id,
                                email: email as string
                            });
                        }
                        location.href = '/';
                    }
                }
            } catch (error) {
                console.log(error);
                return
            }

        }
    }
}
