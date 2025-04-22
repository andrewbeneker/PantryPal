using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PantryPalAPI.DTOs;
using PantryPalAPI.Entities;
using PantryPalAPI.Services;

namespace PantryPalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpoonacularController : ControllerBase
    {
        private readonly PantryPalDbContext _context;
        private readonly ISpoonacularService _spoonacularService;



        public SpoonacularController(PantryPalDbContext context, ISpoonacularService spoonacularService)
        {
            _context = context;
            _spoonacularService = spoonacularService;
        }

        [HttpGet("recipes")]
        public async Task<IActionResult> GetRecipesFromPantry([FromQuery] string ingredients)
        {
            if (string.IsNullOrWhiteSpace(ingredients))
            {
                return BadRequest("Please provide at least one ingredient.");
            }

            var result = await _spoonacularService.SearchRecipesByIngredientsAsync(ingredients);
            if (string.IsNullOrWhiteSpace(result) || result == "[]")
            {
                return NotFound("No recipes found with the given ingredients.");
            }

            Console.WriteLine("Raw Spoonacular JSON:");
            Console.WriteLine(result);
            Console.WriteLine("Raw string length: " + result.Length);
            Console.WriteLine("First 500 characters: " + result.Substring(0, 500));
            var parsedResult = JsonConvert.DeserializeObject<List<SpoonacularRecipeDto>>(result); // JSON string (result) --> list of DTO objects
            Console.WriteLine("ParsedResult.Count: " + parsedResult?.Count);
            return Ok(parsedResult);
        }
    }
}
