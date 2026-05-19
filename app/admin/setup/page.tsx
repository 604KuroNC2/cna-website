import Image from "next/image";
import QRCode from "qrcode";
import { generateURI } from "otplib";

export default async function SetupPage() {
  const secret = process.env.ADMIN_TOTP_SECRET;

  if (!secret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#00002a] text-white px-4">
        <p className="text-red-400">
          <strong>ADMIN_TOTP_SECRET</strong> is not set in your environment variables.
        </p>
      </div>
    );
  }

  const uri = generateURI({
    label: "CNA Lighting Admin",
    secret,
    issuer: "CNA Lighting",
  });

  const qrDataUrl = await QRCode.toDataURL(uri, {
    width: 240,
    margin: 2,
    color: { dark: "#000050", light: "#ffffff" },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #00002a 0%, #000060 50%, #000080 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative h-12 w-40">
            <Image
              src="/brand_assets/CNA Logo - White with Alpha Background.png"
              alt="CNA Lighting"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.4)] p-8 text-center">
          <h1 className="font-display font-black text-2xl text-[#000080] tracking-tight mb-1">
            Authenticator Setup
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Scan this QR code with Google Authenticator to set up admin login.
          </p>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-3 border border-gray-100 rounded-sm inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="TOTP QR Code" width={240} height={240} />
            </div>
          </div>

          {/* Manual entry */}
          <div className="mb-6 p-4 bg-gray-50 rounded-sm text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Can&apos;t scan? Enter manually:
            </p>
            <p className="font-mono text-sm text-[#000080] break-all tracking-wider">
              {secret.match(/.{1,4}/g)?.join(" ")}
            </p>
          </div>

          {/* Steps */}
          <ol className="text-left space-y-2 text-sm text-gray-600 mb-6">
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#000080] text-white text-xs font-bold flex items-center justify-center">1</span>
              Open <strong>Google Authenticator</strong> on your phone
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#000080] text-white text-xs font-bold flex items-center justify-center">2</span>
              Tap <strong>+</strong> and choose <strong>Scan a QR code</strong>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#000080] text-white text-xs font-bold flex items-center justify-center">3</span>
              Scan the code above — done!
            </li>
          </ol>

          <a
            href="/admin/login"
            className="block w-full py-3 bg-[#000080] text-white font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-[#0000a0] transition-all duration-200 text-center"
          >
            Go to Login →
          </a>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Keep this page private — it contains your authenticator secret.
        </p>
      </div>
    </div>
  );
}
