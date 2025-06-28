import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate inputs before proceeding
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    
    try {
      await login(username, password);
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    let isValid = true;

    if (!username.value || username.value.length < 1) {
      setUsernameError(true);
      setUsernameErrorMessage(t('enterUsername'));
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

    if (!password.value || password.value.length < 1) {
      setPasswordError(true);
      setPasswordErrorMessage(t('enterPassword'));
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <SitemarkIcon />
        </Box>
        <LanguageSwitcher />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        {t('signIn')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="username">{t('username')}</FormLabel>
          <TextField
            error={usernameError}
            helperText={usernameErrorMessage}
            id="username"
            type="text"
            name="username"
            placeholder={t('enterUsername')}
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={usernameError ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">{t('password')}</FormLabel>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder={t('enterPassword')}
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label={t('rememberMe')}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ position: 'relative' }}
        >
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
          {loading ? t('loading') : t('signIn')}
        </Button>
      </Box>
    </Card>
  );
}
