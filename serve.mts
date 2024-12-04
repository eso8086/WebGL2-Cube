import {BuildContext, BuildOptions, build, context} from "esbuild";

// returns string formatted red color using ansi characters
function red(strings: TemplateStringsArray, ...values: any[]){
    const initialStr = "";
    const content: string = strings.reduce((prev, current, i)=> prev + current + (values[i] || ''), initialStr)
    return "\x1b[41m" + content + "\x1b[0m";
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
    let ctx: BuildContext = await context(config);
    await ctx.watch();
    /*
     servedir:
     This is a directory of extra content for esbuild's HTTP server to serve instead of a 404
     when incoming requests don't match any of the generated output file paths.
     This lets you use esbuild as a general-purpose local web server.
     */
    const {host, port} = await ctx.serve({
        servedir: "."
    });
    console.log(red`Serving at ${host}:${port}`);
}
