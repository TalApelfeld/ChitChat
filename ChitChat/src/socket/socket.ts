import { io, Socket } from "socket.io-client";

const URL =
  location.hostname === "localhost"
    ? (import.meta.env.VITE_SOCKET_PC_URL as string)
    : `ws://${location.hostname}:3000`;

// Configure retries and timeouts to be robust during dev
export const socket: Socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"], // avoid long-poll fallback noise in dev
  autoConnect: false, // IMPORTANT: we will call connect() explicitly
});
