export const CONSTANT = {
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    HOSPITALS_LIMIT: 12,
    DOCTORS_LIMIT: 12,
  },
  CURRENCY: {
    SYMBOL: "৳",
    CODE: "BDT",
    NAME: "Bangladeshi Taka",
  },
  VAT: {
    PERCENTAGE: 5,
    INCLUDED: true,
  },
  DATE_FORMAT: "DD MMM YYYY",
  TIME_FORMAT: "hh:mm A",
  VALIDATION: {
    PHONE_REGEX: /^(?:\+88|88)?(01[3-9]\d{8})$/,
    OTP_LENGTH: 6,
  },
  LOCAL_STORAGE_KEYS: {
    AUTH_TOKEN: "md_auth_token",
    USER_DATA: "md_user_data",
    USER_PREFERENCES: "md_user_prefs",
    RECENT_SEARCHES: "md_recent_searches",
    BOOKING_INTENT: "md_booking_intent",
  },
  CALLBACK_URL_PARAM: "callbackUrl",
};
