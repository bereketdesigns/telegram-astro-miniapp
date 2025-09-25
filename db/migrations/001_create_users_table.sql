-- db/migrations/001_create_users_table.sql
-- This SQL script creates the 'users' table if it doesn't already exist.
-- This table stores basic user information retrieved from Telegram's initData.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,              -- A unique integer ID for each user, automatically increments.
    telegram_id BIGINT UNIQUE NOT NULL, -- The user's unique Telegram ID. BIGINT is used because Telegram IDs can be large.
                                        -- UNIQUE ensures no two users have the same Telegram ID, and NOT NULL means it must always be present.
    username TEXT,                      -- The user's Telegram username (e.g., @john_doe). This can be NULL if the user doesn't have one.
    first_name TEXT,                    -- The user's first name from Telegram.
    last_name TEXT,                     -- The user's last name from Telegram.
    photo_url TEXT,                     -- URL to the user's profile picture provided by Telegram. Can be NULL.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the user record was created, defaults to the current time.
);