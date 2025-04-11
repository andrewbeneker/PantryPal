using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PantryPalAPI.Entities;
using PantryPalAPI.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace PantryPalAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly PantryPalDbContext _context;

        public FavoritesController(PantryPalDbContext context)
        {
            _context = context;
        }

        // GET: api/Favorites
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetAndDeleteFavoriteDto>>> GetFavorites()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }
            int userId = int.Parse(userIdClaim);

            var userFavorites =
                                await _context.Favorites
                                .Where(item => item.UserId == userId)
                                .ToListAsync();

            return Ok(userFavorites);
        }

        // GET: api/Favorites/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Favorite>> GetFavorite(int id)
        {
            var favorite = await _context.Favorites.FindAsync(id);

            if (favorite == null)
            {
                return NotFound();
            }

            return favorite;
        }

        // PUT: api/Favorites/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFavorite(int id, Favorite favorite)
        {
            if (id != favorite.FavoriteId)
            {
                return BadRequest();
            }

            _context.Entry(favorite).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FavoriteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Favorites
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AddFavoriteDto>> PostFavorite(AddFavoriteDto favorite)
        {

            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }
            int userId = int.Parse(userIdClaim);

            var newFavorite = new Favorite()
            {
                UserId = userId,
                RecipeName = favorite.RecipeName,
                RecipeUrl = favorite.RecipeUrl,
                RecipeImage = favorite.RecipeImage
            };

            _context.Favorites.Add(newFavorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Favorite: {favorite.RecipeName} added successfully" });
        }

        // DELETE: api/Favorites/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }
            int userId = int.Parse(userIdClaim);

            var favorite = await _context.Favorites.FindAsync(id);
            if (favorite == null || favorite.UserId != userId)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FavoriteExists(int id)
        {
            return _context.Favorites.Any(e => e.FavoriteId == id);
        }
    }
}
