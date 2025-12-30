import Lanyard from './Lanyard'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </div>
  )
}

export default App