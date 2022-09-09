import * as React from 'react';
import styles from './postList.module.scss';
import { PostInterface } from '../../interfaces/post';
import Link from 'next/link';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
    posts: Array<PostInterface>;
}

export class PostsListComponent extends React.Component<Props>{

    constructor( props: Readonly<Props> ) {
        super( props );
    }

    render = (): JSX.Element => {
        return (
            <div className="col-6 offset-3">
                {
                    this.props.posts.map( ( post: PostInterface ): JSX.Element => (
                        <Link href={'/post/' + post.uuid} key={post.uuid} passHref>
                            <div className="card mb-5">
                                <div className="card-header">
                                    {post.title}
                                    <span className="badge bg-primary float-end">{post.price} sats</span>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">{post.excerpt}</p>
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