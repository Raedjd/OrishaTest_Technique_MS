using OrishaTest.Application.Contracts.Persistance;
using OrishaTest.Application.DataTransfertObject;
using OrishaTest.Application.DataTransfertObject.Orders;
using OrishaTest.Domain.Entities;
using OrishaTest.Domain.Enums;

namespace OrishaTest.Application.Services
{
    public class ReceptionRepository : IReceptionRepository
    {
        public ReceptionStatus GetStatus(int receivedQuantity, int expectedQuantity)
        {
            if (receivedQuantity == 0)
                return ReceptionStatus.NotReceived;

            if (receivedQuantity >= expectedQuantity)
                return ReceptionStatus.Received;

            return ReceptionStatus.Partial;
        }

        public OrderDetailDto BuildOrderDetail(Order order)
        {
            var pallets = order.Pallets
                .OrderBy(p => p.Code)
                .Select(BuildPallet)
                .ToList();

            var expected = pallets.Sum(p => p.ExpectedQuantity);
            var received = pallets.Sum(p => p.ReceivedQuantity);

            return new OrderDetailDto
            {
                Id = order.Id,
                Number = order.Number,
                SupplierName = order.SupplierName,
                Status = GetStatus(received, expected),
                Progress = BuildProgress(received, expected),
                Pallets = pallets
            };
        }

        public OrderSummaryDto BuildOrderSummary(Order order)
        {
            var detail = BuildOrderDetail(order);

            return new OrderSummaryDto
            {
                Id = detail.Id,
                Number = detail.Number,
                SupplierName = detail.SupplierName,
                Status = detail.Status,
                Progress = detail.Progress,
                PalletCount = detail.Pallets.Count
            };
        }

        private PalletDto BuildPallet(Pallet pallet)
        {
            var cartons = pallet.Cartons
                .OrderBy(c => c.Code)
                .Select(BuildCarton)
                .ToList();

            var expected = cartons.Sum(c => c.ExpectedQuantity);
            var received = cartons.Sum(c => c.ReceivedQuantity);

            return new PalletDto
            {
                Id = pallet.Id,
                Code = pallet.Code,
                ExpectedQuantity = expected,
                ReceivedQuantity = received,
                Status = GetStatus(received, expected),
                Cartons = cartons
            };
        }


        private CartonDto BuildCarton(Carton carton)
        {
            var products = carton.Products
                .OrderBy(p => p.Ref)
                .Select(BuildProduct)
                .ToList();

            var expected = products.Sum(p => p.ExpectedQuantity);
            var received = products.Sum(p => p.ReceivedQuantity);

            return new CartonDto
            {
                Id = carton.Id,
                Code = carton.Code,
                ExpectedQuantity = expected,
                ReceivedQuantity = received,
                Status = GetStatus(received, expected),
                Products = products
            };
        }

        private ProductDto BuildProduct(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Ref = product.Ref,
                Name = product.Name,
                Color = product.Color,
                Size = product.Size,
                ExpectedQuantity = product.ExpectedQuantity,
                ReceivedQuantity = product.ReceivedQuantity,
                Status = GetStatus(product.ReceivedQuantity, product.ExpectedQuantity)
            };
        }


        private static ProgressDto BuildProgress(int received, int expected)
        {
            return new ProgressDto
            {
                ReceivedQuantity = received,
                ExpectedQuantity = expected,
                Percentage = expected == 0 ? 0 : (int)Math.Round(100.0 * received / expected)
            };
        }

        public void SetProductReceivedQuantity(Product product, int receivedQuantity)
        {
            product.ReceivedQuantity = receivedQuantity;
        }
    }
}