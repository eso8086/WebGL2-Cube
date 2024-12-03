import * as esbuild from 'esbuild'

function red(strings: TemplateStringsArray, ...values: any[]){
    return "\x1b[41m" + strings.reduce((prev, current, i)=>prev+current+(values[i] || ''), "") + "\x1b[0m";
}

let ctx = await esbuild.context({
    entryPoints: ['./src/main.mts'],
    bundle: true,
    minify: false,
    sourcemap: 'inline',
    tsconfig: "./tsconfig.json",
    outfile: 'dist/out.js',
    keepNames: true,
    sourcesContent: true,
    format: 'esm',
});

await ctx.watch();
const {host, port} = await ctx.serve({
    servedir: "." //current dir (probably where is js file located)
});
console.log(red`Serving at ${host}:${port}`);