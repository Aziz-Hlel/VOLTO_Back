import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/WsJwtGuard.guard';

@WebSocketGateway({ cors: true, })
export class LadiesNightGateway {


  @WebSocketServer()
  server: Server;  // This is the socket.io server instance

  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // You can do things like authenticate the client here
    // or join the client to a room
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }


  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() message: string) {

    console.log(`Client ${client.id} says: ${message}`);

    // broadcast to all clients except sender
    client.broadcast.emit('receiveMessage', { senderId: client.id, message });


    // optionally return to sender
    return { status: 'sent', message };
  }


  @SubscribeMessage('sendMessage2')
  handleSendMessage2(@ConnectedSocket() client: Socket, @MessageBody() message: string) {

    console.log(`Client ${client.id} says: ${message}`);

    // broadcast to all clients except sender
    client.broadcast.emit('receiveMessage', { senderId: client.id, message });


    // optionally return to sender
    return { status: 'sent', message };
  }

}
