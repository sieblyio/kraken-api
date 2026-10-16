/**
 * Used to switch how authentication/requests work under the hood
 */
export const REST_CLIENT_TYPE_ENUM = {
  /** Spot */
  main: 'main',
  /** Futures */
  derivatives: 'derivatives',
  /** Institutional */
  institutional: 'institutional',
  /** Partner */
  partner: 'partner',
  /** Affiliate reporting */
  affiliate: 'affiliate',
} as const;

export type RestClientType =
  (typeof REST_CLIENT_TYPE_ENUM)[keyof typeof REST_CLIENT_TYPE_ENUM];

const krakenURLMap = {
  [REST_CLIENT_TYPE_ENUM.main]: 'https://api.kraken.com',
  [REST_CLIENT_TYPE_ENUM.derivatives]: 'https://futures.kraken.com',
  [REST_CLIENT_TYPE_ENUM.institutional]: 'https://api.kraken.com',
  [REST_CLIENT_TYPE_ENUM.partner]: 'https://embed.kraken.com',
  [REST_CLIENT_TYPE_ENUM.affiliate]: 'https://api.kraken.com',
} as const;

/**
 * Kraken decommissioned demo-futures.kraken.com at 13:00 UTC on 14 July 2026.
 * No replacement demo host exists, and Spot never had a testnet.
 */
export const KRAKEN_FUTURES_TESTNET_RETIRED_ERROR =
  'Kraken retired its Futures demo (testnet) environment on 14 July 2026, so testnet is no longer available. See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives';

export interface RestClientOptions {
  /** Your API key */
  apiKey?: string;

  /** Your API secret */
  apiSecret?: string;

  /**
   * Kraken retired the Futures demo (testnet) environment on 14 July 2026.
   * There is no replacement demo host, and Spot never had a testnet.
   *
   * Setting this to `true` throws. The live environment is used when it is omitted or `false`.
   *
   * See https://support.kraken.com/articles/360024809011-api-testing-environment-derivatives
   */
  testnet?: boolean;

  /**
   * Use access token instead of sign, if this is provided.
   * For guidance refer to: https://github.com/tiagosiebler/kucoin-api/issues/2
   */
  apiAccessToken?: string;

  /** Default: false. If true, we'll throw errors if any params are undefined */
  strictParamValidation?: boolean;

  /**
   * Optionally override API protocol + domain
   * e.g baseUrl: 'https://api.kraken.com'
   **/
  baseUrl?: string;

  /** Default: true. whether to try and post-process request exceptions (and throw them). */
  parseExceptions?: boolean;

  customTimestampFn?: () => number;

  /**
   * Enable keep alive for REST API requests (via axios).
   */
  keepAlive?: boolean;

  /**
   * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets being kept alive. Default = 1000.
   * Only relevant if keepAlive is set to true.
   * Default: 1000 (defaults comes from https agent)
   */
  keepAliveMsecs?: number;

  /**
   * Allows you to provide a custom "signMessage" function, e.g. to use node's much faster createHmac method
   *
   * Look in the examples folder for a demonstration on using node's createHmac instead.
   */
  customSignMessageFn?: (message: string, secret: string) => Promise<string>;
}

export function serializeParams<T extends Record<string, any> | undefined = {}>(
  params: T,
  strict_validation: boolean | undefined,
  encodeValues: boolean,
  prefixWith: string,
  repeatArrayValuesAsKVPairs: boolean,
): string {
  if (!params) {
    return '';
  }

  const queryString = Object.keys(params)
    .sort()
    .map((key) => {
      const value = params[key];
      if (strict_validation === true && typeof value === 'undefined') {
        throw new Error(
          'Failed to sign API request due to undefined parameter',
        );
      }

      if (repeatArrayValuesAsKVPairs && Array.isArray(value)) {
        const values = value.map((subValue) => {
          const encodedValue = encodeValues
            ? encodeURIComponent(subValue)
            : subValue;
          return `${key}=${encodedValue}`;
        });

        return values.join('&');
      }
      const encodedValue = encodeValues ? encodeURIComponent(value) : value;
      return `${key}=${encodedValue}`;
    })
    .join('&');

  // Only prefix if there's a value
  return queryString ? prefixWith + queryString : queryString;
}

export const APIIDMainKey = 'broker';
export const APIIDMain = 'AA56 N84G TOOP ELJQ';

export function isEmptyObject(obj: any, acceptStringIfNotEmpty: boolean) {
  if (obj && acceptStringIfNotEmpty && typeof obj === 'string') {
    return false;
  }
  if (!obj || typeof obj !== 'object') {
    return true;
  }
  for (const _i in obj) {
    return false;
  }
  return true;
}

export function getRestBaseUrl(
  restClientOptions: RestClientOptions,
  restClientType: RestClientType,
): string {
  if (restClientOptions.testnet) {
    throw new Error(KRAKEN_FUTURES_TESTNET_RETIRED_ERROR);
  }

  if (restClientOptions.baseUrl) {
    return restClientOptions.baseUrl;
  }

  return krakenURLMap[restClientType];
}
