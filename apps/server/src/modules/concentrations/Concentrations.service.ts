import Concentration from './Concentrations.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class ConcentrationService {
  static async Create(payload: any) {
    return await Concentration.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const query: any = {};
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      Concentration.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Concentration.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async Update(id: string, payload: any) {
    return await Concentration.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await Concentration.findByIdAndDelete(id);
  }
}

export default ConcentrationService;
