using Npgsql;

namespace WebCTCPCKXLCTBinhAn.API.Services
{
    public class ManipulationDB : IManipulationDB
    {
        private readonly NpgsqlDataSource _dataSource;

        public ManipulationDB(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        // =========================================================
        // INSERT
        // =========================================================

        public async Task<bool> InsertDynamicAsync(string tableName, Dictionary<string, object?> data)
        {
            if (string.IsNullOrWhiteSpace(tableName))
                throw new ArgumentException("Tên bảng không được để trống.", nameof(tableName));

            if (data is null || data.Count == 0)
                throw new ArgumentException("Dữ liệu không được rỗng.", nameof(data));

            var columns = string.Join(
                ", ",
                data.Keys.Select(QuoteIdentifier));

            var parameters = string.Join(
                ", ",
                data.Keys.Select((_, index) => $"@p{index}"));

            var sql = $"""
                INSERT INTO {QuoteIdentifier(tableName)}
                    ({columns})
                VALUES
                    ({parameters});
                """;

            await using var command =
                _dataSource.CreateCommand(sql);

            int index = 0;

            foreach (var value in data.Values)
            {
                command.Parameters.AddWithValue(
                    $"@p{index}",
                    value ?? DBNull.Value);

                index++;
            }

            var rowsAffected =
                await command.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }


        // =========================================================
        // UPDATE
        // =========================================================

        public async Task<bool> UpdateDynamicAsync(
            string tableName,
            Dictionary<string, object?> dataToUpdate,
            Dictionary<string, object?> whereConditions)
        {
            if (string.IsNullOrWhiteSpace(tableName))
                throw new ArgumentException(
                    "Tên bảng không được để trống.",
                    nameof(tableName));

            if (dataToUpdate is null || dataToUpdate.Count == 0)
                throw new ArgumentException(
                    "Dữ liệu cập nhật không được rỗng.",
                    nameof(dataToUpdate));

            if (whereConditions is null || whereConditions.Count == 0)
                throw new ArgumentException(
                    "Điều kiện WHERE không được rỗng.",
                    nameof(whereConditions));

            var setClauses = dataToUpdate.Keys
                .Select((key, index) =>
                    $"{QuoteIdentifier(key)} = @set{index}");

            var whereClauses = whereConditions.Keys
                .Select((key, index) =>
                    $"{QuoteIdentifier(key)} = @where{index}");

            var sql = $"""
                UPDATE {QuoteIdentifier(tableName)}
                SET {string.Join(", ", setClauses)}
                WHERE {string.Join(" AND ", whereClauses)};
                """;

            await using var command =
                _dataSource.CreateCommand(sql);

            int setIndex = 0;

            foreach (var value in dataToUpdate.Values)
            {
                command.Parameters.AddWithValue(
                    $"@set{setIndex}",
                    value ?? DBNull.Value);

                setIndex++;
            }

            int whereIndex = 0;

            foreach (var value in whereConditions.Values)
            {
                command.Parameters.AddWithValue(
                    $"@where{whereIndex}",
                    value ?? DBNull.Value);

                whereIndex++;
            }

            var rowsAffected =
                await command.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }


        // =========================================================
        // DELETE
        // =========================================================

        public async Task<bool> DeleteDynamicAsync(
            string tableName,
            Dictionary<string, object?> whereConditions)
        {
            if (string.IsNullOrWhiteSpace(tableName))
                throw new ArgumentException(
                    "Tên bảng không được để trống.",
                    nameof(tableName));

            if (whereConditions is null || whereConditions.Count == 0)
                throw new ArgumentException(
                    "Điều kiện WHERE không được rỗng để tránh DELETE toàn bộ bảng!",
                    nameof(whereConditions));

            var whereClauses = whereConditions.Keys
                .Select((key, index) =>
                    $"{QuoteIdentifier(key)} = @where{index}");

            var sql = $"""
                DELETE FROM {QuoteIdentifier(tableName)}
                WHERE {string.Join(" AND ", whereClauses)};
                """;

            await using var command =
                _dataSource.CreateCommand(sql);

            int index = 0;

            foreach (var value in whereConditions.Values)
            {
                command.Parameters.AddWithValue(
                    $"@where{index}",
                    value ?? DBNull.Value);

                index++;
            }

            var rowsAffected =
                await command.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }


        // =========================================================
        // QUOTE IDENTIFIER
        // =========================================================

        private static string QuoteIdentifier(string identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier))
                throw new ArgumentException(
                    "Tên identifier không được để trống.");

            return "\"" +
                   identifier.Replace("\"", "\"\"") +
                   "\"";
        }
    }
}

//Cách sử dụng
//public async Task<bool> Update()
//{
//    var dataToUpdate = new Dictionary<string, object?>
//    {
//        ["noi_dung"] = "Nội dung đã sửa",
//        ["hien_thi"] = true
//    };

//    var whereConditions = new Dictionary<string, object?>
//    {
//        ["id"] = 10
//    };

//    return await _db.UpdateDynamicAsync(
//        "cac_cot_moc",
//        dataToUpdate,
//        whereConditions);
//}