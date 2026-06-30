import axios from 'axios';
import SmsLogService from '../modules/sms-logs/SmsLogs.service.js';
import type { SmsCategory } from '../modules/sms-logs/SmsLogs.model.js';

export interface SmsOptions {
  category?: SmsCategory;
  ip?: string;
  userAgent?: string;
}

export const sendSMS = async (
  to: string,
  message: string,
  options: SmsOptions = {},
) => {
  const token = process.env.GREEN_WEB_KEY;
  const params = new URLSearchParams();
  params.append('token', token || '');
  params.append('to', to);
  params.append('message', message);

  try {
    const response = await axios.post(
      'http://api.greenweb.com.bd/api.php',
      params,
    );

    // Persist every send — fire-and-forget so logging failures never break the send
    SmsLogService.Create({
      phone: to,
      message,
      category: options.category ?? 'other',
      status: 'sent',
      provider: 'greenweb',
      providerResponse: response.data,
      ip: options.ip,
      userAgent: options.userAgent,
    }).catch((e) => console.error('Failed to log SMS:', e));

    return response.data;
  } catch (error: any) {
    console.error('SMS sending failed:', error);

    SmsLogService.Create({
      phone: to,
      message,
      category: options.category ?? 'other',
      status: 'failed',
      provider: 'greenweb',
      errorMessage:
        error?.response?.data?.toString?.() ||
        error?.message ||
        'Unknown error',
      ip: options.ip,
      userAgent: options.userAgent,
    }).catch((e) => console.error('Failed to log failed SMS:', e));

    throw new Error('Failed to send SMS');
  }
};
