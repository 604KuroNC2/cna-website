import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata = { title: "Company History | CNA Lighting" };

export default function CompanyHistoryPage() {
  const yearsInBusiness = Math.floor(
    (Date.now() - new Date("1988-03-01").getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <InfoPageLayout
      title="Company History"
      subtitle={`${yearsInBusiness}+ years of lighting excellence — trusted by distributors across Canada.`}
    >
      <h2>About CNA Lighting</h2>
      <p>
        CNA Lighting is a division of <strong>CNA International Enterprises Inc.</strong>, a privately held Canadian company
        established in <strong>March 1988</strong>. For over {yearsInBusiness} years, CNA has been dedicated to delivering
        high-quality lighting products and excellent prompt service to customers across Canada.
      </p>

      <h2>Our Beginning</h2>
      <p>
        CNA began its journey with the introduction of its first halogen light bulb in 1988. What started as a focused
        specialty product line grew steadily as demand for reliable, quality lighting solutions expanded throughout Canada.
        From the outset, CNA committed to standing behind every product it sells — a philosophy that continues to define
        the company today.
      </p>

      <h2>The Shift to LED</h2>
      <p>
        As the lighting industry evolved, CNA adapted and invested heavily in LED technology. Today, the company&apos;s
        catalog is anchored by a wide range of high-performance LED light bulbs and fixtures. While limited halogen, CFL,
        and HID product lines remain available for specific applications, LED products are now the cornerstone of the CNA
        offering — reflecting the industry-wide shift toward energy efficiency and longevity.
      </p>

      <h2>Serving the Trade</h2>
      <p>
        CNA sells exclusively through the trade — lighting distributors, electrical wholesalers, and lighting showrooms
        throughout Canada. This focused distribution model allows CNA to maintain strong relationships with its partners
        and ensure consistent product availability and support.
      </p>
      <p>
        To serve customers across the country, CNA operates well-stocked inventory across <strong>three Canadian warehouses</strong>:
      </p>
      <ul>
        <li><strong>Burnaby, BC</strong> — Head Office &amp; West Coast distribution</li>
        <li><strong>Surrey, BC</strong> — Bulk order facility (AVP Carriers Ltd.)</li>
        <li><strong>Halton Hills, ON</strong> — Central Canada distribution (QRC Logistics)</li>
      </ul>

      <h2>Innovation &amp; Product Development</h2>
      <p>
        Year after year, CNA introduces new and innovative lighting products to the Canadian market. The company
        continuously monitors industry developments and customer needs to expand and refine its product lineup.
        Subscribers to CNA&apos;s email list receive monthly updates on new product introductions.
      </p>

      <h2>Quality &amp; Certifications</h2>
      <p>
        CNA puts its brand name on everything it sells — a statement of accountability and confidence in product quality.
        CNA products are certified to <strong>cUL</strong>, <strong>cETLus</strong>, and <strong>cTUVus</strong> standards,
        meeting the safety and performance requirements for the Canadian and North American markets.
      </p>

      <div
        style={{
          background: "linear-gradient(135deg, #00002a 0%, #000060 100%)",
          borderRadius: "4px",
          padding: "2rem",
          marginTop: "2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1.5rem",
          textAlign: "center",
        }}
      >
        {[
          { value: `${yearsInBusiness}+`, label: "Years in Business" },
          { value: "500+", label: "LED Products" },
          { value: "3", label: "Canadian Warehouses" },
          { value: "2–5yr", label: "LED Warranty" },
        ].map((stat) => (
          <div key={stat.label}>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFD700", lineHeight: 1.1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.3rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
}
