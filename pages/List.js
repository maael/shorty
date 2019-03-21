const fullURL = (short) => `/${short}`

export default ({urls}) => {
  return (
    <div style={{
      marginTop: 20,
      color: '#ffffff',
      padding: '20px 30px',
      borderRadius: 40,
      fontSize: '1em',
      width: '60vw',
      boxSizing: 'border-box',
      marginLeft: '50%',
      transform: 'translate(-50%)',
      opacity: 0.3,
      textShadow: '0px 3px 3px #000000'

    }}>
      <div style={{fontWeight: 'bold', marginBottom: 5}}>{urls.length} shortened urls</div>
      {urls.slice(0, 2).map((url) => (
        <div key={url.id} style={{padding: 5, boxSizing: 'border-box', display: 'flex', flexDirection: 'row'}}>
          <span style={{width: 200, flexShrink: 0}}><a style={{color: '#ffffff'}} href={fullURL(url.shortened)}>/{url.shortened}</a></span>
          <span style={{flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}><a style={{color: '#ffffff'}} href={url.original}>{url.original}</a></span>
          <span style={{width: 50, flexShrink: 0, paddingLeft: 20}}><small>{url.visits} visit{url.visits === 1 ? '' : 's'}</small></span>
        </div>
      ))}
    </div>
  )
}
