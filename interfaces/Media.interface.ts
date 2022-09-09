import { PaymentTypeInterface } from './PaymentType.interface';
import { GraphQLTypedObject } from '../graphql/queries/common.gql';
export interface MediaInterface extends GraphQLTypedObject {
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
    mediaInvoice?: PaymentTypeInterface,
    fileSize?: number
}