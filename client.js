import { io } from 'socket.io-client';
class Client {

    constructor(opts = {}) {
        this.url = opts.url || 'http://localhost';
        this.auth = opts.auth || { user_id: 1234 } ; // { user_id, user_name }
        this.port = opts.port || "";
        this.secretKey = opts?.secretKey;
        this.queueSubscribe = []
        this.socket = null;
    }

    async init() {
        const instance = this;
        return new Promise(function(resolve, reject) {
            const uri = instance.url.startsWith('https') ? instance.url : instance.url + ':' + instance.port
            instance.socket = io(uri, {
                query: {user_id: instance.auth.user_id},
                auth: {token: instance.secretKey},
                transports: ["polling"]
            });

            instance.socket.on('connect', () => {
                instance.queueSubscribe.forEach((subscribe) => {
                    console.log('Queue subscription for ', subscribe)
                    instance.subscribeChannel(subscribe.channelName, subscribe.callback)
                })
                return resolve()
            })

            instance.socket.on("connect_error", (err) => {
                console.log(err)
                return reject()
            });

            instance.socket.on('error', (err) => {
                console.log('Error', err)
                return reject()
            })

            instance.socket.on('disconnect', (err) => {
                console.log('Disconnect', err)
                return reject()
            })
        });
    }

    async subscribeChannel(channelName, callback) {
        if(this.socket !== null) {
            if(this.socket?.connected) {
                this.socket.emit('subscribe_channel', channelName)
                this.socket.on('notification', (args) => {
                    if(args.channel !== channelName) return;
                    callback(args)
                })
            }
        }else{
            const subscribe = this.queueSubscribe.find((subscribe) => subscribe.channelName == channelName);
            if(!subscribe) {
                this.queueSubscribe.push({ channelName: channelName, callback: callback })
            }
        }
    }

    async subscribeChannelPublic(channelName, callback) {
        if(this.socket !== null) {
            if(this.socket?.connected) {
                this.socket.emit('subscribe_channel_public', channelName)
                this.socket.on('notification', (args) => {
                    if(args.channel !== channelName) return;
                    callback(args)
                })
            }
        }else{
            const subscribe = this.queueSubscribe.find((subscribe) => subscribe.channelName == channelName);
            if(!subscribe) {
                this.queueSubscribe.push({ channelName: channelName, callback: callback })
            }
        }
    }

}

export default Client;