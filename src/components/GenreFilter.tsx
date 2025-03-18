
import { useState } from 'react';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedGenre === null
              ? 'bg-brown-800 text-white'
              : 'bg-brown-100 text-brown-700 hover:bg-brown-200'
          }`}
        >
          Все
        </button>
        
        {genres.slice(0, isOpen ? genres.length : 5).map(genre => (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedGenre === genre
                ? 'bg-brown-800 text-white'
                : 'bg-brown-100 text-brown-700 hover:bg-brown-200'
            }`}
          >
            {genre}
          </button>
        ))}
        
        {genres.length > 5 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-cream-100 text-brown-700 hover:bg-cream-200 transition-all duration-200"
          >
            {isOpen ? 'Скрыть' : `Еще ${genres.length - 5}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default GenreFilter;
