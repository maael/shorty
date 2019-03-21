const DOMAIN = 'https://l.mael.tech/'
const fullURL = (short) => `${DOMAIN}${short}`

export default ({urls}) => {
  return (
    <div style={{
      marginTop: 20,
      color: '#ffffff',
      backgroundColor: 'rgb(17,20,40)',
      padding: '20px 30px',
      borderRadius: 40,
      fontSize: '1em',
      width: '60vw',
      boxSizing: 'border-box',
      marginLeft: '50%',
      transform: 'translate(-50%)',
      opacity: 0.2
    }}>
      <div style={{fontWeight: 'bold', marginBottom: 5}}>{urls.length} shortened urls</div>
      {urls.slice(0, 2).map((url) => (
        <div key={url.id} style={{padding: 5, boxSizing: 'border-box', textAlign: 'center'}}>
          <span style={{padding: 10, maxWidth: '40%'}}><a style={{color: '#ffffff'}} href={fullURL(url.shortened)}>/{url.shortened}</a></span>
          <span style={{padding: 10, maxWidth: '40%'}}><a style={{color: '#ffffff'}} href={url.original}>{url.original}</a></span>
        </div>
      ))}
    </div>
  )
}
