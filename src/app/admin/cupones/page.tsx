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
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestión Dinámica de Cupones</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Crea códigos promocionales en tiempo real, define límites de uso y porcentaje de descuento.
          </p>
        </div>
        <button
          onClick={fetchCoupons}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold text-sm">
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Cupón</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Código del Cupón</label>
              <input
                type="text"
                placeholder="EJ: LALA100, PROMO2026"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Porcentaje de Descuento (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-zinc-500 mt-1">100% para anuncios totalmente gratuitos.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Cantidad Máxima de Usos</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <Ticket className="w-4 h-4" />
              <span>{creating ? "Creando Cupón..." : "Crear Cupón Activo"}</span>
            </button>
          </form>
        </div>

        {/* Coupons List Table */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cupones Registrados</span>
            <span className="text-xs text-zinc-500">{coupons.length} cupones en total</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500 text-sm">Cargando cupones...</div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">No hay cupones creados aún.</div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {coupons.map((coupon) => {
                const percentUsed = Math.min(100, Math.round((coupon.currentUses / coupon.maxUses) * 100));
                return (
                  <div key={coupon._id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-950/40 transition-colors">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold font-mono text-white tracking-wide flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-purple-400" />
                          {coupon.code}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded">
                          {coupon.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Usage Progress Bar */}
                      <div className="w-full max-w-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-zinc-400">
                          <span>Usos: {coupon.currentUses} de {coupon.maxUses}</span>
                          <span>{percentUsed}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                          <div
                            className={`h-full transition-all ${
                              percentUsed >= 100 ? "bg-red-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleActive(coupon._id, coupon.active)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          coupon.active
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800"
                            : "bg-red-950 text-red-300 border-red-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-800"
                        }`}
                      >
                        {coupon.active ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Habilitado
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-400" /> Pausado
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Eliminar cupón"
                      >
                        <Trash2 className="w-4 h-4" />
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
