import axios, { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/dist/client/router';
import { FormEvent, FormEventHandler } from 'react';
import getConfig from 'next/config';
import { UserService } from '../../services/user.service';

const config = getConfig();

const LoginPage: NextPage = () => {
    const userService: UserService = new UserService();
    const router: NextRouter = useRouter();

    const handleSubmit = async ( event: FormEvent<HTMLFormElement> ): Promise<void> => {

        event.preventDefault();

        const formData = new FormData( event.currentTarget );

        let data: { username?: string, password?: string } = {
            username: formData.get( "login" )?.toString(),
            password: formData.get( "password" )?.toString()
        };

        userService.login( data ).then( ( response ) => {
            if ( response.status === 200 ) {
                router.push( '/upload', undefined, {

                } );
            }
        } ).catch( ( error ) => {
            console.error( error );
        } );

    }

    if ( userService.isSessionValid() ) {
        router.push( '/upload' );
    }

    return (
        <div className="col-4 offset-4">
            <h3>Log-in</h3>
            <div className="card">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="form-floating">
                            <input className="form-control" type="text" name="login" id="login" required aria-required />
                            <label className="label" htmlFor="login">Login</label>
                        </div>
                        <hr />
                        <div className="form-floating">
                            <input className="form-control" type="password" name="password" id="password" required aria-required />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" placeholder="Login" >Submit</button>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default LoginPage;
