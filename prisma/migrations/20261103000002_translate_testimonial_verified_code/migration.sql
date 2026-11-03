-- The verification line of a testimonial ("بلیت رسمی VIP: GT-98214") is read on every language's site too.
ALTER TABLE `testimonials` MODIFY `verified_code` LONGTEXT NULL;
UPDATE `testimonials` SET `verified_code` = IF(`verified_code` IS NULL OR `verified_code` = '', JSON_OBJECT(), JSON_OBJECT('fa', `verified_code`));
ALTER TABLE `testimonials` MODIFY `verified_code` JSON NOT NULL;
