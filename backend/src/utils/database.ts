import mongoose, {
  ClientSession,
  Connection,
  FilterQuery,
  PopulateOptions,
} from 'mongoose';

export const transaction = async <T>(
  connection: Connection,
  cb: (session: ClientSession) => Promise<T>,
): Promise<T> => {
  const session = await connection.startSession();

  try {
    session.startTransaction();
    const result = await cb(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  hasNext: boolean;
  limit: number;
}

export const paginated = async <T>(
  model: mongoose.Model<T>,
  paginationQuery: {
    page: number;
    limit: number;
    filter?: FilterQuery<T>;
    sort?: any;
    select?: string;
  },
  populate?: PopulateOptions[] | PopulateOptions,
): Promise<PaginatedResponse<T>> => {
  const { filter, page, limit, sort } = paginationQuery;

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    populate
      ? model
          .find(filter, {})
          .skip(skip)
          .limit(limit)
          .sort(sort || { createdAt: -1 })
          .populate(populate)
      : model.find(filter, {}).skip(skip).limit(limit),
    model.count(filter),
  ]);

  return {
    items: docs,
    hasNext: total > skip + limit,
    limit,
    page,
    total,
  };
};

export async function paginatedAgg<M>(
  collection: mongoose.Model<M>,
  matchPipeline: mongoose.PipelineStage[],
  paginationQuery: {
    page: number;
    limit: number;
  },
  withDeletedValues = false,
  extensionPipeline?: any[],
) {
  const { page, limit } = paginationQuery;

  const skip = (page - 1) * limit;
  matchPipeline.push(
    {
      $facet: {
        paginatedResults: extensionPipeline
          ? [{ $skip: skip }, { $limit: limit }].concat(extensionPipeline)
          : [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
    {
      $project: {
        _id: 0,
        items: '$paginatedResults',
        total: {
          $arrayElemAt: ['$totalCount.count', 0],
        },
      },
    },
  );

  const [{ items, total }] = withDeletedValues
    ? await (collection as any).aggregateWithDeleted(matchPipeline, {
        allowDiskUse: true,
      })
    : await collection.aggregate(matchPipeline, { allowDiskUse: true });

  return {
    page,
    limit,
    total: total,
    hasNext: total > skip + limit,
    items: items,
  };
}
