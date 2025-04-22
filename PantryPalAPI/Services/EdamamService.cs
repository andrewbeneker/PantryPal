using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using PantryPalAPI.DTOs;
using PantryPalAPI.Models;

namespace PantryPalAPI.Services
{
    public class EdamamService : IEdamamService
    {
        private readonly HttpClient _httpClient;
        private readonly EdamamSettings _edamamSettings;

        public EdamamService(HttpClient httpClient, IOptions<EdamamSettings> edamamOptions)
        {
            _httpClient = httpClient;
            _edamamSettings = edamamOptions.Value;
        }

        public async Task<List<RecipeDto>> SearchRecipesAsync(string query, int limit = 5)
        {
            string url = $"https://api.edamam.com/api/recipes/v2?type=public&q={query}&app_id={_edamamSettings.AppId}&app_key={_edamamSettings.AppKey}&from=0&to={limit}";

            Console.WriteLine($"Requesting Edamam API: {url}");

            // Create HTTP request
            var request = new HttpRequestMessage(HttpMethod.Get, url);

            // Add the required Edamam-Account-User header
            request.Headers.Add("Edamam-Account-User", "Dannynebs");

            // Send the request
            HttpResponseMessage response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                string errorResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Edamam API Error: {response.StatusCode}, Response: {errorResponse}");
                throw new Exception("Failed to fetch recipes from Edamam.");
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EdamamApiResponse>(jsonString); // JSON string -> into EdamamApiResponse object

            return result.Hits.Select(h => new RecipeDto
            {
                RecipeLabel = h.Recipe.Label,
                RecipeImage = h.Recipe.Image,
                RecipeUrl = h.Recipe.Url
            }).ToList();
        }
    }
}
