import axios, { ResponseType } from 'axios';
import { AuthenticationService } from '@/services/AuthenticationService';
import { Storage } from './storage';
import { msg } from './msg';

export type ApiResponseType = {
    success: boolean;
    messages: {
        message: string
    };
    code: number;
    data: any;
};

export const enum ApiResponseCode {
    Success = 200,
    Failure = 400,
    NotFound = 404,
    Unauthorized = 401,
    Forbidden = 403
}

export const PRODUCTION_MODE = import.meta.env.MODE === 'production';
export const ApiHost = PRODUCTION_MODE ? 'api.prexms.com' : 'localhost:8000';

export const getApiEndpoint = () => {
    return `${PRODUCTION_MODE ? 'https' : 'http'}://${ApiHost}/api/admin/`;
};

export const getAuthToken = async () => {
    const token = await Storage.get<string>('token');
    return token;
};

type OtherOptions = {
    handleError?: boolean;
    headers?: Record<string, string>;
    responseType?: ResponseType;
    download?: boolean;
    onError?: () => void;
    onUploadProgress?: (percentage: number) => void;
};

export function Api(
    url: string,
    body?: FormData | object,
    options?: OtherOptions & { download?: false | undefined }
): Promise<ApiResponseType>;

export function Api(
    url: string,
    body?: FormData | object,
    options?: OtherOptions & { download: true }
): Promise<Blob>;

// implementation
export async function Api(
    url: string,
    body: FormData | Object = {},
    options: OtherOptions & { download?: boolean } = { handleError: true }
): Promise<ApiResponseType | Blob> {
    try {
        const token = await getAuthToken();

        if (!/https?:\/\//.test(url)) {
            url = `${getApiEndpoint()}${url}`;
        }

        let headers: any = {
            'Accept': options.download ? 'application/octet-stream' : 'application/json',
            'Authorization': `Bearer ${token}`,
            'organization': window.location.hostname
        };

        if (!(body instanceof FormData) && typeof body === 'object') {
            const hasFile = Object.values(body).find(k => k instanceof File);
            if (hasFile) {
                const fd = new FormData();
                for (const key in body) {
                    if ([undefined, null].includes((body as Record<string, any>)[key])) continue;
                    fd.append(key, (body as Record<string, any>)[key]);
                }
                body = fd;
            }
        }

        if (body instanceof FormData) {
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            headers['Content-Type'] = 'application/json';
        }

        if (options.headers) {
            headers = { ...headers, ...options.headers };
        }

        const response = await axios.post(url, body, {
            headers,
            responseType: options.download ? 'blob' : options.responseType,
            onUploadProgress: (e) => {
                if (e && e.total) {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    if (typeof options.onUploadProgress === 'function') {
                        options.onUploadProgress(percent);
                    }
                }
            },
        });

        if (options.download) {
            return response.data as Blob;
        }

        if (response?.data?.code !== ApiResponseCode.Success && options.handleError !== false) {
            if (response.data?.message) {
                if (typeof response.data?.message === 'string') {
                    msg.warning(response.data.message);
                } else if (Array.isArray(response.data?.message)) {
                    response.data.message.forEach((message: string) => msg.warning(message));
                } else if (typeof response.data?.message === 'object') {
                    msg.warning(response.data.message?.message || 'Something went wrong');
                }
            }
        }

        return response.data;
    } catch (error: any) {
        console.error('API Error:', url, error);

        let message = 'Something went wrong';
        let code = ApiResponseCode.Failure;

        if (error.response) {
            message = error.response.data.error || message;
            code = error.response.status;

            if (code === ApiResponseCode.Unauthorized) {
                await AuthenticationService.logoutPlatform().catch(e => console.error(e));
                window.location.href = '/login';
                msg.error('Unauthorized access. Please log in again.');
            } else if (code === ApiResponseCode.NotFound) {
                msg.error('Resource not found');
            } else {
                msg.error(message);
            }
        } else {
            msg.error(message);
        }

        return {
            success: false,
            messages: { message },
            code,
            data: {},
        };
    }
}

export default Api;
