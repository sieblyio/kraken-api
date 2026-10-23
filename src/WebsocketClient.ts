import {
  BaseWebsocketClient,
  EmittableEvent,
  MidflightWsRequestEvent,
} from './lib/BaseWSClient.js';
import { neverGuard } from './lib/misc-util.js';
import {
  KRAKEN_FUTURES_TESTNET_RETIRED_ERROR,
  RestClientOptions,
} from './lib/requestUtils.js';
import {
  hashMessage,
  SignAlgorithm,
  SignEncodeMethod,
  signMessage,
  SignMessageOptions,
} from './lib/webCryptoAPI.js';
import { DefaultLogger } from './lib/websocket/logger.js';
import { RestClientCache } from './lib/websocket/rest-client-cache.js';
import {
  getPromiseRefForWSAPIRequest,
  WS_KEY_MAP,
  WsKey,
  WSOperation,
  WSRequestOperationKraken,
  WSSubscriptionRequest,
  WSTopicRequest,
} from './lib/websocket/websocket-util.js';
import { WSConnectedResult } from './lib/websocket/WsStore.types.js';
import {
  Exact,
  WS_API_Operations,
  WSAPIAuthenticationRequestFromServer,
  WSAPIRequestOperationKrakenSpot,
  WSAPITopicRequestParamMap,
  WSAPITopicResponseMap,
  WSAPIWsKey,
  WSAPIWsKeyTopicMap,
} from './types/websockets/ws-api.js';
import { MessageEventLike } from './types/websockets/ws-events.js';
import {
  WSClientConfigurableOptions,
  WsMarket,
} from './types/websockets/ws-general.js';
import {
  WS_DERIVATIVES_PRIVATE_TOPICS,
  WS_SPOT_PRIVATE_TOPICS,
  WSTopic,
} from './types/websockets/ws-subscriptions.js';

const WS_LOGGER_CATEGORY_ID = 'kraken-ws';
const WS_LOGGER_CATEGORY = {
  category: WS_LOGGER_CATEGORY_ID,
};

export interface WSAPIRequestFlags {
  /** If true, will skip auth requirement for WS API connection */
  authIsOptional?: boolean | undefined;
}

export class WebsocketClient extends BaseWebsocketClient<WsKey, any> {
  private restClientCache: RestClientCache = new RestClientCache();

  private wsChallengeCache: Map<WsKey, string> = new Map();

  constructor(options?: WSClientConfigurableOptions, logger?: DefaultLogger) {
    super({ ...options, wsLoggerCategory: WS_LOGGER_CATEGORY_ID }, logger);

    this.restClientCache.setLogger(this.logger, WS_LOGGER_CATEGORY);
  }

  /**
   * Request connection of all dependent (public & private) websockets, instead of waiting for automatic connection by library.
   *
   * Returns array of promises that individually resolve when each connection is successfully opened.
   */
  public connectAll(): Promise<WSConnectedResult | undefined>[] {
    return [this.connect(WS_KEY_MAP.spotPrivateV2)];
  }

  /**
   * Ensures the WS API connection is active and ready.
   *
   * You do not need to call this, but if you call this before making any WS API requests,
   * it can accelerate the first request (by preparing the connection in advance).
   */
  public connectWSAPI(wsKey: WSAPIWsKey, skipAuth?: boolean): Promise<unknown> {
    if (skipAuth) {
      return this.assertIsConnected(wsKey);
    }

    /** This call automatically ensures the connection is active AND authenticated before resolving */
    return this.assertIsAuthenticated(wsKey);
  }

  /**
   * Request subscription to one or more topics. Pass topics as either an array of strings, or array of objects (if the topic has parameters).
   * Objects should be formatted as {topic: string, payload: object}.
   * Unified public subscriptions require a payload with asset_class and channel-specific parameters.
   *
   * - Subscriptions are automatically routed to the correct websocket connection.
   * - Authentication/connection is automatic.
   * - Resubscribe after network issues is automatic.
   *
   * Call `unsubscribe(topics)` to remove topics
   */
  public subscribe<TWSKey extends WsKey>(
    requests: WSSubscriptionRequest<TWSKey> | WSSubscriptionRequest<TWSKey>[],
    wsKey: TWSKey,
  ): void;

  public subscribe(
    requests:
      | (WSTopicRequest<WSTopic> | WSTopic)
      | (WSTopicRequest<WSTopic> | WSTopic)[],
    wsKey: WsKey,
  ) {
    if (!Array.isArray(requests)) {
      this.subscribeTopicsForWsKey([requests], wsKey);
      return;
    }

    if (requests.length) {
      this.subscribeTopicsForWsKey(requests, wsKey);
    }
  }

  /**
   * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
   *
   * - Requests are automatically routed to the correct websocket connection.
   * - These topics will be removed from the topic cache, so they won't be subscribed to again.
   * - Pass the same topic and payload used to subscribe, including optional parameters.
   */
  public unsubscribe<TWSKey extends WsKey>(
    requests: WSSubscriptionRequest<TWSKey> | WSSubscriptionRequest<TWSKey>[],
    wsKey: TWSKey,
  ): void;

  public unsubscribe(
    requests:
      | (WSTopicRequest<WSTopic> | WSTopic)
      | (WSTopicRequest<WSTopic> | WSTopic)[],
    wsKey: WsKey,
  ) {
    if (!Array.isArray(requests)) {
      this.unsubscribeTopicsForWsKey([requests], wsKey);
      return;
    }

    if (requests.length) {
      this.unsubscribeTopicsForWsKey(requests, wsKey);
    }
  }

  /**
   * WS API Methods - similar to the REST API, but via WebSockets
   */

  /**
   * Send a Websocket API event on a connection. Returns a promise that resolves on reply.
   *
   * Returned promise is rejected if an exception is detected in the reply OR the connection disconnects for any reason (even if automatic reconnect will happen).
   *
   * After a fresh connection, you should always send a login request first.
   *
   * If you authenticated once and you're reconnected later (e.g. connection temporarily lost), the SDK will by default automatically:
   * - Detect you were authenticated to the WS API before
   * - Try to re-authenticate (up to 5 times, in case something (bad timestamp) goes wrong)
   * - If it succeeds, it will emit the 'authenticated' event.
   * - If it fails and gives up, it will emit an 'exception' event (type: 'wsapi.auth', reason: detailed text).
   *
   * You can turn off the automatic re-auth WS API logic using `reauthWSAPIOnReconnect: false` in the WSClient config.
   *
   * @param wsKey - The connection this event is for (e.g. "spotV4" | "perpFuturesUSDTV4" | "perpFuturesBTCV4" | "deliveryFuturesUSDTV4" | "deliveryFuturesBTCV4" | "optionsV4")
   * @param channel - The channel this event is for (e.g. "spot.login" to authenticate)
   * @param params - Any request parameters for the payload (contents of req_param in the docs). Signature generation is automatic, only send parameters such as order ID as per the docs.
   * @returns Promise - tries to resolve with async WS API response. Rejects if disconnected or exception is seen in async WS API response
   */

  // This overload allows the caller to omit the 3rd param, if it isn't required (e.g. for the login call)
  async sendWSAPIRequest<
    TWSKey extends keyof WSAPIWsKeyTopicMap,
    TWSOperation extends WSAPIWsKeyTopicMap[TWSKey],
    TWSParams extends Exact<WSAPITopicRequestParamMap[TWSOperation]>,
    TWSAPIResponse extends
      | WSAPITopicResponseMap[TWSOperation]
      | object = WSAPITopicResponseMap[TWSOperation],
  >(
    wsKey: TWSKey,
    operation: TWSOperation,
    params?: TWSParams extends void | never ? undefined : TWSParams,
    requestFlags?: WSAPIRequestFlags,
  ): Promise<TWSAPIResponse>;

  async sendWSAPIRequest<
    TWSKey extends keyof WSAPIWsKeyTopicMap,
    TWSOperation extends WSAPIWsKeyTopicMap[TWSKey],
    // if this throws a type error, probably forgot to add a new operation to WsAPITopicRequestParamMap
    TWSParams extends Exact<WSAPITopicRequestParamMap[TWSOperation]>,
    TWSAPIResponse extends
      | WSAPITopicResponseMap[TWSOperation]
      | object = WSAPITopicResponseMap[TWSOperation],
  >(
    wsKey: TWSKey,
    operation: TWSOperation,
    params: TWSParams & { signRequest?: boolean },
    requestFlags?: WSAPIRequestFlags,
  ): Promise<TWSAPIResponse | any> {
    /**
     * Base Info:
     * - https://docs.kraken.com/api/docs/websocket-v2/add_order
     *
     * Currently only supported for Spot markets
     */

    this.logger.trace(`sendWSAPIRequest(): assert "${wsKey}" is connected`, {
      ...WS_LOGGER_CATEGORY,
    });

    await this.assertIsConnected(wsKey);

    // Some commands don't require authentication.
    if (requestFlags?.authIsOptional !== true) {
      this.logger.trace(
        'sendWSAPIRequest(): assertIsAuthenticated(${wsKey})...',
      );
      await this.assertIsAuthenticated(wsKey);
      this.logger.trace(
        'sendWSAPIRequest(): assertIsAuthenticated(${wsKey}) ok',
      );
    }

    const requestEvent: WSAPIRequestOperationKrakenSpot = {
      method: operation,
      params: params,
      req_id: this.getNewRequestId(),
    };

    // Sign request
    const signedEvent = await this.signWSAPIRequest(requestEvent);

    // Store deferred promise
    const promiseRef = getPromiseRefForWSAPIRequest(wsKey, requestEvent);

    const deferredPromise = this.getWsStore().createDeferredPromise<
      TWSAPIResponse & { request: any }
    >(wsKey, promiseRef, false);

    // Enrich returned promise with request context for easier debugging
    deferredPromise.promise
      ?.then((res) => {
        if (!Array.isArray(res)) {
          res.request = {
            wsKey: wsKey,
            ...signedEvent,
          };
        }

        return res;
      })
      .catch((e) => {
        if (typeof e === 'string') {
          this.logger.error('unexpcted string', { e });
          return e;
        }
        e.request = {
          wsKey: wsKey,
          operation,
          payload: signedEvent.params,
        };
        return e;
      });

    // Send event
    const throwExceptions = true;
    this.tryWsSend(wsKey, JSON.stringify(signedEvent), throwExceptions);

    this.logger.trace(
      `sendWSAPIRequest(): sent "${operation}" event with promiseRef(${promiseRef})`,
      signedEvent,
    );

    // Return deferred promise, so caller can await this call
    return deferredPromise.promise!;
  }

  /**
   *
   * Internal methods - not intended for public use
   *
   */

  private getRestClientOptions(): RestClientOptions {
    return {
      ...this.options,
      ...this.options.restOptions,
      apiKey: this.options.apiKey,
      apiSecret: this.options.apiSecret,
    };
  }

  /**
   * Note: implementing this method will wipe the WsStore state for this WsKey, once this method returns
   */
  protected isCustomReconnectionNeeded(): boolean {
    return false;
  }

  protected async triggerCustomReconnectionWorkflow(): Promise<void> {
    return;
  }

  protected async getWsUrl(wsKey: WsKey): Promise<string> {
    if (this.options.testnet) {
      throw new Error(KRAKEN_FUTURES_TESTNET_RETIRED_ERROR);
    }

    if (this.options.wsUrl) {
      return this.options.wsUrl;
    }

    switch (wsKey) {
      case WS_KEY_MAP.unifiedPublicV2: {
        return 'wss://uws.kraken.com/v2/public';
      }
      /**
       * https://docs.kraken.com/api/docs/guides/spot-ws-intro/
       *
       * Note: Kraken's v2 WebSockets clean up a number idiosyncrasies and ambiguities from v1 with the overall aim to enable easier integration with applications. It is intended that v1 will be maintained but future enhancements will be developed in v2.
       *
       * Given the above, we are only integrating with V2 for now.
       *
       * V2 SpotWebSocket Reference: https://docs.kraken.com/api/docs/websocket-v2/add_order/
       */
      case WS_KEY_MAP.spotPublicV2: {
        return 'wss://ws.kraken.com/v2';
      }
      case WS_KEY_MAP.spotPrivateV2: {
        return 'wss://ws-auth.kraken.com/v2';
      }
      case WS_KEY_MAP.spotL3V2: {
        return 'wss://ws-l3.kraken.com/v2';
      }
      case WS_KEY_MAP.spotBetaPublicV2: {
        return 'wss://beta-ws.kraken.com/v2';
      }
      case WS_KEY_MAP.spotBetaPrivateV2: {
        return 'wss://beta-ws-auth.kraken.com/v2';
      }
      // Uses the same URL, but we maintain separate connections for easier management
      case WS_KEY_MAP.derivativesPublicV1:
      case WS_KEY_MAP.derivativesPrivateV1: {
        return 'wss://futures.kraken.com/ws/v1';
      }
      default: {
        throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
      }
    }
  }

  protected sendPingEvent(wsKey: WsKey) {
    // let pingChannel: WsRequestPing['channel'];

    switch (wsKey) {
      case WS_KEY_MAP.derivativesPublicV1:
      case WS_KEY_MAP.derivativesPrivateV1: {
        const ws = this.getWsStore().get(wsKey)?.ws;
        if (ws) {
          ws.ping();
        }
        break;
      }
      case WS_KEY_MAP.unifiedPublicV2:
      case WS_KEY_MAP.spotPublicV2:
      case WS_KEY_MAP.spotPrivateV2:
      case WS_KEY_MAP.spotL3V2:
      case WS_KEY_MAP.spotBetaPublicV2:
      case WS_KEY_MAP.spotBetaPrivateV2: {
        // Spot: https://docs.kraken.com/api/docs/websocket-v2/ping
        return this.tryWsSend(
          wsKey,
          `{ "method": "ping", "req_id": ${this.getNewRequestId()} }`,
        );
      }

      default: {
        throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
      }
    }
  }

  protected sendPongEvent(wsKey: WsKey) {
    try {
      this.logger.trace('Sending upstream ws PONGFRAME: ', {
        ...WS_LOGGER_CATEGORY,
        wsMessage: 'PONGFRAME',
        wsKey,
      });
      if (!wsKey) {
        throw new Error('Cannot send PONGFRAME, no wsKey provided');
      }
      const wsState = this.getWsStore().get(wsKey);
      if (!wsState || !wsState?.ws) {
        throw new Error(
          `Cannot send PONGFRAME, ${wsKey} socket not connected yet`,
        );
      }

      // Send a protocol layer pong
      wsState.ws.pong();
    } catch (e) {
      this.logger.error('Failed to send WS PONG', {
        ...WS_LOGGER_CATEGORY,
        wsMessage: 'PONGFRAME',
        wsKey,
        exception: e,
      });
    }
  }

  // NOT IN USE for kraken
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isWsPing(_msg: any): boolean {
    return false;
  }

  protected isWsPong(msg: any): boolean {
    // Pre-parsed in resolveEmittableEvents into "pong" eventType:
    if (msg?.eventType) {
      if (msg?.eventType === 'pong') {
        return true;
      }
    }

    return false;
  }

  /**
   * Parse incoming events into categories, before emitting to the user
   */
  protected resolveEmittableEvents(
    wsKey: WsKey,
    event: MessageEventLike,
  ): EmittableEvent[] {
    const results: EmittableEvent[] = [];

    try {
      const parsed = JSON.parse(event.data);

      // derivatives sends 'challenge' on successful auth-init (used for sign during subscribe)
      const responseEvents = [
        // spot confirmation for subscription success
        'subscribe',
        'unsubscribe',
        'info',
        // derivatives confirmation for subscription success
        'subscribed',
        'unsubscribed',
      ];
      const authenticatedEvents = ['challenge'];

      const derivativesEventAction = parsed.event || parsed.feed;
      const spotEventAction =
        parsed.method ||
        parsed.type ||
        parsed.event ||
        parsed?.header?.data ||
        parsed.channel;
      const eventAction = spotEventAction || derivativesEventAction;

      const promiseRef = [wsKey, eventAction, parsed?.req_id].join('_');

      // WS API
      if (WS_API_Operations.includes(eventAction)) {
        const isError = parsed.success !== true;

        // WS API Exception
        if (isError) {
          try {
            this.getWsStore().rejectDeferredPromise(
              wsKey,
              promiseRef,
              {
                wsKey,
                ...parsed,
              },
              true,
            );
          } catch (e) {
            this.logger.error('Exception trying to reject WSAPI promise', {
              wsKey,
              promiseRef,
              parsedEvent: parsed,
              error: e,
            });
          }

          results.push({
            eventType: 'exception',
            event: parsed,
            isWSAPIResponse: true,
          });
          return results;
        }

        // WS API Success
        try {
          this.getWsStore().resolveDeferredPromise(
            wsKey,
            promiseRef,
            {
              wsKey,
              ...parsed,
            },
            true,
          );
        } catch (e) {
          this.logger.error('Exception trying to resolve WSAPI promise', {
            wsKey,
            promiseRef,
            parsedEvent: parsed,
            error: e,
          });
        }

        results.push({
          eventType: 'response',
          event: parsed,
          isWSAPIResponse: true,
        });
        return results;
      } // end of WS API response processing

      if (typeof eventAction === 'string') {
        if (parsed.success === false) {
          results.push({
            eventType: 'exception',
            event: parsed,
          });
          return results;
        }

        // exceptions with derivatives v1 WS. E.g. { event: 'alert', message: 'Bad websocket message' }
        if (eventAction === 'alert') {
          results.push({
            eventType: 'exception',
            event: parsed,
          });
          return results;
        }

        // Most events use event: "update" or "snapshot" for topic updates
        if (['update', 'snapshot'].includes(eventAction)) {
          results.push({
            eventType: 'message',
            event: parsed,
          });
          return results;
        }

        // These are request/reply pattern events (e.g. after subscribing to topics or authenticating)
        // e.g. "method":"subscribe"
        if (responseEvents.includes(eventAction)) {
          results.push({
            eventType: 'response',
            event: parsed,
          });
          return results;
        }

        // derivatives events include the "feed" property to identify the channel name
        if (typeof parsed.feed === 'string') {
          results.push({
            eventType: 'message',
            event: parsed,
          });
          return results;
        }

        // Request/reply pattern for authentication success
        if (authenticatedEvents.includes(eventAction)) {
          if (wsKey === WS_KEY_MAP.derivativesPrivateV1) {
            const challenge = parsed.message;
            if (challenge) {
              this.logger.trace(
                `Stored challenge for derivatives auth on wsKey "${wsKey}": "${challenge}"`,
              );
              this.wsChallengeCache.set(wsKey, challenge);
            }
          }

          results.push({
            eventType: 'authenticated',
            event: parsed,
          });
          return results;
        }

        if (eventAction === 'heartbeat' || eventAction === 'pong') {
          results.push({
            eventType: 'pong',
            event: parsed,
          });
          return results;
        }

        this.logger.error(
          `!! Unhandled string "eventAction" "${eventAction}". Defaulting to "message" channel... Parsed:`,
          parsed,
        );
      } else {
        this.logger.error(
          `!! Unhandled non-string "eventAction" "${eventAction}". Defaulting to "message" channel... Parsed:`,
          parsed,
        );
      }

      results.push({
        eventType: 'message',
        event: parsed,
      });
    } catch (e) {
      results.push({
        event: {
          message: 'Failed to parse event data due to exception',
          exception: e,
          eventData: event.data,
        },
        eventType: 'exception',
      });

      this.logger.error('Failed to parse event data due to exception: ', {
        exception: e,
        eventData: event.data,
      });
    }

    return results;
  }

  /**
   * Determines if a topic is for a private channel, using a hardcoded list of strings
   */
  protected isPrivateTopicRequest(request: WSTopicRequest<any>): boolean {
    const topicName = request?.topic?.toLowerCase();
    if (!topicName) {
      return false;
    }

    if (WS_SPOT_PRIVATE_TOPICS.includes(topicName)) {
      return true;
    }

    if (WS_DERIVATIVES_PRIVATE_TOPICS.includes(topicName)) {
      return true;
    }

    return false;
  }

  /**
   * Not in use for Kraken
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getWsMarketForWsKey(_wsKey: WsKey): WsMarket {
    return 'futures';
  }

  /**
   * Whether key represents a private connection. Feeds into automatic auth on connect.
   */
  protected getPrivateWSKeys(): WsKey[] {
    return [
      WS_KEY_MAP.spotPrivateV2,
      WS_KEY_MAP.spotL3V2,
      WS_KEY_MAP.spotBetaPrivateV2,
      WS_KEY_MAP.derivativesPrivateV1,
    ];
  }

  protected isAuthOnConnectWsKey(wsKey: WsKey): boolean {
    return this.getPrivateWSKeys().includes(wsKey);
  }

  /** Force subscription requests to be sent in smaller batches, if a number is returned */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getMaxTopicsPerSubscribeEvent(_wsKey: WsKey): number | null {
    return 1;
  }

  protected authPrivateConnectionsOnConnect(wsKey: WsKey): boolean {
    // derivatives require you to send a challenge on connect
    if (wsKey === WS_KEY_MAP.derivativesPrivateV1) {
      return true;
    }

    return this.options.authPrivateConnectionsOnConnect;
  }

  /**
   * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
   */
  protected async getWsRequestEvents(
    wsKey: WsKey,
    operation: WSOperation,
    requests: WSTopicRequest<WSTopic>[],
  ): Promise<MidflightWsRequestEvent<WSRequestOperationKraken<string>>[]> {
    const wsRequestEvents: MidflightWsRequestEvent<
      WSRequestOperationKraken<WSTopic>
    >[] = [];
    const wsRequestBuildingErrors: unknown[] = [];

    // Previously used to track topics in a request. Keeping this for subscribe/unsubscribe requests, no need for incremental values

    for (const topicRequest of requests) {
      const req_id = this.getNewRequestId();

      switch (wsKey) {
        case WS_KEY_MAP.unifiedPublicV2:
        case WS_KEY_MAP.spotPublicV2:
        case WS_KEY_MAP.spotPrivateV2:
        case WS_KEY_MAP.spotL3V2:
        case WS_KEY_MAP.spotBetaPublicV2:
        case WS_KEY_MAP.spotBetaPrivateV2: {
          const wsEvent: WSRequestOperationKraken<WSTopic> = {
            method: operation,
            params: {
              channel: topicRequest.topic,
              ...topicRequest.payload,
            },
            req_id: req_id,
          };

          if (
            this.options.authPrivateRequests &&
            (wsKey === WS_KEY_MAP.spotPrivateV2 ||
              wsKey === WS_KEY_MAP.spotL3V2 ||
              wsKey === WS_KEY_MAP.spotBetaPrivateV2)
          ) {
            // Get token from REST client cache
            const tokenResult =
              await this.restClientCache.fetchSpotWebSocketToken(
                this.getRestClientOptions(),
                this.options.requestOptions,
              );

            if (!tokenResult?.token) {
              wsRequestBuildingErrors.push(
                new Error(
                  `No WS auth token could be retrieved for private spot WS request for topic "${topicRequest.topic}"`,
                ),
              );
              continue;
            }

            wsEvent.params.token = tokenResult.token;
          }

          // Cache midflight subs on the req ID
          // Enrich response with subs for that req ID
          const midflightWsEvent: MidflightWsRequestEvent<
            WSRequestOperationKraken<WSTopic>
          > = {
            requestKey: wsEvent.req_id,
            requestEvent: wsEvent,
          };

          wsRequestEvents.push({
            ...midflightWsEvent,
          });

          break;
        }
        // No auth needed, it's public topics only here
        case WS_KEY_MAP.derivativesPublicV1: {
          const wsEvent: WSRequestOperationKraken<WSTopic> = {
            event: operation,
            feed: topicRequest.topic,
            ...topicRequest.payload,
            req_id: req_id,
          };

          // Cache midflight subs on the req ID
          // Enrich response with subs for that req ID
          const midflightWsEvent: MidflightWsRequestEvent<
            WSRequestOperationKraken<WSTopic>
          > = {
            requestKey: wsEvent.req_id,
            requestEvent: wsEvent,
          };

          wsRequestEvents.push({
            ...midflightWsEvent,
          });

          break;
        }

        case WS_KEY_MAP.derivativesPrivateV1: {
          const wsEvent: WSRequestOperationKraken<WSTopic> = {
            event: operation,
            feed: topicRequest.topic,
            ...topicRequest.payload,
            req_id: req_id,
          };

          // https://docs.kraken.com/api/docs/guides/futures-websockets
          // Authenticated requests must include both the original challenge message (original_challenge) and the signed (signed_challenge) in JSON format.

          if (!this.wsChallengeCache.has(wsKey)) {
            this.logger.trace(
              `No challenge key cached for wsKey ${wsKey}, asserting authentication...`,
              { ...WS_LOGGER_CATEGORY, wsKey },
            );

            await this.assertIsAuthenticated(wsKey);
          }

          const challengeKey = this.wsChallengeCache.get(wsKey);
          if (!challengeKey) {
            this.logger.error(
              `Auth-check passed but no challenge key could be retrieved from cache for wsKey ${wsKey}`,
              { ...WS_LOGGER_CATEGORY, wsKey },
            );
            throw new Error(
              'No challenge key cached, cannot send authenticated request',
            );
          }

          wsEvent.original_challenge = challengeKey;
          wsEvent.api_key = this.options.apiKey;

          const hashedChallenge = await hashMessage(
            challengeKey,
            'binary',
            'SHA-256',
          );

          if (!this.options.apiSecret) {
            throw new Error(
              'API Secret missing, cannot sign challenge for authenticated WS request',
            );
          }

          const challengeSign = await this.signMessage(
            hashedChallenge,
            this.options.apiSecret,
            'base64',
            'SHA-512',
            {
              isSecretB64Encoded: true,
              isInputBinaryString: true,
            },
          );

          wsEvent.signed_challenge = challengeSign;

          // Cache midflight subs on the req ID
          // Enrich response with subs for that req ID
          const midflightWsEvent: MidflightWsRequestEvent<
            WSRequestOperationKraken<WSTopic>
          > = {
            requestKey: wsEvent.req_id,
            requestEvent: wsEvent,
          };

          wsRequestEvents.push({
            ...midflightWsEvent,
          });

          break;
        }

        default: {
          throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
        }
      }
    }

    if (wsRequestBuildingErrors.length) {
      const label =
        wsRequestBuildingErrors.length === requests.length ? 'all' : 'some';

      this.logger.error(
        `Failed to build/send ${wsRequestBuildingErrors.length} event(s) for ${label} WS requests due to exceptions`,
        {
          ...WS_LOGGER_CATEGORY,
          wsRequestBuildingErrors,
          wsRequestBuildingErrorsStringified: JSON.stringify(
            wsRequestBuildingErrors,
            null,
            2,
          ),
        },
      );
    }

    return wsRequestEvents;
  }

  private async signMessage(
    paramsStr: string,
    secret: string,
    method: SignEncodeMethod,
    algorithm: SignAlgorithm,
    options?: SignMessageOptions,
  ): Promise<string> {
    if (typeof this.options.customSignMessageFn === 'function') {
      return this.options.customSignMessageFn(paramsStr, secret);
    }
    return await signMessage(paramsStr, secret, method, algorithm, options);
  }

  protected async getWsAuthRequestEvent(
    wsKey: WsKey,
    eventToAuth?: WSAPIAuthenticationRequestFromServer,
  ): Promise<object | string | 'waitForEvent' | void> {
    try {
      switch (wsKey) {
        case WS_KEY_MAP.spotPrivateV2:
        case WS_KEY_MAP.spotL3V2:
        case WS_KEY_MAP.spotBetaPrivateV2: {
          // Not needed here, handled automatically with request during subscribe
          this.logger.trace(
            `getWsAuthRequestEvent(${wsKey}): no auth request required for private WS...`,
          );

          return;
        }

        case WS_KEY_MAP.unifiedPublicV2:
        case WS_KEY_MAP.spotPublicV2:
        case WS_KEY_MAP.spotBetaPublicV2:
        case WS_KEY_MAP.derivativesPublicV1: {
          // Public WS - no auth
          this.logger.trace(
            `getWsAuthRequestEvent(${wsKey}): no auth required for public WS...`,
          );
          return;
        }

        case WS_KEY_MAP.derivativesPrivateV1: {
          // cleanup old challenge key (in case we were reconnected)
          this.wsChallengeCache.delete(wsKey);

          // https://docs.kraken.com/api/docs/futures-api/websocket/challenge/

          this.logger.trace(
            `getWsAuthRequestEvent(${wsKey}): preparing auth challenge request...`,
            { ...WS_LOGGER_CATEGORY, wsKey },
          );
          const challengeRequest = {
            event: 'challenge',
            api_key: this.options.apiKey,
          };

          return challengeRequest;
        }

        default: {
          throw neverGuard(wsKey, `Unhandled WsKey "${wsKey}"`);
        }
      }
    } catch (e: any) {
      this.logger.error(
        `getWsAuthRequestEvent(${wsKey}): Exception preparing auth request: `,
        {
          wsKey,
          eventToAuth,
          exception: e,
          exceptionBody: e?.body,
          stack: e?.stack,
        },
      );

      throw e;
    }
  }

  /**
   *
   * @param requestEvent
   * @returns A signed updated WS API request object, ready to be sent
   */
  private async signWSAPIRequest(
    requestEvent: WSAPIRequestOperationKrakenSpot,
  ): Promise<WSAPIRequestOperationKrakenSpot> {
    if (!this.options.apiSecret) {
      throw new Error('API Secret missing');
    }

    // Get token from REST client cache
    const tokenResult = await this.restClientCache.fetchSpotWebSocketToken(
      this.getRestClientOptions(),
      this.options.requestOptions,
    );

    if (!tokenResult?.token) {
      const error = new Error(
        `No WS auth token could be retrieved for private spot WS request for topic "${requestEvent.method}"`,
      );
      error.cause = tokenResult;
      throw error;
    }

    const authParams: Record<string, any> = {};
    if (tokenResult.token) {
      authParams.token = tokenResult.token;
    }
    if (requestEvent.method === 'add_order') {
      // authParams.broker = APIIDMain;
    }

    return {
      ...requestEvent,
      params: {
        ...requestEvent.params,
        ...authParams,
      },
    };
  }
}
