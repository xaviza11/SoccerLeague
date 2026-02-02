import axios from 'axios';
import { Readable } from 'stream';

export class GameClient {
  private readonly gameEndpoint = "/game/stream"; 
  private CRUD_API: string;

  constructor() {
    this.CRUD_API = process.env.CRUD_API || "http://localhost:3000";
  }

  /**
   * Recibe un array de juegos y los envía como un stream NDJSON (Newline Delimited JSON)
   */
  public async sendStream(payloads: any[]): Promise<any> {
    const url = `${this.CRUD_API}${this.gameEndpoint}`;

    const stream = new Readable({
      read() {
        payloads.forEach(obj => {
          this.push(JSON.stringify(obj) + '\n');
        });
        this.push(null);
      }
    });

    try {
      const response = await axios.post(url, stream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Transfer-Encoding': 'chunked'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error enviando stream desde Fastify:", error.message);
      throw error;
    }
  }
}