using System;
using System.Collections.Generic;

namespace PantryPalAPI.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public byte[] PasswordHash { get; set; } = null!;

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<FoodWasteStat> FoodWasteStats { get; set; } = new List<FoodWasteStat>();

    public virtual ICollection<PantryItem> PantryItems { get; set; } = new List<PantryItem>();
}
