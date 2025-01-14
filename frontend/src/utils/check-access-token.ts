import {AuthUtils} from "./auth-utils";

export class CheckAccessToken {


    constructor(){
        this.init()
    }

    init(){
        const accessToken: string | null = localStorage.getItem(AuthUtils.accessTokenKey);
            if (!accessToken){
                location.href = '/login'
            }
        }

}