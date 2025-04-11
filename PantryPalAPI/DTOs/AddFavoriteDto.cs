namespace PantryPalAPI.DTOs
{
    public class AddFavoriteDto
    {
        
        public int UserId { get; set; }

        public string? RecipeName { get; set; }

        public string? RecipeUrl { get; set; }

        public string? RecipeImage { get; set; }
    }
}
