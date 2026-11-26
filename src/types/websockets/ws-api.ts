import { WS_KEY_MAP, WSOperation } from '../../lib/websocket/websocket-util.js';
import {
  WSAPIAddSpotOrderParams,
  WSAPIAmendSpotOrderParams,
  WSAPIBatchAddSpotOrdersParams,
  WSAPIBatchCancelSpotOrdersParams,
  WSAPICancelAllSpotOrdersAfterParams,
  WSAPICancelSpotOrderParams,
  WSAPIEditSpotOrderParams,
} from '../request/wsapi.types.js';
import {
  WSAPIAddUnifiedOrderParams,
  WSAPIAmendUnifiedOrderParams,
  WSAPIBatchAddUnifiedOrdersParams,
  WSAPIBatchCancelUnifiedOrdersParams,
  WSAPICancelAllUnifiedOrdersAfterParams,
  WSAPICancelAllUnifiedOrdersParams,
  WSAPICancelUnifiedOrderParams,
  WSAPISetUnifiedPreferenceParams,
} from '../request/wsapi-unified.types.js';
import {
  WSAPIAddSpotOrderResult,
  WSAPIAmendSpotOrderResult,
  WSAPIBatchAddSpotOrdersResult,
  WSAPIBatchCancelSpotOrdersResult,
  WSAPICancelAllSpotOrdersAfterResult,
  WSAPICancelAllSpotOrdersResult,
  WSAPICancelSpotOrderResult,
  WSAPIEditSpotOrderResult,
} from '../response/wsapi.types.js';
import {
  WSAPIAddUnifiedOrderResult,
  WSAPIAmendUnifiedOrderResult,
  WSAPIBatchAddUnifiedOrdersResult,
  WSAPIBatchCancelUnifiedOrdersResult,
  WSAPICancelAllUnifiedOrdersAfterResult,
  WSAPICancelAllUnifiedOrdersResult,
  WSAPICancelUnifiedOrderResult,
  WSAPISetUnifiedPreferenceResult,
} from '../response/wsapi-unified.types.js';

export type Exact<T> = {
  // This part says: if there's any key that's not in T, it's an error
  // This conflicts sometimes for some reason...
  // [K: string]: never;
} & {
  [K in keyof T]: T[K];
};

export interface WsRequestOperation<TWSTopic extends string> {
  id: number;
  type: WSOperation;
  topic: TWSTopic;
  privateChannel: boolean;
  response: boolean;
}

export interface WSAPIAuthenticationRequestFromServer {
  timestamp: number;
  sessionId: string;
}

export interface WSAPIAuthenticationConfirmedFromServer {
  pingInterval: number;
  sessionId: string;
  pingTimeout: number;
  data: 'welcome';
}

/**
 * WS API commands (for sending requests via WS)
 */
export const WS_API_Operations = [
  'add_order',
  'amend_order',
  'cancel_order',
  'cancel_all',
  'cancel_all_orders_after',
  'batch_add',
  'batch_cancel',
  'edit_order',
  'set_preference',
] as const;

export type WSAPIOperation = (typeof WS_API_Operations)[number];
export type WSAPISpotOperation = Exclude<WSAPIOperation, 'set_preference'>;
export type WSAPIUnifiedOperation = Exclude<WSAPIOperation, 'edit_order'>;

export interface WSAPIRequestOperationKrakenSpot<
  TWSOperation extends WSAPIOperation = WSAPIOperation,
  TWSParams extends object = any,
> {
  method: TWSOperation;
  params?: TWSParams;
  req_id: number;
}

export interface WSAPIWsKeyTopicMap {
  [WS_KEY_MAP.spotPrivateV2]: WSAPISpotOperation;
  [WS_KEY_MAP.spotBetaPrivateV2]: WSAPISpotOperation;
  [WS_KEY_MAP.unifiedPrivateV2]: WSAPIUnifiedOperation;
}

export type WSAPIWsKey = keyof WSAPIWsKeyTopicMap;
export type WSAPIUnifiedWsKey = typeof WS_KEY_MAP.unifiedPrivateV2;
export type WSAPISpotWsKey = Exclude<WSAPIWsKey, WSAPIUnifiedWsKey>;

export interface WSAPISpotResponse<
  TResponseData extends object = object,
  TWSAPIOperation = WSAPISpotOperation,
  TWSKey extends WSAPIWsKey = WSAPISpotWsKey,
> {
  wsKey: TWSKey;
  error?: string;
  method: TWSAPIOperation;
  req_id: number;
  success: boolean;
  time_in: string;
  time_out: string;
  result: TResponseData;
  request: any;
}

export type WSAPIUnifiedResponse<
  TResponseData extends object = object,
  TWSAPIOperation = WSAPIUnifiedOperation,
> = WSAPISpotResponse<TResponseData, TWSAPIOperation, WSAPIUnifiedWsKey>;

export interface WSAPITopicRequestParamMap {
  [key: string]: unknown;

  add_order: WSAPIAddSpotOrderParams;
  amend_order: WSAPIAmendSpotOrderParams;
  cancel_order: WSAPICancelSpotOrderParams;
  cancel_all: never;
  cancel_all_orders_after: WSAPICancelAllSpotOrdersAfterParams;
  batch_add: WSAPIBatchAddSpotOrdersParams;
  batch_cancel: WSAPIBatchCancelSpotOrdersParams;
  edit_order: WSAPIEditSpotOrderParams;
}

export interface WSAPITopicResponseMap {
  [k: string]: unknown;

  add_order: WSAPISpotResponse<WSAPIAddSpotOrderResult, 'add_order'>;
  amend_order: WSAPISpotResponse<WSAPIAmendSpotOrderResult, 'amend_order'>;
  cancel_order: WSAPISpotResponse<WSAPICancelSpotOrderResult, 'cancel_order'>;
  cancel_all: WSAPISpotResponse<WSAPICancelAllSpotOrdersResult, 'cancel_all'>;
  cancel_all_orders_after: WSAPISpotResponse<
    WSAPICancelAllSpotOrdersAfterResult,
    'cancel_all_orders_after'
  >;
  batch_add: WSAPISpotResponse<WSAPIBatchAddSpotOrdersResult[], 'batch_add'>;
  batch_cancel: WSAPISpotResponse<
    WSAPIBatchCancelSpotOrdersResult,
    'batch_cancel'
  >;
  edit_order: WSAPISpotResponse<WSAPIEditSpotOrderResult, 'edit_order'>;
}

export interface WSAPIUnifiedTopicRequestParamMap {
  add_order: WSAPIAddUnifiedOrderParams;
  amend_order: WSAPIAmendUnifiedOrderParams;
  cancel_order: WSAPICancelUnifiedOrderParams;
  cancel_all: WSAPICancelAllUnifiedOrdersParams;
  cancel_all_orders_after: WSAPICancelAllUnifiedOrdersAfterParams;
  batch_add: WSAPIBatchAddUnifiedOrdersParams;
  batch_cancel: WSAPIBatchCancelUnifiedOrdersParams;
  set_preference: WSAPISetUnifiedPreferenceParams;
}

export interface WSAPIUnifiedTopicResponseMap {
  add_order: WSAPIUnifiedResponse<WSAPIAddUnifiedOrderResult, 'add_order'>;
  amend_order: WSAPIUnifiedResponse<
    WSAPIAmendUnifiedOrderResult,
    'amend_order'
  >;
  cancel_order: WSAPIUnifiedResponse<
    WSAPICancelUnifiedOrderResult,
    'cancel_order'
  >;
  cancel_all: WSAPIUnifiedResponse<
    WSAPICancelAllUnifiedOrdersResult,
    'cancel_all'
  >;
  cancel_all_orders_after: WSAPIUnifiedResponse<
    WSAPICancelAllUnifiedOrdersAfterResult,
    'cancel_all_orders_after'
  >;
  batch_add: WSAPIUnifiedResponse<
    WSAPIBatchAddUnifiedOrdersResult[],
    'batch_add'
  >;
  batch_cancel: WSAPIUnifiedResponse<
    WSAPIBatchCancelUnifiedOrdersResult,
    'batch_cancel'
  >;
  set_preference: WSAPIUnifiedResponse<
    WSAPISetUnifiedPreferenceResult,
    'set_preference'
  >;
}

type WSAPIRequestParamMap<TWSKey extends WSAPIWsKey> =
  TWSKey extends WSAPIUnifiedWsKey
    ? WSAPIUnifiedTopicRequestParamMap
    : WSAPITopicRequestParamMap;

type WSAPIResponseMap<TWSKey extends WSAPIWsKey> =
  TWSKey extends WSAPIUnifiedWsKey
    ? WSAPIUnifiedTopicResponseMap
    : WSAPITopicResponseMap;

export type WSAPIRequestParams<
  TWSKey extends WSAPIWsKey,
  TWSOperation extends WSAPIWsKeyTopicMap[TWSKey],
> = WSAPIRequestParamMap<TWSKey>[TWSOperation &
  keyof WSAPIRequestParamMap<TWSKey>];

export type WSAPIResponse<
  TWSKey extends WSAPIWsKey,
  TWSOperation extends WSAPIWsKeyTopicMap[TWSKey],
> = WSAPIResponseMap<TWSKey>[TWSOperation & keyof WSAPIResponseMap<TWSKey>];
