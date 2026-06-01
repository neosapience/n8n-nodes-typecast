import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  IDataObject,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

function throwTypecastApiError(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  error: unknown,
  context: string,
): never {
  const errorData = error as {
    message?: string;
    httpCode?: number | string;
    errorResponse?: { error_code?: string };
    error_code?: string;
  };
  const errorMessage = errorData.message || 'Unknown error';
  const statusCode = errorData.httpCode;
  const errorCode = errorData.errorResponse?.error_code || errorData.error_code;

  const statusDetails = statusCode ? `[${statusCode}] ` : '';
  const errorCodeDetails = errorCode ? `(Error Code: ${errorCode}) ` : '';
  const message = `${context}: ${statusDetails}${errorCodeDetails}${errorMessage}`;

  throw new NodeApiError(
    this.getNode(),
    {
      message,
      ...(statusCode ? { statusCode } : {}),
      ...(errorCode ? { error_code: errorCode } : {}),
    } as JsonObject,
    {
      message,
      ...(statusCode ? { httpCode: String(statusCode) } : {}),
    },
  );
}

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
  } catch (error) {
    throwTypecastApiError.call(this, error, 'Typecast API request failed');
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
  } catch (error) {
    throwTypecastApiError.call(this, error, 'Typecast API binary request failed');
  }
}

export async function typecastApiRequestFormData(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: FormData,
  qs: IDataObject = {},
  version: string = 'v1',
) {
  const options: IHttpRequestOptions = {
    method,
    body,
    qs,
    url: `https://api.typecast.ai/${version}${endpoint}`,
  };

  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'typecastApi',
      options,
    );
    return typeof response === 'string' ? JSON.parse(response) : response;
  } catch (error) {
    throwTypecastApiError.call(this, error, 'Typecast API multipart request failed');
  }
}

export async function typecastApiRequestNoContent(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  qs: IDataObject = {},
  version: string = 'v1',
): Promise<void> {
  const options: IHttpRequestOptions = {
    method,
    qs,
    url: `https://api.typecast.ai/${version}${endpoint}`,
  };

  try {
    await this.helpers.httpRequestWithAuthentication.call(this, 'typecastApi', options);
  } catch (error) {
    throwTypecastApiError.call(this, error, 'Typecast API request failed');
  }
}
