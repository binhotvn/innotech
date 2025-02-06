import { ApiProperty } from '@nestjs/swagger';

export interface IWrapper<T> {
  statusCode: number;
  message: string;
  data?: T | Promise<T>;
}

export class TWrapper<T> implements IWrapper<T> {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  data?: T | Promise<T>;

  constructor(statusCode: number, message: string, data?: T | Promise<T>) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
