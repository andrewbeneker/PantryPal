using System;
using System.Collections.Generic;

namespace PantryPalAPI.Entities;

public partial class PantryItem
{
    public int ItemId { get; set; }

    public int UserId { get; set; }

    public string ItemName { get; set; } = null!;

    public int Quantity { get; set; }

    public string UnitOfMeasure { get; set; } = null!;

    public DateTime ExpirationDate { get; set; }

    public virtual User User { get; set; } = null!;
}
