"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type TrackItem = {
  product_id?: string;
  product_name?: string;
  product_image?: string;
  price?: number;
  quantity?: number;
};

type TrackOrder = {
  id: number;
  order_number?: string;
  status?: string;
  payment_status?: string;
  fulfillment_status?: string;
  total?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  tracking_carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  items?: TrackItem[];
};

const fulfillmentCopy: Record<string, string> = {
  unfulfilled: "Preparing",
  shipped: "In transit",
  delivered: "Delivered",
};

function money(amount?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function dateLabel(value?: string) {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function currentStep(order: TrackOrder) {
  if (order.fulfillment_status === "delivered" || order.status === "completed") return 4;
  if (order.fulfillment_status === "shipped" || order.status === "shipped" || order.tracking_number) return 3;
  if (order.payment_status === "paid" || order.status === "paid") return 2;
  return 0;
}

function buildSteps(order: TrackOrder) {
  return [
    {
      title: "Order received",
      text: "We have received your Nayo Smart order.",
      date: dateLabel(order.created_at),
    },
    {
      title: "Payment confirmed",
      text: "Stripe has confirmed the payment.",
      date: order.payment_status ? order.payment_status.toUpperCase() : "Pending",
    },
    {
      title: "Preparing to ship",
      text: "Your backpack is being checked and packed.",
      date: order.shipped_at ? dateLabel(order.shipped_at) : "Now",
    },
    {
      title: "In transit",
      text: "Tracking information is available once the parcel is handed to the carrier.",
      date: dateLabel(order.shipped_at),
    },
    {
      title: "Delivered",
      text: "The order has arrived at the destination.",
      date: dateLabel(order.delivered_at),
    },
  ];
}

export default function TrackLookup() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        order: orderNumber.trim(),
        email: email.trim(),
      });
      const response = await fetch(`/api/track?${params.toString()}`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "We could not find that order. Please check the order number and email.");
      }

      setOrder(data.order);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || "Tracking lookup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = order ? currentStep(order) : 0;
  const steps = order ? buildSteps(order) : [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="rounded-[34px] bg-[#F7F5F1] p-8 md:p-10">
          <p className="label mb-4 text-[#8A8A8A]">Order Tracking</p>
          <h1 className="font-display text-4xl font-light leading-tight text-[#1A1A1A] md:text-6xl">
            Follow your smart backpack from checkout to doorstep.
          </h1>
          <p className="mt-6 max-w-xl font-body text-[15px] leading-[1.9] text-[#76716B]">
            Enter the order number and email used at checkout. We only show shipping details after both match, so your order stays private.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div>
              <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A]">
                Order number
              </label>
              <input
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="N2601234567"
                required
                className="w-full rounded-none border border-[#E1DED8] bg-white px-5 py-4 font-body text-[15px] text-[#1A1A1A] outline-none transition-colors focus:border-[#C9A96E]"
              />
            </div>
            <div>
              <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-none border border-[#E1DED8] bg-white px-5 py-4 font-body text-[15px] text-[#1A1A1A] outline-none transition-colors focus:border-[#C9A96E]"
              />
            </div>
            {error ? (
              <p className="rounded-2xl bg-white px-4 py-3 font-body text-[14px] leading-[1.7] text-[#9B3A2F]">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] px-7 py-4 font-body text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#C9A96E] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Checking..." : "Find my order"}
            </button>
          </form>

          <p className="mt-7 font-body text-[13px] leading-[1.8] text-[#8A8A8A]">
            Need help locating your order number?{" "}
            <Link href="/contact" className="text-[#1A1A1A] underline underline-offset-4">
              Contact support
            </Link>
            .
          </p>
        </section>

        <section className="min-h-[520px] border border-[#E8E6E2] bg-white p-6 md:p-8">
          {!order ? (
            <div className="flex min-h-[460px] flex-col justify-between">
              <div>
                <p className="label mb-5 text-[#8A8A8A]">What you will see</p>
                <div className="space-y-4">
                  {["Payment confirmation", "Packing progress", "Carrier and tracking number", "Order items and total"].map((item) => (
                    <div key={item} className="flex items-center gap-4 border-b border-[#E8E6E2] pb-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#C9A96E]" />
                      <span className="font-body text-[15px] text-[#1A1A1A]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] bg-[#F7F5F1] p-7">
                <p className="font-display text-2xl font-light leading-tight text-[#1A1A1A]">
                  A calmer post-purchase experience, built directly into noreva.cc.
                </p>
                <p className="mt-4 font-body text-[14px] leading-[1.8] text-[#8A8A8A]">
                  No account required. No messy support thread. Just order number, email, and the latest fulfillment status.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-5 border-b border-[#E8E6E2] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="label mb-2 text-[#8A8A8A]">Order</p>
                  <h2 className="font-display text-3xl font-light text-[#1A1A1A]">
                    {order.order_number || `#${order.id}`}
                  </h2>
                  <p className="mt-2 font-body text-[14px] text-[#8A8A8A]">
                    Placed {dateLabel(order.created_at)} · {money(order.total, order.currency || "USD")}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-[#F7F5F1] px-4 py-2 font-body text-[12px] uppercase tracking-[0.16em] text-[#1A1A1A]">
                  {fulfillmentCopy[order.fulfillment_status || ""] || order.status || "Processing"}
                </span>
              </div>

              <div className="mt-8 space-y-6">
                {steps.map((step, index) => {
                  const active = index <= progress;
                  return (
                    <div key={step.title} className="grid grid-cols-[28px_1fr] gap-4">
                      <div className="flex flex-col items-center">
                        <span className={`mt-1 h-4 w-4 rounded-full border ${active ? "border-[#C9A96E] bg-[#C9A96E]" : "border-[#D6D1C8] bg-white"}`} />
                        {index < steps.length - 1 ? <span className={`mt-2 h-full w-px ${index < progress ? "bg-[#C9A96E]" : "bg-[#E8E6E2]"}`} /> : null}
                      </div>
                      <div className="pb-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-display text-xl font-light text-[#1A1A1A]">{step.title}</h3>
                          <span className="shrink-0 font-body text-[12px] text-[#8A8A8A]">{step.date}</span>
                        </div>
                        <p className="mt-1 font-body text-[14px] leading-[1.8] text-[#8A8A8A]">{step.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 rounded-[28px] bg-[#F7F5F1] p-6">
                <p className="label mb-4 text-[#8A8A8A]">Tracking</p>
                {order.tracking_number ? (
                  <div>
                    <p className="font-display text-2xl font-light text-[#1A1A1A]">
                      {order.tracking_carrier || "Carrier"} · {order.tracking_number}
                    </p>
                    {order.tracking_url ? (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex bg-[#1A1A1A] px-5 py-3 font-body text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C9A96E] hover:text-[#1A1A1A]"
                      >
                        Open carrier tracking
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <p className="font-body text-[14px] leading-[1.8] text-[#8A8A8A]">
                    Tracking will appear here as soon as the warehouse hands the parcel to the carrier.
                  </p>
                )}
              </div>

              {order.items && order.items.length > 0 ? (
                <div className="mt-8">
                  <p className="label mb-4 text-[#8A8A8A]">Items</p>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={`${item.product_id || item.product_name || "item"}-${index}`} className="flex gap-4 border-b border-[#E8E6E2] pb-4">
                        <div className="h-16 w-16 shrink-0 bg-[#F7F5F1]">
                          {item.product_image ? <img src={item.product_image} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-body text-[15px] text-[#1A1A1A]">{item.product_name || "Nayo Smart backpack"}</p>
                          <p className="mt-1 font-body text-[13px] text-[#8A8A8A]">
                            Qty {item.quantity || 1} · {money(item.price, order.currency || "USD")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
