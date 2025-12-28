import React from 'react';

function Logo({ size = 'medium' }) {
  const sizes = {
    small: { container: '40px', fontSize: '14px', spacing: '8px', textSize: '12px' },
    medium: { container: '60px', fontSize: '20px', spacing: '12px', textSize: '14px' },
    large: { container: '80px', fontSize: '26px', spacing: '16px', textSize: '16px' }
  };

  const currentSize = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: currentSize.spacing }}>
      <div style={{
        width: currentSize.container,
        height: currentSize.container,
        background: 'linear-gradient(135deg, #ff8c00 0%, #e67e00 50%, #cc6900 100%)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(255, 140, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Effet de brillance */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          transform: 'rotate(45deg)',
          animation: 'shine 3s infinite'
        }}></div>

        {/* Texte du logo */}
        <span style={{
          fontSize: currentSize.fontSize,
          fontWeight: '800',
          color: 'white',
          letterSpacing: '-1px',
          position: 'relative',
          zIndex: 1,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>B</span>
      </div>

      {/* Texte "Bawi Bank" */}
      <div>
        <div style={{
          fontSize: currentSize.textSize,
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ff8c00, #ffa500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.5px'
        }}>
          BAWI BANK
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
}

export default Logo;
