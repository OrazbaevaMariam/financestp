
import {HttpUtils} from "../utils/http-utils"
import {LoginResponseType} from "../types/login-response.type";
import { DefaultDataPoint } from "chart.js";
import { DefaultResponseType } from "../types/default-response.type";
import {RefreshToken} from "../types/refresh-token.type";
export class AuthService {
    // static async logIn(data){
    //     const result: LoginResponseType = await HttpUtils.request('/login', 'POST', false, data);
    //
    //     if (result.error || !result.user || !result.tokens || (!result.tokens.accessToken || !result.tokens.refreshToken)) {
    //         return false;
    //     }
    //
    //     return result;
    // }
    // static async signUp(data){
    //     const result: LoginResponseType = await HttpUtils.request('/signup', 'POST', false, data);
    //     if (result.error || !result.user ) {
    //         return false;
    //     }
    //
    //     return result.user;
    // }

    public static async logOut(data: RefreshToken): Promise<void>{
        await HttpUtils.request('/logout', 'POST', false, data);
    }


}