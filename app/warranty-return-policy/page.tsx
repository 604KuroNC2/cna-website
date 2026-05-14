import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata = { title: "Warranty & Return Policy | CNA Lighting" };

export default function WarrantyReturnPolicyPage() {
  return (
    <InfoPageLayout
      title="Warranty &amp; Return Policy"
      subtitle="CNA International Enterprises Inc. stands behind every product we sell."
    >
      <h2>Warranty</h2>
      <p>
        CNA International Enterprises Inc. warrants its products against failure due to defect in material or workmanship under normal use and service conditions for the following periods:
      </p>
      <table>
        <thead>
          <tr>
            <th>Product Type</th>
            <th>Warranty Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>LED Products</td>
            <td>2–5 years from date of sale</td>
          </tr>
          <tr>
            <td>LED Exit Signs</td>
            <td>10 years from date of sale</td>
          </tr>
          <tr>
            <td>CFL Products</td>
            <td>1 year from date of sale</td>
          </tr>
        </tbody>
      </table>

      <h3>For Distributors &amp; Retailers</h3>
      <p>
        CNA may, at its discretion, replace defective items or credit your account at the current distributor pricing or original invoice amount — whichever is lower.
        Warranty coverage <strong>excludes</strong> freight, removal, re-installation, labour, or equipment costs.
      </p>
      <p>
        Coverage does not apply to products damaged by accident, neglect, abuse, misuse, or acts of God.
      </p>

      <h3>For End Customers</h3>
      <p>
        Please contact the distributor or retailer from whom you purchased the product. If contacting CNA directly, you will be required to:
      </p>
      <ul>
        <li>Return the defective unit (customer is responsible for return shipping costs)</li>
        <li>Provide the original purchase receipt</li>
        <li>Obtain an RMA (Return Merchandise Authorization) number from CNA before returning</li>
      </ul>
      <p>
        Upon approval, CNA will ship the replacement product at no shipping cost to the customer.
      </p>

      <hr />

      <h2>General Return Policy</h2>
      <p>
        CNA accepts returns that meet <strong>all</strong> of the following conditions:
      </p>
      <ul>
        <li>Products must be <strong>new, unused, and in original packaging</strong></li>
        <li>Products must be in re-sellable condition</li>
        <li>A <strong>25% restocking fee</strong> will be applied to all returns</li>
        <li>Credit is calculated at the current distributor price list or original invoice amount — whichever is lesser</li>
        <li>Customer is responsible for all return shipping costs</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>Authorization Required:</strong> You must contact CNA and receive an authorization/approval number before returning any items. Unauthorized returns will not be accepted.
        </p>
      </div>

      <p>
        <strong>Discontinued products cannot be returned.</strong> Please verify product availability and status before placing orders if returns may be required.
      </p>

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
