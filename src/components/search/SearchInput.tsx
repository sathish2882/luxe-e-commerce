
import { useState } from "react";
import { SearchInput } from "../navbar/NavbarStyle";
import { useNavigate } from "react-router-dom";

interface SearchProps {
  isSearchOpen: boolean;
}

function SearchBar({ isSearchOpen }: SearchProps) {
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState<string>("")

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) =>{
      if (e.key === "Enter" && searchInput.trim()){
          navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
          setSearchInput("")
      }
    }
    
  return (
    <input
      className={isSearchOpen ? `${SearchInput}` : "hidden"}
      placeholder="Search products..."
      type="search"
      onChange={(e)=> setSearchInput(e.target.value)}
      value={searchInput}
      onKeyDown={handleKeyDown}
    />
  );
}

export default SearchBar;
