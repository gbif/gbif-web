import { Socket } from 'net';
import Transport from 'winston-transport';

interface LogstashTransportOptions extends Transport.TransportStreamOptions {
  host: string;
  port: number;
}

export default class LogstashTransport extends Transport {
  private logstashHost: string;

  private logstashPort: number;

  private client: Socket;

  constructor(options: LogstashTransportOptions) {
    super(options);
    this.logstashHost = options.host;
    this.logstashPort = options.port;
    this.client = new Socket();

    this.client.on('error', (err: Error) => {
      console.error('Logstash connection error:', err);
      this.client.destroy();
      this.client = new Socket(); // Reinitialize the socket
    });

    this.client.connect(this.logstashPort, this.logstashHost, () => {
      console.log('Connected to Logstash');
    });
  }

  log(info: any, callback: () => void): void {
    const message = JSON.stringify(info);
    if (!this.client.destroyed) {
      this.client.write(`${message}\n`, callback);
    } else {
      console.error('Logstash client is not connected.');
      callback();
    }
  }
}
