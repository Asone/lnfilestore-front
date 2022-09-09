import * as React from 'react';
import styles from './fileList.module.scss';
import { FileInterface } from '../../interfaces/file';
import Link from 'next/link';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
    files: Array<FileInterface>;
}

export class FilesListComponent extends React.Component<Props>{

    constructor( props: Readonly<Props> ) {
        super( props );
    }

    render = (): JSX.Element => {
        return (
            <div className="col-6 offset-3">
                {
                    this.props.files.map( ( file: FileInterface ): JSX.Element => (
                        <Link href={'/file/' + file.uuid} key={file.uuid} passHref>
                            <div className="card mb-5">
                                <div className="card-header">
                                    {file.description}
                                    <span className="badge bg-primary float-end">{file.price} sats</span>
                                </div>
                            </div>
                        </Link>
                    )
                    )
                }
            </div>
        )
    }
}