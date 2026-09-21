using Npgsql;
using System.Data.Common;
using WebCTCPCKXLCTBinhAn.API.Models;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class UserRepository(NpgsqlDataSource dataSource):IUserRepository
    {
        private readonly NpgsqlDataSource _dataSource = dataSource;
        public async Task<User?> GetByEmailAsync(string email)
        {
            const string sql = """
            SELECT
                id,
                full_name,
                email,
                password_hash,
                role,
                created_at
            FROM users
            WHERE LOWER(email) = LOWER($1)
            LIMIT 1;
            """;

            await using var cmd = _dataSource.CreateCommand(sql);

            cmd.Parameters.AddWithValue(email);

            await using var reader =
                await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return null;

            return new User
            {
                Id = reader.GetGuid(0),

                FullName =
                    reader.GetString(1),

                Email =
                    reader.GetString(2),

                PasswordHash =
                    reader.GetString(3),

                Role =
                    reader.GetString(4),

                CreatedAt =
                    reader.GetDateTime(5)
            };
        }


        public async Task<User?>
            GetByIdAsync(Guid id)
        {
            const string sql = """
            SELECT
                id,
                full_name,
                email,
                password_hash,
                role,
                created_at
            FROM users
            WHERE id = $1;
            """;

            await using var cmd =
                _dataSource.CreateCommand(sql);

            cmd.Parameters.AddWithValue(id);

            await using var reader =
                await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return null;

            return new User
            {
                Id = reader.GetGuid(0),
                FullName = reader.GetString(1),
                Email = reader.GetString(2),
                PasswordHash = reader.GetString(3),
                Role = reader.GetString(4),
                CreatedAt = reader.GetDateTime(5)
            };
        }


        public async Task<bool>
            EmailExistsAsync(string email)
        {
            const string sql = """
            SELECT EXISTS(
                SELECT 1
                FROM users
                WHERE LOWER(email)
                    = LOWER($1)
            );
            """;

            await using var cmd =
                _dataSource.CreateCommand(sql);

            cmd.Parameters.AddWithValue(email);

            var result =
                await cmd.ExecuteScalarAsync();

            return result is true;
        }


        public async Task<User>
            CreateAsync(User user)
        {
            const string sql = """
            INSERT INTO users
            (
                id,
                full_name,
                email,
                password_hash,
                role
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING created_at;
            """;

            await using var cmd =
                _dataSource.CreateCommand(sql);

            cmd.Parameters.AddWithValue(
                user.Id);

            cmd.Parameters.AddWithValue(
                user.FullName);

            cmd.Parameters.AddWithValue(
                user.Email);

            cmd.Parameters.AddWithValue(
                user.PasswordHash);

            cmd.Parameters.AddWithValue(
                user.Role);

            var createdAt =
                await cmd.ExecuteScalarAsync();

            user.CreatedAt =
                (DateTime)createdAt!;

            return user;
        }
    }
}
