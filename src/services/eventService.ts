'use strict';

import { Api } from '../api/api';
import * as Types from '../types/Types';

interface EventResponse extends Types.Event, Types.APIResponse {}

interface EventListResponse extends Types.APIResponse {
  events: Types.Event[];
  meta: Types.ListMeta;
}

interface EventListRequest {
  // Limit to events with a given `action`.

  action?: string;

  // Cursor pointing to the start of the desired set.

  after?: string;

  // Cursor pointing to the end of the desired set.

  before?: string;

  // ID of a [billing request](#billing-requests-billing-requests). If specified,
  // this endpoint will return all events for the given billing request.

  billing_request?: string;

  // The creation date of this Event.
  created_at?: Types.CreatedAtFilter;

  // Includes linked resources in the response. Must be used with the
  // `resource_type` parameter specified. The include should be one of:
  // <ul>
  // <li>`payment`</li>
  // <li>`mandate`</li>
  // <li>`payer_authorisation`</li>
  // <li>`payout`</li>
  // <li>`refund`</li>
  // <li>`subscription`</li>
  // <li>`instalment_schedule`</li>
  // <li>`creditor`</li>
  // <li>`billing_request`</li>
  // </ul>

  include?: Types.EventInclude;

  // Number of records to return.

  limit?: string;

  // ID of a [mandate](#core-endpoints-mandates). If specified, this endpoint will
  // return all events for the given mandate.

  mandate?: string;

  // ID of an event. If specified, this endpoint will return all events whose
  // parent_event is the given event ID.

  parent_event?: string;

  // ID of a [payer authorisation](#core-endpoints-payer-authorisations).

  payer_authorisation?: string;

  // ID of a [payment](#core-endpoints-payments). If specified, this endpoint will
  // return all events for the given payment.

  payment?: string;

  // ID of a [payout](#core-endpoints-payouts). If specified, this endpoint will
  // return all events for the given payout.

  payout?: string;

  // ID of a [refund](#core-endpoints-refunds). If specified, this endpoint will
  // return all events for the given refund.

  refund?: string;

  // Type of resource that you'd like to get all events for. Cannot be used
  // together with the `payment`,    `payer_authorisation`, `mandate`,
  // `subscription`, `instalment_schedule`, `creditor`, `refund` or `payout`
  // parameter. The type can be one of:
  // <ul>
  // <li>`billing_requests`</li>
  // <li>`creditors`</li>
  // <li>`instalment_schedules`</li>
  // <li>`mandates`</li>
  // <li>`payer_authorisations`</li>
  // <li>`payments`</li>
  // <li>`payouts`</li>
  // <li>`refunds`</li>
  // <li>`subscriptions`</li>
  // </ul>

  resource_type?: Types.EventResourceType;

  // ID of a [subscription](#core-endpoints-subscriptions). If specified, this
  // endpoint will return all events for the given subscription.

  subscription?: string;
}

export class EventService {
  private api: Api;

  constructor(api) {
    this.api = api;
  }

  async list(requestParameters: EventListRequest): Promise<EventListResponse> {
    const urlParameters = [];
    const requestParams = {
      path: '/events',
      method: 'get',
      urlParameters,
      requestParameters,
      payloadKey: null,
      fetch: null,
    };

    const response = await this.api.request(requestParams);
    const formattedResponse: EventListResponse = {
      ...response.body,
      __response__: response.__response__,
    };

    return formattedResponse;
  }

  async *all(
    requestParameters: EventListRequest
  ): AsyncGenerator<Types.Event, void, unknown> {
    let cursor = undefined;
    do {
      const list = await this.list({ ...requestParameters, after: cursor });

      for (const event of list.events) {
        yield event;
      }

      cursor = list.meta.cursors.after;
    } while (cursor);
  }

  async find(identity: string): Promise<EventResponse> {
    const urlParameters = [{ key: 'identity', value: identity }];
    const requestParams = {
      path: '/events/:identity',
      method: 'get',
      urlParameters,

      payloadKey: null,
      fetch: null,
    };

    const response = await this.api.request(requestParams);
    const formattedResponse: EventResponse = {
      ...response.body['events'],
      __response__: response.__response__,
    };

    return formattedResponse;
  }
}
