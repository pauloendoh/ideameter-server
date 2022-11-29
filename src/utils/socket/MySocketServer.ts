import { Server } from "socket.io"

// singleton
export class MySocketServer {
  private static _instance: Server

  private constructor() {}

  public static get instance() {
    if (!this._instance) this._instance = new Server()
    return this._instance
  }

  public static setInstance(server: Server) {
    this._instance = server
  }
}
