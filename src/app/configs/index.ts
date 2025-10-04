import "dotenv/config";

export const configs = {
    port: process.env.PORT,
    env: "development",
    jwt: {
        accessToken_expires: process.env.ACCESS_TOKEN_EXPIRES,
        refreshToken_expires: process.env.REFRESH_TOKEN_EXPIRES,
        accessToken_secret: process.env.ACCESS_TOKEN_SECRET,
        refreshToken_secret: process.env.REFRESH_TOKEN_SECRET,

    },
    db_url: process.env.DB_URL,
    email: {
        app_email: process.env.APP_USER_EMAIL,
        app_password: process.env.APP_PASSWORD
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        cloud_api_key: process.env.CLOUD_API_KEY,
        cloud_api_secret: process.env.CLOUD_API_SECRET
    }
}