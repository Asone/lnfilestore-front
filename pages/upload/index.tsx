import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { SetStateAction, useState, FormEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { getPostQuery } from '../../graphql/getPost.gql';
import { fileUploadMutation } from '../../graphql/queries/fileUpload.gql';
import { filesList } from '../../graphql/queries/filesList.gql';
import { client } from './../../client';

const UploadFile: NextPage = () => {
    const [file, setFile] = useState( null );
    const router = useRouter();
    const handleChange = ( file: SetStateAction<null> ) => {
        setFile( file );
    };

    const [uploadFile, { data, loading, error }] = useMutation( fileUploadMutation );

    const handleSubmit = async ( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault();

        const formData = new FormData( event.currentTarget );
        const price: string = formData.get( "price" ) as string;
        let variables = {
            filename: formData.get( "title" ),
            title: formData.get( "title" ),
            description: formData.get( "description" ),
            price: parseInt( price ),
            published: true,
            file: formData.get( "file" )
        };
        client.mutate( {
            mutation: fileUploadMutation,
            variables: { file: variables }
        } ).then( ( result ) => { console.log( result ) } )

    }

    return (
        <div className="col-6 offset-3">
            <h3>Upload a file to server</h3>
            <div className="card">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="form-floating">
                            <input type="file" className="form-control" name="file" aria-required required />
                            <label className="label" htmlFor="file" aria-label="File title">File</label>
                        </div>
                        <hr />
                        <div className="form-floating">
                            <input type="text" className="form-control" name="title" aria-required required />
                            <label className="label" htmlFor="title" aria-label="File title">File title</label>
                        </div>
                        <div className="form-floating my-3">
                            <input type="number" step="1" defaultValue={100} className="form-control" name="price" aria-required required />
                            <label className="label" htmlFor="title" aria-label="File price in satoshis">File price in satoshis</label>
                        </div>
                        <div className="form-floating">
                            <textarea className="form-control" name="description" aria-required required></textarea>
                            <label className="description" htmlFor="title" aria-label="File description">File description</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" type="submit">Upload file</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UploadFile;