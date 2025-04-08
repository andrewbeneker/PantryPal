using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PantryPalAPI.Entities;
using PantryPalAPI.DTOs;
using System.Text;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PantryPalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly PantryPalDbContext _context;
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _config;

        public UsersController(PantryPalDbContext context, ILogger<UsersController> logger, IConfiguration config)
        {
            _context = context;
            _logger = logger;
            _config = config;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("register")]
        public async Task<ActionResult<UserRegistrationDto>> PostUser([FromBody] UserRegistrationDto userRegistrationDto)
        {
            this._logger.LogInformation("Post called");
            if (await _context.Users.AnyAsync(u => u.Username == userRegistrationDto.Username))
            {
                return BadRequest("Username already exists");
            }

            var hashedPassword = EncryptPassword(userRegistrationDto.PasswordHash);

            var userRegistration = new User()
            {
                Username = userRegistrationDto.Username,
                Email = userRegistrationDto.Email,
                PasswordHash = hashedPassword
            };

            _context.Users.Add(userRegistration);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = userRegistration.UserId }, userRegistrationDto);
        }
        private byte[] EncryptPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return hashedBytes;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserLoginDto>> AuthenticateUser([FromBody] UserLoginDto loginDto)
        {
            this._logger.LogInformation("Authenticate User called");
            var hashedPassword = EncryptPassword(loginDto.Password);

            var user = await _context.Users.FirstOrDefaultAsync(u=>u.Username == loginDto.Username && u.PasswordHash == hashedPassword);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
            };
            userDto.Token = GenerateToken(userDto);
            return Ok(userDto);
        }

        private string GenerateToken(UserDto userDto)
        {
            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim("LoginId",userDto.Username),
                new Claim("Email",userDto.Email)
            };
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }








        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
