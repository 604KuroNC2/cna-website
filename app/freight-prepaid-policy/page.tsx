import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata = { title: "Freight Prepaid Policy | CNA Lighting" };

export default function FreightPrepaidPolicyPage() {
  return (
    <InfoPageLayout
      title="Freight Prepaid Policy"
      subtitle="Prepaid freight thresholds and estimated delivery times from our Canadian warehouses."
    >
      <div className="info-box">
        <p>
          Prepaid freight is subject to stock availability. Contact us for details on special orders or orders outside standard coverage areas.
        </p>
      </div>

      <h2>Domestic Shipments — Vancouver Warehouse</h2>
      <p><strong>Minimum Order:</strong> $50.00</p>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Prepaid Freight Threshold</th>
            <th>Estimated Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Greater Vancouver</td>
            <td>$350+</td>
            <td>1–2 business days</td>
          </tr>
          <tr>
            <td>British Columbia</td>
            <td>$500+</td>
            <td>1–2 business days</td>
          </tr>
          <tr>
            <td>Alberta</td>
            <td>$750+</td>
            <td>1–2 business days</td>
          </tr>
          <tr>
            <td>Saskatchewan</td>
            <td>$750+</td>
            <td>2–3 business days</td>
          </tr>
          <tr>
            <td>Manitoba</td>
            <td>$750+</td>
            <td>4–5 business days</td>
          </tr>
          <tr>
            <td>Ontario</td>
            <td>$1,000+</td>
            <td>5 business days</td>
          </tr>
          <tr>
            <td>Quebec</td>
            <td>$1,000+</td>
            <td>5 business days</td>
          </tr>
        </tbody>
      </table>

      <h2>Domestic Shipments — Toronto Warehouse</h2>
      <p><strong>Minimum Order:</strong> $100.00</p>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Prepaid Freight Threshold</th>
            <th>Estimated Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Greater Toronto</td>
            <td>$350+</td>
            <td>1–2 business days</td>
          </tr>
          <tr>
            <td>Ontario</td>
            <td>$500+</td>
            <td>1–2 business days</td>
          </tr>
          <tr>
            <td>Quebec</td>
            <td>$750+</td>
            <td>2 business days</td>
          </tr>
          <tr>
            <td>Atlantic Provinces</td>
            <td>$1,000+</td>
            <td>3 business days</td>
          </tr>
        </tbody>
      </table>

      <h2>International Shipments — Contiguous United States</h2>
      <p><strong>Minimum Order:</strong> $100.00</p>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Prepaid Freight Threshold</th>
            <th>Estimated Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>USA (Lower 48 States)</td>
            <td>$1,500+</td>
            <td>Varies by destination</td>
          </tr>
        </tbody>
      </table>

      <h2>Contact Us</h2>
      <div className="contact-card">
        <p style={{ margin: 0 }}>
          <strong>Tel:</strong> 604.438.2862 &nbsp;|&nbsp;
          <strong>Toll Free:</strong> 877.772.2862<br />
          <strong>Fax:</strong> 604.438.2972 &nbsp;|&nbsp;
          <strong>Toll Free Fax:</strong> 877.772.2972
        </p>
      </div>
    </InfoPageLayout>
  );
}
