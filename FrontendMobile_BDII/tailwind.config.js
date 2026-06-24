/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // UCU design system — espejo exacto del web
                navy: {
                    950: "#00173a",
                    900: "#002b61",
                    800: "#0b3c7e",
                    700: "#25467d",
                    300: "#7694d0",
                    200: "#acc7ff",
                    100: "#d7e2ff",
                },
                energy: {
                    700: "#00616d",
                    500: "#00e3fd",
                    400: "#4deeff",
                },
                surface: "#f9f9ff",
                "surface-dim": "#d2daeb",
                "container-low": "#f0f3ff",
                container: "#e7eeff",
                "container-high": "#dbe3f4",
                ink: "#141c28",
                "ink-soft": "#434750",
                "ink-faint": "#747781",
                line: "#c4c6d1",
                ok: { 600: "#047857", 500: "#10b981", 100: "#d1fae5" },
                warn: { 600: "#b45309", 500: "#f59e0b", 100: "#fef3c7" },
                danger: { 700: "#93000a", 600: "#ba1a1a", 500: "#ef4444", 100: "#ffdad6" },
                info: { 600: "#1d4ed8", 500: "#3b82f6", 100: "#dbeafe" },
            },
        },
    },
    plugins: [],
};
