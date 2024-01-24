const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';
const principalUrl = 'https://es.wikipedia.org/'


app.get('/', (req,res) => {
    axios.get(url)
        .then(response => {
            if(response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                const links = [];

                $('#mw-pages a').each((index, element) => {
                    const link = $(element).attr('href');
                    links.push(link);
                })
                const finalArray = [];
                let completedRequest = 0;
                for (const link of links) {
                    const innerURL = `${principalUrl}${link}`;
                    axios.get(innerURL)
                        .then(response2 => {
                            if(response2.status === 200) {
                                const innerPage = response2.data;
                                const $ = cheerio.load(innerPage);
                                const title = $('h1').text();
                                const imgs = [];
                                const texts = []
                                $('img').each((index,element) => {
                                    const img = $(element).attr('src');
                                    imgs.push(img);
                                })
                                $('p').each((index,element) => {
                                    const text = $(element).text();
                                    texts.push(text);
                                })
                                const obj = {
                                    title,
                                    imgs,
                                    texts
                                };
                                finalArray.push(obj);
                                completedRequest++;
                                if(completedRequest === links.length) {
                                    res.send(finalArray);
                                }
                        }
                    })
                }
            }
        })
})



app.listen(3000, () => {
    console.log('Express está escuchando en http://localhost:3000');
})