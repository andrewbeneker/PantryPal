namespace PantryPalAPI.DTOs
{
    public class PantryItemUpdateDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public string UnitOfMeasure { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}
