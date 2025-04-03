using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PantryPalAPI.DTOs;
using PantryPalAPI.Services;

namespace PantryPalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly IEdamamService _edamamService;

        public RecipesController(IEdamamService edamamService)
        {
            _edamamService = edamamService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<RecipeDto>>> SearchRecipes([FromQuery] string query, [FromQuery] int limit = 5)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query cannot be empty.");
            }

            var recipes = await _edamamService.SearchRecipesAsync(query, limit);
            return Ok(recipes);
        }
    }
}

