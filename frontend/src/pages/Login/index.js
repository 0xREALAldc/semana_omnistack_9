import React, { useState } from 'react';
import api from '../../services/api';

export default function Login({ history }){ //history e uma das varias variaveis que contem dados e usamos para fazer navegacao
  const [ email, setEmail ] = useState(''); // usa os colchetes porque o `useState` retorna um vetor, e iremos usar a desestruturacao e sendo que a variavel
  // `email` tem seu valor atualizado em tempo real comforme ela e alterada, `setEmail` atualiza a variavel `email`

  async function handleSubmit(event){
    event.preventDefault();

    const response = await api.post('/sessions', { email });

    const { _id } = response.data;

    localStorage.setItem('user', _id);

    history.push('/dashboard'); //navega para a tela do dashboard
  }

  return (
    <>  {/* criar uma tag vazia ' <> </>' no react e chamado de fragment */}
      <p>
        Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa!
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-MAIL *</label>
        <input 
          id="email" 
          type="email" 
          placeholder="Seu melhor e-mail"
          value={email}  /* passa a variavel aqui para ter ele sempre atualizado */
          onChange={event => setEmail(event.target.value)} /> {/* pegamos o valor do input toda vez que ele e alterado */}

          <button className="btn" type="submit">Entrar</button>
      </form>
    </>
  );
}