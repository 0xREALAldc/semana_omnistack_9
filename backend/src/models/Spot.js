const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  thumbnail: String,
  company: String,
  price: Number,
  techs: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  toJSON: { //algumas configuracoes que podem ser feitas para toda vez que o Schema for convertido em JSON
    virtuals: true //isso signigica que toda vez que o Schema for convertido em JSON ele ira calcular os virtuals
  }
});

//virtual -> campo que vai ser computado pelo JS e nao existe na base
SpotSchema.virtual('thumbnail_url').get(function(){
  return `http://localhost:3333/files/${this.thumbnail}`
})

module.exports = mongoose.model('Spot', SpotSchema);//exportando o eschema do usuario