namespace PantryPalAPI.DTOs
{
    public class PantryItemRetrieveOrCreateDto
    {
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public string UnitOfMeasure { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int UserId { get; set; }
    }
}
