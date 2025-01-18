using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IInvoice
    {
        Task<Invoice> CreateInvoice(Invoice invoice);
        Task<Invoice> GetInvoiceById(int id);
        Task<IEnumerable<Invoice>> GetAllInvoices();

    }
}