import { IWrapper } from '../type/wrapper.interface';

export default async function Wrapper<T>(
  fn: (...params: any) => T,
  params: Record<string, any>,
  successMessage: string,
  waitAsync: boolean = true,
): Promise<IWrapper<T>> {
  try {
    const result = waitAsync
      ? await fn(...Object.values(params))
      : fn(...Object.values(params));
    return {
      statusCode: 200,
      message: successMessage,
      data: result,
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message,
    };
  }
}
