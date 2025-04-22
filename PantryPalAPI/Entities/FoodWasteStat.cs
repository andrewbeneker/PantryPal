using System;
using System.Collections.Generic;

namespace PantryPalAPI.Entities;

public partial class FoodWasteStat
{
    public int Id { get; set; }

    public int? ItemsWasted { get; set; }

    public int? ItemsUsed { get; set; }

    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
