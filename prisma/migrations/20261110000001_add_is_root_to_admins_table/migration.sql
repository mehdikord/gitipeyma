-- 1 = root admin (مدیر کل), full access; 0 = internal admin (مدیر داخلی), only the requests of their services.
ALTER TABLE `admins` ADD COLUMN `is_root` BOOLEAN NOT NULL DEFAULT false AFTER `password`;

-- Everyone who could sign in until now had full access, so they stay root admins.
UPDATE `admins` SET `is_root` = true;
