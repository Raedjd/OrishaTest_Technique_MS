using OrishaTest.Domain.Entities;

namespace OrishaTest.XUnitTests
{
    public static class TestData
    {
        public static Order CreateOrder()
        {
            return new Order
            {
                Number = "CMD-TEST",
                SupplierName = "Test Supplier",
                Pallets =
                {
                    new Pallet
                    {
                        Code = "PAL-01",
                        Cartons =
                        {
                            new Carton
                            {
                                Code = "CART-01-A",
                                Products =
                                {
                                    P("TSH-RED-M", 50),
                                    P("SHO-BLK-42", 10)
                                }
                            },
                            new Carton
                            {
                                Code = "CART-01-B",
                                Products =
                                {
                                    P("TSH-RED-L", 40)
                                }
                            }
                        }
                    }
                }
            };
        }

        private static Product P(string reference, int expectedQuantity) => new Product
        {
            Ref = reference,
            Name = reference,
            Color = "Test",
            Size = "M",
            ExpectedQuantity = expectedQuantity,
            ReceivedQuantity = 0
        };

        // Raccourcis pour retrouver un élément par son code
        public static Carton Carton(Order order, string code) =>
            order.Pallets.SelectMany(p => p.Cartons).Single(c => c.Code == code);

        public static Product Product(Order order, string reference) =>
            order.Pallets.SelectMany(p => p.Cartons).SelectMany(c => c.Products).Single(p => p.Ref == reference);
    }
}