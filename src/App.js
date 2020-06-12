import React, { useState, useEffect } from 'react'
import './App.css'
import GoogleMapReact from 'google-map-react'
import io from 'socket.io-client'
import Marker from './Marker'
const socket = io('http://35.238.125.238:8020/admin')

function App() {
  const [state, setState] = useState('Offline')
  const [cartVideo, setCartVideo] = useState('')
  const [passengerVideo, setPassengerVideo] = useState('')
  const [logs, setLogs] = useState([])
  const [message, setMessage] = useState('')
  const [cartGPS, setCartGPS] = useState({
    latitude: 38.43175,
    longitude: -78.876357
  })
  const [destinationGPS, setDestinationGPS] = useState({})

  useEffect(e => {
    socket.on('state', data => {
      const jsonData = JSON.parse(data)
      setState(jsonData.state)
      setLogs(jsonData.logs)
    })
    socket.on('cart_video', data => {
      setCartVideo(data)
    })
    socket.on('passenger_video', data => {
      setPassengerVideo(data)
    })

    socket.on('add_log', data => {
      setLogs(logs.unshift(JSON.parse(data)).pop())
      // setLogs(JSON.parse(data))
    })

    socket.on('update_state', data => {
      setState(data)
      if (data === 'Idle') setDestinationGPS({})
    })

    socket.on('cart_gps', data => {
      const jsonData = JSON.parse(data)
      setCartGPS(jsonData)
    })

    socket.on('destination_gps', data => {
      const jsonData = JSON.parse(data)
      setDestinationGPS(jsonData)
    })
  }, [])

  const onStop = () => {
    socket.emit('pull_over')
  }

  const onResume = () => {
    socket.emit('resume_driving')
  }

  const onMessage = () => {
    if (message) {
      console.log(message)
      socket.emit('message', message)
    }
  }

  return (
    <div className="app">
      <div className="left">
        <div className="top">
          {passengerVideo ? (
            <img
              className="video"
              src={`data:image/jpeg;base64,${passengerVideo}`}
              onError={e => {
                e.target.onerror = null
                e.target.src = require('./logo.svg')
              }}
            ></img>
          ) : (
            <div className="video" />
          )}

          {cartVideo ? (
            <img
              className="video"
              src={`data:image/jpeg;base64,${cartVideo}`}
              onError={e => {
                e.target.onerror = null
                e.target.src = require('./logo.svg')
              }}
            ></img>
          ) : (
            <div className="video" />
          )}
        </div>
        <div className="bottom">
          <div className="info">
            <div className="state">{state}</div>
            <div className="control">
              <div className="msg-container">
                <input
                  className="msg"
                  placeholder="Send message"
                  value={message ? message : ''}
                  onChange={e => setMessage(e.target.value)}
                ></input>
                <button className="send" onClick={e => onMessage()}>
                  Send
                </button>
              </div>
              <div className="control-btns">
                <button
                  className="btn"
                  onClick={e => onResume()}
                  style={{ backgroundColor: '#62a859' }}
                >
                  Resume
                </button>
                <button
                  className="btn"
                  onClick={e => onStop()}
                  style={{ backgroundColor: 'red' }}
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
          <div className="logs">
            <div className="log-title">Logs</div>
            {logs.map((e, index) => {
              return (
                <div className="log-item" key={index}>
                  <div className="log-name">{e.destination}</div>
                  <div className="log-timestamp">
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="right">
        {cartGPS ? (
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyB57gkemGo4XwiDMzwXT2dImCdjh_-s7WQ'
            }}
            center={{
              lat: cartGPS.latitude,
              lng: cartGPS.longitude
            }}
            defaultZoom={19}
            options={{
              styles: [
                {
                  featureType: 'all',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#ffffff'
                    }
                  ]
                },
                {
                  featureType: 'all',
                  elementType: 'labels.text.stroke',
                  stylers: [
                    {
                      color: '#000000'
                    },
                    {
                      lightness: 13
                    }
                  ]
                },
                {
                  featureType: 'administrative',
                  elementType: 'geometry.fill',
                  stylers: [
                    {
                      color: '#000000'
                    }
                  ]
                },
                {
                  featureType: 'administrative',
                  elementType: 'geometry.stroke',
                  stylers: [
                    {
                      color: '#144b53'
                    },
                    {
                      lightness: 14
                    },
                    {
                      weight: 1.4
                    }
                  ]
                },
                {
                  featureType: 'landscape',
                  elementType: 'all',
                  stylers: [
                    {
                      color: '#08304b'
                    }
                  ]
                },
                {
                  featureType: 'poi',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#0c4152'
                    },
                    {
                      lightness: 5
                    }
                  ]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry.fill',
                  stylers: [
                    {
                      color: '#000000'
                    }
                  ]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry.stroke',
                  stylers: [
                    {
                      color: '#0b434f'
                    },
                    {
                      lightness: 25
                    }
                  ]
                },
                {
                  featureType: 'road.arterial',
                  elementType: 'geometry.fill',
                  stylers: [
                    {
                      color: '#000000'
                    }
                  ]
                },
                {
                  featureType: 'road.arterial',
                  elementType: 'geometry.stroke',
                  stylers: [
                    {
                      color: '#0b3d51'
                    },
                    {
                      lightness: 16
                    }
                  ]
                },
                {
                  featureType: 'road.local',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#000000'
                    }
                  ]
                },
                {
                  featureType: 'transit',
                  elementType: 'all',
                  stylers: [
                    {
                      color: '#146474'
                    }
                  ]
                },
                {
                  featureType: 'water',
                  elementType: 'all',
                  stylers: [
                    {
                      color: '#021019'
                    }
                  ]
                }
              ]
            }}
          >
            {console.log(cartGPS)}
            <Marker
              lat={cartGPS.latitude}
              lng={cartGPS.longitude}
              name={'Cart'}
              color={'blue'}
            />

            {destinationGPS ? (
              <Marker
                lat={destinationGPS.latitude}
                lng={destinationGPS.longitude}
                name={'Destination'}
                color={'red'}
              />
            ) : null}
          </GoogleMapReact>
        ) : null}
        <div className="cart-gps">
          {cartGPS.latitude}, {cartGPS.longitude}
        </div>
      </div>
    </div>
  )
}

export default App
