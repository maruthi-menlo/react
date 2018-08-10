export class Constants{

    // Environments settings

    // Develop URL
    // BASE_URL = `http://192.168.1.231:3000/api/v1/`;

    // Stage URL
    // BASE_URL = `http://137.116.56.150:3000/api/v1/`;
    
    // QA URL
    BASE_URL = `http://137.116.56.150:4000/api/v1/`;

    REQUIRED_PASSWORD_CONFIRMPASSWORD_SAME = "Password and Password Confirm should be the same.";
    REQUIRED_PASSWORD_AGAINPASSWORD_SAME = "Password and Password again should be the same.";
    TERMS_CONDITIONS = "Please accept terms & conditions.";
    MOBILE_NUMBER_FORMAT = "Phone number is invalid.";
    PASSWORD_RULE_MESSAGE = "Password should contain a minimum of eight characters with at least one letter, one number, and one special character.";
    USER_NAME_EXISTS = 'Username already in use.';
    LOGIN_USER_NAME_REQUIRED = 'Please enter username.';
    FIRM_NAME_REQUIRED = 'Please enter firm name.';
    FIRST_NAME_REQUIRED = 'Please enter first name.';
    LAST_NAME_REQUIRED = 'Please enter last name.';
    LOGIN_PASSWORD_REQUIRED = 'Please enter password.';
    INVALID_LOGIN = 'Invalid credentials. Please try again. Please note your account will get locked after 5 unsuccessful attempts.';
    CELL_NUMBER_REQUIRED = 'Phone number is required.';
    CELL_NUMBER_VALID = 'Please enter valid phone number.';
    ACCOUNT_TYPE_REQUIRED = 'Please enter account type.';
    EMAIL_MOBILE_REQUIRED = 'Please enter email or cell number.';
    VALID_EMAIL = 'Please enter valid email.'
    INVALID_VERIFY_CODE = 'Please enter valid code.';
    PASSWORD_NOT_MATCH = "Password doesn't meet requirements.";
    INTERNAL_SERVER_ERROR = 'Something went wrong.';
    USERNAME_FORMAT = 'Username can only contain letters and numbers.';
    USERNAME_MIN_CHARCTERS = 'Username should be 5 to 60 characters.';
    GP_DELEGATES_REQUIRED = 'Please select atleast one Gp Delegate for this fund.';
    LP_REQUIRED = 'Please select atleast one LP for this fund.';
    LEGAL_ENTITY_REQUIRED = 'Please enter Legal Entity.';
    LEGAL_ENTITY_NAME_REQUIRED = 'Please enter Fund Manager (GP) Legal Entity Name.';
    UPLOAD_DOC_REQUIRED = 'Please upload paternship document.';
    FUND_TARGET_COMMITMENT_MSZ = 'The Fund Target Commitment should always be less than the Hard Cap value.';
    FUND_HARD_CAP_MSZ = 'Hard Cap value should always be greater than the Fund Target Commitment.';
    NO_GP_DELEGATES = 'You haven’t added any GP Delegates to this Fund yet.';
    NO_LPS = 'You haven’t added any LPs to this Fund yet.';
    NO_GP_FUNDS = 'No Funds available. Please click on Create Fund button to create new Fund.';
    NO_LP_FUNDS = 'No Funds available.';


    /**************LP Subscrption Form Start****************/
    NAME_REQUIRED = 'Please enter name.';
    STREET_REQUIRED = 'Please enter Street name.';
    CITY_REQUIRED = 'Please enter City name.';
    STATE_REQUIRED = 'Please enter State name.';
    ZIP_REQUIRED = 'Please enter Zip.';
    ENTITY_NAME_REQUIRED = 'Please enter Entity’s Name.';
    INVESTOR_SUB_TYPE_REQUIRED = 'Please select Investor Sub Type.';
    ENTITY_TYPE_REQUIRED = 'Please enter Entity type.';
    JURIDICTION_REQUIRED = 'Please select Entity legally registered.';
    ENTITY_US_501_REQUIRED = 'Please select Is the Entity a U.S. 501(c)(3)?.';
    EQUITY_OWNERS_REQUIRED = 'Please enter number of direct equity owners of the Entity.';
    EXISTING_INVESTORS_REQUIRED = 'Please enter existing or prospective investors.';
    TOTAL_VALUE_REQUIRED = 'Please enter total value of equity interests in the Trust is held by “benefit plan investors”.';
    
    /**************LP Subscrption Form End***************/
}