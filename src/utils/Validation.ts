import { useDebounceFn } from '@vueuse/core';

const patternCode = /^[A-Za-z0-9]+$/;
const patternName = /^[A-Za-z0-9 ]+$/;

export const validateCode = (t: (key: string) => string) => {
    return useDebounceFn(
        (rule: any, value: string, callback: (error?: Error) => void): void => {
            if (value.trim() === '') {
                callback(new Error(t('validateCode')));
            } else if (value.length < 6 || value.length > 8) {
                callback(new Error(t('validateCodeLength')));
            } else {
                if (!patternCode.test(value)) {
                    callback(new Error(t('validateCodePattern')));
                } else {
                    callback();
                }
            }
        },
        300
    );
};

export const validateName = (t: (key: string) => string) => {
    return useDebounceFn(
        (rule: any, value: string, callback: (error?: Error) => void): void => {
            if (value.trim() === '') {
                callback(new Error(t('validateName')));
            } else if (value.length > 255) {
                callback(new Error(t('validateNameLength')));
            } else {
                if (!patternName.test(value)) {
                    callback(new Error(t('validateNamePattern')));
                } else {
                    callback();
                }
            }
        },
        300
    );
};


export const validateDescription = (t: (key: string) => string) => {
    return useDebounceFn(
        (rule: any, value: string, callback: (error?: Error) => void): void => {
            if (value.trim() === '') {
                callback(new Error(t('validateDescription')));
            } else if (value.length > 255) {
                callback(new Error(t('validateDescriptionLength')));
            } else {
                callback();
            }
        },
        300
    );
};


export const validatePrice = (t: (key: string) => string) => {
    return useDebounceFn(
        (rule: any, value: string, callback: (error?: Error) => void): void => {
            const price = Number(value);

            if (!Number.isInteger(price)) {
                return callback(new Error(t('validatePrice')));
            }
            if (price <= 0) {
                return callback(new Error(t('validatePriceValue')));
            }
            callback();
        },
        300
    );
};


export const validateQuantity = (t: (key: string) => string) => {
    return useDebounceFn(
        (rule: any, value: string, callback: (error?: Error) => void): void => {
            const quantity = Number(value);

            if (!Number.isInteger(quantity)) {
                return callback(new Error(t('validateQuantity')));
            }
            if (quantity <= 0) {
                return callback(new Error(t('validateQuantityValue')));
            }
            callback();
        },
        300
    );
};

export const validateCategory = (t: (key: string) => string) => {
    return useDebounceFn(
        (rule: any, value: string[], callback: (error?: Error) => void): void => {
            console.log(value)
            if (!value || value.length === 0) {
                return callback(new Error(t('validateCategoryRequired')));
            }
            callback();
        },
        300
    );
};

