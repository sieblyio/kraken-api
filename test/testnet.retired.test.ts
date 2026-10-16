import {
  DerivativesClient,
  SpotClient,
  WebsocketClient,
} from '../src/index.js';
import {
  getRestBaseUrl,
  KRAKEN_FUTURES_TESTNET_RETIRED_ERROR,
  REST_CLIENT_TYPE_ENUM,
} from '../src/lib/requestUtils.js';
import { WS_KEY_MAP, WsKey } from '../src/lib/websocket/websocket-util.js';

class WsUrlProbe extends WebsocketClient {
  public resolveUrl(wsKey: WsKey): Promise<string> {
    return this.getWsUrl(wsKey);
  }
}

describe('retired Futures demo (testnet)', () => {
  it('throws for REST when testnet is true', () => {
    expect(() =>
      getRestBaseUrl({ testnet: true }, REST_CLIENT_TYPE_ENUM.derivatives),
    ).toThrow(KRAKEN_FUTURES_TESTNET_RETIRED_ERROR);

    expect(() =>
      getRestBaseUrl({ testnet: true }, REST_CLIENT_TYPE_ENUM.main),
    ).toThrow(KRAKEN_FUTURES_TESTNET_RETIRED_ERROR);

    expect(() => new DerivativesClient({ testnet: true })).toThrow(
      KRAKEN_FUTURES_TESTNET_RETIRED_ERROR,
    );

    expect(() => new SpotClient({ testnet: true })).toThrow(
      KRAKEN_FUTURES_TESTNET_RETIRED_ERROR,
    );
  });

  it('keeps the live REST host when testnet is omitted', () => {
    expect(getRestBaseUrl({}, REST_CLIENT_TYPE_ENUM.derivatives)).toBe(
      'https://futures.kraken.com',
    );

    expect(getRestBaseUrl({}, REST_CLIENT_TYPE_ENUM.main)).toBe(
      'https://api.kraken.com',
    );

    expect(() => new DerivativesClient()).not.toThrow();
  });

  it('throws for WebSocket when testnet is true', async () => {
    const client = new WsUrlProbe({ testnet: true });

    await expect(
      client.resolveUrl(WS_KEY_MAP.derivativesPublicV1),
    ).rejects.toThrow(KRAKEN_FUTURES_TESTNET_RETIRED_ERROR);

    await expect(
      client.resolveUrl(WS_KEY_MAP.derivativesPrivateV1),
    ).rejects.toThrow(KRAKEN_FUTURES_TESTNET_RETIRED_ERROR);

    await expect(client.resolveUrl(WS_KEY_MAP.spotPublicV2)).rejects.toThrow(
      KRAKEN_FUTURES_TESTNET_RETIRED_ERROR,
    );
  });

  it('keeps the live WebSocket hosts when testnet is omitted', async () => {
    const client = new WsUrlProbe();

    await expect(
      client.resolveUrl(WS_KEY_MAP.derivativesPublicV1),
    ).resolves.toBe('wss://futures.kraken.com/ws/v1');

    await expect(client.resolveUrl(WS_KEY_MAP.spotPublicV2)).resolves.toBe(
      'wss://ws.kraken.com/v2',
    );
  });
});
