export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Upgrade</h1>
        <p className="text-gray-300">
          Credits’in bitti. Paket satın alarak devam edebilirsin.
        </p>

        <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-2">
          <div className="text-lg font-semibold">Starter Pack</div>
          <div className="text-sm text-gray-300">50 kredi</div>
          <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 p-2 rounded">
            Purchase (yakında)
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Şimdilik bu ekran “CTA” için. Ödeme entegrasyonunu sonra ekleriz (Stripe vb.).
        </p>
      </div>
    </div>
  );
}
