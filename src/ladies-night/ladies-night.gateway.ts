import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/WsJwtGuard.guard';
import { LadiesNightService } from './ladies-night.service';
import type { authSocket } from 'src/events/types/authSocket';

@WebSocketGateway({ cors: true, })
export class LadiesNightGateway {

  constructor(private readonly ladiesNightService: LadiesNightService) { }

  @WebSocketServer()
  server: Server;  // This is the socket.io server instance

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // You can do things like authenticate the client here
    // or join the client to a room
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }


  @UseGuards(WsJwtGuard)
  @SubscribeMessage('authenticate')
  async authenticate(@ConnectedSocket() socket: authSocket, @MessageBody() message: string) {

    await this.ladiesNightService.updateSavedUserSocketId(socket.user.id, socket.id);

    // optionally return to sender
    return { status: 'sent', message };
  }


  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get-quota')
  async getQuota(@ConnectedSocket() socket: authSocket, @MessageBody() message: string) {

    await this.ladiesNightService.updateSavedUserSocketId(socket.user.id, socket.id);

    const getDrinkQuota = await this.ladiesNightService.getDrinkQuota();

    const a = await this.ladiesNightService.getUserDrinksConsumed(socket.user.id);

    // broadcast to all clients except sender
    // client.broadcast.emit('receiveMessage', { senderId: client.id, message });


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
