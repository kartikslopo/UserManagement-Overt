import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
  TablePagination,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import LanguageSwitcher from './LanguageSwitcher';

const AdminDashboard = () => {
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
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0); // Material-UI uses 0-based pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const [formData, setFormData] = useState({
    username: '',
    passwordHash: '',
    role: '',
    name: '',
    description: '',
  });

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0); // Reset to first page when searching
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
        page + 1, // Convert to 1-based pagination for API
        rowsPerPage,
        searchTerm,
        sortBy,
        sortDirection
      );
      
      setUsers(response.data);
      setTotalCount(response.totalCount);
      setError('');
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
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

  const handleAddUser = () => {
    setDialogMode('add');
    setFormData({
      username: '',
      passwordHash: '',
      role: '',
      name: '',
      description: '',
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      passwordHash: '', // Don't show existing password
      role: user.role,
      name: user.name,
      description: user.description,
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dialogMode === 'add') {
        await userService.addUser(formData);
        setSuccess('User added successfully');
      } else {
        await userService.updateUser(selectedUser.id, formData);
        setSuccess('User updated successfully');
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      setError(`Failed to ${dialogMode} user: ` + err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1">
            {t('userManagement')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              {t('addNewUser')}
            </Button>
          </Box>
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
                      <TableCell>Actions</TableCell>
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
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditUser(user)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogMode === 'add' ? t('addNewUser') : t('editUser')}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="username"
                label={t('username')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={dialogMode === 'edit'}
              />
              <TextField
                margin="dense"
                name="passwordHash"
                label={dialogMode === 'add' ? t('password') : t('newPassword')}
                type="password"
                fullWidth
                variant="outlined"
                value={formData.passwordHash}
                onChange={handleInputChange}
                required={dialogMode === 'add'}
              />
              <TextField
                margin="dense"
                name="name"
                label={t('fullName')}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <FormControl fullWidth margin="dense" variant="outlined" required>
                <InputLabel>{t('role')}</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label={t('role')}
                >
                  <MenuItem value="Admin">{t('admin')}</MenuItem>
                  <MenuItem value="Viewer">{t('viewer')}</MenuItem>
                  <MenuItem value="User">{t('user')}</MenuItem>
                  <MenuItem value="SelfOnly">{t('selfOnly')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="description"
                label={t('description')}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {dialogMode === 'add' ? 'Add User' : 'Update User'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
