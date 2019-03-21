import {useEffect, useState, useRef} from 'react'
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
  }

  return (
    <div>
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
              console.info('set url to', pasted)
              const result = await createShort(pasted)
              updateShort(result.shortened)
              copyToClipboard(fullURL(result.shortened))
              const latestURLs = await getURLs()
              updateURLs(latestURLs)
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
              boxSizing: 'border-box'
            }}
          />
        </form>
        <List urls={urls} />
      </div>
      <canvas ref={canvas}></canvas>
    </div>
  )
}
