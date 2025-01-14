import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import { HttpResultType } from "../types/http-result.type";
import { AuthInfoKeysParams } from "../types/auth-info-keys.type";

export class Sidebar {
 
    private balanceElement: HTMLElement | null;
    private personName: HTMLElement | null;

    constructor() {
        this.balanceElement = document.getElementById('balance__amount');
        this.personName = document.getElementById('profile-name');
        this.init().then();
    }

    private async init(): Promise<void>  {

        let userInfo: string | AuthInfoKeysParams | null | undefined = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
       if (typeof userInfo === 'string' && userInfo){
        userInfo = JSON.parse(userInfo);
       }
      
        try {
            const result: HttpResultType = await HttpUtils.request('/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.response.error);
                }
                if (result.response && result.response.balance && this.balanceElement){
                    this.balanceElement.innerText = result.response.balance;
                }
            }
        } catch (error) {
             console.log(error);
             return
        }
        if (this.personName && (userInfo as AuthInfoKeysParams).name){
            this.personName.innerText = (userInfo as AuthInfoKeysParams).name as string;
        }
    
    }
}