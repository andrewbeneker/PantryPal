namespace PantryPalAPI.DTOs
{
    public class GetAndDeleteFavoriteDto
    {
        public int FavoriteId { get; set; }

        public int UserId { get; set; }

        public string? RecipeName { get; set; }

        public string? RecipeUrl { get; set; }

        public string? RecipeImage { get; set; }
    }
}
