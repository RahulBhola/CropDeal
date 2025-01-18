using CropDealBackend.Data;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class InvoiceRepository: IInvoice
    {
        private readonly CropDealDbContext _context;

        public InvoiceRepository(CropDealDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice> CreateInvoice(Invoice invoice)
        {
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
            return invoice;
        }

        public async Task<Invoice> GetInvoiceById(int id)
        {
            return await _context.Invoices.FindAsync(id);
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoices()
        {
            return await _context.Invoices.ToListAsync();
        }

    }
}