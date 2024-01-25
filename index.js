const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';
const principalUrl = 'https://es.wikipedia.org'

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const links = [];
        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href');
            links.push(link);
        });
        const finalArray = [];
        let completedRequest = 0;
        for (const link of links) {
            const innerURL = `${principalUrl}${link}`;
            const response = await axios.get(innerURL)
            const innerPage = response.data;
            const $ = cheerio.load(innerPage);
            const title = $('h1').text();
            const imgs = [];
            const texts = [];

            const obj = {
                title,
                imgs,
                texts
            };
            
            $('img').each((index,element) => {
                const img = $(element).attr('src');
                imgs.push(img);
            })
            $('p').each((index,element) => {
                const text = $(element).text();
                texts.push(text);
            })

            finalArray.push(obj);
            completedRequest++;
            if(completedRequest === links.length) {
               res.send(finalArray);
            }
        }
        
    } catch(error) {
        console.log(error);
    }
})

/********************************** CLASE ********************************/

/*app.get('/', async (req, res) => {
    try {
      const response = await axios.get(url)
      const html = response.data
      const $ = cheerio.load(html)
  
      const links = []
      $('#mw-pages a').each((index, element) => {
        const link = $(element).attr('href')
        links.push(link)
      })
      
      const finalArray = [] 
      
      for(const link of links) {
        const innerURL = `${principalURL}${link}`
        const response = await axios.get(innerURL)
        const innerPage = response.data
        const $ = cheerio.load(innerPage)
        
        
        const obj = {
          imgs: [],
          texts: []
        }
        
        const title = $('h1').text()
        obj.title = title
       
        $('img').each((index, element) => {
          const img = $(element).attr('src')
          obj.imgs.push(img)
          console.log('imgs-->', img)
        })
        
        $('p').each((index, element) => {
            const text = $(element).text()
            obj.texts.push(text)
            console.log('texts-->', text)
          })
        finalArray.push(obj)
      }
          
      res.send(`
      <p>LINKS</p>
      <ul>
        ${links.map(data => `<li>${data}</li>`).join('')}
      </ul>
      <p>Cantantes</p>
      <ul>
        ${finalArray.map(data => `
          <li>
            <h2>${data.title}</h2>
            <p>Imagenes: ${data.imgs.map(img => `<p>${img}</p>`).join('')}</p>
            <p>Textos: ${data.texts.map(text => `<p>${text}</p>`).join('')}</p>
          </li>`
        )}
      </ul>
      `)
  
    } catch(error) {
      console.log(error)
    }
  }) */


app.listen(3000, () => {
    console.log('Express está escuchando en http://localhost:3000');
})