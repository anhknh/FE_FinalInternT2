import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import i18n from "@/utils/i18n";
import NotificationCustom from "@/utils/NotificationCustom";
import { Composer } from 'vue-i18n'; // Thêm kiểu Composer để khai báo t

class ApiService {
    private axiosInstance: AxiosInstance;
    private static readonly BASE_URL: string = ' http://192.168.1.10:8081';
    private static readonly TIMEOUT: number = 5000; // Thời gian timeout (ms)
    private t: Composer['t']; // Khai báo hàm t với kiểu đúng

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: ApiService.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: ApiService.TIMEOUT, // Thêm cấu hình timeout
        });

        // Gán hàm dịch từ i18n
        this.t = i18n.global.t;

        // Interceptors
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const currentLanguage = localStorage.getItem('language') || 'en';
                config.headers['Accept-Language'] = currentLanguage;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.code === 'ECONNABORTED') {
                    // Xử lý lỗi timeout
                    NotificationCustom.error(this.t('timeout'), this.t('error'));
                } else if (!error.response) {
                    // Xử lý lỗi không kết nối được (backend tắt)
                    NotificationCustom.error(this.t('errorConnect'), this.t('error'));
                } else {
                    // Xử lý lỗi từ server
                    NotificationCustom.error(this.t('errorServer'), this.t('error'));
                }
                return Promise.reject(error);
            }
        );
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}

export default new ApiService(); // Khởi tạo luôn đối tượng singleton
