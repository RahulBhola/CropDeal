using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CropDealBackend.Data;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CropDealBackend.Repository
{
    public class OrderTransactionRepository: IOrderTransaction
    {
        private readonly CropDealDbContext _context;

        public OrderTransactionRepository(CropDealDbContext context)
        {
            _context = context;
        }

        public async Task<OrderTransaction> CreateOrderTransactionAsync(OrderTransaction orderTransaction)
        {
            _context.OrderTransactions.Add(orderTransaction);
            await _context.SaveChangesAsync();
            return orderTransaction;
        }

         public async Task<OrderTransaction> UpdateOrderTransaction(OrderTransaction orderTransaction)
        {
            _context.OrderTransactions.Update(orderTransaction);
            await _context.SaveChangesAsync();
            return orderTransaction;
        }

        public async Task<OrderTransaction> GetOrderTransactionById(int id)
        {
            return await _context.OrderTransactions.Include(o => o.Invoice).FirstOrDefaultAsync(o => o.OrderTransactionId == id);
        }

        public async Task<List<OrderTransaction>> GetOrdersByUserId(string userId)
        {
            return await _context.OrderTransactions
                .Where(o => o.UserId == userId)
                .Include(o => o.Invoice)  // Fetch the associated invoice
                .ToListAsync();
        }
    }
}