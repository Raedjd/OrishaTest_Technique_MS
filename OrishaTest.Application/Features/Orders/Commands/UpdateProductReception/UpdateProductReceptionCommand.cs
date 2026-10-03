using MediatR;
using OrishaTest.Application.DataTransfertObject;
using System.Text.Json.Serialization;

namespace OrishaTest.Application.Features.Orders.Commands.UpdateProductReception
{
    public class UpdateProductReceptionCommand : IRequest<OrderDetailDto?>
    {
        [JsonIgnore]
        public Guid OrderId { get; set; }

        [JsonIgnore]
        public Guid ProductId { get; set; }

        public int ReceivedQuantity { get; set; }
    }
}