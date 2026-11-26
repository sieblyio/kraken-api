import { WSUnifiedAssetClass } from '../websockets/ws-unified.js';
import {
  WSAPIAddSpotOrderParams,
  WSAPIAmendSpotOrderParams,
  WSAPIBatchAddSpotOrdersParams,
  WSAPICancelAllSpotOrdersAfterParams,
} from './wsapi.types.js';

interface WSAPIUnifiedOrderFields
  extends Omit<WSAPIAddSpotOrderParams, 'order_type'> {
  order_type: Exclude<
    WSAPIAddSpotOrderParams['order_type'],
    'iceberg' | 'settle-position'
  >;
  /** Broker IIBAN for accounts enrolled in Kraken's API Partner Program. */
  broker?: string;
  /** @deprecated Use triggers.price. */
  stop_price?: number;
  /** @deprecated Use triggers.reference. */
  trigger?: 'last' | 'index';
}

type WSAPIUnifiedSpotOnlyOrderField =
  | 'margin'
  | 'effective_time'
  | 'expire_time'
  | 'order_userref'
  | 'display_qty'
  | 'fee_preference'
  | 'cash_order_qty'
  | 'sender_sub_id';

export type WSAPIAddUnifiedSpotOrderParams = WSAPIUnifiedOrderFields & {
  asset_class: 'spot';
};

export type WSAPIAddUnifiedDerivativesOrderParams = Omit<
  WSAPIUnifiedOrderFields,
  | WSAPIUnifiedSpotOnlyOrderField
  | 'limit_price_type'
  | 'triggers'
  | 'conditional'
  | 'time_in_force'
  | 'stp_type'
> &
  Partial<Record<WSAPIUnifiedSpotOnlyOrderField, never>> & {
    asset_class: 'derivatives';
    limit_price_type?: 'static';
    triggers?: Omit<
      NonNullable<WSAPIAddSpotOrderParams['triggers']>,
      'price_type'
    > & { price_type?: 'static' };
    conditional?: Omit<
      NonNullable<WSAPIAddSpotOrderParams['conditional']>,
      'limit_price_type' | 'trigger_price_type'
    > & {
      limit_price_type?: 'static';
      trigger_price_type?: 'static';
    };
    time_in_force?: 'gtc' | 'ioc';
    stp_type?: 'cancel_newest';
  };

export type WSAPIAddUnifiedOrderParams =
  | WSAPIAddUnifiedSpotOrderParams
  | WSAPIAddUnifiedDerivativesOrderParams;

type WSAPIUnifiedAmendOrderIdentifier =
  | { order_id: string; cl_ord_id?: string }
  | { order_id?: string; cl_ord_id: string };

export type WSAPIAmendUnifiedOrderParams = Omit<
  WSAPIAmendSpotOrderParams,
  'order_qty' | 'order_id' | 'cl_ord_id'
> &
  WSAPIUnifiedAmendOrderIdentifier & { order_qty?: number } & (
    | { asset_class: 'spot' }
    | {
        asset_class: 'derivatives';
        display_qty?: never;
        limit_price_type?: 'static';
        trigger_price_type?: 'static';
      }
  );

type WSAPIUnifiedCancelOrderIdentifier =
  | { order_id: string[]; cl_ord_id?: never; order_userref?: never }
  | { cl_ord_id: string[]; order_id?: never; order_userref?: never };

export type WSAPICancelUnifiedOrderParams =
  | (WSAPIUnifiedCancelOrderIdentifier & { asset_class: WSUnifiedAssetClass })
  | {
      asset_class: 'spot';
      order_userref: number[];
      order_id?: never;
      cl_ord_id?: never;
    };

export interface WSAPICancelAllUnifiedOrdersParams {
  asset_class: WSUnifiedAssetClass;
}

export interface WSAPICancelAllUnifiedOrdersAfterParams
  extends WSAPICancelAllSpotOrdersAfterParams {
  asset_class: WSUnifiedAssetClass;
}

/** Batch-wide fields must be supplied on the enclosing request. */
export type WSAPIUnifiedSpotBatchOrder = Omit<
  WSAPIAddUnifiedSpotOrderParams,
  'asset_class' | 'symbol' | 'conditional' | 'deadline' | 'validate'
> & { conditional?: never };

export type WSAPIUnifiedDerivativesBatchOrder = Omit<
  WSAPIAddUnifiedDerivativesOrderParams,
  | 'asset_class'
  | 'symbol'
  | 'conditional'
  | 'deadline'
  | 'validate'
  | 'time_in_force'
  | 'expire_time'
> & {
  conditional?: never;
  /** Derivatives batches also support GTD orders with expire_time. */
  time_in_force?: 'gtc' | 'ioc' | 'gtd';
  expire_time?: string;
};

export type WSAPIBatchAddUnifiedOrdersParams = Pick<
  WSAPIBatchAddSpotOrdersParams,
  'deadline' | 'symbol' | 'validate'
> &
  (
    | { asset_class: 'spot'; orders: WSAPIUnifiedSpotBatchOrder[] }
    | {
        asset_class: 'derivatives';
        orders: WSAPIUnifiedDerivativesBatchOrder[];
      }
  );

/** Supply 2 to 50 identifiers; orders and cl_ord_id may be combined. */
export type WSAPIBatchCancelUnifiedOrdersParams = {
  asset_class: WSUnifiedAssetClass;
} & (
  | { orders: string[]; cl_ord_id?: string[] }
  | { orders?: string[]; cl_ord_id: string[] }
);

export interface WSAPISetUnifiedPreferenceParams {
  asset_class: 'derivatives';
  leverage_mode: {
    symbol: string;
    /** A number selects fixed leverage; null restores cross margin. */
    max_leverage: number | null;
  };
}
