const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["ui/react/dashboard/dashboard.tsx"],
        outdir: "ui/static/js",
        bundle: true,
	minify: true,
        plugins: [],
    })
    .then(() => console.log("⚡ Dashboard build complete! ⚡"))
    .catch(() => process.exit(1));
