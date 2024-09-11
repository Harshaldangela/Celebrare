import React, { useState, useRef } from 'react';
import { FaUndo, FaRedo } from 'react-icons/fa'; 
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const [texts, setTexts] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeText, setActiveText] = useState(null);
  const containerRef = useRef(null);

  const addText = () => {
    const newText = {
      id: uuidv4(),
      content: 'New Text',
      top: 50,
      left: 50,
      fontSize: '16px',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
    };
    const newTexts = [...texts, newText];
    updateTexts(newTexts);
    setActiveText(newText);
  };

  const updateTexts = (newTexts) => {
    setTexts(newTexts);
    const newHistory = [...history.slice(0, historyIndex + 1), newTexts];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTexts(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTexts(history[historyIndex + 1]);
    }
  };

  const handleMouseMove = (e) => {
    if (activeText) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const newLeft = e.clientX - rect.left - 50;
      const newTop = e.clientY - rect.top - 20;
  
      const adjustedLeft = Math.min(Math.max(newLeft, 0), rect.width - 100);
      const adjustedTop = Math.min(Math.max(newTop, 0), rect.height - 40);
  
      const updatedTexts = texts.map(text =>
        text.id === activeText.id ? { ...text, top: adjustedTop, left: adjustedLeft } : text
      );
      updateTexts(updatedTexts);
    }
  };

  const updateTextStyle = (style) => {
    if (activeText) {
      const updatedTexts = texts.map(text =>
        text.id === activeText.id ? { ...text, ...style } : text
      );
      updateTexts(updatedTexts);
      setActiveText((prev) => ({ ...prev, ...style }));
    }
  };

  const toggleBold = () => {
    updateTextStyle({ fontWeight: activeText?.fontWeight === 'bold' ? 'normal' : 'bold' });
  };

  const toggleItalic = () => {
    updateTextStyle({ fontStyle: activeText?.fontStyle === 'italic' ? 'normal' : 'italic' });
  };

  const toggleUnderline = () => {
    updateTextStyle({
      textDecoration: activeText?.textDecoration === 'underline' ? 'none' : 'underline',
    });
  };

  const alignCenter = () => {
    updateTextStyle({ textAlign: activeText?.textAlign === 'center' ? 'left' : 'center' });
  };

  const changeFontSize = (size) => {
    updateTextStyle({ fontSize: size });
  };

  const changeFontFamily = (family) => {
    updateTextStyle({ fontFamily: family });
  };

  const handleMouseDown = (text) => {
    setActiveText(text);
  };

  const handleMouseUp = () => {
    setActiveText(null);
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      className="app-container"
    >
      <div className="undo-redo-container">
        <button 
          onClick={undo} 
          disabled={historyIndex <= 0} 
          className="icon-button" 
          aria-label="Undo"
        >
          <FaUndo />
        </button>
        <button 
          onClick={redo} 
          disabled={historyIndex >= history.length - 1} 
          className="icon-button" 
          aria-label="Redo"
        >
          <FaRedo />
        </button>
      </div>

      <div id="text-container" ref={containerRef}>
        {texts.map((text) => (
          <div
            key={text.id}
            style={{
              position: 'absolute',
              top: text.top,
              left: text.left,
              fontSize: text.fontSize,
              fontFamily: text.fontFamily,
              fontWeight: text.fontWeight,
              fontStyle: text.fontStyle,
              textDecoration: text.textDecoration,
              textAlign: text.textAlign,
              border: activeText && activeText.id === text.id ? '2px solid blue' : '1px solid black',
            }}
            contentEditable
            onMouseDown={() => handleMouseDown(text)}
            suppressContentEditableWarning={true}
          >
            {text.content}
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={addText}>Add Text</button>
        <button onClick={toggleBold} disabled={!activeText}>Bold</button>
        <button onClick={toggleItalic} disabled={!activeText}>Italic</button>
        <button onClick={toggleUnderline} disabled={!activeText}>Underline</button>
        <button onClick={alignCenter} disabled={!activeText}>Center</button>
      </div>

      <div className="controls">
        <select 
          onChange={(e) => changeFontSize(e.target.value)} 
          disabled={!activeText} 
          defaultValue="16px"
        >
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
        </select>

        <select 
          onChange={(e) => changeFontFamily(e.target.value)} 
          disabled={!activeText} 
          defaultValue="Arial"
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier">Courier</option>
        </select>
      </div>
    </div>
  );
};

export default App;
