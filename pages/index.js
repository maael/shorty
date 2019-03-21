import {useEffect, useState, useRef} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Head from 'next/head'
import animate from './animate'
import List from './List'

const DOMAIN = 'https://l.mael.tech/'

const copyToClipboard = str => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

const fullURL = (short) => `${DOMAIN}${short}`

const createShort = async (original) => {
  const res = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      original
    })
  })
  const json = await res.json()
  return json
}

const getURLs = async () => {
  const res = await fetch('/api')
  const json = await res.json()
  return json
}

export default () => {
  const [url, updateUrl] = useState('')
  const [short, updateShort] = useState('')
  const canvas = useRef()
  const initial = useRef()

  const [urls, updateURLs] = useState([])
  const initialUrls = useRef()

  useEffect(() => {
    if (!initialUrls.current) {
      getURLs().then((newURLs) => {
        updateURLs(newURLs)
        initialUrls.current = true
      })
    }
  })

  useEffect(() => {
    setTimeout(() => {
      if (!initial.current && canvas.current) {
        animate(canvas.current)
        initial.current = true
      }
    }, 10)
  })

  const onSubmit = async (e) => {
    e && e.preventDefault()
    const result = await createShort(url)
    updateShort(result.shortened)
    copyToClipboard(fullURL(result.shortened))
    const latestURLs = await getURLs()
    updateURLs(latestURLs)
    toast('Copied', {
      toastId: 'copied'
    })
  }

  return (
    <div>
      <Head>
        <meta name="theme-color" content="#110E19" />
      </Head>
      <style jsx global>{`
        body, html {
          background-color: #110E19;
          color: #fff;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: Arial, Helvetica, sans-serif;
        }
        canvas {
          position:absolute;
          bottom:0;
          left:0
        }
        .custom-toast {
          background: #191D4C;
          border-radius: 20px;
          box-shadow: 0px 3px 3px #000000;
          color: #FFFFFF;
          text-align: center;
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99,
        boxSizing: 'border-box',
      }}>
        <form onSubmit={onSubmit}>
          <input
            type='text'
            value={short ? fullURL(short) : url}
            onChange={({target}) => {
              updateUrl(target.value)
              updateShort('')
            }}
            autoCapitalize='none'
            autoCorrect='none'
            autoFocus
            autoComplete='none'
            placeholder='Paste or enter link to shorten...'
            onPaste={async (e) => {
              const pasted = e.clipboardData.getData('Text')
              updateUrl(pasted)
              const result = await createShort(pasted)
              updateShort(result.shortened)
              copyToClipboard(fullURL(result.shortened))
              const latestURLs = await getURLs()
              updateURLs(latestURLs)
              toast('Copied', {
                toastId: 'copied'
              })
            }}
            style={{
              outline: 'none',
              border: 0,
              padding: '20px 30px',
              borderRadius: 40,
              color: '#ffffff',
              backgroundColor: '#191D4C',
              fontSize: '2em',
              width: '60vw',
              textOverflow: 'ellipsis',
              boxSizing: 'border-box',
              boxShadow: '0px 3px 3px #000000'
            }}
          />
        </form>
        <List urls={urls} />
      </div>
      <canvas ref={canvas}></canvas>
      <ToastContainer
        position={toast.POSITION.BOTTOM_CENTER}
        autoClose={3000}
        hideProgressBar
        toastClassName='custom-toast'
        closeButton={false}
        style={{
          width: 100,
          marginLeft: -50
        }}
      />
    </div>
  )
}
