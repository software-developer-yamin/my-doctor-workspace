import ContactMessage, { ContactMessageStatus } from './ContactMessages.model.js';
import { buildMeta, parsePagination } from '../../utils/sendResponse.js';

class ContactMessageService {
  static async Create(payload: {
    name: string;
    phone: string;
    subject: string;
    message: string;
    ip?: string;
    userAgent?: string;
  }) {
    return await ContactMessage.create(payload);
  }

  static async GetAll(filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      const rx = { $regex: String(filters.search), $options: 'i' };
      query.$or = [
        { name: rx },
        { phone: rx },
        { subject: rx },
        { message: rx },
      ];
    }

    const [data, total] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetOne(id: string) {
    return await ContactMessage.findById(id);
  }

  static async UpdateStatus(id: string, status: ContactMessageStatus) {
    return await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  static async Delete(id: string) {
    return await ContactMessage.findByIdAndDelete(id);
  }
}

export default ContactMessageService;
