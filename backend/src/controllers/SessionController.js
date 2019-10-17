// metodos
// convenção da comunidade ter apenas estes 
// index (listagem de sessoes), show (listar uma unica sessao), store (criar), update (alterar), destroy (remover)
const User = require('../models/User');

module.exports = {
  
  async store(req, res){
    const { email } = req.body; //não necessita colocar .email por usar a desestruturacao para buscar o valor 'email' do 'body'

    let user = await User.findOne({ email });

    if (!user){
      user = await User.create({ email });
    }

    return res.json( user );
  }
};