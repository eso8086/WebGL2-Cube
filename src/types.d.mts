
export declare global{
    interface Window{
        canvas: HTMLCanvasElement,
        gl: WebGL2RenderingContext
    }

    const canvas: HTMLCanvasElement
    const gl: WebGL2RenderingContext

}