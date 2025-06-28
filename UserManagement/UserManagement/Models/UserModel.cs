namespace UserManagement.API.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string Role { get; set; } = "";
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
