import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// Shared style tokens, matching DashboardClone.jsx
const card = "rounded-3xl border border-white/[0.06] bg-[#100c14] p-6";
const label = "mb-1.5 block text-[12px] font-medium text-white/45";
const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white placeholder-white/25 outline-none transition focus:border-white/30";
const sectionTitle = "mb-5 text-[19px] font-semibold";

export default function CreateInvoice() {
  const navigate = useNavigate();

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    currency: "NGN",
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0 },
  ]);

  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount - discount;

  const currencySymbol =
    { NGN: "₦", USD: "$", EUR: "€", GBP: "£" }[invoiceMeta.currency] || "";

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () =>
    setItems((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      client,
      invoiceMeta,
      items,
      taxPercent,
      discount,
      notes,
      terms,
      paymentDetails,
      subtotal,
      taxAmount,
      total,
    };
    // TODO: send this payload to your backend / storage / email service
    console.log("Invoice payload:", payload);
  };

  return (
    <div
      className="min-h-screen w-full overflow-y-auto text-white"
      style={{ background: "#08080a", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[880px] px-6 py-8 sm:px-8">
        {/* header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight">Create Invoice</h1>
            <p className="mt-0.5 text-[13px] text-white/40">
              Fill in the details below and send it off to your client.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ---------------- Client details ---------------- */}
          <section className={card}>
            <h2 className={sectionTitle}>Client Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Client name</label>
                <input
                  className={input}
                  placeholder="Adaeze & Co."
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Client email</label>
                <input
                  type="email"
                  className={input}
                  placeholder="client@email.com"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Client phone</label>
                <input
                  className={input}
                  placeholder="+234..."
                  value={client.phone}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Client address</label>
                <input
                  className={input}
                  placeholder="Street, city, state"
                  value={client.address}
                  onChange={(e) => setClient({ ...client, address: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* ---------------- Invoice meta ---------------- */}
          <section className={card}>
            <h2 className={sectionTitle}>Invoice Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={label}>Invoice number</label>
                <input
                  className={input}
                  placeholder="INV-0001"
                  value={invoiceMeta.invoiceNumber}
                  onChange={(e) =>
                    setInvoiceMeta({ ...invoiceMeta, invoiceNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Issue date</label>
                <input
                  type="date"
                  className={`${input} [color-scheme:dark]`}
                  value={invoiceMeta.issueDate}
                  onChange={(e) =>
                    setInvoiceMeta({ ...invoiceMeta, issueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Due date</label>
                <input
                  type="date"
                  className={`${input} [color-scheme:dark]`}
                  value={invoiceMeta.dueDate}
                  onChange={(e) =>
                    setInvoiceMeta({ ...invoiceMeta, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Currency</label>
                <select
                  className={`${input} [color-scheme:dark]`}
                  value={invoiceMeta.currency}
                  onChange={(e) =>
                    setInvoiceMeta({ ...invoiceMeta, currency: e.target.value })
                  }
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </section>

          {/* ---------------- Line items ---------------- */}
          <section className={card}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[19px] font-semibold">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-white to-white/80 px-4 py-2 text-[12px] font-medium text-black"
              >
                <Plus size={14} /> Add item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 items-end gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:grid-cols-[1fr_90px_120px_120px_36px]"
                >
                  <div>
                    <label className={label}>Description</label>
                    <input
                      className={input}
                      placeholder="Website design & build"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={label}>Qty</label>
                    <input
                      type="number"
                      min="0"
                      className={input}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={label}>Rate</label>
                    <input
                      type="number"
                      min="0"
                      className={input}
                      value={item.rate}
                      onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={label}>Amount</label>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[14px] font-medium tabular-nums text-white/80">
                      {currencySymbol}
                      {(item.quantity * item.rate).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/40 transition hover:text-rose-400 disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Totals ---------------- */}
          <section className={card}>
            <h2 className={sectionTitle}>Totals</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Tax (%)</label>
                <input
                  type="number"
                  min="0"
                  className={input}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                />
              </div>
              <div>
                <label className={label}>Discount (flat amount)</label>
                <input
                  type="number"
                  min="0"
                  className={input}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
              <div className="flex justify-between text-[13px] text-white/50">
                <span>Subtotal</span>
                <span className="tabular-nums text-white/80">
                  {currencySymbol}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[13px] text-white/50">
                <span>Tax</span>
                <span className="tabular-nums text-white/80">
                  {currencySymbol}
                  {taxAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[13px] text-white/50">
                <span>Discount</span>
                <span className="tabular-nums text-white/80">
                  -{currencySymbol}
                  {discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-3 text-[16px] font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {currencySymbol}
                  {total.toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          {/* ---------------- Payment details ---------------- */}
          <section className={card}>
            <h2 className={sectionTitle}>Payment Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>Bank name</label>
                <input
                  className={input}
                  value={paymentDetails.bankName}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, bankName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Account name</label>
                <input
                  className={input}
                  value={paymentDetails.accountName}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, accountName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Account number</label>
                <input
                  className={input}
                  value={paymentDetails.accountNumber}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* ---------------- Notes / terms ---------------- */}
          <section className={card}>
            <h2 className={sectionTitle}>Notes & Terms</h2>
            <div className="space-y-4">
              <div>
                <label className={label}>Notes (visible to client)</label>
                <textarea
                  rows={3}
                  className={`${input} resize-none`}
                  placeholder="Thank you for your business!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Terms & conditions</label>
                <textarea
                  rows={3}
                  className={`${input} resize-none`}
                  placeholder="Payment due within 7 days..."
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ---------------- Actions ---------------- */}
          <div className="flex flex-wrap justify-end gap-3 pb-8">
            <button
              type="button"
              className="rounded-full border border-white/10 px-5 py-2.5 text-[13px] font-medium text-white/70 transition hover:text-white"
            >
              Preview
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 px-5 py-2.5 text-[13px] font-medium text-white/70 transition hover:text-white"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-white to-white/80 px-6 py-2.5 text-[13px] font-medium text-black"
            >
              Send Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}