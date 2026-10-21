'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: number | string;
  onChange: (e: { target: { value: string } }) => void;
  children: React.ReactNode;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  children,
  className = '',
}: CustomSelectProps) {
  // Estado cerrado por defecto
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extraer las opciones pasadas como <option> con tipado correcto
  const options = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<{ value: number | string; children: React.ReactNode }> =>
        React.isValidElement(child)
    )
    .map((child) => ({
      value: child.props.value,
      label: child.props.children,
    }));

  // Buscar la etiqueta seleccionada
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: number | string) => {
    onChange({ target: { value: String(val) } });
    setIsOpen(false); // Se cierra al elegir opción
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Botón cerrado estilo Select */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex justify-between items-center text-left bg-white cursor-pointer select-none ${className}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : 'Seleccionar...'}
        </span>
        <svg
          className={`w-4 h-4 ml-2 text-gray-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lista desplegable: Solo se renderiza si isOpen === true */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto py-1 text-sm left-0">
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 cursor-pointer transition-colors flex justify-between items-center ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-blue-600 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}