using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PantryPalAPI.DTOs;
using PantryPalAPI.Entities;

namespace PantryPalAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FoodWasteStatsController : ControllerBase
    {
        private readonly PantryPalDbContext _context;

        public FoodWasteStatsController(PantryPalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<FoodWasteStatsDTO>> GetFoodWasteStats()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }
            int userId = int.Parse(userIdClaim);

            var stats = await _context.FoodWasteStats
                .Where(s => s.UserId == userId)
                .ToListAsync();

            int totalUsed = stats.Sum(s => s.ItemsUsed ?? 0); // summing for ItemsUsed table, set to 0 if null
            int totalWasted = stats.Sum(s => s.ItemsWasted ?? 0);

            var dto = new FoodWasteStatsDTO
            {
                UserId = userId,
                ItemsUsed = totalUsed,
                ItemsWasted = totalWasted
            };

            return Ok(dto); // DTO returned to frontend with totals present
        }

        // GET: api/FoodWasteStats/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FoodWasteStat>> GetFoodWasteStat(int id)
        {
            var foodWasteStat = await _context.FoodWasteStats.FindAsync(id);

            if (foodWasteStat == null)
            {
                return NotFound();
            }

            return foodWasteStat;
        }

        // PUT: api/FoodWasteStats/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFoodWasteStat(int id, FoodWasteStat foodWasteStat)
        {
            if (id != foodWasteStat.Id)
            {
                return BadRequest();
            }

            _context.Entry(foodWasteStat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoodWasteStatExists(id))
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

        [HttpPost("ItemsUsed")]
        public async Task<ActionResult<FoodWasteStat>> PostItemUsed()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }

            int userId = int.Parse(userIdClaim);

            var stats = await _context.FoodWasteStats.FindAsync(userId);

            if (stats == null)
            {
                stats = new FoodWasteStat
                {
                    UserId = userId,
                    ItemsUsed = 1,
                    ItemsWasted = 0
                };
                _context.FoodWasteStats.Add(stats);
            }
            else
            {
                stats.ItemsUsed += 1;
            }

            await _context.SaveChangesAsync();

            return Ok(stats);
        }

        [HttpPost("ItemsWasted")]
        public async Task<ActionResult<FoodWasteStat>> PostItemWasted()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }

            int userId = int.Parse(userIdClaim);

            var stats = await _context.FoodWasteStats.FindAsync(userId);

            if (stats == null)
            {
                stats = new FoodWasteStat
                {
                    UserId = userId,
                    ItemsUsed = 0,
                    ItemsWasted = 1
                };
                _context.FoodWasteStats.Add(stats);
            }
            else
            {
                stats.ItemsWasted += 1;
            }

            await _context.SaveChangesAsync();

            return Ok(stats);
        }

        // DELETE: api/FoodWasteStats/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodWasteStat(int id)
        {
            var foodWasteStat = await _context.FoodWasteStats.FindAsync(id);
            if (foodWasteStat == null)
            {
                return NotFound();
            }

            _context.FoodWasteStats.Remove(foodWasteStat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodWasteStatExists(int id)
        {
            return _context.FoodWasteStats.Any(e => e.Id == id);
        }
    }
}
