using OrishaTest.Application.DataTransfertObject;
using OrishaTest.Domain.Entities;
using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.Contracts.Persistance
{
    public interface IReceptionRepository
    {
        OrderSummaryDto BuildOrderSummary(Order order);

        OrderDetailDto BuildOrderDetail(Order order);

        ReceptionStatus GetStatus(int receivedQuantity, int expectedQuantity);

        void SetProductReceivedQuantity(Product product, int receivedQuantity);
        void MarkCarton(Carton carton, bool received);
    }
}