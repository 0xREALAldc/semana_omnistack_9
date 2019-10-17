import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard(){
  const [ spots, setSpots] = useState([]);
  const [ requests, setRequests ] = useState([]);

  const user_id = localStorage.getItem('user');

  const socket = useMemo(() => socketio('http://localhost:3333', {  //o useMemo tem o mesmo efeito do useEffect, e so vai chamar a conexao com o socket novamente
                                                                    // se o user_id mudar 
    query: { user_id }
  }), [user_id]);

  useEffect(() => {
    socket.on('booking_request', data => {
      setRequests([...requests, data])
    })
  }, [requests, socket]);

  useEffect(() =>{ // busca inicial de dados da api
    async function loadSpots(){
      const user_id  = localStorage.getItem('user');
      const response = await api.get('/dashboard', {
        headers: { user_id }
      }); //no segundo parametro podemos passar as configuracoes da requisicao

      setSpots(response.data);
      console.log(response.data);
    }

    loadSpots();
  }, []); // recebe basicamente 2 parametros, uma funcao e o segundo um array de dependencias onde tu pode executar a funcao do 
          // primeiro parametro conforme mudancas em um elemento do array. Para executar apenas uma vez, so deixar o array vazio

  async function handleAccept(id){
    await api.post(`/bookings/${id}/approvals`);

    setRequests(requests.filter(request => request._id !== id));
  }

  async function handleReject(id){
    await api.post(`/bookings/${id}/rejections`);

    setRequests(requests.filter(request => request._id !== id));
  }


  return (
    <> 
      <ul className="notifications">
        {requests.map(request => (  
          <li key={ request._id }>
            <p>
              <strong>{ request.user.email }</strong> está solicitando uma reserva em <strong>{ request.spot.company }</strong> para a data <strong>{ request.date }</strong>
            </p>
            <button className="accept" onClick={() => handleAccept(request._id)}>ACEITAR</button>
            <button className="reject" onClick={() => handleReject(request._id)}>REJEITAR</button>
          </li>
        ))}
      </ul>

      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${ spot.thumbnail_url})` }}/> {/* duas chaves porque a primeira indica que vamos colocar um codigo JS e a segunda que vamos colocar um objeto */}
            <strong>{ spot.company }</strong>
            <span>{ spot.price ? `R$${spot.price}/dia` : 'GRATUITO' }</span>
          </li>
        ))}
      </ul>
      <Link to="/new"> {/* podemos usar o Link para nao ter a necessidade de usar o history.push('/new) */}
        <button className="btn">Cadastrar novo spot</button>
      </Link>
    </>
  )
}