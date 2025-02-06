export class UtilService {
  processPaginationAndFilter(
    page: number,
    limit: number,
    filter: any,
  ): { page: number; limit: number; filter: any } {
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    if (limit > 20) {
      limit = 20;
    }

    if (filter) {
      const filterArray = filter.split(',');
      if (filterArray.length === 0) {
        filter = {};
      }
      filter = {};
      filterArray.forEach((f) => {
        const [key, value] = f.split('=');
        if (key && value) {
          filter[key] = value;
        }
      });
    } else {
      filter = {};
    }

    if (filter.q) {
      filter.description = {
        $regex: `.*${filter.q}.*`,
        $options: 'i',
      };
      delete filter.q;
    }
    if (typeof filter === 'string') {
      filter = {};
    }

    return { page, limit, filter };
  }
}
