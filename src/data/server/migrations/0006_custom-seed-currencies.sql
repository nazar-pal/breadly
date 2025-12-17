-- Custom SQL migration file, put your code below! --

/*
================================================================================
MIGRATION 0006: Seed Currencies
================================================================================
Purpose: Populate the currencies table with common world currencies.

Data:
  - Major world currencies (USD, EUR, GBP, JPY, etc.)
  - Regional currencies (UAH, INR, SGD, etc.)
================================================================================
*/

INSERT INTO currencies (code, symbol, name) VALUES
('USD', '$', 'US Dollar'),
('EUR', '€', 'Euro'),
('GBP', '£', 'British Pound'),
('JPY', '¥', 'Japanese Yen'),
('CAD', 'C$', 'Canadian Dollar'),
('AUD', 'A$', 'Australian Dollar'),
('CHF', 'CHF', 'Swiss Franc'),
('CNY', '¥', 'Chinese Yuan Renminbi'),
('SGD', 'S$', 'Singapore Dollar'),
('INR', '₹', 'Indian Rupee'),
('UAH', '₴', 'Ukrainian Hryvnia');

