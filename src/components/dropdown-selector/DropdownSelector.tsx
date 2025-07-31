import { type FC, useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import styles from './DropdownSelector.module.scss';

interface DropdownSelectorProps {
  options: string[];
  onSelect: (option: string) => void;
  placeholder?: string;
  className?: string;
}

export const DropdownSelector: FC<DropdownSelectorProps> = ({ options, onSelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles['dropdown-selector']} ${className}`}
      ref={dropdownRef}
    >
      <button
        className={styles['dropdown-trigger']}
        onClick={() => setIsOpen(!isOpen)}
        type='button'
      >
        <Plus
          size={20}
          className={styles['plus-icon']}
        />
      </button>

      {isOpen && (
        <div className={styles['dropdown-menu']}>
          {options.map((option, index) => (
            <button
              key={index}
              className={`${styles['dropdown-option']} ${selectedOption === option ? styles.selected : ''}`}
              onClick={() => handleOptionSelect(option)}
              type='button'
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
