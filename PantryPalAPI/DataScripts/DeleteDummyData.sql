Use PantryPalDB

-- Step 1: Delete from child tables first (to avoid FK constraint issues)


DELETE FROM Favorites;
DELETE FROM PantryItem;

-- Step 2: Delete from parent table
DELETE FROM Users;

-- Step 3: Reset identity columns back to 1
DBCC CHECKIDENT ('Favorites', RESEED, 0);
DBCC CHECKIDENT ('PantryItem', RESEED, 0);
DBCC CHECKIDENT ('Users', RESEED, 0);
