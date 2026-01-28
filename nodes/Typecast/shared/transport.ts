import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  IDataObject,
  IHttpRequestOptions,
} from 'n8n-workflow';

export async function typecastApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  version: string = 'v2',
) {
  const options: IHttpRequestOptions = {
    method,
    body,
    qs,
    url: `https://api.typecast.ai/${version}${endpoint}`,
    json: true,
  };

  try {
    return await this.helpers.httpRequestWithAuthentication.call(this, 'typecastApi', options);
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    const statusCode = error.httpCode;
    const errorCode = error.errorResponse?.error_code || error.error_code;

    const statusDetails = statusCode ? `[${statusCode}] ` : '';
    const errorCodeDetails = errorCode ? `(Error Code: ${errorCode}) ` : '';

    throw new Error(`Typecast API request failed: ${statusDetails}${errorCodeDetails}${errorMessage}`);
  }
}

export async function typecastApiRequestBinary(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  version: string = 'v1',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const options: IHttpRequestOptions = {
    method,
    body,
    qs,
    url: `https://api.typecast.ai/${version}${endpoint}`,
    json: true,
    encoding: 'arraybuffer',
  };

  try {
    return await this.helpers.httpRequestWithAuthentication.call(this, 'typecastApi', options);
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    const statusCode = error.httpCode;
    const errorCode = error.errorResponse?.error_code || error.error_code;

    const statusDetails = statusCode ? `[${statusCode}] ` : '';
    const errorCodeDetails = errorCode ? `(Error Code: ${errorCode}) ` : '';

    throw new Error(`Typecast API binary request failed: ${statusDetails}${errorCodeDetails}${errorMessage}`);
  }
}
