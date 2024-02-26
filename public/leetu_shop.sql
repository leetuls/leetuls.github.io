CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `remember_token` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `session_users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `token` varchar(255),
  `refresh_token` varchar(255),
  `token_expried` varchar(255),
  `refresh_token_expried` varchar(255),
  `user_id` int,
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `session_customers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `token` varchar(255),
  `refresh_token` varchar(255),
  `token_expried` varchar(255),
  `refresh_token_expried` varchar(255),
  `customer_id` int,
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `order_items` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `product_id` varchar(255),
  `quantity` int
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `customer_id` int,
  `status` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `customers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `address` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `auth_id` varchar(255),
  `auth_type` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `product_id` varchar(255),
  `name` varchar(255),
  `price` int,
  `feature_image` varchar(255),
  `content` text,
  `user_id` int,
  `category_id` int,
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `product_images` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `image` varchar(255),
  `product_id` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `categories` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `parent_id` int,
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `product_tags` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `product_id` int,
  `tag_id` int,
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `tags` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `menus` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `parent_id` int,
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `sliders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` varchar(255),
  `image` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

CREATE TABLE `settings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `config_key` varchar(255),
  `config_value` varchar(255),
  `created_at` timestamp,
  `update_at` timestamp
);

ALTER TABLE `products` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`product_id`) REFERENCES `product_images` (`product_id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`product_id`) REFERENCES `product_tags` (`product_id`);

CREATE TABLE `order_items_products` (
  `order_items_product_id` varchar,
  `products_product_id` varchar,
  PRIMARY KEY (`order_items_product_id`, `products_product_id`)
);

ALTER TABLE `order_items_products` ADD FOREIGN KEY (`order_items_product_id`) REFERENCES `order_items` (`product_id`);

ALTER TABLE `order_items_products` ADD FOREIGN KEY (`products_product_id`) REFERENCES `products` (`product_id`);


ALTER TABLE `tags` ADD FOREIGN KEY (`id`) REFERENCES `product_tags` (`tag_id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`id`) REFERENCES `order_items` (`order_id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `session_users` (`user_id`);

ALTER TABLE `customers` ADD FOREIGN KEY (`id`) REFERENCES `session_customers` (`customer_id`);
