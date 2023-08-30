/* const express = require('express');
const app = express();
const sql = require('mssql');


const config = {
    user: 'sa',
    password: 'Cadelga20',
    server: 'localhost',
    database: 'App_AgroCred',
    options: {
      encrypt: false // Si tu servidor SQL Server está en la nube, debes establecer esta propiedad como true
    }
  }
   

app.get('/destinos', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT *  FROM [App_AgroCred].[dbo].[Destino]');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(30010, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
 */