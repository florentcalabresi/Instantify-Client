import Client from './client.js'

const client = new Client()
client.init().then(async () => {
    console.log('Connected client')
    await client.subscribeChannel('friends_demand', (args) => {
        console.log('Result: ', args)
    })
})
