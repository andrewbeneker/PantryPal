using Microsoft.Extensions.Options;

namespace PantryPalAPI.Services
{
    public class SpoonacularService: ISpoonacularService
    {
        private readonly HttpClient _httpClient;
        private readonly SpoonacularSettings _spoonacularSettings;

        public SpoonacularService(HttpClient httpClient, IOptions<SpoonacularSettings> spoonacularOptions)
        {
            _httpClient = httpClient;
            _spoonacularSettings = spoonacularOptions.Value;

            Console.WriteLine("🔑 Spoonacular API Key from config: " + _spoonacularSettings.ApiKey);

        }

        public async Task<string> SearchRecipesByIngredientsAsync(string ingredients)
        {
            if (string.IsNullOrWhiteSpace(ingredients))
            {
                return "[]"; // Return empty array if no ingredients provided
            }

            string encodedIngredients = Uri.EscapeDataString(ingredients);
            string url = $"https://api.spoonacular.com/recipes/findByIngredients?ingredients={encodedIngredients}&number=10&apiKey={_spoonacularSettings.ApiKey}";

            Console.WriteLine($"📡 Spoonacular URL: {url}");

            try
            {
                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"❌ Spoonacular API Error: {response.StatusCode}");
                    return "[]";
                }

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔥 Exception in SpoonacularService: {ex.Message}");
                return "[]";
            }
        }

    }
}
