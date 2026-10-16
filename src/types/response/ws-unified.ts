import { WSSpotStatusData } from '../websockets/ws-events.js';
import {
  WSUnifiedBookDepth,
  WSUnifiedOHLCInterval,
  WSUnifiedOHLCTickType,
  WSUnifiedPublicTopic,
} from '../websockets/ws-unified.js';

export interface WSUnifiedTickerData {
  symbol: string;
  bid: number;
  bid_qty: number;
  ask: number;
  ask_qty: number;
  /** Only guaranteed when the market traded in the last 24 hours. */
  last?: number;
  volume: number;
  vwap: number;
  low: number;
  high: number;
  change: number;
  change_pct: number;
  timestamp: string;
  /** Additional fields observed on the unified derivatives feed. */
  volume_quote?: number;
  suspended?: boolean;
  open?: number;
  mark?: number;
  index?: number;
  premium?: number;
  open_interest?: number;
  funding_rate?: number;
  funding_rate_prediction?: number;
  relative_funding_rate?: number;
  relative_funding_rate_prediction?: number;
  trades?: number;
  next_funding_rate_time?: string;
}

export interface WSUnifiedBookLevel {
  price: number;
  /** Zero quantity removes a price level. */
  qty: number;
}

export interface WSUnifiedBookData {
  symbol: string;
  bids: WSUnifiedBookLevel[];
  asks: WSUnifiedBookLevel[];
  /** Exchange-provided CRC32 checksum for the top 10 bids and asks. */
  checksum: number;
  timestamp: string;
}

export interface WSUnifiedOHLCData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  trades: number;
  volume: number;
  interval_begin: string;
  interval: WSUnifiedOHLCInterval;
  /** @deprecated Use interval_begin. */
  timestamp?: string;
}

export interface WSUnifiedTradeData {
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  ord_type: 'limit' | 'market';
  /** Documented by Kraken, but omitted on the current derivatives feed. */
  trade_id?: number;
  timestamp: string;
}

export interface WSUnifiedInstrumentAsset {
  id: string;
  status:
    | 'depositonly'
    | 'disabled'
    | 'enabled'
    | 'fundingtemporarilydisabled'
    | 'withdrawalonly'
    | 'workinprogress';
  precision: number;
  precision_display: number;
  borrowable: boolean;
  collateral_value?: number;
  margin_rate?: number;
  multiplier?: number;
  class?: string;
}

export interface WSUnifiedInstrumentPair {
  symbol: string;
  base: string;
  quote: string;
  status:
    | 'cancel_only'
    | 'delisted'
    | 'limit_only'
    | 'maintenance'
    | 'online'
    | 'post_only'
    | 'reduce_only'
    | 'work_in_progress';
  price_precision: number;
  /** Use the published increment, which need not be a power of ten. */
  price_increment: number;
  qty_precision: number;
  qty_increment: number;
  qty_min: number;
  cost_min?: number;
  cost_precision?: number;
  has_index?: boolean;
  margin_initial?: number;
  marginable?: boolean;
  position_limit_long?: number;
  position_limit_short?: number;
  ws_display_price_precision?: number;
  /** @deprecated Use price_increment. */
  tick_size?: number;
}

export interface WSUnifiedInstrumentData {
  assets: WSUnifiedInstrumentAsset[];
  pairs: WSUnifiedInstrumentPair[];
}

export interface WSUnifiedPublicDataMap {
  ticker: WSUnifiedTickerData[];
  book: WSUnifiedBookData[];
  ohlc: WSUnifiedOHLCData[];
  trade: WSUnifiedTradeData[];
  instrument: WSUnifiedInstrumentData;
}

/** Raw exchange messages, discriminated by channel. No asset_class is added or inferred. */
export type WSUnifiedPublicDataEvent<
  TTopic extends WSUnifiedPublicTopic = WSUnifiedPublicTopic,
> = {
  [TChannel in TTopic]: {
    channel: TChannel;
    type: 'snapshot' | 'update';
    data: WSUnifiedPublicDataMap[TChannel];
  };
}[TTopic];

export type WSUnifiedExchangeStatus = WSSpotStatusData['system'] | 'offline';

/** Reuses v2 maintenance metadata; unified deployments also report each exchange separately. */
export interface WSUnifiedStatusData extends Omit<WSSpotStatusData, 'system'> {
  system?: WSSpotStatusData['system'];
  spot_exchange?: WSUnifiedExchangeStatus;
  futures_exchange?: WSUnifiedExchangeStatus;
}

export interface WSUnifiedStatusEvent {
  channel: 'status';
  type: 'update';
  data: WSUnifiedStatusData[];
}

/** Payload emitted by WebsocketClient's message event for unifiedPublicV2. */
export type WSUnifiedPublicMessageEvent = (
  | WSUnifiedPublicDataEvent
  | WSUnifiedStatusEvent
) & {
  wsKey: 'unifiedPublicV2';
  isWSAPIResponse: false;
};

export type WSUnifiedPublicSubscriptionResult = {
  [TTopic in WSUnifiedPublicTopic]: {
    channel: TTopic;
    snapshot?: boolean;
    warnings?: string[];
  } & (TTopic extends 'instrument' ? { symbol?: string } : { symbol: string }) &
    (TTopic extends 'book' ? { depth?: WSUnifiedBookDepth } : object) &
    (TTopic extends 'ohlc'
      ? {
          interval?: WSUnifiedOHLCInterval;
          tick_type?: WSUnifiedOHLCTickType;
        }
      : object);
}[WSUnifiedPublicTopic];

/** Each symbol can receive its own acknowledgement with the same req_id. */
export type WSUnifiedPublicSubscriptionResponse = {
  method: 'subscribe' | 'unsubscribe';
  req_id?: number;
} & (
  | {
      success: true;
      result: WSUnifiedPublicSubscriptionResult;
      time_in: string;
      time_out: string;
    }
  | {
      success: false;
      error: string;
      result?: WSUnifiedPublicSubscriptionResult;
      time_in?: string;
      time_out?: string;
    }
);

export type WSUnifiedPublicResponseEvent =
  WSUnifiedPublicSubscriptionResponse & {
    wsKey: 'unifiedPublicV2';
    isWSAPIResponse: false;
  };

/** Heartbeats and successful pongs are consumed internally by the client. */
export interface WSUnifiedHeartbeatEvent {
  channel: 'heartbeat';
}

export interface WSUnifiedPongEvent {
  method: 'pong';
  req_id?: number;
  time_in: string;
  time_out: string;
  success?: boolean;
  error?: string;
}
