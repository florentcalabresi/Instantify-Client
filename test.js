import Client from './client.js'


const client = new Client()

client.init().then(async () => {
    console.log('Connected client')
})
