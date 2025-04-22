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

        // GET: api/FoodWasteStats
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodWasteStatsDTO>>> GetFoodWasteStats()
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
                stats = new FoodWasteStat { UserId = userId, ItemsUsed = 0, ItemsWasted = 0 };
                _context.FoodWasteStats.Add(stats);
                await _context.SaveChangesAsync();
            }
            var DTO = new FoodWasteStatsDTO { UserId = userId, ItemsUsed = stats.ItemsUsed, ItemsWasted = stats.ItemsWasted };
            return Ok(DTO);
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

        // POST: api/FoodWasteStats
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("ItemUsed")]
        public async Task<ActionResult<FoodWasteStat>> PostItemUsed()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }
            int userId = int.Parse(userIdClaim);

            var stats = await _context.FoodWasteStats.FindAsync(userId);

            stats.ItemsUsed += 1;
            Console.WriteLine($"error: {stats.ItemsUsed}");

            await _context.SaveChangesAsync();

            return Ok(stats);
        }

        [HttpPost("ItemWasted")]
        public async Task<ActionResult<FoodWasteStatsDTO>> PostItemWasted(FoodWasteStatsDTO itemWasted)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("UserId claim is missing in token");
            }
            int userId = int.Parse(userIdClaim);

            //var stats = await _context.FoodWasteStats.FindAsync(userId);

            var stat = await _context.FoodWasteStats.FirstOrDefaultAsync(s => s.UserId == userId);
            if (stat == null)
            {
                stat = new FoodWasteStat { UserId = userId, ItemsUsed = 0, ItemsWasted = 1 };
                _context.FoodWasteStats.Add(stat);
            }

                var newItemWasted = new FoodWasteStatsDTO()
                {
                    UserId = userId,
                    ItemsWasted = itemWasted.ItemsWasted,
                };
                newItemWasted.ItemsWasted += 1;
 
            Console.WriteLine(stat.ItemsWasted);

            //_context.FoodWasteStats.Add(newItemWasted);
            await _context.SaveChangesAsync();

            return Ok(newItemWasted);
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
