"use client";

import { useEffect, useState } from "react";
import { Ticket, Plus, CheckCircle2, XCircle, Trash2, Tag, RefreshCw } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  usedBy: string[];
  createdAt: string;
}

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(100);
  const [maxUses, setMaxUses] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error("Error al cargar cupones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError("Ingresá un código para el cupón");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          discountPercent: Number(discountPercent),
          maxUses: Number(maxUses),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear cupón");
      } else {
        setCoupons((prev) => [data, ...prev]);
        setCode("");
        setDiscountPercent(100);
        setMaxUses(10);
      }
    } catch (err) {
      setError("Error inesperado de red");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === id ? { ...c, active: !currentActive } : c))
        );
      }
    } catch (err) {
      console.error("Error al alternar estado del cupón:", err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("¿Deseas eliminar este cupón de la base de datos?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("Error al eliminar cupón:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black uppercase tracking-tight">Gestión Dinámica de Cupones</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mt-1">
            Crea códigos promocionales en tiempo real, define límites de uso y porcentaje de descuento.
          </p>
        </div>
        <button
          onClick={fetchCoupons}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator Form */}
        <div className="bg-white border-2 border-black p-6 h-fit shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-6 text-black font-black uppercase text-sm border-b-2 border-black pb-4">
            <Plus className="w-5 h-5" />
            <span>Crear Nuevo Cupón</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-800 text-xs font-bold uppercase text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Código del Cupón</label>
              <input
                type="text"
                placeholder="EJ: LALA100, PROMO2026"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 border-2 border-black px-4 py-3 text-sm font-bold text-black font-mono placeholder-gray-400 focus:outline-none focus:bg-white uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Porcentaje de Descuento (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-black px-4 py-3 text-sm font-bold text-black focus:outline-none focus:bg-white"
              />
              <p className="text-[11px] font-bold text-muted-foreground uppercase mt-2">100% para anuncios totalmente gratuitos.</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Cantidad Máxima de Usos</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-black px-4 py-3 text-sm font-bold text-black focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-black hover:bg-black/80 text-white font-black uppercase tracking-wider py-4 px-4 text-xs transition-transform hover:translate-y-[-2px] flex items-center justify-center gap-2 border-2 border-transparent"
            >
              <Ticket className="w-5 h-5" />
              <span>{creating ? "Creando Cupón..." : "Crear Cupón Activo"}</span>
            </button>
          </form>
        </div>

        {/* Coupons List Table */}
        <div className="lg:col-span-2 bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="p-6 bg-gray-50 border-b-2 border-black flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-wider text-black">Cupones Registrados</span>
            <span className="text-xs font-bold uppercase text-muted-foreground">{coupons.length} cupones en total</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-black font-bold uppercase text-sm">Cargando cupones...</div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center text-black font-bold uppercase text-sm">No hay cupones creados aún.</div>
          ) : (
            <div className="divide-y-2 divide-gray-200">
              {coupons.map((coupon) => {
                const percentUsed = Math.min(100, Math.round((coupon.currentUses / coupon.maxUses) * 100));
                return (
                  <div key={coupon._id} className="p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                    <div className="space-y-4 flex-1 w-full min-w-0">
                      <div className="flex items-center flex-wrap gap-3">
                        <span className="text-lg font-black font-mono text-black uppercase tracking-widest flex items-center gap-2 border-2 border-black px-3 py-1 bg-white">
                          <Tag className="w-5 h-5 text-black" />
                          {coupon.code}
                        </span>
                        <span className="px-3 py-1 text-xs font-black uppercase bg-purple-100 text-purple-900 border-2 border-purple-900">
                          {coupon.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Usage Progress Bar */}
                      <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                          <span>Usos: {coupon.currentUses} de {coupon.maxUses}</span>
                          <span>{percentUsed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-none overflow-hidden border-2 border-black">
                          <div
                            className={`h-full transition-all border-r-2 border-black ${
                              percentUsed >= 100 ? "bg-red-500" : "bg-black"
                            }`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end xl:self-center">
                      <button
                        onClick={() => handleToggleActive(coupon._id, coupon.active)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase border-2 transition-transform hover:translate-y-[-1px] ${
                          coupon.active
                            ? "bg-green-100 text-green-800 border-green-800"
                            : "bg-red-100 text-red-800 border-red-800"
                        }`}
                      >
                        {coupon.active ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-800" /> Habilitado
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-800" /> Pausado
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-colors"
                        title="Eliminar cupón"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
