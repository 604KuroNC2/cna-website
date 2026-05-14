import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata = { title: "Contact | CNA Lighting" };

export default function ContactPage() {
  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="CNA International Enterprises Inc. — Head Office in Burnaby, BC."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Head Office */}
        <div className="contact-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000080" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Head Office &amp; Vancouver Warehouse
          </h3>
          <p style={{ margin: "0.5rem 0 0 0", lineHeight: 1.7 }}>
            CNA International Enterprises Inc.<br />
            #8 – 8980 Fraserwood Court<br />
            Burnaby, BC, Canada V5J 5H7
          </p>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.9rem" }}>
            <span>
              <strong>Tel:</strong>{" "}
              <a href="tel:6044382862">604.438.2862</a>
            </span>
            <span>
              <strong>Toll Free:</strong>{" "}
              <a href="tel:18777722862">877.772.2862</a>
            </span>
            <span>
              <strong>Fax:</strong> 604.438.2972
            </span>
            <span>
              <strong>Toll Free Fax:</strong> 877.772.2972
            </span>
          </div>
        </div>

        {/* Office Hours */}
        <div className="contact-card">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000080" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            Office Hours — Burnaby
          </h3>
          <table style={{ marginTop: "0.5rem", marginBottom: 0, fontSize: "0.875rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.3rem 0.75rem 0.3rem 0", fontWeight: 600, whiteSpace: "nowrap" }}>Mon – Wed &amp; Fri</td>
                <td style={{ padding: "0.3rem 0" }}>9:00 AM – 4:30 PM</td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0.75rem 0.3rem 0", fontWeight: 600 }}>Thursday</td>
                <td style={{ padding: "0.3rem 0" }}>10:00 AM – 4:30 PM</td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0.75rem 0.3rem 0", fontWeight: 600 }}>Sat – Sun</td>
                <td style={{ padding: "0.3rem 0", color: "#9ca3af" }}>Closed</td>
              </tr>
            </tbody>
          </table>
          <h3 style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000080" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Warehouse — Pickups &amp; Deliveries
          </h3>
          <table style={{ marginTop: "0.5rem", marginBottom: 0, fontSize: "0.875rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.3rem 0.75rem 0.3rem 0", fontWeight: 600, whiteSpace: "nowrap" }}>Mon – Wed &amp; Fri</td>
                <td style={{ padding: "0.3rem 0" }}>9:00 AM – 4:00 PM</td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0.75rem 0.3rem 0", fontWeight: 600 }}>Thursday</td>
                <td style={{ padding: "0.3rem 0" }}>11:00 AM – 4:00 PM</td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0.75rem 0.3rem 0", fontWeight: 600 }}>Sat – Sun</td>
                <td style={{ padding: "0.3rem 0", color: "#9ca3af" }}>Closed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Additional Warehouse Locations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <div className="contact-card">
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>Bulk Orders — Western Canada</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
            AVP Carriers Ltd.<br />
            9445 189 Street<br />
            Surrey, BC V4N 5L8
          </p>
        </div>
        <div className="contact-card">
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>Central Canada Distribution</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
            QRC Logistics<br />
            8020 Fifth Line N<br />
            Halton Hills, ON L7G 0B8
          </p>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "2rem" }}>
        <p>
          CNA sells exclusively through authorized distributors and electrical wholesalers.
          If you are an end customer, please <a href="/faq">see our FAQ</a> to locate your nearest distributor.
        </p>
      </div>
    </InfoPageLayout>
  );
}
