import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from './entities/product.entity';
import mongoose, { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { paginated, transaction } from '../utils/database';
import { UtilService } from '../utils/utils.service';
import { ProductEvent } from '../utils/product';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products')
    private readonly productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
    private readonly utilService: UtilService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    return await transaction(this.connection, async (session) => {
      const newProduct = new this.productModel({
        ...createProductDto,
      });
      Logger.log(newProduct, 'PRODUCT_CREATED');

      return await newProduct.save({ session });
    });
  }

  findAll(ipage: number, ilimit: number, ifilter?: any) {
    const { page, limit, filter } = this.utilService.processPaginationAndFilter(
      ipage,
      ilimit,
      ifilter,
    );

    return paginated(this.productModel, {
      limit: limit,
      page: page,
      sort: '-createdAt',
      filter: filter,
    });
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = (await this.cacheManager.get(
      `product_${id}`,
    )) as ProductDocument;
    if (product) {
      return product;
    }

    const productFromDb = await this.productModel.findById(id);

    if (productFromDb) {
      await this.cacheManager.set(`product_${id}`, productFromDb, 30000);
      return productFromDb;
    }
    throw new NotFoundException('PRODUCT_NOT_FOUND');
  }
  async deleteOne(id: string) {
    const result = await transaction(this.connection, async (session) => {
      const products = await this.productModel.findById(id).session(session);
      if (!products) {
        throw new NotFoundException();
      }
      products.softDelete = true;
      await products.save({ session });
      this.eventEmitter.emit(ProductEvent.DELETE, { id: id });
      Logger.log(`Mark product ${id} delete`, 'PRODUCT_DELETED');
      return { message: 'PRODUCT_DELETED' };
    });

    return result;
  }
  @OnEvent(ProductEvent.DELETE)
  async deleteEventHandler(data: any) {
    Logger.log(`Delete event handler ${data.id}`, 'DELETE_EVENT_HANDLER');
    await transaction(this.connection, async (session) => {
      await this.productModel.deleteOne({ _id: data.id }).session(session);
    });
  }
}
