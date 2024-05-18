const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

let connection;

// Criamos uma conexão de uma maneira assincrona para conseguir fazer o select insert corretamente
async function createConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'admin123',
      database: 'moving_picture',
      Promise: bluebird,
    });
  }
  return connection;
}

/* 
  Exemplo de como usar abaixo:

  try {
    const result = await select({
      query: 'SELECT * FROM moving_picture.Integ_Filmes',
    });
    console.log(result)
  } catch (err) {
    console.error('Failed SELECT:', err);
  }
*/
async function select({ query }) {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(query);
    return rows;
  } catch (err) {
    console.error('Database select error:', err);
    throw err;
  }
}

/* 
  Exemplo de como usar abaixo:

  const query = "UPDATE users SET name = ? WHERE id = ?";
  const params = ['newName', userId];

  try {
    const result = await update({ query, params });
    console.log('Rows affected:', result.affectedRows);
  } catch (err) {
    console.error('Failed to update user:', err);
  }
*/
async function update({ query, params }) {
  try {
    const connection = await createConnection();
    const [result] = await connection.execute(query, params);
    return result;
  } catch (err) {
    console.error('Database update error:', err);
    throw err;
  }
}

/* 
  Exemplo de como usar abaixo:

  for (const movie of result) {
      await insert({
        table: 'moving_picture.Integ_Filmes',
        data: movie,
        columns:
          'Id_do_filme, Nome_do_filme, rating, ano_lancamento, url_image, genero',
      });
    }
*/
async function insert({ table, data, columns }) {
  const connection = await createConnection();
  try {
    const allowedKeys = columns.split(', ').map((col) => col.trim());
    const movieData = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedKeys.includes(key)),
    );

    const keys = Object.keys(movieData).join(', ');
    const values = Object.values(movieData);

    const placeholders = Array(values.length).fill('?').join(', ');

    const sql = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
    await connection.execute(sql, values);
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  }
}

module.exports = {
  insert,
  select,
  update,
};
