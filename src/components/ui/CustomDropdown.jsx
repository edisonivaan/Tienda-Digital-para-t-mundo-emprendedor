import { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

export default function CustomDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder = 'Seleccionar...',
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [computedDirection, setComputedDirection] = useState('down');
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Cierra al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If there's less than 260px below and more space above, open upwards
      if (spaceBelow < 260 && spaceAbove > spaceBelow) {
        setComputedDirection('up');
      } else {
        setComputedDirection('down');
      }
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <div className={`custom-dropdown ${className} ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      <div 
        className={`custom-dropdown__header ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
      >
        <span>{displayLabel}</span>
        <span className="custom-dropdown__arrow">▼</span>
      </div>
      
      {isOpen && !disabled && (
        <ul className={`custom-dropdown__list custom-dropdown__list--${computedDirection}`}>
          {options.map(option => (
            <li 
              key={option.value}
              className={`custom-dropdown__item ${value === option.value ? 'active' : ''}`}
              onClick={() => { 
                onChange(option.value); 
                setIsOpen(false); 
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
