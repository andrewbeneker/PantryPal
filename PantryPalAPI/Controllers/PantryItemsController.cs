using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PantryPalAPI.Entities;
using PantryPalAPI.DTOs;

namespace PantryPalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PantryItemsController : ControllerBase
    {
        private readonly PantryPalDbContext _context;

        public PantryItemsController(PantryPalDbContext context)
        {
            _context = context;
        }

        // GET: api/PantryItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PantryItem>>> GetPantryItems()
        {
            return await _context.PantryItems.ToListAsync();
        }

        // GET: api/PantryItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PantryItem>> GetPantryItem(int id)
        {
            var pantryItem = await _context.PantryItems.FindAsync(id);

            if (pantryItem == null)
            {
                return NotFound();
            }

            return pantryItem;
        }

        // PUT: api/PantryItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPantryItem(int id, PantryItemUpdateDto pantryItem)
        {
            var pantryItemUpdate = await _context.PantryItems.FindAsync(id);
            if (pantryItemUpdate == null)
            {
                return NotFound();
            }

            pantryItemUpdate.ItemName = pantryItem.ItemName;
            pantryItemUpdate.Quantity = pantryItem.Quantity;
            pantryItemUpdate.UnitOfMeasure = pantryItem.UnitOfMeasure;
            pantryItemUpdate.ExpirationDate = pantryItem.ExpirationDate;

            _context.PantryItems.Update(pantryItemUpdate);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        // POST: api/PantryItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PantryItemRetrieveOrCreateDto>> PostPantryItem(PantryItemRetrieveOrCreateDto pantryItem)
        {

            var addPantryItem = new PantryItem()
            {
                ItemName = pantryItem.ItemName,
                Quantity = pantryItem.Quantity,
                UnitOfMeasure = pantryItem.UnitOfMeasure,
                ExpirationDate = pantryItem.ExpirationDate,
                UserId = pantryItem.UserId
            };

            _context.PantryItems.Add(addPantryItem);
            await _context.SaveChangesAsync();

            return Ok($"Pantry Item: {pantryItem.ItemName} added successfully");
        }

        // DELETE: api/PantryItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePantryItem(int id)
        {
            var pantryItem = await _context.PantryItems.FindAsync(id);
            if (pantryItem == null)
            {
                return NotFound();
            }

            _context.PantryItems.Remove(pantryItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PantryItemExists(int id)
        {
            return _context.PantryItems.Any(e => e.ItemId == id);
        }
    }
}
