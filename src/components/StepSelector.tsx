import React, { useState } from 'react'

interface StepOption {
  id: string
  type: 'action' | 'router'
  label: string
  icon: string
  category: string
  description?: string
  integrationLogo?: string
}

interface StepSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (option: StepOption) => void
  position?: { x: number; y: number }
}

const stepOptions: StepOption[] = [
  // Popular integrations
  {
    id: 'google-sheets',
    type: 'action',
    label: 'Google Sheets',
    icon: '📊',
    category: 'Popular',
    integrationLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlesheets.svg',
  },
  {
    id: 'slack',
    type: 'action',
    label: 'Slack',
    icon: '💬',
    category: 'Popular',
    integrationLogo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
  },
  {
    id: 'notion',
    type: 'action',
    label: 'Notion',
    icon: '📝',
    category: 'Popular',
    integrationLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
  },
  {
    id: 'gmail',
    type: 'action',
    label: 'Gmail',
    icon: '📧',
    category: 'Popular',
    integrationLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg',
  },
  {
    id: 'hubspot',
    type: 'action',
    label: 'HubSpot',
    icon: '🎯',
    category: 'Popular',
    integrationLogo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hubspot.svg',
  },

  // Utility nodes
  {
    id: 'router',
    type: 'router',
    label: 'Router',
    icon: '🔀',
    category: 'Highlights',
    description: 'Route to multiple branches',
  },
  { id: 'http', type: 'action', label: 'HTTP', icon: '🌐', category: 'Highlights', description: 'Make HTTP requests' },
  { id: 'code', type: 'action', label: 'Code', icon: '💻', category: 'Highlights', description: 'Run custom code' },
  {
    id: 'tables',
    type: 'action',
    label: 'Tables',
    icon: '📊',
    category: 'Highlights',
    description: 'Work with tables',
  },
]

export const StepSelector: React.FC<StepSelectorProps> = ({ isOpen, onClose, onSelect, position }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'utility'>('all')

  if (!isOpen) return null

  const filteredOptions = stepOptions.filter((option) => {
    const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'popular' && option.category === 'Popular') ||
      (activeTab === 'utility' && option.category === 'Highlights')
    return matchesSearch && matchesTab
  })

  const popularOptions = filteredOptions.filter((o) => o.category === 'Popular')
  const highlightOptions = filteredOptions.filter((o) => o.category === 'Highlights')

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        }}
        onClick={onClose}
      />

      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          maxHeight: '80vh',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <input
            type='text'
            placeholder='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              outline: 'none',
            }}
            autoFocus
          />
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            padding: '0 20px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'all' ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'all' ? '#6366f1' : '#6b7280',
            }}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'popular' ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'popular' ? '#6366f1' : '#6b7280',
            }}
          >
            Apps
          </button>
          <button
            onClick={() => setActiveTab('utility')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'utility' ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === 'utility' ? '#6366f1' : '#6b7280',
            }}
          >
            Utility
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {activeTab === 'all' && (
            <>
              {popularOptions.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '12px',
                    }}
                  >
                    Popular
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {popularOptions.map((option) => (
                      <StepOption
                        key={option.id}
                        option={option}
                        onSelect={() => {
                          onSelect(option)
                          onClose()
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {highlightOptions.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '12px',
                    }}
                  >
                    Highlights
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {highlightOptions.map((option) => (
                      <StepOption
                        key={option.id}
                        option={option}
                        onSelect={() => {
                          onSelect(option)
                          onClose()
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab !== 'all' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredOptions.map((option) => (
                <StepOption
                  key={option.id}
                  option={option}
                  onSelect={() => {
                    onSelect(option)
                    onClose()
                  }}
                />
              ))}
            </div>
          )}

          {filteredOptions.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: '#9ca3af',
                marginTop: '40px',
              }}
            >
              No results found
            </p>
          )}
        </div>
      </div>
    </>
  )
}

interface StepOptionProps {
  option: StepOption
  onSelect: () => void
}

const StepOption: React.FC<StepOptionProps> = ({ option, onSelect }) => (
  <div
    onClick={onSelect}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      backgroundColor: '#fff',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f3f4f6'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#fff'
    }}
  >
    {option.integrationLogo ? (
      <img
        src={option.integrationLogo}
        alt={option.label}
        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
      />
    ) : (
      <span style={{ fontSize: '24px' }}>{option.icon}</span>
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 500, color: '#1f2937' }}>{option.label}</div>
      {option.description && (
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{option.description}</div>
      )}
    </div>
  </div>
)
