export async function getTextureImage(src: string): Promise<HTMLImageElement> {
    const res: Response = await fetch(src);
    if(!res.ok){
        alert(`Failed to load image - ${src}`);
        throw `ERROR - Image failed to load.\nImage Source: ${src}`;
    }

    const blob: Blob = await res.blob();

    return new Promise((res, rej): HTMLImageElement=>{
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onerror = () =>{
            rej("texture loading failed");
        }
        img.onload = ()=>{
            res(img)
            URL.revokeObjectURL(img.src)
        };
        return img;
    })

}