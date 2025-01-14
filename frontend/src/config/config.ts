import {ConfigType} from "../types/config.type";

const host: string = "http://localhost:3000";
// const host = process.env.HOST;

const config: ConfigType = {
    host: host,
    api: host + '/api',

};

export default config;