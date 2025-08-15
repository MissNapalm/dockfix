import React, { useState, useRef, useEffect } from "react";

const Calculator = ({ onClose }) => {
  const [position, setPosition] = useState({
    x: Math.max(50, (window.innerWidth - 320) / 2),
    y: Math.max(50, Math.min((window.innerHeight - 520) / 2, window.innerHeight - 525))
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = Math.max(-300, Math.min(window.innerWidth - 50, e.clientX - dragOffset.current.x));
        const newY = Math.max(-500, e.clientY - dragOffset.current.y);
        setPosition({
          x: newX,
          y: newY
        });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = "auto";
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.calc-button') || e.target.closest('.calc-close-btn')) return;
    setDragging(true);
    document.body.style.userSelect = "none";
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '−':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = currentValue / inputValue;
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation(null);
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const handleButtonPress = (buttonId) => {
    setButtonPressed(buttonId);
    setTimeout(() => setButtonPressed(null), 150);
  };

  const Button = ({ children, onClick, type = "number", className = "", disabled = false, id }) => {
    const baseStyle = {
      position: 'relative',
      border: 'none',
      borderRadius: '16px',
      fontSize: '20px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
      transform: buttonPressed === id ? 'scale(0.95)' : 'scale(1)',
    };

    const getButtonStyle = () => {
      switch (type) {
        case 'operator':
          return {
            ...baseStyle,
            background: operation === children 
              ? 'linear-gradient(145deg, #ffffff, #f0f0f0)' 
              : 'linear-gradient(145deg, #ff9500, #ff7b00)',
            color: operation === children ? '#ff9500' : '#ffffff',
            boxShadow: operation === children
              ? 'inset 0 2px 8px rgba(255, 149, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)'
              : '0 4px 12px rgba(255, 149, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            height: '64px',
          };
        case 'function':
          return {
            ...baseStyle,
            background: 'linear-gradient(145deg, #a6a6a6, #8a8a8a)',
            color: '#000000',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            height: '64px',
          };
        case 'equals':
          return {
            ...baseStyle,
            background: 'linear-gradient(145deg, #ff9500, #ff7b00)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(255, 149, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            height: '64px',
            gridColumn: 'span 1',
          };
        case 'zero':
          return {
            ...baseStyle,
            background: 'linear-gradient(145deg, #505050, #3a3a3a)',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            height: '64px',
            gridColumn: 'span 2',
            borderRadius: '32px',
          };
        default: // number
          return {
            ...baseStyle,
            background: 'linear-gradient(145deg, #505050, #3a3a3a)',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            height: '64px',
          };
      }
    };

    return (
      <button
        className={`calc-button ${className}`}
        style={getButtonStyle()}
        onClick={() => {
          handleButtonPress(id);
          onClick();
        }}
        disabled={disabled}
        onMouseEnter={(e) => {
          if (type === 'operator' && operation !== children) {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 16px rgba(255, 149, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
          } else if (type !== 'operator') {
            e.target.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (buttonPressed !== id) {
            e.target.style.transform = 'scale(1)';
            if (type === 'operator' && operation !== children) {
              e.target.style.boxShadow = '0 4px 12px rgba(255, 149, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }
          }
        }}
      >
        <span style={{ 
          textShadow: type === 'function' ? '0 1px 1px rgba(255, 255, 255, 0.5)' : '0 1px 2px rgba(0, 0, 0, 0.3)',
          fontSize: children.length > 1 ? '18px' : '20px'
        }}>
          {children}
        </span>
      </button>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        zIndex: 1003,
        background: 'linear-gradient(145deg, #1c1c1e, #000000)',
        borderRadius: '24px',
        padding: '20px',
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.4),
          0 8px 16px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '0 8px',
          cursor: 'grab',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="calc-close-btn"
            onClick={onClose}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 4px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
          >
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '10px', 
              fontWeight: 'bold',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)'
            }}>
              ×
            </span>
          </button>
        </div>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            fontWeight: '600',
            letterSpacing: '-0.02em',
          }}
        >
          Calculator
        </div>
        <div style={{ width: '16px' }} />
      </div>

      {/* Display */}
      <div
        style={{
          background: 'linear-gradient(145deg, #1c1c1e, #111113)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '20px',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: display.length > 8 ? '32px' : '48px',
            fontWeight: '300',
            textAlign: 'right',
            lineHeight: '1',
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            letterSpacing: display.length > 8 ? '-0.02em' : '-0.04em',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            transition: 'font-size 0.2s ease',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          {display.length > 12 ? display.slice(-12) : display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
      >
        <Button type="function" onClick={clear} id="clear">C</Button>
        <Button type="function" onClick={() => setDisplay(String(-parseFloat(display)))} id="plusminus">±</Button>
        <Button type="function" onClick={() => setDisplay(String(parseFloat(display) / 100))} id="percent">%</Button>
        <Button type="operator" onClick={() => performOperation('÷')} id="divide">÷</Button>

        <Button onClick={() => inputDigit(7)} id="7">7</Button>
        <Button onClick={() => inputDigit(8)} id="8">8</Button>
        <Button onClick={() => inputDigit(9)} id="9">9</Button>
        <Button type="operator" onClick={() => performOperation('×')} id="multiply">×</Button>

        <Button onClick={() => inputDigit(4)} id="4">4</Button>
        <Button onClick={() => inputDigit(5)} id="5">5</Button>
        <Button onClick={() => inputDigit(6)} id="6">6</Button>
        <Button type="operator" onClick={() => performOperation('−')} id="subtract">−</Button>

        <Button onClick={() => inputDigit(1)} id="1">1</Button>
        <Button onClick={() => inputDigit(2)} id="2">2</Button>
        <Button onClick={() => inputDigit(3)} id="3">3</Button>
        <Button type="operator" onClick={() => performOperation('+')} id="add">+</Button>

        <Button type="zero" onClick={() => inputDigit(0)} id="0">0</Button>
        <Button onClick={inputDecimal} id="decimal">.</Button>
        <Button type="equals" onClick={calculate} id="equals">=</Button>
      </div>
    </div>
  );
};

export default Calculator;