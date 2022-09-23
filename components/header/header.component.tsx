import Link from 'next/link';
import { UserService } from '../../services/user.service';
import { useState } from 'react';
import styles from './header.module.scss';

export const Header = (): JSX.Element => {

    let [loggedIn, updateLoggedIn] = useState<boolean>( false );
    const resetLog = () => {
        userService.reset()
    }
    const userService = new UserService();

    return (
        <nav className={`navbar navbar-expand-lg navbar-dark bg-secondary bg-opacity-50 px-2 ${ styles.navbar }`}>
            <Link href="/"><img src="/lightning.svg" id="logo" className={styles.logo} /></Link>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link href={"/" + ( userService.isSessionValid() ? "upload" : "login" )} suppressHydrationWarning>
                            <a className="nav-link active" aria-current="page" suppressHydrationWarning>{userService.isSessionValid() ? "Upload" : "Login"}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/files">
                            <a className="nav-link active" aria-current="page" ><i className="icon-file-archive"></i>Files</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/parameters">
                            <a className="nav-link active" aria-current="page" ><i className="icon-back-in-time"></i>Parameters</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/about">
                            <a className="nav-link active" aria-current="page" >About</a>
                        </Link>
                    </li>
                    <li className="nav-item" onClick={resetLog}>
                        Reset log
                    </li>
                </ul>

            </div>
        </nav>
    );

}