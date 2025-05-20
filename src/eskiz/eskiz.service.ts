import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EskizService {
  private token: string | null = null;
  private baseUrl = process.env.ESKIZ_BASE_URL;
  private email = process.env.ESKIZ_EMAIL;
  private password = process.env.ESKIZ_PASSWORD;
  constructor() {
    this.auth();
  }

  async auth() {
    try {
      let { data: response } = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password,
      });

      this.token = response?.data?.token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendSMS(message: string, phone: string) {
    try {
      let {} = await axios.post(
        `${this.baseUrl}/message/sms/send`,
        {
          mobile_phone: phone,
          message: 'This is test from Eskiz',
          from: '4546',
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );
    } catch (error) {
      await this.auth();
      await this.sendSMS(message, phone);
      throw new BadRequestException(error.message);
    }
  }
}
