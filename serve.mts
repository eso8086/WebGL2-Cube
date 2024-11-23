import * as esbuild from 'esbuild'

function red(strings: TemplateStringsArray, ...values: any[]){
    return "\x1b[41m" + strings.reduce((prev, current, i)=>prev+current+(values[i] || ''), "") + "\x1b[0m";
}


let ctx = await esbuild.context({
    entryPoints: ['./src/main.mts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    tsconfig: "./tsconfig.json",
    outfile: 'dist/out.js',
});
await ctx.watch();
const {host, port} = await ctx.serve({
    servedir: "." //current dir (probably where is js file located)
});
console.log(red`Serving at ${host}:${port}`);