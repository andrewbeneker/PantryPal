Use PantryPalDB

-- Insert dummy users
INSERT INTO Users (Username, Email, PasswordHash)
VALUES 
('daniel123', 'daniel@example.com', CONVERT(VARBINARY, 'password1')),
('rebeccah_rocks', 'rebeccah@example.com', CONVERT(VARBINARY, 'password2')),
('andyman', 'andy@example.com', CONVERT(VARBINARY, 'password3'));

-- Insert dummy pantry items
-- Assume UserId 1 = Daniel, 2 = Rebeccah, 3 = Andy
INSERT INTO PantryItem (UserId, ItemName, Quantity, UnitOfMeasure, ExpirationDate)
VALUES
(1, 'Canned Beans', 4, 'cans', '2025-01-10'),
(1, 'Rice', 2, 'lbs', '2025-05-15'),
(2, 'Oatmeal', 1, 'box', '2024-12-01'),
(2, 'Almond Milk', 1, 'carton', '2024-04-20'),
(3, 'Pasta', 3, 'lbs', '2025-03-30'),
(3, 'Tomato Sauce', 2, 'jars', '2024-11-12');

-- Insert dummy favorite recipes
INSERT INTO Favorites (UserId, RecipeName, RecipeUrl, RecipeImage)
VALUES
(1, 'Spicy Chickpea Curry', 'https://recipes.com/spicy-chickpea-curry', 'https://images.com/chickpea-curry.jpg'),
(2, 'Oatmeal Pancakes', 'https://recipes.com/oatmeal-pancakes', 'https://images.com/oatmeal-pancakes.jpg'),
(3, 'Classic Spaghetti', 'https://recipes.com/classic-spaghetti', 'https://images.com/spaghetti.jpg');
