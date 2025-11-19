import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function typecastApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('typecastApi');

	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': credentials.apiKey as string,
		},
		body,
		qs,
		uri: `https://api.typecast.ai/v1${endpoint}`,
		json: true,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as any);
	}
}

export async function typecastApiRequestBinary(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('typecastApi');

	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': credentials.apiKey as string,
		},
		body,
		qs,
		uri: `https://api.typecast.ai/v1${endpoint}`,
		json: true,
		encoding: null, // Return binary data
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as any);
	}
}
