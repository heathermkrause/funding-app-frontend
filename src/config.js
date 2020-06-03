export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export const domain = 'restaurant.review';
export const PAGE_LIMIT = 4;
export const TABLE_LIST_LIMIT = 10;
export const MSG_COUNT_LIMIT = 10;

export const ALERT_COUNT = 5;
