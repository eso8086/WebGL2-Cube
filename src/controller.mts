
export default class Controller {
    public keys: Record<string, boolean> = {};

    public listenMouseEvents(){
        window.onkeydown = (e: KeyboardEvent)=>{
            this.keys[e.key.toLowerCase()] = true;
        }

        window.onkeyup = (e: KeyboardEvent)=>{
            this.keys[e.key.toLowerCase()] = false;
        }
    }
}