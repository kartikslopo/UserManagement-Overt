namespace UserManagement.API.Models
{
    public class LoginResponseModel
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Access { get; set; } = string.Empty;
    }
}
