import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, default: () => uuidv4() })
  _id: string;

  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  description: string;

  @Prop({ required: true, default: '', index: true })
  category: string;

  @Prop({ required: true, default: '' })
  price: number;

  @Prop({ required: false, default: false })
  softDelete: boolean;

  @Prop({ select: false })
  __v: number;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
