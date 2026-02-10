import { io, Socket } from 'socket.io-client';
import { API_URL } from '../constants/API';

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        if (this.socket?.connected) return;

        this.socket = io(API_URL, {
            transports: ['websocket'],
            forceNew: true,
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
            this.socket?.emit('join', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinConversation(conversationId: string) {
        this.socket?.emit('join_conversation', conversationId);
    }

    onNewMessage(callback: (message: any) => void) {
        this.socket?.on('new_message', callback);
    }

    onNotification(callback: (notification: any) => void) {
        this.socket?.on('notification', callback);
    }

    onTyping(callback: (data: { userId: string, isTyping: boolean }) => void) {
        this.socket?.on('typing', callback);
    }

    emitTyping(conversationId: string, userId: string, isTyping: boolean) {
        this.socket?.emit('typing', { conversationId, userId, isTyping });
    }

    removeListeners() {
        this.socket?.off('new_message');
        this.socket?.off('notification');
        this.socket?.off('typing');
    }

    getSocket() {
        return this.socket;
    }
}

export const socketService = new SocketService();
export default socketService;
