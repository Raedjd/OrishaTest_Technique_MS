
using OrishaTest.Application.Services;
using OrishaTest.Domain.Enums;


namespace OrishaTest.XUnitTests
{
    public class ReceptionRepositoryTests
    {
        private readonly ReceptionRepository _sut = new();


        [Theory]
        [InlineData(0, 10, ReceptionStatus.NotReceived)]
        [InlineData(5, 10, ReceptionStatus.Partial)]
        [InlineData(10, 10, ReceptionStatus.Received)]
        public void GetStatus_ReturnsExpectedStatus(int received, int expected, ReceptionStatus expectedStatus)
        {
            var status = _sut.GetStatus(received, expected);

            Assert.Equal(expectedStatus, status);
        }


        [Fact]
        public void BuildOrderDetail_NewOrder_EverythingIsNotReceived()
        {
            var order = TestData.CreateOrder();

            var detail = _sut.BuildOrderDetail(order);

            Assert.Equal(ReceptionStatus.NotReceived, detail.Status);
            Assert.All(detail.Pallets, p => Assert.Equal(ReceptionStatus.NotReceived, p.Status));
            Assert.Equal(0, detail.Progress.ReceivedQuantity);
            Assert.Equal(100, detail.Progress.ExpectedQuantity);
        }

 

        [Fact]
        public void AllProductsOfCartonReceivedOneByOne_CartonIsReceived()
        {
            var order = TestData.CreateOrder();

            _sut.SetProductReceivedQuantity(TestData.Product(order, "TSH-RED-M"), 50);
            _sut.SetProductReceivedQuantity(TestData.Product(order, "SHO-BLK-42"), 10);

            var detail = _sut.BuildOrderDetail(order);
            var carton = detail.Pallets[0].Cartons.Single(c => c.Code == "CART-01-A");

            Assert.Equal(ReceptionStatus.Received, carton.Status);
        }

        [Fact]
        public void OneProductUnchecked_CartonAndPalletBecomePartial()
        {
            var order = TestData.CreateOrder();
            _sut.MarkPallet(order.Pallets.First(), received: true);

            // On décoche un seul produit
            _sut.SetProductReceivedQuantity(TestData.Product(order, "SHO-BLK-42"), 0);

            var detail = _sut.BuildOrderDetail(order);
            var pallet = detail.Pallets[0];
            var carton = pallet.Cartons.Single(c => c.Code == "CART-01-A");

            Assert.Equal(ReceptionStatus.Partial, carton.Status);
            Assert.Equal(ReceptionStatus.Partial, pallet.Status);
        }


        [Fact]
        public void MarkCarton_True_AllProductsAreReceived()
        {
            var order = TestData.CreateOrder();
            var carton = TestData.Carton(order, "CART-01-A");

            _sut.MarkCarton(carton, received: true);

            Assert.All(carton.Products, p => Assert.Equal(p.ExpectedQuantity, p.ReceivedQuantity));
        }

        [Fact]
        public void MarkCarton_False_AllProductsAreReset()
        {
            var order = TestData.CreateOrder();
            var carton = TestData.Carton(order, "CART-01-A");
            _sut.MarkCarton(carton, received: true);

            _sut.MarkCarton(carton, received: false);

            Assert.All(carton.Products, p => Assert.Equal(0, p.ReceivedQuantity));
        }

        [Fact]
        public void MarkCarton_DoesNotChangeOtherCartons()
        {
            var order = TestData.CreateOrder();

            _sut.MarkCarton(TestData.Carton(order, "CART-01-A"), received: true);

            Assert.Equal(0, TestData.Product(order, "TSH-RED-L").ReceivedQuantity);
        }


        [Fact]
        public void MarkPallet_True_PalletCartonsAndOrderAreReceived()
        {
            var order = TestData.CreateOrder();

            _sut.MarkPallet(order.Pallets.First(), received: true);

            var detail = _sut.BuildOrderDetail(order);

            Assert.Equal(ReceptionStatus.Received, detail.Pallets[0].Status);
            Assert.All(detail.Pallets[0].Cartons, c => Assert.Equal(ReceptionStatus.Received, c.Status));
            Assert.Equal(ReceptionStatus.Received, detail.Status);
        }


        [Fact]
        public void Progress_IsComputedFromAllProducts()
        {
            var order = TestData.CreateOrder();

            _sut.SetProductReceivedQuantity(TestData.Product(order, "TSH-RED-M"), 50);

            var detail = _sut.BuildOrderDetail(order);

            Assert.Equal(50, detail.Progress.ReceivedQuantity);
            Assert.Equal(100, detail.Progress.ExpectedQuantity);
            Assert.Equal(50, detail.Progress.Percentage);
        }


        [Fact]
        public void BuildOrderSummary_ContainsStatusProgressAndPalletCount()
        {
            var order = TestData.CreateOrder();
            _sut.MarkCarton(TestData.Carton(order, "CART-01-B"), received: true);

            var summary = _sut.BuildOrderSummary(order);

            Assert.Equal("CMD-TEST", summary.Number);
            Assert.Equal(1, summary.PalletCount);
            Assert.Equal(ReceptionStatus.Partial, summary.Status);
            Assert.Equal(40, summary.Progress.Percentage);
        }
    }
}