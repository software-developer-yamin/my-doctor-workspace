import CallbackRequest, { CallbackRequestStatus } from './CallbackRequests.model.js';
import { buildMeta, parsePagination } from '../../utils/sendResponse.js';

class CallbackRequestService {
  static async Create(payload: {
    name: string;
    phone: string;
    note?: string;
    ip?: string;
    userAgent?: string;
  }) {
    return await CallbackRequest.create(payload);
  }

  static async GetAll(filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      const rx = { $regex: String(filters.search), $options: 'i' };
      query.$or = [{ name: rx }, { phone: rx }, { note: rx }];
    }

    const [data, total] = await Promise.all([
      CallbackRequest.find(query)
        .populate('handledBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CallbackRequest.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetOne(id: string) {
    return await CallbackRequest.findById(id).populate('handledBy', 'name email');
  }

  static async UpdateStatus(
    id: string,
    status: CallbackRequestStatus,
    handledBy?: string,
  ) {
    const update: any = { status };
    if (status === 'called' || status === 'completed') {
      update.handledAt = new Date();
      if (handledBy) update.handledBy = handledBy;
    }
    return await CallbackRequest.findByIdAndUpdate(id, update, { new: true });
  }

  static async Delete(id: string) {
    return await CallbackRequest.findByIdAndDelete(id);
  }
}

export default CallbackRequestService;
