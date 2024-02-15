const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["frontend/excerpts/excerpts.tsx"],
        outdir: "ui/static/js",
        bundle: true,
	minify: true,
        plugins: [],
    })
    .then(() => console.log("⚡ Excerpt app build complete! ⚡"))
    .catch(() => process.exit(1));
