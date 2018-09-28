import socketIo from 'socket.io-client';

let BASE_SOCKET_URL = `http://192.168.1.231:8000`;
// // let BASE_SOCKET_URL = `http://137.116.56.150:3000`;
// // let BASE_SOCKET_URL = `http://137.116.56.150:8000`;
// export const socket = socketIo(BASE_SOCKET_URL,{transports: ['websocket']});