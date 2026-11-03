-- Content the site shows is now stored once per language: {"fa": "...", "en": "...", "tr": "..."}.
-- Existing text is Persian, so it becomes the "fa" entry; empty or missing text becomes {}.

-- service_categories
ALTER TABLE `service_categories` MODIFY `title` LONGTEXT NULL;
UPDATE `service_categories` SET `title` = IF(`title` IS NULL OR `title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `title`));
ALTER TABLE `service_categories` MODIFY `title` JSON NOT NULL;

-- service_groups
ALTER TABLE `service_groups` MODIFY `title` LONGTEXT NULL;
UPDATE `service_groups` SET `title` = IF(`title` IS NULL OR `title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `title`));
ALTER TABLE `service_groups` MODIFY `title` JSON NOT NULL;

-- services
ALTER TABLE `services` MODIFY `title` LONGTEXT NULL, MODIFY `short_title` LONGTEXT NULL, MODIFY `category_label` LONGTEXT NULL, MODIFY `eyebrow` LONGTEXT NULL, MODIFY `summary` LONGTEXT NULL, MODIFY `description` LONGTEXT NULL, MODIFY `content` LONGTEXT NULL, MODIFY `badge` LONGTEXT NULL;
UPDATE `services` SET `title` = IF(`title` IS NULL OR `title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `title`)), `short_title` = IF(`short_title` IS NULL OR `short_title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `short_title`)), `category_label` = IF(`category_label` IS NULL OR `category_label` = '', JSON_OBJECT(), JSON_OBJECT('fa', `category_label`)), `eyebrow` = IF(`eyebrow` IS NULL OR `eyebrow` = '', JSON_OBJECT(), JSON_OBJECT('fa', `eyebrow`)), `summary` = IF(`summary` IS NULL OR `summary` = '', JSON_OBJECT(), JSON_OBJECT('fa', `summary`)), `description` = IF(`description` IS NULL OR `description` = '', JSON_OBJECT(), JSON_OBJECT('fa', `description`)), `content` = IF(`content` IS NULL OR `content` = '', JSON_OBJECT(), JSON_OBJECT('fa', `content`)), `badge` = IF(`badge` IS NULL OR `badge` = '', JSON_OBJECT(), JSON_OBJECT('fa', `badge`));
ALTER TABLE `services` MODIFY `title` JSON NOT NULL, MODIFY `short_title` JSON NOT NULL, MODIFY `category_label` JSON NOT NULL, MODIFY `eyebrow` JSON NOT NULL, MODIFY `summary` JSON NOT NULL, MODIFY `description` JSON NOT NULL, MODIFY `content` JSON NOT NULL, MODIFY `badge` JSON NOT NULL;

-- service_features
ALTER TABLE `service_features` MODIFY `title` LONGTEXT NULL;
UPDATE `service_features` SET `title` = IF(`title` IS NULL OR `title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `title`));
ALTER TABLE `service_features` MODIFY `title` JSON NOT NULL;

-- service_steps
ALTER TABLE `service_steps` MODIFY `title` LONGTEXT NULL, MODIFY `description` LONGTEXT NULL;
UPDATE `service_steps` SET `title` = IF(`title` IS NULL OR `title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `title`)), `description` = IF(`description` IS NULL OR `description` = '', JSON_OBJECT(), JSON_OBJECT('fa', `description`));
ALTER TABLE `service_steps` MODIFY `title` JSON NOT NULL, MODIFY `description` JSON NOT NULL;

-- service_faqs
ALTER TABLE `service_faqs` MODIFY `question` LONGTEXT NULL, MODIFY `answer` LONGTEXT NULL;
UPDATE `service_faqs` SET `question` = IF(`question` IS NULL OR `question` = '', JSON_OBJECT(), JSON_OBJECT('fa', `question`)), `answer` = IF(`answer` IS NULL OR `answer` = '', JSON_OBJECT(), JSON_OBJECT('fa', `answer`));
ALTER TABLE `service_faqs` MODIFY `question` JSON NOT NULL, MODIFY `answer` JSON NOT NULL;

-- testimonials
ALTER TABLE `testimonials` MODIFY `client_name` LONGTEXT NULL, MODIFY `service_title` LONGTEXT NULL, MODIFY `context` LONGTEXT NULL, MODIFY `comment` LONGTEXT NULL, MODIFY `year` LONGTEXT NULL, MODIFY `category_label` LONGTEXT NULL, MODIFY `outcome_headline` LONGTEXT NULL, MODIFY `origin_destination` LONGTEXT NULL;
UPDATE `testimonials` SET `client_name` = IF(`client_name` IS NULL OR `client_name` = '', JSON_OBJECT(), JSON_OBJECT('fa', `client_name`)), `service_title` = IF(`service_title` IS NULL OR `service_title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `service_title`)), `context` = IF(`context` IS NULL OR `context` = '', JSON_OBJECT(), JSON_OBJECT('fa', `context`)), `comment` = IF(`comment` IS NULL OR `comment` = '', JSON_OBJECT(), JSON_OBJECT('fa', `comment`)), `year` = IF(`year` IS NULL OR `year` = '', JSON_OBJECT(), JSON_OBJECT('fa', `year`)), `category_label` = IF(`category_label` IS NULL OR `category_label` = '', JSON_OBJECT(), JSON_OBJECT('fa', `category_label`)), `outcome_headline` = IF(`outcome_headline` IS NULL OR `outcome_headline` = '', JSON_OBJECT(), JSON_OBJECT('fa', `outcome_headline`)), `origin_destination` = IF(`origin_destination` IS NULL OR `origin_destination` = '', JSON_OBJECT(), JSON_OBJECT('fa', `origin_destination`));
ALTER TABLE `testimonials` MODIFY `client_name` JSON NOT NULL, MODIFY `service_title` JSON NOT NULL, MODIFY `context` JSON NOT NULL, MODIFY `comment` JSON NOT NULL, MODIFY `year` JSON NOT NULL, MODIFY `category_label` JSON NOT NULL, MODIFY `outcome_headline` JSON NOT NULL, MODIFY `origin_destination` JSON NOT NULL;

-- testimonial_milestones
ALTER TABLE `testimonial_milestones` MODIFY `title` LONGTEXT NULL, MODIFY `description` LONGTEXT NULL;
UPDATE `testimonial_milestones` SET `title` = IF(`title` IS NULL OR `title` = '', JSON_OBJECT(), JSON_OBJECT('fa', `title`)), `description` = IF(`description` IS NULL OR `description` = '', JSON_OBJECT(), JSON_OBJECT('fa', `description`));
ALTER TABLE `testimonial_milestones` MODIFY `title` JSON NOT NULL, MODIFY `description` JSON NOT NULL;

-- metrics
ALTER TABLE `metrics` MODIFY `value` LONGTEXT NULL, MODIFY `label` LONGTEXT NULL, MODIFY `subtext` LONGTEXT NULL, MODIFY `trend` LONGTEXT NULL;
UPDATE `metrics` SET `value` = IF(`value` IS NULL OR `value` = '', JSON_OBJECT(), JSON_OBJECT('fa', `value`)), `label` = IF(`label` IS NULL OR `label` = '', JSON_OBJECT(), JSON_OBJECT('fa', `label`)), `subtext` = IF(`subtext` IS NULL OR `subtext` = '', JSON_OBJECT(), JSON_OBJECT('fa', `subtext`)), `trend` = IF(`trend` IS NULL OR `trend` = '', JSON_OBJECT(), JSON_OBJECT('fa', `trend`));
ALTER TABLE `metrics` MODIFY `value` JSON NOT NULL, MODIFY `label` JSON NOT NULL, MODIFY `subtext` JSON NOT NULL, MODIFY `trend` JSON NOT NULL;

-- trust_quotes
ALTER TABLE `trust_quotes` MODIFY `text` LONGTEXT NULL;
UPDATE `trust_quotes` SET `text` = IF(`text` IS NULL OR `text` = '', JSON_OBJECT(), JSON_OBJECT('fa', `text`));
ALTER TABLE `trust_quotes` MODIFY `text` JSON NOT NULL;

-- team_members
ALTER TABLE `team_members` MODIFY `name` LONGTEXT NULL, MODIFY `role` LONGTEXT NULL, MODIFY `specialty` LONGTEXT NULL, MODIFY `department` LONGTEXT NULL;
UPDATE `team_members` SET `name` = IF(`name` IS NULL OR `name` = '', JSON_OBJECT(), JSON_OBJECT('fa', `name`)), `role` = IF(`role` IS NULL OR `role` = '', JSON_OBJECT(), JSON_OBJECT('fa', `role`)), `specialty` = IF(`specialty` IS NULL OR `specialty` = '', JSON_OBJECT(), JSON_OBJECT('fa', `specialty`)), `department` = IF(`department` IS NULL OR `department` = '', JSON_OBJECT(), JSON_OBJECT('fa', `department`));
ALTER TABLE `team_members` MODIFY `name` JSON NOT NULL, MODIFY `role` JSON NOT NULL, MODIFY `specialty` JSON NOT NULL, MODIFY `department` JSON NOT NULL;

-- offices
ALTER TABLE `offices` MODIFY `name` LONGTEXT NULL, MODIFY `role` LONGTEXT NULL, MODIFY `country` LONGTEXT NULL, MODIFY `address` LONGTEXT NULL, MODIFY `working_hours` LONGTEXT NULL;
UPDATE `offices` SET `name` = IF(`name` IS NULL OR `name` = '', JSON_OBJECT(), JSON_OBJECT('fa', `name`)), `role` = IF(`role` IS NULL OR `role` = '', JSON_OBJECT(), JSON_OBJECT('fa', `role`)), `country` = IF(`country` IS NULL OR `country` = '', JSON_OBJECT(), JSON_OBJECT('fa', `country`)), `address` = IF(`address` IS NULL OR `address` = '', JSON_OBJECT(), JSON_OBJECT('fa', `address`)), `working_hours` = IF(`working_hours` IS NULL OR `working_hours` = '', JSON_OBJECT(), JSON_OBJECT('fa', `working_hours`));
ALTER TABLE `offices` MODIFY `name` JSON NOT NULL, MODIFY `role` JSON NOT NULL, MODIFY `country` JSON NOT NULL, MODIFY `address` JSON NOT NULL, MODIFY `working_hours` JSON NOT NULL;

-- social_links
ALTER TABLE `social_links` MODIFY `label` LONGTEXT NULL;
UPDATE `social_links` SET `label` = IF(`label` IS NULL OR `label` = '', JSON_OBJECT(), JSON_OBJECT('fa', `label`));
ALTER TABLE `social_links` MODIFY `label` JSON NOT NULL;

-- currencies
ALTER TABLE `currencies` MODIFY `name` LONGTEXT NULL;
UPDATE `currencies` SET `name` = IF(`name` IS NULL OR `name` = '', JSON_OBJECT(), JSON_OBJECT('fa', `name`));
ALTER TABLE `currencies` MODIFY `name` JSON NOT NULL;

-- settings: the separate Persian and English keys become one translated key each.
INSERT INTO `settings` (`key`, `value`, `created_at`, `updated_at`)
SELECT 'company_name', JSON_OBJECT('fa', MAX(IF(`key` = 'company_name_fa', `value`, NULL)), 'en', MAX(IF(`key` = 'company_name_en', `value`, NULL))), NOW(), NOW()
FROM `settings` WHERE `key` IN ('company_name_fa', 'company_name_en') HAVING COUNT(*) > 0;
INSERT INTO `settings` (`key`, `value`, `created_at`, `updated_at`)
SELECT 'brand_tagline', JSON_OBJECT('fa', MAX(IF(`key` = 'brand_tagline_fa', `value`, NULL)), 'en', MAX(IF(`key` = 'brand_tagline_en', `value`, NULL))), NOW(), NOW()
FROM `settings` WHERE `key` IN ('brand_tagline_fa', 'brand_tagline_en') HAVING COUNT(*) > 0;
DELETE FROM `settings` WHERE `key` IN ('company_name_fa', 'company_name_en', 'brand_tagline_fa', 'brand_tagline_en');
UPDATE `settings` SET `value` = JSON_OBJECT('fa', `value`) WHERE `key` = 'support_availability' AND `value` IS NOT NULL AND JSON_VALID(`value`) = 0;
