-- init.sql
INSERT INTO subscriptions (id, plan_name, max_files_per_month, max_users, price_per_user, fixed_price, additional_file_cost, company_id, expiration_date, createdAt, updatedAt)
VALUES
(1, 'free', 10, 1, 0, 0, 0, NULL, '0000-00-00 00:00:00', NOW(), NOW()),
(2, 'basic', 100, 10, 5, 0, 0, NULL, '0000-00-00 00:00:00', NOW(), NOW()),
(3, 'premium', 1000, NULL, 0, 300, 0.50, NULL, '0000-00-00 00:00:00', NOW(), NOW());
