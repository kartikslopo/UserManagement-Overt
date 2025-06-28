import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import LanguageSwitcher from './LanguageSwitcher';

const ViewerDashboard = () => {
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0);
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch users when page, pageSize, or sort changes
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, sortBy, sortDirection]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(
        page + 1,
        rowsPerPage,
        searchTerm,
        sortBy,
        sortDirection
      );
      
      setUsers(response.data);
      setTotalCount(response.totalCount);
      setError('');
    } catch (err) {
      setError(t('failedToFetchUsers') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, sortBy, sortDirection]);

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
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

  const sortableColumns = [
    { id: 'Id', label: t('id') },
    { id: 'Username', label: t('username') },
    { id: 'Name', label: t('fullName') },
    { id: 'Role', label: t('role') },
  ];

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

        <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon />
              <Typography variant="h6">
                {t('viewerAccess')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('viewerAccessDescription')}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1">
              {t('usersOverview')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {t('totalUsers')}: {totalCount}
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder={t('searchUsers')}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {sortableColumns.map((column) => (
                        <TableCell key={column.id}>
                          <TableSortLabel
                            active={sortBy === column.id}
                            direction={sortBy === column.id ? sortDirection : 'asc'}
                            onClick={() => handleSort(column.id)}
                          >
                            {column.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={translateRole(user.role)} 
                            color={getRoleColor(user.role)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{user.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </Paper>

        {users.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {t('noUsersFound')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ViewerDashboard;
