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
	} catch (error) {
		throw new Error(`Typecast API request failed: ${(error as Error).message}`);
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
		throw new Error(`Typecast API binary request failed: ${(error as Error).message}`);
	}
}
