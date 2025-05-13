import fs from 'fs';
import path from 'path';

export class LoggerService {
    private logDir: string;
    
    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.createLogDirectory();
    }

    private createLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    public async saveLog(message: string) {
        const date = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logDir, `${date}.log`);
        
        await fs.promises.appendFile(logFile, message + '\n');
    }

    public async getLogs(date?: string): Promise<string[]> {
        const fileName = date ? `${date}.log` : `${new Date().toISOString().split('T')[0]}.log`;
        const logFile = path.join(this.logDir, fileName);
        
        if (!fs.existsSync(logFile)) {
            return [];
        }
        
        const content = await fs.promises.readFile(logFile, 'utf-8');
        return content.split('\n').filter(line => line);
    }
}