import SmsLog, { SmsCategory, SmsStatus } from './SmsLogs.model.js';
import { buildMeta, parsePagination } from '../../utils/sendResponse.js';

class SmsLogService {
  static async Create(payload: {
    phone: string;
    message: string;
    category?: SmsCategory;
    status?: SmsStatus;
    provider?: string;
    providerResponse?: any;
    errorMessage?: string;
    ip?: string;
    userAgent?: string;
  }) {
    const providerResponse =
      payload.providerResponse !== undefined
        ? typeof payload.providerResponse === 'string'
          ? payload.providerResponse
          : JSON.stringify(payload.providerResponse)
        : undefined;
    return await SmsLog.create({ ...payload, providerResponse });
  }

  static async GetAll(filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const query: any = {};
    if (filters.phone) {
      query.phone = { $regex: String(filters.phone), $options: 'i' };
    }
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { phone: { $regex: String(filters.search), $options: 'i' } },
        { message: { $regex: String(filters.search), $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      SmsLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      SmsLog.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetOne(id: string) {
    return await SmsLog.findById(id);
  }

  static async Delete(id: string) {
    return await SmsLog.findByIdAndDelete(id);
  }
}

export default SmsLogService;
