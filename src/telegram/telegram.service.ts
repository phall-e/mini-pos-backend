import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
    public async sendMessage(chatId: string, message: string) {
        try {
            const token = process.env.TELEGRAM_BOT_TOKEN;
            await axios.post(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {
                    chat_id: chatId,
                    text: message,
                },
            );
        } catch (error) {
            throw error;
        }
    }
}
