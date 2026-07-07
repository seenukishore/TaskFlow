import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#0a0a0f'
    }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#0a0a0f'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}