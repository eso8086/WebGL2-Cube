import * as esbuild from 'esbuild'
import {BuildContext, BuildOptions, build} from "esbuild";

function red(strings: TemplateStringsArray, ...values: any[]){
    return "\x1b[41m" + strings.reduce((prev, current, i)=>prev+current+(values[i] || ''), "") + "\x1b[0m";
}

const config: BuildOptions = {
    entryPoints: ['./src/main.mts'],
    bundle: true,
    minify: false,
    sourcemap: 'inline',
    tsconfig: "./tsconfig.json",
    outfile: 'dist/out.js',
    keepNames: true,
    sourcesContent: true,
    format: 'esm',
};
//this supposed to be used by github actions
if(process.argv.includes("--no-watch")){
    await build(config);
}
else{
    let ctx: BuildContext<BuildOptions> = await esbuild.context(config);
    await ctx.watch();
    const {host, port} = await ctx.serve({
        servedir: "." //current dir (probably where is js file located)
    });
    console.log(red`Serving at ${host}:${port}`);
}
