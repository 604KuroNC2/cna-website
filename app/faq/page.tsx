import InfoPageLayout from "@/components/InfoPageLayout";

export const metadata = { title: "FAQ | CNA Lighting" };

const faqs = [
  {
    q: "I'm an end-customer. Can I purchase products directly from CNA?",
    a: "No, CNA only deals with distributors. Please contact us and we can help you locate your nearest authorized distributor.",
  },
  {
    q: "How do I become a customer and start purchasing?",
    a: "Contact us to request a credit application. Please note that your first purchase must be paid in advance before an account can be established.",
  },
  {
    q: "Do you sell to electrical contractors and electricians?",
    a: "No — CNA sells exclusively through distributors. Please contact your local lighting distributor or electrical wholesaler to purchase CNA products.",
  },
  {
    q: "Do you sell other brands besides CNA?",
    a: "We primarily sell CNA brand products. We do carry other brands in limited, special cases. The vast majority of our catalog is CNA-branded.",
  },
  {
    q: "How do I become an agent?",
    a: "Most areas in Canada already have agents handling their respective territories. If you represent a region that currently has no CNA representation, agency opportunities may be available. Please contact us to discuss.",
  },
  {
    q: "What types of products does CNA carry?",
    a: "CNA offers a wide range of LED lighting products including filament bulbs, general purpose LED A-series bulbs, reflectors and spotlights (MR16, GU10, PAR), miniature specialty bulbs (G4, G9, E11, J-Type), LED downlights and potlights, LED strip lights, LED drivers, and commercial fixtures. We also carry a limited selection of halogen, CFL, and HID products.",
  },
  {
    q: "Where are your warehouses located?",
    a: "CNA maintains warehouses in Burnaby (Vancouver), BC and Halton Hills (Toronto), ON. We also have a bulk order facility in Surrey, BC through AVP Carriers Ltd.",
  },
  {
    q: "What certifications do CNA products carry?",
    a: "CNA products are certified to cUL, cETLus, and cTUVus standards, ensuring compliance with Canadian and North American safety requirements.",
  },
  {
    q: "What is the warranty on CNA LED products?",
    a: "LED products carry a 2–5 year warranty from the date of sale. LED Exit Signs are covered for 10 years. CFL products carry a 1-year warranty. See our Warranty & Return Policy page for full details.",
  },
  {
    q: "What dimmers are compatible with CNA dimmable LEDs?",
    a: "CNA dimmable LED products work with Forward Phase / Leading Edge load type dimmers. Recommended options include Lutron DVELV-300P (best), DVCL-153P (good), and Lutron Caséta PRO (best wireless). See our Dimmer Compatibility page for the full list.",
  },
];

export default function FAQPage() {
  return (
    <InfoPageLayout
      title="Frequently Asked Questions"
      subtitle="Common questions about purchasing, products, and working with CNA Lighting."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                margin: "0 0 0.75rem 0",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#000080",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.5rem",
                  height: "1.5rem",
                  minWidth: "1.5rem",
                  background: "#FFD700",
                  color: "#000080",
                  borderRadius: "2px",
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  marginTop: "0.05rem",
                }}
              >
                Q
              </span>
              {faq.q}
            </h3>
            <p
              style={{
                margin: 0,
                paddingLeft: "2.25rem",
                color: "#374151",
                lineHeight: 1.7,
              }}
            >
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="info-box" style={{ marginTop: "2.5rem" }}>
        <p>
          Have a question that&apos;s not answered here?{" "}
          <a href="/contact">Contact us</a> and our team will be happy to help.
        </p>
      </div>
    </InfoPageLayout>
  );
}
