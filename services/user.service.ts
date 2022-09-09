import { CookieValueTypes, getCookie } from 'cookies-next';
import axios, { AxiosResponse } from 'axios';
import getConfig from 'next/config';
export class UserService {
    protected config = getConfig();
    private session: CookieValueTypes;

    constructor() {
        this.session = getCookie( 'session' );
    }

    isSessionValid = (): boolean => {
        if ( this.session ) return true;
        return false;
    }

    login = ( data: { username?: string, password?: string } ): Promise<AxiosResponse<void>> => {
        return axios.postForm( this.config.publicRuntimeConfig.api_host + '/auth', data, { withCredentials: true } );
    }
}