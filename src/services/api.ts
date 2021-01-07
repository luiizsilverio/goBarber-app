import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://192.168.172.49:3333',
    baseURL: 'http://10.0.2.2:3333',
});

export default api;


/** baseURL:
 * iOS com Emulador: localhost
 * iOS com físico: IP da máquina
 * Android com Emulador: localhost (adb reverse tcp:3333 tcp:3333)
 * Android com Emulador: 10.0.2.2 (Android Studio)
 * Android com Genymotion: 10.0.3.2 
 * Android com físico: IP da máquina
 */
