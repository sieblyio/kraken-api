import WebSocket from 'isomorphic-ws';

import { WSAPIRequestOperationKrakenSpot } from '../../types/websockets/ws-api.js';
import { WSTopic } from '../../types/websockets/ws-subscriptions.js';
import { WSUnifiedPublicTopicRequest } from '../../types/websockets/ws-unified.js';

/** Should be one WS key per unique URL */
export const WS_KEY_MAP = {
  /**
   * Public WebSocket subscriptions for Kraken Spot products, via the V2 API
   *
   * - Ref: https://docs.kraken.com/api/docs/guides/spot-ws-intro
   * - Channels: https://docs.kraken.com/api/docs/websocket-v2/add_order
   *
   * Note: Use spotPrivateV2 for private channels (requires API keys).
   */
  spotPublicV2: 'spotPublicV2',
  spotPrivateV2: 'spotPrivateV2',
  spotL3V2: 'spotL3V2',
  spotBetaPublicV2: 'spotBetaPublicV2',
  spotBetaPrivateV2: 'spotBetaPrivateV2',
  /**
   * Unauthenticated unified v2 market data for Spot and Derivatives.
   * Specify asset_class in each subscription payload.
   * Authenticated Level 3 and unified private channels are not supported yet.
   * https://docs.kraken.com/exchange/api-reference/unified-ws/ticker
   */
  unifiedPublicV2: 'unifiedPublicV2',
  /**
   * Public WebSocket subscriptions for Kraken Derivatives products, via the V1 API:
   *
   * - Ref: https://docs.kraken.com/api/docs/guides/futures-websockets
   * - Channels: https://docs.kraken.com/api/docs/futures-api/websocket/open_orders
   *
   * Note: While both Public and Private channels use the same WebSocket URL, we will actually maintain separate connections for easier management. Private channels require authentication and the connection is authenticated automatically.
   */
  derivativesPublicV1: 'derivativesPublicV1',
  derivativesPrivateV1: 'derivativesPrivateV1',
} as const;

/** This is used to differentiate between each of the available websocket streams */
export type WsKey = (typeof WS_KEY_MAP)[keyof typeof WS_KEY_MAP];

export type WSOperation = 'subscribe' | 'unsubscribe';

/**
 * Normalised internal format for a request (subscribe/unsubscribe/etc) on a topic, with optional parameters.
 *
 * - Topic: the topic this event is for
 * - Payload: the parameters to include, optional. E.g. auth requires key + sign. Some topics allow configurable parameters.
 */
export interface WSTopicRequest<
  TWSTopic extends WSTopic = WSTopic,
  TWSPayload = any,
> {
  topic: TWSTopic;
  payload?: TWSPayload;
}

/** Unified subscriptions require channel-specific payloads; existing keys retain their interface. */
export type WSSubscriptionRequest<TWSKey extends WsKey> =
  TWSKey extends 'unifiedPublicV2'
    ? WSUnifiedPublicTopicRequest
    : WSTopicRequest<WSTopic> | WSTopic;

/**
 * Conveniently allow users to request a topic either as string topics or objects (containing string topic + params)
 */
export type WSTopicRequestOrStringTopic<
  TWSTopic extends WSTopic,
  TWSPayload = any,
> = WSTopicRequest<TWSTopic, TWSPayload> | string;

export interface WSRequestOperationKraken<
  TWSTopic extends string,
  TWSParams extends object = any,
> {
  // spot only
  method?: WSOperation;
  // futures only
  event?: WSOperation;
  params:
    | {
        channel: (TWSTopic | string | number)[];
        symbol?: string[];
        event_trigger?: string;
        snapshot?: boolean;
      }
    | TWSParams;
  req_id: number;
  /**
   * The following are needed for futures/derivatives requests
   */
  feed?: TWSTopic;
  api_key?: string;
  original_challenge?: string;
  signed_challenge?: string;
}

/**
 * #305: ws.terminate() is undefined in browsers.
 * This only works in node.js, not in browsers.
 * Does nothing if `ws` is undefined. Does nothing in browsers.
 */
export function safeTerminateWs(
  ws?: WebSocket | any,
  fallbackToClose?: boolean,
): boolean {
  if (!ws) {
    return false;
  }
  if (typeof ws['terminate'] === 'function') {
    ws.terminate();
    return true;
  } else if (fallbackToClose) {
    ws.close();
  }

  return false;
}

/**
 * WS API promises are stored using a primary key. This key is constructed using
 * properties found in every request & reply.
 *
 * The counterpart to this is in resolveEmittableEvents
 */
export function getPromiseRefForWSAPIRequest(
  wsKey: WsKey,
  requestEvent: WSAPIRequestOperationKrakenSpot,
): string {
  const promiseRef = [wsKey, requestEvent.method, requestEvent.req_id].join(
    '_',
  );
  return promiseRef;
}

/**
 * Users can conveniently pass topics as strings or objects (object has topic name + optional params).
 *
 * This method normalises topics into objects (object has topic name + optional params).
 */
export function getNormalisedTopicRequests(
  wsTopicRequests: WSTopicRequestOrStringTopic<WSTopic>[],
): WSTopicRequest<WSTopic>[] {
  const normalisedTopicRequests: WSTopicRequest<WSTopic>[] = [];

  for (const wsTopicRequest of wsTopicRequests) {
    // passed as string, convert to object
    if (typeof wsTopicRequest === 'string') {
      const topicRequest: WSTopicRequest<WSTopic> = {
        topic: wsTopicRequest as WSTopic,
        payload: undefined,
      };
      normalisedTopicRequests.push(topicRequest);
      continue;
    }

    // already a normalised object, thanks to user
    normalisedTopicRequests.push(wsTopicRequest);
  }
  return normalisedTopicRequests;
}
