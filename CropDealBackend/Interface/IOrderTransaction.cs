using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CropDealBackend.Models;

namespace CropDealBackend.Interface
{
    public interface IOrderTransaction
    {
        Task<OrderTransaction> CreateOrderTransactionAsync(OrderTransaction orderTransaction);
        Task<OrderTransaction> UpdateOrderTransaction(OrderTransaction orderTransaction);
        Task<OrderTransaction> GetOrderTransactionById(int id);
        Task<List<OrderTransaction>> GetOrdersByUserId(string userId);
    }
}