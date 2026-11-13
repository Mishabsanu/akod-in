"use client";

import { CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { cartOrderMessage, deliveryFee, FREE_DELIVERY_ABOVE, whatsappLink, type DeliveryAddress } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";
import { WhatsAppIcon } from "./WhatsApp";

const STATES = [
  "Kerala", "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const ADDRESS_KEY = "akod-address-v1";
const EMPTY: DeliveryAddress = { name: "", phone: "", address: "", landmark: "", city: "", district: "", state: "Kerala", pincode: "", note: "" };

type Errors = Partial<Record<keyof DeliveryAddress, string>>;

function validate(a: DeliveryAddress): Errors {
  const e: Errors = {};
  if (a.name.trim().length < 2) e.name = "Enter your name";
  if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""))) e.phone = "Enter a 10-digit mobile number";
  if (a.address.trim().length < 6) e.address = "Enter house / building, street and area";
  if (a.city.trim().length < 2) e.city = "Enter city / town";
  if (a.district.trim().length < 2) e.district = "Enter your district";
  if (!a.state) e.state = "Choose a state";
  if (!/^[1-9]\d{5}$/.test(a.pincode.trim())) e.pincode = "Enter a 6-digit PIN code";
  return e;
}

const input =
  "w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900";

function Field({
  label,
  error,
  required,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-neutral-700">
        {label}
        {required && <span className="text-neutral-400"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

/** Cart + delivery address; "Send order on WhatsApp" opens WhatsApp with everything filled in. */
export default function CheckoutView() {
  const { items, count, subtotal, setQty, remove, clear } = useCart();
  const [a, setA] = useState<DeliveryAddress>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  /** Order number from AKOD ECO (empty if saving failed; the WhatsApp order still goes through) */
  const [orderNo, setOrderNo] = useState("");

  // Remember the address for next time
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADDRESS_KEY);
      if (raw) setA({ ...EMPTY, ...JSON.parse(raw), note: "" });
    } catch {}
  }, []);

  const set = (k: keyof DeliveryAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setA((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const errs = validate(a);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    const clean = { ...a, phone: a.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "") };
    try {
      const { note, ...keep } = clean;
      void note;
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(keep));
    } catch {}
    // Open the WhatsApp tab now (in the tap) so phones don't block it; point it at WhatsApp once saved
    const tab = window.open("", "_blank");
    setSending(true);
    let no = "";
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), customer: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.orderNo) no = String(data.orderNo);
      else console.warn("[order] not saved:", data.error ?? res.status);
    } catch (err) {
      console.warn("[order] not saved:", err);
    }
    const link = whatsappLink(cartOrderMessage(items, clean, no || undefined));
    if (tab && !tab.closed) {
      tab.opener = null;
      tab.location.href = link;
    } else {
      window.location.href = link;
    }
    setOrderNo(no);
    setSending(false);
    setSent(true);
  };

  const border = (k: keyof DeliveryAddress) => (errors[k] ? "border-red-400" : "border-neutral-300");
  const fee = deliveryFee(subtotal);
  const freeDelivery = fee === 0;

  if (sent) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
        <CheckCircle2 className="h-14 w-14 text-neutral-900" strokeWidth={1.4} />
        <h1 className="mt-5 text-2xl font-light tracking-tight">Almost done!</h1>
        <p className="mt-2 text-neutral-500">
          WhatsApp has opened with your order. Tap <b className="text-neutral-900">Send</b> there, and we&apos;ll confirm the total and delivery
          time.
        </p>
        {orderNo && (
          <p className="mt-4 rounded-full bg-neutral-100 px-4 py-1.5 text-sm">
            Your order no: <b className="font-semibold text-neutral-900">{orderNo}</b>
          </p>
        )}
        <div className="mt-8 flex w-full flex-col gap-3">
          <a
            href={whatsappLink(cartOrderMessage(items, a, orderNo || undefined))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-900 text-sm font-medium"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp didn&apos;t open? Try again
          </a>
          <button
            onClick={() => {
              clear();
              setSent(false);
            }}
            className="h-12 rounded-full bg-neutral-900 text-sm font-medium text-white"
          >
            Done – clear my cart
          </button>
          <Link href="/" className="text-sm text-neutral-500 underline-offset-4 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <h1 className="mt-5 text-2xl font-light tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-neutral-500">Add your favourite Kerala snacks, then order here in one go.</p>
        <Link href="/" className="mt-8 rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-12 lg:px-10 lg:py-12">
      {/* Address */}
      <section>
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Delivery details</h1>
        <p className="mt-1 text-sm text-neutral-500">We&apos;ll send your order and address to AKOD on WhatsApp.</p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name}>
            <input name="name" value={a.name} onChange={set("name")} autoComplete="name" className={`${input} ${border("name")}`} />
          </Field>
          <Field label="Mobile number" required error={errors.phone}>
            <input
              name="phone"
              value={a.phone}
              onChange={set("phone")}
              inputMode="tel"
              autoComplete="tel"
              placeholder="10-digit mobile"
              className={`${input} ${border("phone")}`}
            />
          </Field>
          <Field label="House / building, street, area" required error={errors.address} className="sm:col-span-2">
            <textarea
              name="address"
              value={a.address}
              onChange={set("address")}
              rows={2}
              autoComplete="street-address"
              className={`${input} ${border("address")} resize-none`}
            />
          </Field>
          <Field label="Landmark">
            <input name="landmark" value={a.landmark} onChange={set("landmark")} placeholder="Optional" className={`${input} border-neutral-300`} />
          </Field>
          <Field label="City / town" required error={errors.city}>
            <input name="city" value={a.city} onChange={set("city")} autoComplete="address-level2" className={`${input} ${border("city")}`} />
          </Field>
          <Field label="District" required error={errors.district}>
            <input name="district" value={a.district} onChange={set("district")} autoComplete="address-level3" className={`${input} ${border("district")}`} />
          </Field>
          <Field label="PIN code" required error={errors.pincode}>
            <input
              name="pincode"
              value={a.pincode}
              onChange={set("pincode")}
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              className={`${input} ${border("pincode")}`}
            />
          </Field>
          <Field label="State" required error={errors.state} className="sm:col-span-2">
            <select name="state" value={a.state} onChange={set("state")} autoComplete="address-level1" className={`${input} ${border("state")}`}>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Note for us" className="sm:col-span-2">
            <textarea
              name="note"
              value={a.note}
              onChange={set("note")}
              rows={2}
              placeholder="Optional – e.g. preferred delivery time, gift message"
              className={`${input} border-neutral-300 resize-none`}
            />
          </Field>
        </div>
      </section>

      {/* Order summary */}
      <aside className="h-fit rounded-2xl border border-neutral-200 bg-[#f6f6f6] p-5 sm:p-6 lg:sticky lg:top-32">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-medium text-neutral-900">Your order</h2>
          <span className="text-sm text-neutral-500">
            {count} item{count === 1 ? "" : "s"}
          </span>
        </div>

        <ul className="mt-4 divide-y divide-neutral-200">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 py-3">
              <ProductImage product={i} className="h-16 w-14 shrink-0 rounded-md bg-white" sizes="56px" mini />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <p className="line-clamp-2 text-sm text-neutral-900">{i.name}</p>
                  <p className="shrink-0 text-sm">{formatPrice(i.price * i.qty)}</p>
                </div>
                <p className="text-xs text-neutral-500">{i.variant}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-neutral-300 bg-white">
                    <button type="button" onClick={() => setQty(i.id, i.qty - 1)} className="p-1.5" aria-label="One less">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-6 text-center text-xs">{i.qty}</span>
                    <button type="button" onClick={() => setQty(i.id, i.qty + 1)} className="p-1.5" aria-label="One more">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button type="button" onClick={() => remove(i.id)} className="text-neutral-400 hover:text-neutral-900" aria-label={`Remove ${i.name}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Delivery</dt>
            <dd>{freeDelivery ? "Free" : formatPrice(fee)}</dd>
          </div>
          {!freeDelivery && (
            <p className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Truck className="h-3.5 w-3.5" /> Add {formatPrice(FREE_DELIVERY_ABOVE - subtotal)} more for free delivery
            </p>
          )}
          <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + fee)}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={sending}
          className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,211,102,0.8)] transition hover:brightness-95"
        >
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <WhatsAppIcon className="h-5 w-5" />}
          {sending ? "Placing your order…" : "Send order on WhatsApp"}
        </button>
        <p className="mt-3 text-center text-xs text-neutral-500">We confirm availability and delivery time on WhatsApp. No payment here.</p>
      </aside>
    </form>
  );
}
