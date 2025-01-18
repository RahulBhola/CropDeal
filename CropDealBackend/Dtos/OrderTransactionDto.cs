namespace CropDealBackend.Dtos
{
    public class OrderTransactionDto
    {
        public int OrderQuantity { get; set; }
        public double TotalPrice { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int[] CropId { get; set; } 
        public string UserId { get; set; }
    }
}