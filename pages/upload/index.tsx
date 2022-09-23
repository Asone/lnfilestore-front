import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { SetStateAction, useState, FormEvent, useEffect, BaseSyntheticEvent, SyntheticEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { getPostQuery } from '../../graphql/getPost.gql';
import { fileUploadMutation } from '../../graphql/queries/fileUpload.gql';
import { filesList } from '../../graphql/queries/filesList.gql';
import { client } from './../../client';
import styles from './index.module.scss';
import { FileUploader } from 'react-drag-drop-files';
import File from '../files/[uuid]/index';
import UploadResultToast from '../../components/uploadResultToast/index';
import FileUploadComponent from '../../components/file-upload/index';

const UploadFile: NextPage = () => {
    const [file, setFile] = useState<File | null>( null );
    const router = useRouter();
    const [uploadFile, { data, loading, error }] = useMutation( fileUploadMutation );
    const [isFileSelectorDisabled, toggleFileSelector] = useState<boolean>( false );
    const [uploadResult, updateUploadResult] = useState<{ status: 'success' | 'danger', show: boolean }>( { status: 'success', show: false } );
    const handleSubmit = async ( event: BaseSyntheticEvent<SubmitEvent, HTMLFormElement> ) => {
        event.preventDefault();

        const formData = new FormData( event.currentTarget );
        const price: string = formData.get( "price" ) as string;
        let variables = {
            filename: formData.get( "title" ),
            title: formData.get( "title" ),
            description: formData.get( "description" ),
            price: parseInt( price ),
            published: true,
            file: file
        };
        client.mutate( {
            mutation: fileUploadMutation,
            variables: { file: variables }
        } ).then( ( result ) => {
            if ( result.data ) {

                updateUploadResult( { status: 'success', show: true } );
                // reset form 
                setFile( null );
                event.target.reset();
                // router.push(`/files/${result.data.}`)
            }
        } )

    }

    const removeFile = () => {
        setFile( null );
        console.log( file );
    }

    // const fileUploaderRenderer = (): JSX.Element => {

    //     if ( file !== null ) {
    //         return (
    //             <div className="card col-6 offset-3 rounded-3 rounded-pill border-light bg-light bg-opacity-50 shadow-sm border ">
    //                 <div className="card-body  text-center text-dark clickable rounded-pill">
    //                     <i onClick={removeFile} className={`icon-cancel-circled clickable float-end ${ styles.removeFileIcon }`}></i>
    //                     <h6 className={`pr-3`}>{file.name}</h6>
    //                 </div>
    //             </div>

    //         )
    //     }

    //     return (

    //         <div className="card col-8 offset-2 rounded-3 rounded-pill border-light bg-light bg-opacity-50 rounded-3 shadow-sm border ">
    //             <div className="card-body  text-center text-dark clickable rounded-pill">
    //                 <h6 className="">Drag and drop your file here</h6>
    //                 <i className="text-secondary fs-1icon-upload-cloud"></i>
    //             </div>
    //         </div>
    //     )
    // }

    useEffect( () => {

        toggleFileSelector( file ? true : false );

    }, [file] );

    const handleFileChange = ( file: File ) => {
        setFile( file )
    }

    return (
        <>
        <div className="col-6 offset-3">
                <div className="card bg-transparent">
                    <h5 className={`card-header bg-secondary text-light bg-opacity-50 ${ styles.uploadFormHeader }`}>Upload a file to server</h5>
                <form className="form" onSubmit={handleSubmit}>
                        <div className={`card-body bg-light bg-opacity-25 ${ styles.uploadFormBody }`}>
                            {/* <div className="form-floating">
                            <input type="file" className="form-control" name="file" aria-required required />
                            <label className="label" htmlFor="file" aria-label="File title">File</label>
                        </div> */}
                            <FileUploader
                                name="file"
                                handleChange={handleFileChange}
                                disabled={isFileSelectorDisabled}
                                classes={`my-3 col-12 ${ styles.fileLabel }`}>
                                <FileUploadComponent file={file} removeFile={removeFile}></FileUploadComponent>
                            </FileUploader>
                            <hr />
                        </div>
                        <h5 className={`card-header bg-secondary text-light bg-opacity-50 ${ styles.uploadFormHeader }`}>File information</h5>
                        <div className={`card-body bg-light bg-opacity-25 ${ styles.uploadFormBody }`}>
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
                        <div className={`card-footer bg-light bg-opacity-75 text-center ${ styles.uploadFormHeader }`}>

                            <button className="btn btn-primary col-8" type="submit">Upload file <i className="icon-upload-cloud"></i></button>

                    </div>
                </form>
            </div>
        </div>
            <UploadResultToast status={uploadResult?.status || 'success'} show={uploadResult?.show || false}></UploadResultToast>
        </>
    )
}
export default UploadFile;