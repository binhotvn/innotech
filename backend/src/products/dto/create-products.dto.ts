import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsArray,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'TITLE_REQUIRED' })
  name: string;

  @IsNotEmpty({ message: 'DESCRIPTION_REQUIRED' })
  description: string;

  @IsNotEmpty({ message: 'PRICE_REQUIRED' })
  @IsPositive({ message: 'PRICE_INVALID' })
  @Min(0, { message: 'PRICE_INVALID' })
  price: number;

  @IsNotEmpty({ message: 'CATEGORY_REQUIRED' })
  category: string;
}
