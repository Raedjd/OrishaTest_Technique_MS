using System.Text.Json.Serialization;

namespace OrishaTest.Application.Common.Bases
{
    public class ItemPagedResult<T>
    {
        [JsonPropertyName("Items")]
        public List<T> Items { get; set; } = new();

        [JsonPropertyName("TotalCount")]
        public long TotalCount { get; set; }

        [JsonPropertyName("PageNumber")]
        public int PageNumber { get; set; }

        [JsonPropertyName("PageSize")]
        public int PageSize { get; set; }
    }
}
