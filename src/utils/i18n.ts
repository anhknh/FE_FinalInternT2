import { createI18n } from 'vue-i18n';


const messages = {
    en: {
        welcomeMessage: 'Management',

        dashboard: "Dashboard",
        categories: "Categories",
        products: "Products",
        order: "Order",
        customers: "Customers",
        setting: "Setting",

        fieldNameCategory: "Name",
        fieldCodeCategory: "Category Code",
        fieldImageCategory: "Image",
        fieldDescriptionCategory: "Description",
        fieldCreateDateCategory: "Create Date",
        fieldCreateBy: "Created by",
        fieldUpdateBy: "Updated by",
        fieldUpdateDateCategory: "Update Date",
        fieldStatusCategory: "Status",
        fieldOperationsCategory: "Operations",
        fieldCodeProduct: "Product code",
        fieldCodePrice: "Price",
        fieldCodeQuantity: "Quantity",
        fieldCategory: "Category",
        totalPage: "Total",
        page: "page",
        goTo: "Go To",
        active: "Active",
        inactive: "Inactive",
        viewDetails: "Details",
        update: "Update",
        delete: "Delete",
        placeholderSearchCodeCATEGORY: "Enter Code Category",
        placeholderSearchNameCATEGORY: "Enter name Category",
        placeholderSearchCodePRO: "Enter Code Product",
        placeholderSearchNamePRO: "Enter name",
        placeholderSearchCrtStCATEGORY: "Start date",
        placeholderSearchCrtEdCATEGORY: "End date",
        placeholderSelectedCATEGORY: "Please select",
        btnExportExcel: "Export file Excel",
        btnAdd: "Add",
        btnConfirm: "Confirm",
        btnCancel: "Cancel",
        btnBack: "Back",
        btnSave: "Save",
        confirmDelete: "Do you want to delete this item?",
        error: "Error",
        errorFile: "Error downloading the file",
        errorFileType:"Only JPG/PNG files accepted!",
        errorFileSize:"File size must be less than 2MB!",
        errorForm: "Invalid input data",
        errorSearchDate: "start date must be less than end date",
        success: "Success",
        addSuccess: "Add new category successfully",
        updateSuccess: "Update category successfully",
        addSuccessPRO: "Add new product successfully",
        updateSuccessPRO: "Update product successfully",
        deleteSuccess: "Delete successfully",
        warning: "Warning",

        listCategory: "List categories",
        viewCategory: "View Category",
        updateCategory: "Update Category",
        addNewCategory: "Add New Category",
        titleFormAdd: "Add New Category",
        titleFormUpdate: "Update Category",
        titleFormView: "View detail Category",
        listProduct: "List products",
        viewProduct: "View product",
        updateProduct: "Update Product",
        addNewProduct: "Add New Product",
        titleFormAddPRO: "Add New Product",
        titleFormUpdatePRO: "Update Product",
        titleFormViewPRO: "View detail Category",
        validateCode: "Field code is required",
        validateCodeLength: "Code field must be at between 6-8 characters",
        validateCodePattern: "Code field does not contain special values",
        validateName: "Field name is required",
        validateNameLength: "Name field must be at less 255 characters",
        validateNamePattern: "Name field does not contain special values",
        validateDescription: "Field description is required",
        validateDescriptionLength: "Description field must be at less 255 characters",
        validatePrice: "Price must be integer",
        validatePriceValue: "Price must be positive integer",
        validateQuantity: "Quantity must be integer",
        validateQuantityValue: "Quantity must be positive integer",
        validateCategoryRequired: "Please select at least one category.",
        timeout: "Request timed out. Please try again later.",
        errorConnect: "Server connection error",
        errorServer: "Server error, please try again later"
    },
    vi: {
        welcomeMessage: 'Quản lý',

        dashboard: "Bảng điều khiển",
        categories: "Danh mục",
        products: "Sản phẩm",
        order: "Đơn hàng",
        customers: "Khách hàng",
        setting: "Cài đặt",

        fieldNameCategory: "Tên",
        fieldCodeCategory: "Mã Danh Mục",
        fieldImageCategory: "Ảnh",
        fieldDescriptionCategory: "Mô Tả",
        fieldCreateDateCategory: "Ngày Tạo",
        fieldCreateBy: "Người tạo",
        fieldUpdateBy: "Người Cập nhật",
        fieldUpdateDateCategory: "Ngày cập nhật",
        fieldStatusCategory: "Trạng Thái",
        fieldOperationsCategory: "Thao Tác",

        fieldCodeProduct: "Mã sản phẩm",
        fieldCodePrice: "Đơn giá",
        fieldCodeQuantity: "Số lượng",
        fieldCategory: "Danh mục",

        totalPage: "Tổng",
        page: "Trang",
        goTo: "Nhảy tới",
        active: "Hoạt Động",
        inactive: "Không hoạt động",
        viewDetails: "Xem chi tiết",
        update: "Cập nhật",
        delete: "Xóa",
        placeholderSearchCodeCATEGORY: "Tìm mã danh mục",
        placeholderSearchNameCATEGORY: "Tìm tên danh mục",
        placeholderSearchCodePRO: "Tìm mã sản phẩm",
        placeholderSearchNamePRO: "Tìm tên",
        placeholderSearchCrtStCATEGORY: "Từ ngày tạo",
        placeholderSearchCrtEdCATEGORY: "Đến ngày tạo",
        placeholderSelectedCATEGORY: "Chọn danh mục",
        btnExportExcel: "Xuất tiệp Excel",
        btnAdd: "Thêm",
        btnConfirm: "Xác nhận",
        btnCancel: "Hủy",
        btnBack: "Trở về",
        btnSave: "Lưu",
        confirmDelete: "Xác nhận xóa mục đã chọn?",
        error: "Thất bại",
        errorFile: "Tải tiệp về thất bại",
        errorFileType:"Chỉ chấp nhận các tiệp có định dạng JPG/PNG!",
        errorFileSize:"Kích thước tiệp phải nhỏ hơn 2MB!",
        errorForm: "Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại!",
        errorSearchDate: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
        success: "Thành công",
        addSuccess: "Thêm danh mục thành công",
        updateSuccess: "Cập nhật danh mục thành công",
        addSuccessPRO: "Thêm sản phẩm mới thành công",
        updateSuccessPRO: "Cập nhật sản phẩm thành công",
        deleteSuccess: "Xóa thành công",
        warning: "Cảnh báo",
        listCategory: "Danh sách danh mục",
        viewCategory: "Xem danh mục",
        updateCategory: "Cập nhật danh mục",
        addNewCategory: "Thêm danh mục mới",
        titleFormAdd: "Thêm danh mục mới",
        titleFormUpdate: "Cập nhật danh mục",
        titleFormView: "Xem chi tiết danh mục",
        listProduct: "Danh sách sản phẩm",
        viewProduct: "Xem sản phẩm",
        updateProduct: "Cập nhật sản phẩm",
        addNewProduct: "Thêm sản phẩm mới",
        titleFormAddPRO: "Thêm danh mục mới",
        titleFormUpdatePRO: "Cập nhật sản phẩm",
        titleFormViewPRO: "Xem chi tiết sản phẩm",
        validateCode: "Trường mã là bắt buộc",
        validateCodeLength: "Trường mã phải từ 6 đến 8 ký tự",
        validateCodePattern: "Trường mã không chứa ký tự đặc biệt",
        validateName: "Trường tên là bắt buộc",
        validateNameLength: "Trường tên phải ít hơn 255 ký tự",
        validateNamePattern: "Trường tên không chứa ký tự đặc biệt",
        validateDescription: "Trường mô tả là bắt buộc",
        validateDescriptionLength: "Trường mô tả phải ít hơn 255 ký tự",
        validatePrice: "Giá phải là số nguyên",
        validatePriceValue: "Giá phải là số nguyên dương",
        validateQuantity: "Số lượng phải là số nguyên",
        validateQuantityValue: "Số lượng phải là số nguyên dương",
        validateCategoryRequired: "Vui lòng chọn ít nhất một danh mục.",
        timeout: "Yêu cầu đã hết thời gian. Vui lòng thử lại sau.",
        errorConnect: "Lỗi kết nối máy chủ",
        errorServer: "Máy chủ gặp lỗi, vui lòng thử lại sau"
    },
};


const lang = localStorage.getItem("language");

const i18n = createI18n({
    locale: lang || "en",
    fallbackLocale: lang || "en",
    messages,
});

export default i18n;