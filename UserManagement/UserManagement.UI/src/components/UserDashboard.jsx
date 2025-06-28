import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import LanguageSwitcher from './LanguageSwitcher';

const UserDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  
  // Helper function to translate role names
  const translateRole = (role) => {
    switch (role) {
      case 'Admin': return t('admin');
      case 'Viewer': return t('viewer');
      case 'User': return t('user');
      case 'SelfOnly': return t('selfOnly');
      default: return role;
    }
  };
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const profileData = await userService.getUserProfile();
      setUserProfile(profileData);
      setError('');
    } catch (err) {
      setError(t('unableToLoadProfile') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Viewer': return 'warning';
      case 'User': return 'info';
      case 'SelfOnly': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('dashboard')} - {t('welcome')}, {user?.username}!
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.access}
          </Typography>
          <LanguageSwitcher />
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogoutIcon />}
          >
            {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              <Typography variant="h6">
                {t('userAccess')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('userAccessDescription')}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          {t('myProfile')}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : userProfile ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('personalInformation')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('userId')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userProfile.id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('username')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userProfile.username}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('fullName')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userProfile.name || t('notSpecified')}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('role')}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={translateRole(userProfile.role)} 
                      color={getRoleColor(userProfile.role)} 
                      size="small" 
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {t('description')}
                  </Typography>
                  <Typography variant="body1">
                    {userProfile.description || t('noDescriptionProvided')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('accountStatus')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('accessLevel')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.access}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('accountType')}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {t('standardUser')}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t('status')}
                  </Typography>
                  <Chip 
                    label={t('active')} 
                    color="success" 
                    size="small" 
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {t('unableToLoadProfile')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserDashboard;
