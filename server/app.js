
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import getUniqueID from './utils/getUniqueID.js';

//initialize a simple http server
const app = express();
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocketServer({ server });

const getAllClientData = () => {
    const clientsData = [];
    wss.clients.forEach(wsClient => {
        if (wsClient.data && ! wsClient.data.isScrumMaster) {
            clientsData.push(wsClient.data);
        }
    });
    return clientsData;  
};

const resetPoints = () => {
    const clientsData = [];
    wss.clients.forEach(wsClient => {
        if (wsClient.data && ! wsClient.data.isScrumMaster) {
            wsClient.data.points = '';
            clientsData.push(wsClient.data);
            wsClient.send(JSON.stringify({ command: 'setDataSuccess', data: wsClient.data }));
        }
    });
    return clientsData;  
};

wss.on('connection', wsConnection => {

    wsConnection.isAlive = true;
    wsConnection.guid = getUniqueID();
    wsConnection.on('pong', () => {
        console.log('The pong event');
        wsConnection.isAlive = true;
    });

    if (!wsConnection.data) {
        wsConnection.data = {};
    }
    //connection is up, let's add a simple simple event
    wsConnection.on('message', message => {
        console.log('Message from', wsConnection.guid);
        const parsedMessage = JSON.parse(`${message}`);
        const { command, data } = parsedMessage;
        console.log('handling the message', parsedMessage);
        console.log('passed in data', data);
        switch (command) {
            case 'setUserData':
                wsConnection.data = {...wsConnection.data, ...data};
                wsConnection.send(JSON.stringify({ command: 'setDataSuccess', data: wsConnection.data }));
                break;
            case 'getUserData':
                wsConnection.send(JSON.stringify({ command: 'setDataSuccess', data: wsConnection.data }));
                break;
            case 'resetPoints':
                wsConnection.send(JSON.stringify({ command: 'totals', data: resetPoints() }));
                break;
            default:
                break;
        }
    });

    //send immediatly a feedback to the incoming connection    
    wsConnection.send(JSON.stringify({ command: 'setDataSuccess', data: wsConnection.data }));
});

setInterval(() => {
    console.log('Pinging current clients');
    wss.clients.forEach(wsClient => {
        console.log('Connected Client', wsClient.guid);
        console.log('Client Data', wsClient.data);

        if (!wsClient.isAlive) {
            return wsClient.terminate();
        };
        
        wsClient.isAlive = false;
        wsClient.ping('ping');
    });
}, 30000);

setInterval(() => {
    const clientsData = getAllClientData();
    wss.clients.forEach(wsClient => {
        wsClient.send(JSON.stringify({ command: 'totals', data: clientsData }));
    });
}, 2000);

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port${server.address().address}:${server.address().port} :)`);
});
