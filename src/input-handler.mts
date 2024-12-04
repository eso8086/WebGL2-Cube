
export default class InputHandler {
    public keys: Record<string, boolean> = {};

    public listenKeyboardEvents(){
        window.onkeydown = (e: KeyboardEvent)=>{
            this.keys[e.key.toLowerCase()] = true;
        }

        window.onkeyup = (e: KeyboardEvent)=>{
            this.keys[e.key.toLowerCase()] = false;
        }
    }
}