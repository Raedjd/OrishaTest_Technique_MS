using Microsoft.EntityFrameworkCore;
using OrishaTest.Domain.Entities;

namespace OrishaTest.Infrastructure.Persistance.Seed
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ApplicationDBContext db)
        {

            if (await db.Orders.AnyAsync())
                return;

            var orders = new List<Order>
            {
                new Order
                {
                    Number = "CMD-2026",
                    SupplierName = "Sport Distribution",
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
                                        P("TSH-RED-M", "T-Shirt Sport", "Rouge", "M", 50),
                                        P("SHO-BLK-42", "Baskets Running", "Noir", "42", 10)
                                    }
                                },
                                new Carton
                                {
                                    Code = "CART-01-B",
                                    Products =
                                    {
                                        P("TSH-RED-L", "T-Shirt Sport", "Rouge", "L", 40),
                                        P("TSH-BLU-M", "T-Shirt Sport", "Bleu", "M", 30)
                                    }
                                }
                            }
                        },
                        new Pallet
                        {
                            Code = "PAL-02",
                            Cartons =
                            {
                                new Carton
                                {
                                    Code = "CART-02-A",
                                    Products =
                                    {
                                        P("SHT-BLK-S", "Short Training", "Noir", "S", 25),
                                        P("SHT-BLK-M", "Short Training", "Noir", "M", 25),
                                        P("SOC-WHT-39", "Chaussettes Sport", "Blanc", "39-42", 100)
                                    }
                                },
                                new Carton
                                {
                                    Code = "CART-02-B",
                                    Products =
                                    {
                                        P("SHO-WHT-41", "Baskets Running", "Blanc", "41", 8),
                                        P("SHO-WHT-43", "Baskets Running", "Blanc", "43", 6)
                                    }
                                }
                            }
                        }
                    }
                },
                new Order
                {
                    Number = "CMD-2027",
                    SupplierName = "Outdoor Equipements",
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
                                        P("JKT-GRN-L", "Veste Coupe-Vent", "Vert", "L", 20),
                                        P("JKT-GRN-XL", "Veste Coupe-Vent", "Vert", "XL", 15)
                                    }
                                }
                            }
                        }
                    }
                }
            };

            db.Orders.AddRange(orders);
            await db.SaveChangesAsync();
        }


        private static Product P(string reference, string name, string color, string size, int expectedQuantity) =>
            new Product
            {
                Ref = reference,
                Name = name,
                Color = color,
                Size = size,
                ExpectedQuantity = expectedQuantity,
                ReceivedQuantity = 0
            };
    }
}