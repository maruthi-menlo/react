'use strict';

export const httpUrls = {
    LOGIN: 'login',
    COUNTRIES: 'getCountries',
    STATES:'getStatesByCountry',
    ADD_DIRECT_CUSTOMER:'addCustomer',
    UPDATE_DIRECT_CUSTOMER:'updateCustomer',
    DC_ROLES: 'getRoles',
    CSP_ROLES: 'getCSPRoles',
    ADD_CSP_CUSTOMER: 'addCSPCustomer',
    UPDATE_CSP_CUSTOMER: 'updateCSPCustomer',
    CREATE_PASSWORD: 'createPassword',
    VALIDATE_PASSWPORD_TOKEN: 'checkValidToken',
    GET_DC_DATA: 'getListCustomers',
    GET_CSP_DC_DATA: 'getListCustomersCSPAdmin',
    GET_CSP_DATA:'getCSPListCustomers',
    GET_DC_USER_DATA: 'getcustomer',
    GET_CSP_USER_DATA: 'getCSPCustomer',
    EDIT_PLAYA_USER_DATA: 'adminEditProfile',
    EDIT_CUST_ADMIN_USER_DATA: 'editProfile',
    EDIT_ADMIN_USER_DATA: 'updateCSPAdminProfile',
    DEACTIVATE_CSP_DIRECT_USERS:'removeUserFromCustomer',
    UPDATE_USER_STATUS:'updateStatusCustomer',
    FORGOT_PWD:'forgotPassword',
    REMOVE_SUBSCRIPTION:'removeSubscriptionFromCustomer',
    GET_LOGO:'getProfileImage',
    GET_POWERBI_DATA:'getParamasPowerbi',
    GET_SUBSCRIPTIONS:'CustomerAdminListSubscriptions',
    UPDATE_SUBSCRIPTIONS:'CustomerAdminUpdateSubscriptions'
}

