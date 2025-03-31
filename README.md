# Real-Time Chat Application

A WebSocket-based chat application with rooms and typing indicators, built with React, TypeScript, and Redux.

## Features

- **Real-time messaging** using WebSockets
- **Room creation/joining** with unique room IDs
- **Typing indicators** showing when others are typing
- **User persistence** across page refreshes
- **Responsive UI** with clean interface

## Technical Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit
- **WebSocket Library**: Teleparty WebSocket Lib
- **Routing**: React Router 6
- **Persistence**: Session Storage

## Key Implementation Details

### 1. Socket Service Architecture
```typescript
class SocketService {
  // Handles all WebSocket connections
  // Manages subscriptions for:
  // - Messages
  // - Typing indicators
  // - Connection status
  // - User IDs
}