import {AuthUtils} from "./auth-utils";
import {HttpUtils} from "./http-utils";
import {UserInfoType} from "../types/user-info.type";
import { BalanceResponseType } from "../types/balance-response.type";
import {HttpResultType} from "../types/http-result.type";

export class UserInfo {
    readonly fullName: HTMLElement | null;
    readonly balance: HTMLElement | null;
    readonly userInfo: UserInfoType | null;
    readonly accessToken: string | null;


    constructor() {
        this.fullName = document.getElementById('profile-name');
        this.balance = document.getElementById('balance__amount');
        this.userInfo = AuthUtils.getUserInfo();
        this.accessToken = localStorage.getItem(AuthUtils.accessTokenKey);
        this.getUserInfo();
        this.getBalance();
    }

    private getUserInfo(): void {
        if (this.fullName && this.userInfo && this.userInfo.name && this.userInfo.lastName) {
            this.userInfo && this.accessToken ? this.fullName.innerText = this.userInfo.name + ' ' + this.userInfo.lastName : this.fullName.innerText = 'Нет данных';
        }
    }

    private async getBalance(): Promise<void> {
        try {

            const result: HttpResultType = await HttpUtils.request('/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.response.error)
                }
                if (this.balance && result.response && result.response.balance){
                    this.balance.innerText = result.response.balance;
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
}