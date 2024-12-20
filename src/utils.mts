export async function getTextureImage(src: string): Promise<HTMLImageElement> {
    const res: Response = await fetch(src);
    if(!res.ok){
        alert(`Failed to fetch image from source - ${src}`);
        throw `ERROR - Image failed to fetch image from source.\nSource: ${src}`;
    }

    const blob: Blob = await res.blob();

    return new Promise((res, rej): HTMLImageElement=>{
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onerror = () =>{
            alert("Failed to load image");
            throw "ERROR - Failed to load image."
        }
        img.onload = ()=>{
            res(img)
            URL.revokeObjectURL(img.src)
        };
        return img;
    })

}