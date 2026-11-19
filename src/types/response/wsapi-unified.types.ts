import {
  WSAPIAddSpotOrderResult,
  WSAPIAmendSpotOrderResult,
  WSAPIBatchAddSpotOrdersResult,
  WSAPIBatchCancelSpotOrdersResult,
  WSAPICancelAllSpotOrdersAfterResult,
  WSAPICancelAllSpotOrdersResult,
  WSAPICancelSpotOrderResult,
} from './wsapi.types.js';

export type WSAPIAddUnifiedOrderResult = WSAPIAddSpotOrderResult;
/** amend_id is an empty string for derivatives. */
export type WSAPIAmendUnifiedOrderResult = WSAPIAmendSpotOrderResult;
export type WSAPICancelUnifiedOrderResult = WSAPICancelSpotOrderResult;
export type WSAPICancelAllUnifiedOrdersResult = WSAPICancelAllSpotOrdersResult;
export type WSAPICancelAllUnifiedOrdersAfterResult =
  WSAPICancelAllSpotOrdersAfterResult;
export type WSAPIBatchAddUnifiedOrdersResult = WSAPIBatchAddSpotOrdersResult;
export type WSAPIBatchCancelUnifiedOrdersResult =
  WSAPIBatchCancelSpotOrdersResult;

export interface WSAPISetUnifiedPreferenceResult {
  leverage_mode: {
    symbol: string;
    max_leverage: number | null;
  };
}
