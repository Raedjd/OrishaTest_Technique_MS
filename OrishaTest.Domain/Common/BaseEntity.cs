namespace OrishaTest.Domain.Common
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}
