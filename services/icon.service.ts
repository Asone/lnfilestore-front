
export class IconService {

    public getFileTypeIcon = ( fileType: string | null | undefined ): string => {

        if ( !fileType ) {
            return "document";
        }

        switch ( fileType ) {
            case "jpg":
            case "jpeg":
            case "png":
            case "webp":
            case "tif":
            case "bmp":
            case "heif":
            case "avif":
            case "jxr":
            case "psd":
            case "ico":
                return "file-image";

            case "mp4":
            case "m4v":
            case "mkv":
            case "webm":
            case "mov":
            case "avi":
            case "wmv":
            case "mpg":
            case "flv":
                return "file-video";
            case "mid":
            case "mp3":
            case "m4a":
            case "ogg":
            case "flac":
            case "wav":
            case "amr":
            case "aac":
            case "aiff":
            case "dsf":
            case "ape":
                return "music";
            case "zip":
            case "tar":
            case "rar":
            case "gz":
            case "bz2":
            case "7z":
            case "xz":
                return "file-archive";
            case "pdf":
                return "file-pdf";
            case "doc":
            case "docx":
                return "file-word";
            default:
                return "document";
        }
    }
}