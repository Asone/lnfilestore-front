import Link from 'next/link';
import { UserService } from '../../services/user.service';
import { useState } from 'react';
export const Header = (): JSX.Element => {

    let [loggedIn, updateLoggedIn] = useState<boolean>( false );

    const userService = new UserService();
    // const authedLinked = () => {
    //     const userService = new UserService();

    //     if ( userService.isSessionValid() ) {
    //         return (
    //             <li className="nav-item">
    //                 <Link href="/upload">
    //                     <a className="nav-link active" aria-current="page">Upload</a>
    //                 </Link>
    //             </li> )
    //     } else {
    //         return null
    //     }
    // }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-2">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item" suppressHydrationWarning>
                        <Link href={"/" + ( userService.isSessionValid() ? "upload" : "login" )}>
                            <a className="nav-link active" aria-current="page">Upload</a>
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
                </ul>

            </div>
        </nav>
    );

}