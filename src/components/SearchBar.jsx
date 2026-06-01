import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ onSearch, onGeoSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches')) || [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  const wrapperRef = useRef(null);

  const saveRecentSearch = (city) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    const updatedSearches = [
      trimmedCity,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmedCity.toLowerCase()
      ),
    ].slice(0, 5);

    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedCity = inputValue.trim();
    if (!trimmedCity) return;

    onSearch(trimmedCity);
    saveRecentSearch(trimmedCity);
    setShowHistory(false);
  };

  const handleGeoSearch = () => {
    if (!navigator.geolocation) {
      alert('Location access denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onGeoSearch({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        alert('Location access denied');
      }
    );
  };

  const handleSelectHistory = (city) => {
    setInputValue(city);
    onSearch(city);
    saveRecentSearch(city);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
    setShowHistory(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <Box
      ref={wrapperRef}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        mb: 3,
      }}
    >
      <TextField
        fullWidth
        label="Search for a city..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => {
          if (recentSearches.length > 0) {
            setShowHistory(true);
          }
        }}
        disabled={loading}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {inputValue && (
                  <IconButton
                    onClick={() => setInputValue('')}
                    edge="end"
                    disabled={loading}
                    aria-label="Clear search input"
                    sx={{ color: '#fff' }}
                  >
                    <ClearIcon />
                  </IconButton>
                )}

                <IconButton
                  type="submit"
                  edge="end"
                  disabled={loading}
                  aria-label="Search weather"
                  sx={{ color: '#fff' }}
                >
                  <SearchIcon />
                </IconButton>

                <IconButton
                  onClick={handleGeoSearch}
                  edge="end"
                  disabled={loading}
                  aria-label="Use current location"
                  sx={{ color: '#fff' }}
                >
                  <MyLocationIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius: '18px',
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.25)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.45)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255,255,255,0.7)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255,255,255,0.85)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff',
          },
          '& input': {
            color: '#fff',
          },
        }}
      />

      {showHistory && recentSearches.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '100%',
            zIndex: 100,
            background: 'rgba(20,20,40,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '12px',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden',
          }}
        >
          <List disablePadding>
            {recentSearches.map((city) => (
              <ListItemButton
                key={city}
                onClick={() => handleSelectHistory(city)}
                sx={{
                  color: '#fff',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemText primary={city} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button
              fullWidth
              onClick={handleClearHistory}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                textTransform: 'none',
                borderRadius: '10px',
                '&:hover': {
                  background: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              Clear history
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;