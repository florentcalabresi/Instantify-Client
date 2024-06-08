import 'dotenv/config'
import { io } from 'socket.io-client';
class Client {

    constructor(opts = {}) {
        this.url = opts.url || 'http://localhost';
        this.auth = opts.auth || { user_id: 1234 } ; // { user_id, user_name }
        this.port = opts.port || 4150;
        this.secretKey = opts?.secretKey || process.env.SECRET_KEY;
        this.queueSubscribe = []
        this.socket = null;
    }

    async init() {
        const instance = this;
        return new Promise(function(resolve, reject) {
            instance.socket = io(`${instance.url}:${instance.port}`, {
                query: {user_id: instance.auth.user_id},
                auth: {token: instance.secretKey}
            });
            
            instance.socket.on('connect', () => {
                instance.queueSubscribe.forEach((subscribe) => {
                    console.log('Queue subscription for ', subscribe)
                    instance.subscribeChannel(subscribe.channelName, subscribe.callback)
                })
                return resolve()
            })
        });
    }

    async subscribeChannel(channelName, callback) {
        if(this.socket !== null) {
            if(this.socket?.connected) {
                this.socket.emit('subscribe_channel', channelName)
                this.socket.on('notification', callback)
            }
        }else{
            if(!this.queueSubscribe.includes((subscribe) => subscribe.channelName == channelName)) {
                this.queueSubscribe.push({ channelName: channelName, callback: callback })
            }
        }
    }

}

export default Client;