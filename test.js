/*async function pesquisarDocumentos(db) {
    const colecao = db.collection('sites'); // Substitua pelo nome da sua coleção

    try {
        const documentos = await colecao.find({}).toArray();
        documentos[0].sites.forEach(element => {
            console.log(element);
        });
    } catch (error) {
        console.error('Erro ao pesquisar documentos:', error);
    }
}
*/
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const { PASSWORD } = process.env;

const uri = `mongodb+srv://terreorenan68:${PASSWORD}@gofing.pquxsyl.mongodb.net/?retryWrites=true&w=majority&appName=gofing`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect().then();
const db = client.db('siteCatalog');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchTags(url) {
  try {
    // Fazendo a requisição HTTP para o site
    const { data } = await axios.get(url);
    
    // Carregando o HTML com o cheerio
    const $ = cheerio.load(data);

    // Selecionando todas as tags meta
    const metaTags = $('meta');

    // Armazenando os dados das tags meta
    const metaData = {};

    metaTags.each((index, element) => {
      const tag = $(element);
      const name = tag.attr('name') || tag.attr('property');
      const content = tag.attr('content');

      if (name && content) {
        metaData[name] = { content };
      }
    });

    // Selecionando todas as tags p
    const paragraphTags = $('p');
    const paragraphs = [];

    let title = $('title').text();
    const linksTags = $('a');
    let links = [];

    paragraphTags.each((index, element) => {
      const text = $(element).text();
      if (text) {
        paragraphs.push(text);
      }
    });
    linksTags.each((index, element) => {
      const tag = $(element);
      const text = tag.attr('href');
      if (text && text[0] != "#") {
        if(text[0] == '/') {
          links.push(url + text);
        } else{
          links.push(text);
        }
      }
    });

    return { metaData, paragraphs, title, links };
  } catch (error) {
    console.error(`Erro ao buscar tags de ${url}:`, error);
    return { metaData: {}, paragraphs: [], title: {} };
  }
}

// URL do site que você deseja ler as tags
const url = 'https://stackoverflow.com/';
// Chamando a função e exibindo os dados das tags
let c = 0;
function addSite(url, con){
fetchTags(url).then( async({ metaData, paragraphs, title, links }) => {
  let tags = [];
  console.log("New site:", title);
  const client = db.collection('sites');
  console.log(title);
   tags.push(title.split(' '));
   if(metaData.keywords) {
    tags.push(metaData.keywords.content);
   }
   console.log(tags);
    const novoDocumento = {
        name: title,
        url: url,
        tags: tags[0],
        author: metaData.author,
        texts: paragraphs
    };

    try {
        const resultado = await client.insertOne(novoDocumento);
        console.log('Documento adicionado:', resultado.insertedId);
    } catch (erro) {
        console.error('Erro ao adicionar documento:', erro);
    }
    if(links && con) {
      links.forEach(element => {
        if(c < 5) {
          addSite(element, true);
          c++;
        }
      });
    }
});
 
}
addSite(url, true);
