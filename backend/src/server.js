const express  = require('express'); //micro framework dentro do node, com funcionalidades ja prontas como definição de rotas,o app.listen() pra rodar o server tbm
const mongoose = require('mongoose'); 
const cors     = require('cors'); 
const path     = require('path'); 
const socketio = require('socket.io');
const http     = require('http');

const routes = require('./routes'); // importar as rotas criadas

const app    = express();
const server = http.Server(app); //pegando o servidor HTTP de dentro do express
const io     = socketio(server); //fazendo isto o 'server' passa conseguir ouvir tambem o protocolo websocket

mongoose.connect('mongodb://omnistack:543n7942@omnistack-shard-00-00-acl6h.mongodb.net:27017,omnistack-shard-00-01-acl6h.mongodb.net:27017,omnistack-shard-00-02-acl6h.mongodb.net:27017/test?ssl=true&replicaSet=OmniStack-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectedUsers = {};

io.on('connection', socket => {

  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;

}); // toda vez que um usuario logar, tanto por app quanto web ele vai capturar a informacao

// aqui vamos disponibilizar dados que terao acesso possivel em todas as rotas
app.use((req, res, next) =>{ 
  req.io = io;                          // este ira permitir enviar e receber mensagens em tempo real
  req.connectedUsers = connectedUsers; // acesso a todos os usuarios conectados

  return next(); //necessario para a aplicacao nao travar aqui
})

// GET, POST, PUT, DELETE

// req.query  = Acessar query params '?' (os passados com o interrogacao) (para filtros) "app.get"
// req.params = Acessar route params `/users/:id' (para edicao e delete)  "app.put"
// req.body   = Acessar corpo da requisicao (para criacao, edicao)  

app.use(cors()); // o cors serve para controlar quem pode acessar a API, poderiamos colocar ate o parametro assim { origin: 'http://localhost:3333' } para especificar quem poderia acessar
app.use(express.json()); //para dizer que o express vai entender requisicoes do formato JSON
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));// usado no express para retornar arquivos estaticos
app.use(routes);

server.listen(3333); //foi alterado aqui de 'app.listen()' para o 'server.listen()' para escutar tanto http quanto websockets
