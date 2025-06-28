import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Language as LanguageIcon,
  TranslateRounded as TranslateIcon
} from '@mui/icons-material';

const LanguageSwitcher = ({ variant = 'select', size = 'small' }) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
  ];

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    
    // Update document direction for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  if (variant === 'icon') {
    return (
      <FormControl size={size}>
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          displayEmpty
          variant="standard"
          sx={{
            '& .MuiSelect-select': {
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            },
            '& .MuiSelect-icon': {
              display: 'none'
            },
            '&:before, &:after': {
              display: 'none'
            }
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TranslateIcon fontSize="small" />
              <Typography variant="body2">
                {languages.find(lang => lang.code === selected)?.nativeName}
              </Typography>
            </Box>
          )}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {language.nativeName}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl size={size} sx={{ minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        displayEmpty
        startAdornment={<LanguageIcon sx={{ mr: 1, fontSize: 18 }} />}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            {language.nativeName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
