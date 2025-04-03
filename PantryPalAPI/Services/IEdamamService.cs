using PantryPalAPI.DTOs;

namespace PantryPalAPI.Services
{
    public interface IEdamamService
    {
        Task<List<RecipeDto>> SearchRecipesAsync(string query, int limit = 5);
    }
}
