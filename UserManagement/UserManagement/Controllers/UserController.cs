using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using UserManagement.API.Models;
using UserManagement.API.Services;
using UserManagement.API.Data.Repositories;

namespace UserManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IUserManagementRepository _userManagementRepository;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserManagementRepository userManagementRepository, ITokenService tokenService, ILogger<UserController> logger)
        {
            _userManagementRepository = userManagementRepository;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel request)
        {
            _logger.LogInformation("Login attempt for username: {Username}", request.Username);
            
            try
            {
                var user = await _userManagementRepository.ValidateUser(request.Username, request.Password);
                if (user == null)
                {
                    _logger.LogWarning("Failed login attempt for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                var token = _tokenService.GenerateToken(user);
                _logger.LogInformation("Successful login for username: {Username}, Role: {Role}", user.Username, user.Role);
                
                return Ok(new LoginResponseModel
                {
                    Token = token,
                    Role = user.Role,
                    Username = user.Username,
                    Access = GetAccessMessage(user.Role)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for username: {Username}", request.Username);
                throw;
            }
        }

        [Authorize(Roles = "Admin,Viewer")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var currentUser = User.Identity?.Name;
            _logger.LogInformation("GetAllUsers requested by user: {User}", currentUser);
            
            try
            {
                var users = await _userManagementRepository.GetAllUsersAsync();
                _logger.LogInformation("Retrieved {UserCount} users for user: {User}", users.Count(), currentUser);
                
                return Ok(users.Select(u => new {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.Name,
                    u.Description
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all users for user: {User}", currentUser);
                throw;
            }
        }

        [Authorize(Roles = "Admin,Viewer")]
        [HttpGet("paginated")]
        public async Task<IActionResult> GetUsers([FromQuery] PaginatedRequestModel request)
        {
            var currentUser = User.Identity?.Name;
            _logger.LogInformation("GetUsers paginated requested by user: {User}, Page: {Page}, PageSize: {PageSize}, SearchTerm: {SearchTerm}", 
                currentUser, request.Page, request.PageSize, request.SearchTerm);
            
            try
            {
                var result = await _userManagementRepository.GetUsersAsync(request);
                _logger.LogInformation("Retrieved {UserCount} users (Page {Page} of {TotalPages}) for user: {User}", 
                    result.Data.Count, result.Page, result.TotalPages, currentUser);
                
                return Ok(new
                {
                    Data = result.Data.Select(u => new {
                        u.Id,
                        u.Username,
                        u.Role,
                        u.Name,
                        u.Description
                    }),
                    result.TotalCount,
                    result.Page,
                    result.PageSize,
                    result.TotalPages,
                    result.HasNextPage,
                    result.HasPreviousPage
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving paginated users for user: {User}", currentUser);
                return BadRequest($"Error retrieving users: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var username = User.Identity?.Name;
            _logger.LogInformation("GetMyProfile requested by user: {Username}", username);
            
            if (string.IsNullOrWhiteSpace(username))
            {
                _logger.LogWarning("GetMyProfile called with no authenticated user");
                return Unauthorized();
            }

            try
            {
                var user = await _userManagementRepository.GetUserByUsernameAsync(username);
                if (user == null)
                {
                    _logger.LogWarning("User not found in database for username: {Username}", username);
                    return NotFound();
                }

                _logger.LogInformation("Profile retrieved successfully for user: {Username}", username);
                return Ok(new
                {
                    user.Id,
                    user.Username,
                    user.Role,
                    user.Name,
                    user.Description
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving profile for user: {Username}", username);
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddUser(UserModel user)
        {
            var currentUser = User.Identity?.Name;
            _logger.LogInformation("AddUser requested by admin: {Admin}, for new user: {Username}", currentUser, user.Username);
            
            try
            {
                if (await _userManagementRepository.GetUserByUsernameAsync(user.Username) is not null)
                {
                    _logger.LogWarning("Attempt to create user with existing username: {Username} by admin: {Admin}", user.Username, currentUser);
                    return BadRequest("Username already exists");
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                await _userManagementRepository.AddUserAsync(user);
                _logger.LogInformation("User created successfully: {Username} by admin: {Admin}", user.Username, currentUser);
                
                return Ok("User added successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding user: {Username} by admin: {Admin}", user.Username, currentUser);
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserModel updatedUser)
        {
            var currentUser = User.Identity?.Name;
            _logger.LogInformation("UpdateUser requested by admin: {Admin}, for user ID: {UserId}", currentUser, id);
            
            try
            {
                var existing = await _userManagementRepository.GetUserByIdAsync(id);
                if (existing == null)
                {
                    _logger.LogWarning("Attempt to update non-existent user ID: {UserId} by admin: {Admin}", id, currentUser);
                    return NotFound();
                }

                if (!string.IsNullOrWhiteSpace(updatedUser.PasswordHash))
                    updatedUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
                else
                    updatedUser.PasswordHash = existing.PasswordHash;

                updatedUser.Id = id;
                await _userManagementRepository.UpdateUserAsync(updatedUser);
                _logger.LogInformation("User updated successfully: ID {UserId}, Username: {Username} by admin: {Admin}", 
                    id, updatedUser.Username, currentUser);
                
                return Ok("User updated");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user ID: {UserId} by admin: {Admin}", id, currentUser);
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var currentUser = User.Identity?.Name;
            _logger.LogInformation("DeleteUser requested by admin: {Admin}, for user ID: {UserId}", currentUser, id);
            
            try
            {
                var user = await _userManagementRepository.GetUserByIdAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("Attempt to delete non-existent user ID: {UserId} by admin: {Admin}", id, currentUser);
                    return NotFound();
                }

                await _userManagementRepository.DeleteUserAsync(id);
                _logger.LogInformation("User deleted successfully: ID {UserId}, Username: {Username} by admin: {Admin}", 
                    id, user.Username, currentUser);
                
                return Ok("User deleted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user ID: {UserId} by admin: {Admin}", id, currentUser);
                throw;
            }
        }

        private string GetAccessMessage(string role) => role switch
        {
            "Admin" => "You have full access to manage all users.",
            "Viewer" => "You can view all users but cannot make changes.",
            "User" or "SelfOnly" => "You can only view your own data.",
            _ => "Access level not defined."
        }; 
        }
    }
