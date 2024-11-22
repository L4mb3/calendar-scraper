const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();

app.get('/calendario', async (req, res) => {
    try {
        // Effettua una richiesta alla pagina ENAC
        const { data } = await axios.get('https://www.enac.gov.it/sicurezza-aerea/certificazione-del-personale/personale-di-volo/piloti/esami-teorici-piloti/calendario-delle-sessioni-di-esami-ppla-pplh-sfcl-bfcl-2025-in-aggiornamento/');
        
        // Usa JSDOM per estrarre i dati dalla pagina
        const dom = new JSDOM(data);
        const document = dom.window.document;

        // Trova la tabella con i dati
        const table = document.querySelector('.content-section.post-table table tbody');
        const rows = table.querySelectorAll('tr');

        // Estrai i dati
        const result = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            result.push({
                mese: cells[0].textContent.trim(),
                giorno: cells[1].textContent.trim(),
                direzione: cells[2].textContent.trim(),
                note: cells[3].textContent.trim(),
            });
        });

        // Invia i dati come JSON
        res.json(result);
    } catch (error) {
        console.error('Errore durante lo scraping:', error);
        res.status(500).send('Errore durante lo scraping');
    }
});

// Avvia il server sulla porta 3000
app.listen(3000, () => console.log('Server avviato su http://localhost:3000'));
