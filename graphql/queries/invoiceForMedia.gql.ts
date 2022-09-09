import { gql } from '@apollo/client';
import { PaymentTypeInterface } from '../../interfaces/PaymentType.interface';
import { GraphQLTypedObject } from './common.gql';

export const getInvoiceForMediaQuery = gql`query requestInvoiceForMediaQuery($uuid: Uuid!, $paymentRequest: String){
  requestInvoiceForMedia(uuid: $uuid, paymentRequest: $paymentRequest){
    ...on AvailablePayment {
        mediaUuid
        paymentRequest
        expiresAt
        state
    }
    ...on SettledPayment {
        mediaUuid
        paymentRequest
        state
    }
    ...on ReplacementPayment {
        mediaUuid
        paymentRequest
        expiresAt
        state
    }
  }
}`;

export interface GetInvoiceForMediaResponse {
    requestInvoiceForMedia: PaymentTypeInterface
}