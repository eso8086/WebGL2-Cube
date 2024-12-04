
export default class InputHandler {
    public keys: Record<string, boolean> = {
        w: false,
        s: false,
        a: false,
        d: false,
    };

    public listenKeyboardEvents(){
        window.onkeydown = (e: KeyboardEvent)=>{
            this.keys[e.key.toLowerCase()] = true;
        }

        window.onkeyup = (e: KeyboardEvent)=>{
            this.keys[e.key.toLowerCase()] = false;
        }
    }
}