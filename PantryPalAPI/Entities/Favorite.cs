using System;
using System.Collections.Generic;

namespace PantryPalAPI.Entities;

public partial class Favorite
{
    public int FavoriteId { get; set; }

    public int UserId { get; set; }

    public string? RecipeName { get; set; }

    public string? RecipeUrl { get; set; }

    public string? RecipeImage { get; set; }

    public virtual User User { get; set; } = null!;
}
