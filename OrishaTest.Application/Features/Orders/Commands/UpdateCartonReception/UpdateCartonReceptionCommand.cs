using MediatR;
using OrishaTest.Application.DataTransfertObject;
using System.Text.Json.Serialization;

namespace OrishaTest.Application.Features.Orders.Commands.UpdateCartonReception
{
    public class UpdateCartonReceptionCommand : IRequest<OrderDetailDto?>
    {
        [JsonIgnore]
        public Guid OrderId { get; set; }

        [JsonIgnore]
        public Guid CartonId { get; set; }

        public bool Received { get; set; }
    }
}