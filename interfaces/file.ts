export interface FileInterface {
    uuid: string,
    title?: string,
    description?: string,
    price?: number
    published?: boolean,
    createdAt?: number,
    absolutePath?: string,
    publicUrl?: string,
    fileType?: string
    paymentRequest?: string
    paymentExpiresAt?: Date
    paymentStatus?: string
}