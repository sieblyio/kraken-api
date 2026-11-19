import {
  WebsocketAPIClient,
  WebsocketClient,
  WSAPIAddUnifiedOrderParams,
  WSAPIBatchAddUnifiedOrdersParams,
} from '../../src/index.js';

// Compile-only public API checks. This function is never called.
export async function unifiedWsApiTypes(
  ws: WebsocketClient,
  api: WebsocketAPIClient,
) {
  const spotOrder = {
    asset_class: 'spot',
    order_type: 'limit',
    side: 'buy',
    symbol: 'BTC/USD',
    order_qty: 0.001,
    limit_price: 10000,
    validate: true,
  } satisfies WSAPIAddUnifiedOrderParams;
  const derivativesOrder = {
    ...spotOrder,
    asset_class: 'derivatives',
    reduce_only: true,
    symbol: 'PF_XBTUSD',
  } satisfies WSAPIAddUnifiedOrderParams;
  const added = await ws.sendWSAPIRequest(
    'unifiedPrivateV2',
    'add_order',
    spotOrder,
  );
  const key: 'unifiedPrivateV2' = added.wsKey;
  const method: 'add_order' = added.method;
  const orderId: string = added.result.order_id;
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'add_order', derivativesOrder);
  await api.submitUnifiedOrder(spotOrder);
  await api.submitUnifiedOrder(derivativesOrder);
  await api.amendUnifiedOrder({
    asset_class: 'spot',
    order_id: orderId,
    limit_price: 9000,
  });
  const amended = await ws.sendWSAPIRequest('unifiedPrivateV2', 'amend_order', {
    asset_class: 'derivatives',
    cl_ord_id: 'example-id',
    limit_price: 9000,
  });
  const amendId: string = amended.result.amend_id;
  await api.cancelUnifiedOrder({ asset_class: 'spot', order_userref: [1] });
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'cancel_order', {
    asset_class: 'derivatives',
    order_id: [orderId],
  });
  const cancelled = await api.cancelAllUnifiedOrders({ asset_class: 'spot' });
  const count: number = cancelled.result.count;
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'cancel_all', {
    asset_class: 'spot',
  });
  await api.cancelAllUnifiedOrdersAfter({ asset_class: 'spot', timeout: 60 });
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'cancel_all_orders_after', {
    asset_class: 'derivatives',
    timeout: 60,
  });
  const batch = {
    asset_class: 'spot',
    symbol: 'BTC/USD',
    validate: true,
    orders: [
      { order_type: 'limit', side: 'buy', order_qty: 0.001, limit_price: 9000 },
    ],
  } satisfies WSAPIBatchAddUnifiedOrdersParams;
  const batched = await api.batchSubmitUnifiedOrders(batch);
  const batchId: string = batched.result[0].order_id;
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'batch_add', batch);
  await api.batchCancelUnifiedOrders({
    asset_class: 'spot',
    cl_ord_id: ['one', 'two'],
  });
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'batch_cancel', {
    asset_class: 'spot',
    orders: ['one'],
    cl_ord_id: ['two'],
  });
  const preference = await api.setUnifiedPreference({
    asset_class: 'derivatives',
    leverage_mode: { symbol: 'PF_XBTUSD', max_leverage: null },
  });
  const leverage: number | null = preference.result.leverage_mode.max_leverage;
  await ws.sendWSAPIRequest('unifiedPrivateV2', 'set_preference', {
    asset_class: 'derivatives',
    leverage_mode: { symbol: 'PF_XBTUSD', max_leverage: 5 },
  });
  await ws.connectWSAPI('unifiedPrivateV2');
  await api.connectWSAPI('unifiedPrivateV2');

  // Existing Spot and beta calls retain their API and response types.
  const legacy = await ws.sendWSAPIRequest('spotPrivateV2', 'cancel_all');
  const legacyKey: 'spotPrivateV2' | 'spotBetaPrivateV2' = legacy.wsKey;
  await api.cancelAllSpotOrders();
  await api.cancelAllSpotOrders('spotBetaPrivateV2');
  await api.submitSpotOrder(spotOrder, 'spotBetaPrivateV2');
  await api.editSpotOrder({
    order_id: orderId,
    symbol: 'BTC/USD',
    limit_price: 9000,
  });

  // @ts-expect-error Unified cancel_all requires an explicit asset class.
  ws.sendWSAPIRequest('unifiedPrivateV2', 'cancel_all');
  // @ts-expect-error Trading is not available on the unified public connection.
  ws.sendWSAPIRequest('unifiedPublicV2', 'add_order', spotOrder);
  // @ts-expect-error Legacy edit_order is not a unified command.
  ws.sendWSAPIRequest('unifiedPrivateV2', 'edit_order', {});
  // @ts-expect-error Preferences are not available on the legacy Spot WS API.
  ws.sendWSAPIRequest('spotPrivateV2', 'set_preference', {});
  // @ts-expect-error Spot-only helpers must not route incomplete requests to unified.
  api.cancelAllSpotOrders('unifiedPrivateV2');
  const { asset_class, ...withoutAssetClass } = spotOrder;
  // @ts-expect-error Unified orders require asset_class.
  api.submitUnifiedOrder(withoutAssetClass);
  // @ts-expect-error Raw unified orders also require asset_class.
  ws.sendWSAPIRequest('unifiedPrivateV2', 'add_order', withoutAssetClass);
  const invalidMargin = { ...derivativesOrder, margin: true };
  // @ts-expect-error Derivatives do not accept the Spot margin flag.
  api.submitUnifiedOrder(invalidMargin);
  // @ts-expect-error Raw requests enforce the same derivatives restrictions.
  ws.sendWSAPIRequest('unifiedPrivateV2', 'add_order', invalidMargin);
  const invalidIdentifier = {
    asset_class: 'derivatives' as const,
    order_userref: [1],
  };
  // @ts-expect-error Derivatives cancellation does not support order_userref.
  api.cancelUnifiedOrder(invalidIdentifier);
  const mixedIdentifiers = {
    asset_class: 'spot' as const,
    order_id: ['one'],
    cl_ord_id: ['two'],
  };
  // @ts-expect-error cancel_order identifier types cannot be combined.
  api.cancelUnifiedOrder(mixedIdentifiers);
  // @ts-expect-error An amend requires an order or client identifier.
  api.amendUnifiedOrder({ asset_class: 'spot', limit_price: 9000 });
  const spotPreference = {
    asset_class: 'spot' as const,
    leverage_mode: { symbol: 'BTC/USD', max_leverage: 5 },
  };
  // @ts-expect-error leverage_mode is derivatives-only.
  api.setUnifiedPreference(spotPreference);
  const missingLeverage = {
    asset_class: 'derivatives' as const,
    leverage_mode: { symbol: 'PF_XBTUSD' },
  };
  // @ts-expect-error Cross margin requires an explicit null max_leverage.
  api.setUnifiedPreference(missingLeverage);
  const conditionalBatch = {
    ...batch,
    orders: [
      { ...batch.orders[0], conditional: { order_type: 'stop-loss' as const } },
    ],
  };
  // @ts-expect-error Conditional close orders are unsupported in batches.
  api.batchSubmitUnifiedOrders(conditionalBatch);
  // @ts-expect-error Preference results do not contain an order identifier.
  const wrongResult: string = preference.result.order_id;
  return { key, method, orderId, amendId, count, batchId, leverage, legacyKey };
}
