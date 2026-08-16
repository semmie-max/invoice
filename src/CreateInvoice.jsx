import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Bare-bones Create Invoice page.
// Everything below is grouped by section so you can restyle/rearrange freely.
// Swap out the plain <input>/<div> markup for your own design.

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
    // TODO: send this payload to your backend / storage / email service
    const payload = { client, invoiceMeta, items, taxPercent, discount, notes, terms, paymentDetails, subtotal, taxAmount, total };
    console.log("Invoice payload:", payload);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate("/")}>&larr; Back to Dashboard</button>

      <h1>Create Invoice</h1>

      <form onSubmit={handleSubmit}>
        {/* ---------------- Client details ---------------- */}
        <section>
          <h2>Client Details</h2>
          <label>
            Client name
            <input
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
          </label>
          <label>
            Client email
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
            />
          </label>
          <label>
            Client phone
            <input
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
            />
          </label>
          <label>
            Client address
            <textarea
              value={client.address}
              onChange={(e) => setClient({ ...client, address: e.target.value })}
            />
          </label>
        </section>

        {/* ---------------- Invoice meta ---------------- */}
        <section>
          <h2>Invoice Details</h2>
          <label>
            Invoice number
            <input
              value={invoiceMeta.invoiceNumber}
              onChange={(e) =>
                setInvoiceMeta({ ...invoiceMeta, invoiceNumber: e.target.value })
              }
            />
          </label>
          <label>
            Issue date
            <input
              type="date"
              value={invoiceMeta.issueDate}
              onChange={(e) =>
                setInvoiceMeta({ ...invoiceMeta, issueDate: e.target.value })
              }
            />
          </label>
          <label>
            Due date
            <input
              type="date"
              value={invoiceMeta.dueDate}
              onChange={(e) =>
                setInvoiceMeta({ ...invoiceMeta, dueDate: e.target.value })
              }
            />
          </label>
          <label>
            Currency
            <select
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
          </label>
        </section>

        {/* ---------------- Line items ---------------- */}
        <section>
          <h2>Items</h2>
          {items.map((item, index) => (
            <div key={index}>
              <label>
                Description
                <input
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                />
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                />
              </label>
              <label>
                Rate
                <input
                  type="number"
                  min="0"
                  value={item.rate}
                  onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                />
              </label>
              <span>Amount: {(item.quantity * item.rate).toLocaleString()}</span>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem}>
            + Add item
          </button>
        </section>

        {/* ---------------- Tax / discount / totals ---------------- */}
        <section>
          <h2>Totals</h2>
          <label>
            Tax (%)
            <input
              type="number"
              min="0"
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value))}
            />
          </label>
          <label>
            Discount (flat amount)
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </label>
          <div>Subtotal: {subtotal.toLocaleString()}</div>
          <div>Tax amount: {taxAmount.toLocaleString()}</div>
          <div>
            <strong>Total: {total.toLocaleString()}</strong>
          </div>
        </section>

        {/* ---------------- Payment details ---------------- */}
        <section>
          <h2>Payment Details</h2>
          <label>
            Bank name
            <input
              value={paymentDetails.bankName}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, bankName: e.target.value })
              }
            />
          </label>
          <label>
            Account name
            <input
              value={paymentDetails.accountName}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, accountName: e.target.value })
              }
            />
          </label>
          <label>
            Account number
            <input
              value={paymentDetails.accountNumber}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
              }
            />
          </label>
        </section>

        {/* ---------------- Notes / terms ---------------- */}
        <section>
          <h2>Notes & Terms</h2>
          <label>
            Notes (visible to client)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label>
            Terms & conditions
            <textarea value={terms} onChange={(e) => setTerms(e.target.value)} />
          </label>
        </section>

        {/* ---------------- Actions ---------------- */}
        <section>
          <button type="button">Save as Draft</button>
          <button type="submit">Send Invoice</button>
          <button type="button">Preview</button>
        </section>
      </form>
    </div>
  );
}