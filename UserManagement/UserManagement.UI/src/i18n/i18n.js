import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation and Common
      "signIn": "Sign in",
      "signOut": "Sign out",
      "logout": "Logout",
      "dashboard": "Dashboard",
      "welcome": "Welcome",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "cancel": "Cancel",
      "save": "Save",
      "edit": "Edit",
      "delete": "Delete",
      "add": "Add",
      "search": "Search",
      "clear": "Clear",
      "actions": "Actions",
      "or": "or",
      
      // Authentication
      "username": "Username",
      "password": "Password",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot your password?",
      "dontHaveAccount": "Don't have an account?",
      "signUp": "Sign up",
      "invalidCredentials": "Invalid username or password",
      "loginFailed": "Login failed. Please check your credentials.",
      "enterUsername": "Enter your username",
      "enterPassword": "Enter your password",
      
      // User Management
      "userManagement": "User Management",
      "allUsers": "All Users",
      "addNewUser": "Add New User",
      "editUser": "Edit User",
      "deleteUser": "Delete User",
      "userProfile": "User Profile",
      "myProfile": "My Profile",
      "totalUsers": "Total Users",
      "usersOverview": "Users Overview",
      
      // User Fields
      "id": "ID",
      "fullName": "Full Name",
      "role": "Role",
      "description": "Description",
      "status": "Status",
      "accountType": "Account Type",
      "accessLevel": "Access Level",
      "active": "Active",
      "standardUser": "Standard User",
      
      // Roles
      "admin": "Admin",
      "viewer": "Viewer",
      "user": "User",
      "selfOnly": "SelfOnly",
      
      // Dashboard Messages
      "adminAccess": "You have full access to manage all users.",
      "viewerAccess": "You can view all users but cannot make changes.",
      "userAccess": "You can only view your own data.",
      "viewerAccessDescription": "You have read-only access to view all users. You cannot add, edit, or delete users.",
      "userAccessDescription": "You can only view your own profile information. Contact an administrator for any changes.",
      
      // Forms
      "addUser": "Add User",
      "updateUser": "Update User",
      "newPassword": "New Password (leave empty to keep current)",
      "required": "Required",
      "usernameAlreadyExists": "Username already exists",
      "userAddedSuccessfully": "User added successfully",
      "userUpdatedSuccessfully": "User updated successfully",
      "userDeletedSuccessfully": "User deleted successfully",
      "failedToAddUser": "Failed to add user",
      "failedToUpdateUser": "Failed to update user",
      "failedToDeleteUser": "Failed to delete user",
      "failedToFetchUsers": "Failed to fetch users",
      "confirmDelete": "Are you sure you want to delete this user?",
      
      // Pagination
      "rowsPerPage": "Rows per page:",
      "of": "of",
      "page": "Page",
      "noUsersFound": "No users found",
      
      // Search and Sort
      "searchUsers": "Search users...",
      "sortBy": "Sort by",
      "ascending": "Ascending",
      "descending": "Descending",
      
      // Content (Landing Page)
      "roleBasedAccessControl": "Role-Based Access Control",
      "roleBasedAccessControlDesc": "Ensure each user sees exactly what they should. Admins manage all, editors update, viewers observe, and users stay focused on their own data.",
      "secureScalableArchitecture": "Secure & Scalable Architecture",
      "secureScalableArchitectureDesc": "Built using ASP.NET Core and React, this solution combines modern design with performance and extensibility.",
      "manageUsersEfficiently": "Manage Users Efficiently",
      "manageUsersEfficientlyDesc": "Easily create, update, and audit user information with intuitive interfaces and real-time validations.",
      "designedForRealTeams": "Designed for Real Teams",
      "designedForRealTeamsDesc": "Whether you are managing 10 users or 10,000, our system adapts seamlessly to your workflow — simple, smart, and effective.",
      
      // Personal Information
      "personalInformation": "Personal Information",
      "userId": "User ID",
      "accountStatus": "Account Status",
      "notSpecified": "Not specified",
      "noDescriptionProvided": "No description provided",
      
      // Error Messages
      "unableToConnect": "Unable to connect to the server. Please check if the API is running and accessible.",
      "somethingWentWrong": "Something went wrong",
      "unexpectedError": "We're sorry, but something unexpected happened. Please try refreshing the page.",
      "refreshPage": "Refresh Page",
      "initializingApplication": "Initializing application...",
      "unableToLoadProfile": "Unable to load profile information"
    }
  },
  ar: {
    translation: {
      // Navigation and Common
      "signIn": "تسجيل الدخول",
      "signOut": "تسجيل الخروج",
      "logout": "خروج",
      "dashboard": "لوحة التحكم",
      "welcome": "مرحباً",
      "loading": "جارٍ التحميل...",
      "error": "خطأ",
      "success": "نجح",
      "cancel": "إلغاء",
      "save": "حفظ",
      "edit": "تعديل",
      "delete": "حذف",
      "add": "إضافة",
      "search": "بحث",
      "clear": "مسح",
      "actions": "الإجراءات",
      "or": "أو",
      
      // Authentication
      "username": "اسم المستخدم",
      "password": "كلمة المرور",
      "rememberMe": "تذكرني",
      "forgotPassword": "نسيت كلمة المرور؟",
      "dontHaveAccount": "ليس لديك حساب؟",
      "signUp": "إنشاء حساب",
      "invalidCredentials": "اسم المستخدم أو كلمة المرور غير صحيحة",
      "loginFailed": "فشل تسجيل الدخول. يرجى التحقق من بياناتك.",
      "enterUsername": "أدخل اسم المستخدم",
      "enterPassword": "أدخل كلمة المرور",
      
      // User Management
      "userManagement": "إدارة المستخدمين",
      "allUsers": "جميع المستخدمين",
      "addNewUser": "إضافة مستخدم جديد",
      "editUser": "تعديل المستخدم",
      "deleteUser": "حذف المستخدم",
      "userProfile": "الملف الشخصي",
      "myProfile": "ملفي الشخصي",
      "totalUsers": "إجمالي المستخدمين",
      "usersOverview": "نظرة عامة على المستخدمين",
      
      // User Fields
      "id": "المعرف",
      "fullName": "الاسم الكامل",
      "role": "الدور",
      "description": "الوصف",
      "status": "الحالة",
      "accountType": "نوع الحساب",
      "accessLevel": "مستوى الوصول",
      "active": "نشط",
      "standardUser": "مستخدم عادي",
      
      // Roles
      "admin": "مدير",
      "viewer": "مشاهد",
      "user": "مستخدم",
      "selfOnly": "ذاتي فقط",
      
      // Dashboard Messages
      "adminAccess": "لديك وصول كامل لإدارة جميع المستخدمين.",
      "viewerAccess": "يمكنك عرض جميع المستخدمين ولكن لا يمكنك إجراء تغييرات.",
      "userAccess": "يمكنك عرض بياناتك الخاصة فقط.",
      "viewerAccessDescription": "لديك وصول للقراءة فقط لعرض جميع المستخدمين. لا يمكنك إضافة أو تعديل أو حذف المستخدمين.",
      "userAccessDescription": "يمكنك عرض معلومات ملفك الشخصي فقط. اتصل بالمدير لإجراء أي تغييرات.",
      
      // Forms
      "addUser": "إضافة مستخدم",
      "updateUser": "تحديث المستخدم",
      "newPassword": "كلمة المرور الجديدة (اتركها فارغة للاحتفاظ بالحالية)",
      "required": "مطلوب",
      "usernameAlreadyExists": "اسم المستخدم موجود بالفعل",
      "userAddedSuccessfully": "تم إضافة المستخدم بنجاح",
      "userUpdatedSuccessfully": "تم تحديث المستخدم بنجاح",
      "userDeletedSuccessfully": "تم حذف المستخدم بنجاح",
      "failedToAddUser": "فشل في إضافة المستخدم",
      "failedToUpdateUser": "فشل في تحديث المستخدم",
      "failedToDeleteUser": "فشل في حذف المستخدم",
      "failedToFetchUsers": "فشل في جلب المستخدمين",
      "confirmDelete": "هل أنت متأكد من حذف هذا المستخدم؟",
      
      // Pagination
      "rowsPerPage": "الصفوف في الصفحة:",
      "of": "من",
      "page": "الصفحة",
      "noUsersFound": "لم يتم العثور على مستخدمين",
      
      // Search and Sort
      "searchUsers": "البحث عن المستخدمين...",
      "sortBy": "ترتيب حسب",
      "ascending": "تصاعدي",
      "descending": "تنازلي",
      
      // Content (Landing Page)
      "roleBasedAccessControl": "التحكم في الوصول القائم على الأدوار",
      "roleBasedAccessControlDesc": "تأكد من أن كل مستخدم يرى بالضبط ما يجب أن يراه. المديرون يديرون الكل، والمحررون يحدثون، والمشاهدون يراقبون، والمستخدمون يركزون على بياناتهم الخاصة.",
      "secureScalableArchitecture": "هندسة آمنة وقابلة للتوسع",
      "secureScalableArchitectureDesc": "مبنية باستخدام ASP.NET Core و React، هذا الحل يجمع بين التصميم الحديث والأداء وقابلية التوسع.",
      "manageUsersEfficiently": "إدارة المستخدمين بكفاءة",
      "manageUsersEfficientlyDesc": "إنشاء وتحديث ومراجعة معلومات المستخدم بسهولة مع واجهات بديهية والتحقق في الوقت الفعلي.",
      "designedForRealTeams": "مصمم للفرق الحقيقية",
      "designedForRealTeamsDesc": "سواء كنت تدير 10 مستخدمين أو 10000، نظامنا يتكيف بسلاسة مع سير عملك - بسيط وذكي وفعال.",
      
      // Personal Information
      "personalInformation": "المعلومات الشخصية",
      "userId": "معرف المستخدم",
      "accountStatus": "حالة الحساب",
      "notSpecified": "غير محدد",
      "noDescriptionProvided": "لا يوجد وصف مقدم",
      
      // Error Messages
      "unableToConnect": "غير قادر على الاتصال بالخادم. يرجى التحقق من تشغيل API وإمكانية الوصول إليه.",
      "somethingWentWrong": "حدث خطأ ما",
      "unexpectedError": "نحن آسفون، لكن حدث شيء غير متوقع. يرجى تحديث الصفحة.",
      "refreshPage": "تحديث الصفحة",
      "initializingApplication": "تهيئة التطبيق...",
      "unableToLoadProfile": "غير قادر على تحميل معلومات الملف الشخصي"
    }
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false
    }
  });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction based on current language
const currentLanguage = i18n.language || 'en';
const isRTL = currentLanguage === 'ar';
document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
document.documentElement.lang = currentLanguage;

export default i18n;
