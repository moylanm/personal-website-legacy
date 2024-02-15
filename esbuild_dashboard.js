const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["frontend/excerpts/dashboard.tsx"],
        outdir: "ui/static/js",
        bundle: true,
	minify: true,
        plugins: [],
    })
    .then(() => console.log("⚡ Dashboard app build complete! ⚡"))
    .catch(() => process.exit(1));
