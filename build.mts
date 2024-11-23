import * as esbuild from 'esbuild'
import {BuildContext} from "esbuild";
function requireAndCheckOptArg(expect: string, position: number): boolean{
    const v = process.argv[position];
    if(v && v !== expect){
        console.error("usage: --watch");
        process.exit(1);
    }
    return !!v;
}

async function watch(ctx: BuildContext){
    await ctx.watch();
    console.log("watching...");
}

const buildConf = {
    entryPoints: ['./src/main.mts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    tsconfig: "./tsconfig.json",
    outfile: 'dist/out.js',
};

if (requireAndCheckOptArg("--watch", 2)) {
    const ctx: BuildContext = await esbuild.context(buildConf);
    await watch(ctx);
}
else{
    await esbuild.build(buildConf);
}

