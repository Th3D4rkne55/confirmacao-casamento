"use client";

import { useMemo, useState } from "react";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function formatWhatsAppPhoneBR(phone: string) {
  // Aceita "67999999999" ou "5567999999999"
  const d = onlyDigits(phone);
  if (!d) return "";
  if (d.startsWith("55")) return d;
  return "55" + d;
}

export default function Page() {
  // ✅ TROQUE AQUI PELO NÚMERO QUE RECEBERÁ AS CONFIRMAÇÕES (com DDD)
  // Ex.: Campo Grande: "67999999999"
  const WHATSAPP_NUMBER_RAW = "5567991682639";

  const WHATSAPP_NUMBER = useMemo(
    () => formatWhatsAppPhoneBR(WHATSAPP_NUMBER_RAW),
    []
  );

  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewMsg, setPreviewMsg] = useState("");

  const parsedQty = useMemo(() => {
    const n = Number(String(qty).replace(",", "."));
    if (!Number.isFinite(n)) return 0;
    return Math.floor(n);
  }, [qty]);

  function validate(): string | null {
    const n = name.trim();
    if (n.length < 5) return "Informe seu nome completo.";
    if (parsedQty < 1) return "Informe a quantidade total (mínimo 1).";
    if (parsedQty > 20) return "Quantidade muito alta. Se estiver correto, me avise que ajusto.";
    if (!WHATSAPP_NUMBER) return "Número de WhatsApp inválido no código.";
    return null;
  }

  function handleOpenConfirm() {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    const msg = `${name.trim()} - total de: ${parsedQty} pessoa(s)`;
    setPreviewMsg(msg);
    setConfirmOpen(true);
  }

  function handleConfirmSend() {
  const msgPreview = `${name.trim()} - total de: ${parsedQty} pessoa(s)`;
  const text = encodeURIComponent(msg);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
  setConfirmOpen(false);
}

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Fundo responsivo */}
      <div className="absolute inset-0">
        {/* Desktop */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-desktop.jpg')" }}
        />
        {/* Mobile */}
        <div
          className="md:hidden absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-mobile.jpg')" }}
        />
        {/* Overlay para dar contraste */}
        <div className="absolute inset-0 bg-white/5" />
      </div>

      {/* Card central */}
      <div className="relative z-10 min-h-screen flex items-start justify-center p-4 pt-80 md:pt-[28rem]">
  <div className="w-full max-w-2xl rounded-2xl bg-white/90 backdrop-blur shadow-xl p-6 md:p-10">
          <h1 className="text-2xl font-semibold text-[#a85031] text-center">
            Confirmação de Presença
          </h1>

          <p className="text-sm text-[#8f5f3c] text-center mt-2">
            Preencha abaixo para confirmar.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-base md:text-lg font-medium text-[#9F6F45]">
                Qual o seu nome completo:
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: João da Silva"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <div>
              <label className="text-base md:text-lg font-medium text-[#9F6F45]">
                Quantidade total de convidados (contando com você):
              </label>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                inputMode="numeric"
                placeholder="Ex.: 2"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <button
              onClick={handleOpenConfirm}
              className="w-full rounded-xl bg-gray-900 text-white py-3 font-semibold hover:bg-gray-800 transition"
            >
              ENVIAR
            </button>

            <p className="text-xs text-gray-600 text-center">
              Ao enviar, o WhatsApp abrirá com a mensagem pronta.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirmar envio?
            </h2>

            <p className="mt-3 text-sm text-gray-700">
              <span className="font-medium">{name.trim()}</span>, total de{" "}
              <span className="font-medium">{parsedQty}</span> pessoa(s)
              comparecerão.
              <br />
              Você confirma?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 rounded-xl bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
