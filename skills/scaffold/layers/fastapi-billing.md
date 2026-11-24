# Billing layer (FastAPI)

Stripe subscriptions: Checkout to start one, and a webhook that keeps each customer's status current. It requires the `auth` layer.

## Adds

```
app/billing/router.py               BillingRouter: POST /billing/checkout (signed in), POST /billing/webhook
app/billing/stripe_gateway.py       StripeGateway: the only class that calls Stripe (async client)
app/billing/customer_table.py       billing_customers: user → Stripe customer, subscription status
app/billing/checkout/               Checkout, Customers (find or create, safe under concurrent requests)
app/billing/webhook/                Webhook, EventLog, EventHandlers, SubscriptionChanged
migrations/versions/0001_billing_tables.py
```

Checkout is REST even in a GraphQL API: it returns a Stripe redirect URL, and Stripe's webhook is REST anyway.

## How the webhook stays correct

- The signature is verified before anything else. A bad one gets a 400.
- Recording the event id and applying it happen in one transaction. A retried delivery hits the primary key and returns `duplicate`. If applying fails, the record rolls back, so Stripe's retry gets another chance.
- `EventHandlers` maps event types to handlers. Add a type by adding a row, not an `if`.

## Steps

1. If the request names prices or plans, set `STRIPE_PRICE_ID` in `.env` only when the user gave the ID. Never invent one.
2. Add a handler for each other event the request needs, as its own class in `app/billing/webhook/`, then add it to the `EventHandlers` table.

## Tell the user

- They need to add `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` to `.env`.
- To receive webhooks locally, run `stripe listen --forward-to localhost:8000/billing/webhook` and put the `whsec_...` secret it prints in `STRIPE_WEBHOOK_SECRET`.
