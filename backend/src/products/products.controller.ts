import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import Wrapper from 'src/utils/wrapper.controller';
import { Throttle } from '@nestjs/throttler';
import { version } from 'os';

@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const user = req.user;
    return Wrapper(
      this.productsService.create.bind(this.productsService),
      { createProductDto, user },
      'PRODUCT_CREATED',
      true,
    );
  }

  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filters') filter: string,
  ) {
    return this.productsService.findAll(page, limit, filter);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.deleteOne(id);
  }
}
