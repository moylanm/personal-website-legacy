const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["frontend/main.tsx"],
        outdir: "ui/static/js",
        bundle: true,
	minify: true,
        plugins: [],
    })
    .then(() => console.log("⚡ Build complete! ⚡"))
    .catch(() => process.exit(1));
