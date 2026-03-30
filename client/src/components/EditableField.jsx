import React, { useRef, useEffect } from 'react';

const EditableField = ({ 
  as: Component = 'div', 
  value, 
  path, 
  isEditMode, 
  isAiGenerated, 
  onUpdate,
  className = '',
  darkBackground = false
}) => {
  const contentRef = useRef(null);

  // Sync external value changes into the DOM *only* if not currently focused
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== value && document.activeElement !== contentRef.current) {
      contentRef.current.innerText = value || "";
    }
  }, [value]);

  const handleBlur = (e) => {
    const newValue = e.currentTarget.innerText;
    // Only trigger update if content actually changed
    if (newValue !== value) {
      onUpdate(path, newValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const editRing = isEditMode
    ? darkBackground
      ? 'hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-400 focus:bg-blue-900/30'
      : 'hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-500 focus:bg-blue-50'
    : '';

  const baseClasses = isEditMode 
    ? `outline-none rounded transition-colors min-w-[20px] inline-block cursor-text ${editRing}` 
    : "";
    
  // Subtly highlight AI-generated fields based on background context
  const aiHighlight = (isAiGenerated && isEditMode)
    ? darkBackground
      ? 'bg-yellow-900/60 ring-1 ring-yellow-500'
      : 'bg-yellow-100/80 ring-1 ring-yellow-300'
    : '';

  const aiBadgeColor = darkBackground
    ? 'bg-yellow-500 text-yellow-950'
    : 'bg-yellow-400 text-yellow-900';

  const editableNode = (
    <Component
      ref={contentRef}
      contentEditable={isEditMode}
      suppressContentEditableWarning={true}
      className={`${className} ${baseClasses} ${aiHighlight}`.trim()}
      onBlur={handleBlur}
      onPaste={handlePaste}
      dangerouslySetInnerHTML={{ __html: value || "" }}
    />
  );

  // Add a tiny floating "AI" badge on hover to clearly indicate fabricated content
  if (isAiGenerated && isEditMode) {
    const Wrapper = (Component === 'span' || Component === 'a' || Component === 'li') ? 'span' : 'div';
    return (
      <Wrapper className="relative group inline-block">
        {editableNode}
        <span className={`absolute -top-3 -right-3 ${aiBadgeColor} text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-[1px] rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap`}>
          AI Added
        </span>
      </Wrapper>
    );
  }

  return editableNode;
};

export default EditableField;
