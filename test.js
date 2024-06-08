import Client from './client.js'


const client = new Client()

client.subscribeChannel('friends_demand', (args) => {
    console.log('Result: ', args)
})
client.subscribeChannel('friends_demands', (args) => {
    console.log('Result: ', args)
})

client.init().then(async () => {
    console.log('Connected client')
})
