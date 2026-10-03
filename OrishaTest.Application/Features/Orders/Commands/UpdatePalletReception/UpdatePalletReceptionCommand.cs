using MediatR;
using OrishaTest.Application.DataTransfertObject;
using System.Text.Json.Serialization;

namespace OrishaTest.Application.Features.Orders.Commands.UpdatePalletReception
{
    public class UpdatePalletReceptionCommand : IRequest<OrderDetailDto?>
    {
        [JsonIgnore]
        public Guid OrderId { get; set; }

        [JsonIgnore]
        public Guid PalletId { get; set; }

        public bool Received { get; set; }
    }
}