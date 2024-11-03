const esbuild = require("esbuild");

esbuild
    .build({
        entryPoints: ["ui/react/main.tsx"],
        outdir: "ui/static/js",
        bundle: true,
        minify: true
    })
    .then(() => console.log("⚡React build complete! ⚡"))
    .catch(() => process.exit(1));
