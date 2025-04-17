namespace PantryPalAPI.Services
{
    public interface ISpoonacularService
    {
        public Task<string> SearchRecipesByIngredientsAsync(string ingredients);
    }
}
