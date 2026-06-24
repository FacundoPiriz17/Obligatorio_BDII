import { create } from "zustand";

const clampCantidad = (cantidad) => Math.max(1, Math.min(Number(cantidad) || 1, 5));

export const useCarritoStore = create((set, get) => ({
    items: [],

    addItem: (item) => {
        const existing = get().items.find(
            (i) => i.idPartido === item.idPartido && i.nombreSector === item.nombreSector
        );
        if (existing) {
            set((s) => ({
                items: s.items.map((i) =>
                    i.idPartido === item.idPartido && i.nombreSector === item.nombreSector
                        ? { ...i, cantidad: Math.min((i.cantidad ?? 0) + clampCantidad(item.cantidad), 5) }
                        : i
                ),
            }));
        } else {
            set((s) => ({
                items: [...s.items, { ...item, cantidad: clampCantidad(item.cantidad) }],
            }));
        }
    },

    removeItem: (idPartido, nombreSector) =>
        set((s) => ({
            items: s.items.filter((i) => !(i.idPartido === idPartido && i.nombreSector === nombreSector)),
        })),

    updateCantidad: (idPartido, nombreSector, cantidad) => {
        if (cantidad <= 0) {
            get().removeItem(idPartido, nombreSector);
            return;
        }
        set((s) => ({
            items: s.items.map((i) =>
                i.idPartido === idPartido && i.nombreSector === nombreSector ? { ...i, cantidad } : i
            ),
        }));
    },

    clear: () => set({ items: [] }),

    total: () => get().items.reduce((acc, i) => acc + Number(i.precioUnitario || 0) * i.cantidad, 0),

    cantidadTotal: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
}));
