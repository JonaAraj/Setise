const express = require('express');
const csv = require('csv-parse');
const fs = require('fs');
const { create } = require('form-data');

const app = express();
const PORT = 3000;

// Middleware para procesar los datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para mostrar el formulario
app.get('/modificar-csv', (req, res) => {
    res.send(`
    <form action="/modificar" method="POST" enctype="multipart/form-data">
        <input type="file" name="csvFile" accept=".csv"><br>
        <input type="submit" value="Modificar CSV">
    </form>
    `);
});

// Ruta para procesar la modificación del CSV
app.post('/modificar', (req, res) => {
    if (req.files && req.files.csvFile) {
        const csvFile = req.files.csvFile;

        // Leer el contenido del CSV
        fs.readFile(csvFile.path, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error leyendo el archivo CSV');
                return;
            }

            // Analizar el CSV
            csv(data, {
                delimiter: ',', // o cualquier otro delimitador que tenga tu CSV
                columns: true,
            }, (err, records) => {
                if (err) {
                    res.status(500).send('Error analizando el CSV');
                    return;
                }

                // Aquí puedes realizar las modificaciones al contenido del CSV
                // Por ejemplo, agregar una nueva fila
                const newRow = { id: 5, name: 'New Item', value: 10 };
                records.push(newRow);

                // Convertir el array de registros a formato CSV
                const csvString = [
                    Object.keys(records[0]).join(','), // Headers
                    ...records.map(row => Object.values(row).join(','))
                ].join('\n');

                // Escribir el nuevo CSV en un archivo temporal
                fs.writeFile('modificado.csv', csvString, (err) => {
                    if (err) {
                        res.status(500).send('Error escribiendo el archivo CSV');
                        return;
                    }

                    // Enviar el CSV modificado como respuesta
                    res.download('modificado.csv', 'modificado.csv', (err) => {
                        if (err) {
                            res.status(500).send('Error descargando el archivo CSV');
                            return;
                        }
                    });
                });
            });
        });
    } else {
        res.status(400).send('No se ha recibido el archivo CSV');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});