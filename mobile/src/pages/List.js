import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Image, AsyncStorage } from 'react-native';

import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List(){
  const [ techs, setTechs ] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketio('http://10.0.103:3333', {
        query: { user_id }
      })

      socket.on('booking_response', booking => {
        Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA' }`)
      })
    })
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('techs').then(storagedTechs => {
      const techsArray = storagedTechs.split(',').map(tech => tech.trim());

      setTechs(techsArray);
    })
  }, []);

  return (
    <SafeAreaView style= { styles.container }>
      <Image style={ styles.logo } source={ logo } />

      <ScrollView>
        { techs.map(tech => <SpotList key={tech} tech={tech} />)}
      </ScrollView>
    </SafeAreaView>    
  )
}

const styles = StyleSheet.create({  
  container: {
    flex: 1
  },

  logo: {
    height: 32,
    resizeMode: 'contain', // utilizado pois o react native nao sabe como ajustar a imagem quando o tamanho dela e menor que o disponivel 
    alignSelf: 'center',
    marginTop: 10
  },

});