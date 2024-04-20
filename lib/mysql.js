const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'moving_picture',
});

async function insertMoviesIntoDB({ movies }) {
  try {
    for (const movie of movies) {
      const allowedKeys = ['Id_do_filme', 'Id_do_imb', 'Nome_do_filme', 'rating', 'ano_lancamento', 'url_image', 'genero', 'Data_insersão'];
      const movieData = Object.fromEntries(
        Object.entries(movie).filter(([key]) => allowedKeys.includes(key))
      );

      const keys = Object.keys(movieData).join(', ');
      const values = Object.values(movieData);

      const placeholders = Array(values.length).fill('?').join(', ');

      const sql = `INSERT INTO sua_tabela (${keys}) VALUES (${placeholders})`;
      await connection.execute(sql, values);    
      
      console.log(`Filme ${movieData.nome_do_filme} inserido com sucesso!`);
    }
  } catch (error) {
    console.error('Erro ao inserir filmes:', error);
  } finally {
    await connection.end();
  }
}

module.exports = {
  insertMoviesIntoDB,
};
