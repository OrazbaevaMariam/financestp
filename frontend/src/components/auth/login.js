// import {AuthUtils} from "../../utils/auth-utils.js";
// import {ValidationUtils} from "../../utils/validation-utils";
// import {AuthService} from "../../services/auth-service";
//
// export class Login {
//
//     constructor(openNewRoute) {
//         this.openNewRoute = openNewRoute;
//
//         if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
//             // window.location.href = '/'
//             return this.openNewRoute('/');
//         }
//
//         this.emailElement = document.getElementById('email');
//         this.passwordElement = document.getElementById('password');
//         this.rememberMeElement = document.getElementById('remember-me');
//         this.commonErrorElement = document.getElementById('common-error-login');
//
//         this.findElements();
//
//         document.getElementById('process-button').addEventListener('click', this.login.bind(this));
//     }
//
//     findElements() {
//         this.validations = [
//             {element: this.passwordElement},
//             {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
//         ];
//     }
//
//     async login() {
//         // this.commonErrorElement.style.display = 'none';
//         const errorElement = document.getElementById('common-error-login');
//         if (ValidationUtils.validateForm(this.validations, errorElement)) {
//             const loginResult = await AuthService.logIn({
//                 email: this.emailElement.value,
//                 password: this.passwordElement.value,
//                 rememberMe: this.rememberMeElement.checked,
//             });
//             if (loginResult) {
//                 AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
//                     id: loginResult.user.id,
//                     name: loginResult.user.name + ' '+ loginResult.user.lastName
//                 });
//                 return this.openNewRoute('/');
//             }
//             this.commonErrorElement.style.display = 'block';
//         }
//
//     }
// }