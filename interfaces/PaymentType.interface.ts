import { GraphQLTypedObject } from '../graphql/queries/common.gql';

export interface PaymentTypeInterface extends GraphQLTypedObject {
    paymentRequest?: string,
    expiresAt?: number,
    state?: string,
    mediaUuid?: string
}
