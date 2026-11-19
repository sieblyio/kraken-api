import { DefaultLogger } from './lib/websocket/logger.js';
import { WS_KEY_MAP } from './lib/websocket/websocket-util.js';
import {
  WSAPIAddSpotOrderParams,
  WSAPIAmendSpotOrderParams,
  WSAPIBatchAddSpotOrdersParams,
  WSAPIBatchCancelSpotOrdersParams,
  WSAPICancelAllSpotOrdersAfterParams,
  WSAPICancelSpotOrderParams,
  WSAPIEditSpotOrderParams,
} from './types/request/wsapi.types.js';
import {
  WSAPIAddUnifiedOrderParams,
  WSAPIAmendUnifiedOrderParams,
  WSAPIBatchAddUnifiedOrdersParams,
  WSAPIBatchCancelUnifiedOrdersParams,
  WSAPICancelAllUnifiedOrdersAfterParams,
  WSAPICancelAllUnifiedOrdersParams,
  WSAPICancelUnifiedOrderParams,
  WSAPISetUnifiedPreferenceParams,
} from './types/request/wsapi-unified.types.js';
import {
  WSAPIAddSpotOrderResult,
  WSAPIAmendSpotOrderResult,
  WSAPIBatchAddSpotOrdersResult,
  WSAPIBatchCancelSpotOrdersResult,
  WSAPICancelAllSpotOrdersAfterResult,
  WSAPICancelAllSpotOrdersResult,
  WSAPICancelSpotOrderResult,
  WSAPIEditSpotOrderResult,
} from './types/response/wsapi.types.js';
import {
  WSAPIAddUnifiedOrderResult,
  WSAPIAmendUnifiedOrderResult,
  WSAPIBatchAddUnifiedOrdersResult,
  WSAPIBatchCancelUnifiedOrdersResult,
  WSAPICancelAllUnifiedOrdersAfterResult,
  WSAPICancelAllUnifiedOrdersResult,
  WSAPICancelUnifiedOrderResult,
  WSAPISetUnifiedPreferenceResult,
} from './types/response/wsapi-unified.types.js';
import {
  WSAPISpotResponse,
  WSAPISpotWsKey,
  WSAPIUnifiedResponse,
  WSAPIUnifiedWsKey,
  WSAPIWsKey,
} from './types/websockets/ws-api.js';
import { WSClientConfigurableOptions } from './types/websockets/ws-general.js';
import { WebsocketClient } from './WebsocketClient.js';

/**
 * Configurable options specific to only the REST-like WebsocketAPIClient
 */
export interface WSAPIClientConfigurableOptions {
  /**
   * Default: true
   *
   * Attach default event listeners, which will console log any high level
   * events (opened/reconnecting/reconnected/etc).
   *
   * If you disable this, you should set your own event listeners
   * on the embedded WS Client `wsApiClient.getWSClient().on(....)`.
   */
  attachEventListeners: boolean;
}

/**
 * This is a minimal Websocket API wrapper around the WebsocketClient.
 *
 * Some methods support passing in a custom "wsKey". This is a reference to which WS connection should
 * be used to transmit that message. This is only useful if you wish to use an alternative wss
 * domain that is supported by the SDK. E.g. WS_API_KEY_MAP.spotBetaPrivateV2.
 *
 * Note: You can also directly use the sendWSAPIRequest() method to make WS API calls, but some
 * may find the below methods slightly more intuitive.
 *
 * Refer to the WS API promises example for a more detailed example on using sendWSAPIRequest() directly:
 * https://github.com/sieblyio/kraken-api/blob/main/examples/WebSockets/Spot/wsAPI.RAW.ts#L105
 *
 * Docs:
 * - Spot WS API: https://docs.kraken.com/api/docs/websocket-v2/add_order/
 * - Unified WS API: https://docs.kraken.com/exchange/api-reference/unified-ws/add_order
 */
export class WebsocketAPIClient {
  private wsClient: WebsocketClient;

  private options: WSClientConfigurableOptions & WSAPIClientConfigurableOptions;

  constructor(
    options?: WSClientConfigurableOptions &
      Partial<WSAPIClientConfigurableOptions>,
    logger?: DefaultLogger,
  ) {
    this.wsClient = new WebsocketClient(options, logger);

    this.options = {
      attachEventListeners: true,
      ...options,
    };

    this.setupDefaultEventListeners();
  }

  public getWSClient(): WebsocketClient {
    return this.wsClient;
  }

  /**
   * Add a spot order
   */
  submitSpotOrder(
    params: Omit<WSAPIAddSpotOrderParams, 'token' | 'req_id'>,
    wsKey?: WSAPISpotWsKey,
  ): Promise<WSAPISpotResponse<WSAPIAddSpotOrderResult, 'add_order'>> {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'add_order',
      params,
    );
  }

  /**
   * Amend an existing order
   */
  amendSpotOrder(
    params: WSAPIAmendSpotOrderParams,
    wsKey?: WSAPISpotWsKey,
  ): Promise<WSAPISpotResponse<WSAPIAmendSpotOrderResult, 'amend_order'>> {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'amend_order',
      params,
    );
  }

  /**
   * Cancel one or more orders
   */
  cancelSpotOrder(
    params: WSAPICancelSpotOrderParams,
    wsKey?: WSAPISpotWsKey,
  ): Promise<WSAPISpotResponse<WSAPICancelSpotOrderResult, 'cancel_order'>> {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'cancel_order',
      params,
    );
  }

  /**
   * Cancel all open orders
   */
  cancelAllSpotOrders(
    wsKey?: WSAPISpotWsKey,
  ): Promise<WSAPISpotResponse<WSAPICancelAllSpotOrdersResult, 'cancel_all'>> {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'cancel_all',
    );
  }

  /**
   * Cancel all orders after a timeout (Dead Man's Switch)
   */
  cancelAllSpotOrdersAfter(
    params: WSAPICancelAllSpotOrdersAfterParams,
    wsKey?: WSAPISpotWsKey,
  ): Promise<
    WSAPISpotResponse<
      WSAPICancelAllSpotOrdersAfterResult,
      'cancel_all_orders_after'
    >
  > {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'cancel_all_orders_after',
      params,
    );
  }

  /**
   * Add multiple orders in a single batch (2-15 orders)
   */
  batchSubmitSpotOrders(
    params: WSAPIBatchAddSpotOrdersParams,
    wsKey?: WSAPISpotWsKey,
  ): Promise<WSAPISpotResponse<WSAPIBatchAddSpotOrdersResult[], 'batch_add'>> {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'batch_add',
      params,
    );
  }

  /**
   * Cancel multiple orders in a single batch (2-50 orders)
   */
  batchCancelSpotOrders(
    params: WSAPIBatchCancelSpotOrdersParams,
    wsKey?: WSAPISpotWsKey,
  ): Promise<
    WSAPISpotResponse<WSAPIBatchCancelSpotOrdersResult, 'batch_cancel'>
  > {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'batch_cancel',
      params,
    );
  }

  /**
   * Edit an existing order (legacy method, use amendSpotOrder instead)
   * @deprecated Use amendSpotOrder for better performance and features
   */
  editSpotOrder(
    params: WSAPIEditSpotOrderParams,
    wsKey?: WSAPISpotWsKey,
  ): Promise<WSAPISpotResponse<WSAPIEditSpotOrderResult, 'edit_order'>> {
    return this.wsClient.sendWSAPIRequest(
      wsKey || WS_KEY_MAP.spotPrivateV2,
      'edit_order',
      params,
    );
  }

  /** Add a Spot or derivatives order through the unified API. */
  submitUnifiedOrder(
    params: WSAPIAddUnifiedOrderParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<WSAPIUnifiedResponse<WSAPIAddUnifiedOrderResult, 'add_order'>> {
    return this.wsClient.sendWSAPIRequest(wsKey, 'add_order', params);
  }

  /** Amend a unified order in-place. */
  amendUnifiedOrder(
    params: WSAPIAmendUnifiedOrderParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<WSAPIAmendUnifiedOrderResult, 'amend_order'>
  > {
    return this.wsClient.sendWSAPIRequest(wsKey, 'amend_order', params);
  }

  /** Cancel unified orders. Multiple identifiers produce individual response events. */
  cancelUnifiedOrder(
    params: WSAPICancelUnifiedOrderParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<WSAPICancelUnifiedOrderResult, 'cancel_order'>
  > {
    return this.wsClient.sendWSAPIRequest(wsKey, 'cancel_order', params);
  }

  /** Cancel all open orders for the specified asset class. */
  cancelAllUnifiedOrders(
    params: WSAPICancelAllUnifiedOrdersParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<WSAPICancelAllUnifiedOrdersResult, 'cancel_all'>
  > {
    return this.wsClient.sendWSAPIRequest(wsKey, 'cancel_all', params);
  }

  /** Set the unified Dead Man's Switch timeout, or use zero to disable it. */
  cancelAllUnifiedOrdersAfter(
    params: WSAPICancelAllUnifiedOrdersAfterParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<
      WSAPICancelAllUnifiedOrdersAfterResult,
      'cancel_all_orders_after'
    >
  > {
    return this.wsClient.sendWSAPIRequest(
      wsKey,
      'cancel_all_orders_after',
      params,
    );
  }

  /** Add 2 to 15 unified orders for one symbol. */
  batchSubmitUnifiedOrders(
    params: WSAPIBatchAddUnifiedOrdersParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<WSAPIBatchAddUnifiedOrdersResult[], 'batch_add'>
  > {
    return this.wsClient.sendWSAPIRequest(wsKey, 'batch_add', params);
  }

  /** Cancel 2 to 50 unified orders in one request. */
  batchCancelUnifiedOrders(
    params: WSAPIBatchCancelUnifiedOrdersParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<WSAPIBatchCancelUnifiedOrdersResult, 'batch_cancel'>
  > {
    return this.wsClient.sendWSAPIRequest(wsKey, 'batch_cancel', params);
  }

  /** Set derivatives leverage preferences through the unified API. */
  setUnifiedPreference(
    params: WSAPISetUnifiedPreferenceParams,
    wsKey: WSAPIUnifiedWsKey = WS_KEY_MAP.unifiedPrivateV2,
  ): Promise<
    WSAPIUnifiedResponse<WSAPISetUnifiedPreferenceResult, 'set_preference'>
  > {
    return this.wsClient.sendWSAPIRequest(wsKey, 'set_preference', params);
  }
  /**
   *
   *
   *
   *
   *
   *
   *
   * Private methods for handling some of the convenience/automation provided by the WS API Client
   *
   *
   *
   *
   *
   *
   *
   */

  public connectWSAPI(wsKey: WSAPIWsKey) {
    return this.getWSClient().assertIsAuthenticated(wsKey);
  }

  private setupDefaultEventListeners() {
    if (this.options.attachEventListeners) {
      /**
       * General event handlers for monitoring the WebsocketClient
       */
      this.wsClient
        .on('open', (data) => {
          console.log(new Date(), 'ws connected', data.wsKey);
        })
        .on('reconnecting', ({ wsKey }) => {
          console.log(new Date(), 'ws automatically reconnecting.... ', wsKey);
        })
        .on('reconnected', (data) => {
          console.log(new Date(), 'ws has reconnected ', data?.wsKey);
        })
        .on('authenticated', (data) => {
          console.info(new Date(), 'ws has authenticated ', data?.wsKey);
        })
        .on('exception', (data) => {
          try {
            // Blind JSON.stringify can fail on circular references
            console.error(
              new Date(),
              'ws exception: ',
              JSON.stringify(data),
              // JSON.stringify({ ...data, target: 'WebSocket' }),
            );
          } catch {
            console.error(new Date(), 'ws exception: ', data);
          }
        });
    }
  }
}
