
import { ElNotification } from 'element-plus';

class NotificationCustom {
    private message: string;
    private type: 'success' | 'warning' | 'info' | 'error'; // Giới hạn type
    private title: string;

    constructor(message: string, type: 'success' | 'warning' | 'info' | 'error', title: string) {
        this.message = message;
        this.type = type;
        this.title = title;
    }

    // Phương thức mở thông báo
    public open(): void {
        ElNotification({
            title: this.title,
            message: this.message,
            type: this.type,
        });
    }

    // Phương thức tiện lợi để mở thông báo success
    public static success(message: string, title: string): void {
        new NotificationCustom(message, 'success', title).open();
    }

    // Phương thức tiện lợi để mở thông báo warning
    public static warning(message: string, title: string): void {
        new NotificationCustom(message, 'warning', title).open();
    }

    // Phương thức tiện lợi để mở thông báo info
    public static info(message: string, title: string): void {
        new NotificationCustom(message, 'info', title).open();
    }

    // Phương thức tiện lợi để mở thông báo error
    public static error(message: string, title: string): void {
        new NotificationCustom(message, 'error', title).open();
    }
}

export default NotificationCustom;
