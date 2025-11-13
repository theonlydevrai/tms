/**
 * Admin Dashboard Page
 * For managing movies, screenings, and viewing reports
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters as TheatersIcon,
  Assessment as ReportIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [movies, setMovies] = useState<any[]>([]);  // Initialize as empty array
  const [screenings, setScreenings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalMovies: 0, totalBookings: 0, totalRevenue: 0 }); // Initialize with defaults
  const [addMovieOpen, setAddMovieOpen] = useState(false);
  const [editMovieOpen, setEditMovieOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state for screenings
  const [addScreeningOpen, setAddScreeningOpen] = useState(false);
  const [auditoriums, setAuditoriums] = useState<any[]>([]);
  const [screeningForm, setScreeningForm] = useState({
    movie_id: '',
    auditorium_id: '',
    start_time: '',
    base_ticket_price: '',
  });
  
  const [movieForm, setMovieForm] = useState({
    title: '',
    synopsis: '',
    duration_in_minutes: '',
    genre: '',
    language: '',
    rating: '',
    poster_url: '',
    trailer_url: '',
    release_date: '',
    is_active: true,
  });

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.user_type !== 'ADMINISTRATOR') {
        alert('Access denied! Admin only.');
        navigate('/');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load movies
      const moviesRes = await fetch('http://localhost:5000/api/movies');
      const moviesData = await moviesRes.json();
      
      console.log('Movies API Response:', moviesData); // Debug log
      
      // Handle response structure: { status: 'success', data: { movies: [...] } }
      let moviesList: any[] = [];
      if (moviesData.data && moviesData.data.movies) {
        moviesList = moviesData.data.movies;
      } else if (Array.isArray(moviesData.data)) {
        moviesList = moviesData.data;
      } else if (Array.isArray(moviesData)) {
        moviesList = moviesData;
      }
      
      setMovies(Array.isArray(moviesList) ? moviesList : []);

      // Load auditoriums
      try {
        const audRes = await fetch('http://localhost:5000/api/auditoriums');
        const audData = await audRes.json();
        const audList = Array.isArray(audData) ? audData : (audData.data || []);
        setAuditoriums(Array.isArray(audList) ? audList : []);
      } catch (error) {
        console.error('Failed to load auditoriums:', error);
        setAuditoriums([]);
      }

      // Load stats - fetch real booking and revenue data
      try {
        const token = localStorage.getItem('accessToken');
        
        // Fetch all bookings (admin endpoint)
        const bookingsRes = await fetch('http://localhost:5000/api/bookings/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        let totalBookings = 0;
        let totalRevenue = 0;
        
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          const bookings = bookingsData.data?.bookings || bookingsData.data || [];
          totalBookings = Array.isArray(bookings) ? bookings.length : 0;
          totalRevenue = Array.isArray(bookings) 
            ? bookings.reduce((sum: number, booking: any) => sum + (parseFloat(booking.total_amount) || 0), 0) 
            : 0;
        }
        
        setStats({
          totalMovies: moviesList.length || 0,
          totalBookings,
          totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({
          totalMovies: moviesList.length || 0,
          totalBookings: 0,
          totalRevenue: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setMovies([]); // Ensure movies is always an array
      setAuditoriums([]);
      setStats({
        totalMovies: 0,
        totalBookings: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddMovie = () => {
    setMovieForm({
      title: '',
      synopsis: '',
      duration_in_minutes: '',
      genre: '',
      language: '',
      rating: '',
      poster_url: '',
      trailer_url: '',
      release_date: '',
      is_active: true,
    });
    setSelectedMovie(null);
    setAddMovieOpen(true);
  };

  const handleEditMovie = (movie: any) => {
    setMovieForm({
      title: movie.title,
      synopsis: movie.synopsis,
      duration_in_minutes: movie.duration_in_minutes.toString(),
      genre: movie.genre,
      language: movie.language,
      rating: movie.rating,
      poster_url: movie.poster_url || '',
      trailer_url: movie.trailer_url || '',
      release_date: movie.release_date ? movie.release_date.split('T')[0] : '',
      is_active: movie.is_active === 1,
    });
    setSelectedMovie(movie);
    setEditMovieOpen(true);
  };

  const handleSaveMovie = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = selectedMovie 
        ? `http://localhost:5000/api/movies/${selectedMovie.movie_id}`
        : 'http://localhost:5000/api/movies';
      
      const method = selectedMovie ? 'PUT' : 'POST';
      
      // Convert frontend format to backend format
      const payload = {
        title: movieForm.title,
        synopsis: movieForm.synopsis || 'No synopsis available',
        durationInMinutes: parseInt(movieForm.duration_in_minutes),
        genre: movieForm.genre,
        language: movieForm.language,
        rating: movieForm.rating || 'U',
        posterUrl: movieForm.poster_url || '',
        trailerUrl: movieForm.trailer_url || '',
        releaseDate: movieForm.release_date || new Date().toISOString().split('T')[0],
        isActive: movieForm.is_active,
      };

      console.log('Sending payload:', payload); // Debug log
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(selectedMovie ? 'Movie updated successfully!' : 'Movie added successfully!');
        setAddMovieOpen(false);
        setEditMovieOpen(false);
        loadDashboardData();
      } else {
        const error = await response.json();
        console.error('Validation error:', error);
        alert(`Error: ${error.message || 'Failed to save movie'}`);
      }
    } catch (error) {
      console.error('Failed to save movie:', error);
      alert('Failed to save movie. Please try again.');
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await fetch(`http://localhost:5000/api/movies/${movieId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        loadDashboardData();
      } catch (error) {
        console.error('Failed to delete movie:', error);
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage movies, screenings, and view reports
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Movies
                  </Typography>
                  <Typography variant="h4">{stats.totalMovies}</Typography>
                </Box>
                <MovieIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Bookings
                  </Typography>
                  <Typography variant="h4">{stats.totalBookings}</Typography>
                </Box>
                <TheatersIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">₹{stats.totalRevenue}</Typography>
                </Box>
                <ReportIcon sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Movies" icon={<MovieIcon />} iconPosition="start" />
          <Tab label="Screenings" icon={<TheatersIcon />} iconPosition="start" />
          <Tab label="Reports" icon={<ReportIcon />} iconPosition="start" />
        </Tabs>

        {/* Movies Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">Manage Movies</Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddMovie}
                sx={{ mr: 1 }}
              >
                Add Movie
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadDashboardData}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Loading movies...</Typography>
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(movies) || movies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No movies found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  Array.isArray(movies) && movies.map((movie) => (
                    <TableRow key={movie.movie_id}>
                      <TableCell>{movie.title}</TableCell>
                      <TableCell>{movie.genre}</TableCell>
                      <TableCell>{movie.duration_in_minutes} min</TableCell>
                      <TableCell>{movie.language}</TableCell>
                      <TableCell>
                        <Chip
                          label={movie.is_active ? 'Active' : 'Inactive'}
                          color={movie.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleEditMovie(movie)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMovie(movie.movie_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Screenings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">Manage Screenings</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddScreeningOpen(true)}
            >
              Add Screening
            </Button>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Screening management: Add showtimes for movies in different auditoriums.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            To view screenings, go to the Movies page and select a movie.
          </Typography>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Reports & Analytics
          </Typography>
          <Alert severity="info">
            Reports and analytics coming soon! This will show revenue, occupancy, and booking statistics.
          </Alert>
        </TabPanel>
      </Paper>

      {/* Add/Edit Movie Dialog */}
      <Dialog open={addMovieOpen || editMovieOpen} onClose={() => { setAddMovieOpen(false); setEditMovieOpen(false); }} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={movieForm.title}
              onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
            />
            
            <TextField
              label="Synopsis"
              fullWidth
              multiline
              rows={3}
              value={movieForm.synopsis}
              onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (minutes)"
                  fullWidth
                  required
                  type="number"
                  value={movieForm.duration_in_minutes}
                  onChange={(e) => setMovieForm({ ...movieForm, duration_in_minutes: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Genre"
                  fullWidth
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                  placeholder="e.g., Action, Drama, Comedy"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Language"
                  fullWidth
                  value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                  placeholder="e.g., English, Hindi"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Rating"
                  fullWidth
                  required
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select rating</option>
                  <option value="U">U (Universal)</option>
                  <option value="UA">UA (Parental Guidance)</option>
                  <option value="A">A (Adults Only)</option>
                  <option value="S">S (Restricted)</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Poster URL"
                  fullWidth
                  value={movieForm.poster_url}
                  onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })}
                  placeholder="https://example.com/poster.jpg"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Trailer URL (YouTube)"
                  fullWidth
                  value={movieForm.trailer_url}
                  onChange={(e) => setMovieForm({ ...movieForm, trailer_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Release Date"
                  fullWidth
                  type="date"
                  value={movieForm.release_date}
                  onChange={(e) => setMovieForm({ ...movieForm, release_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={movieForm.is_active}
                      onChange={(e) => setMovieForm({ ...movieForm, is_active: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddMovieOpen(false); setEditMovieOpen(false); }}>Cancel</Button>
          <Button onClick={handleSaveMovie} variant="contained" color="primary">
            {selectedMovie ? 'Update' : 'Add'} Movie
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Screening Dialog */}
      <Dialog open={addScreeningOpen} onClose={() => setAddScreeningOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Screening</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Movie"
              fullWidth
              required
              value={screeningForm.movie_id}
              onChange={(e) => setScreeningForm({ ...screeningForm, movie_id: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select a movie</option>
              {Array.isArray(movies) && movies.map((movie) => (
                <option key={movie.movie_id} value={movie.movie_id}>
                  {movie.title}
                </option>
              ))}
            </TextField>

            <TextField
              select
              label="Auditorium"
              fullWidth
              required
              value={screeningForm.auditorium_id}
              onChange={(e) => setScreeningForm({ ...screeningForm, auditorium_id: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select an auditorium</option>
              {Array.isArray(auditoriums) && auditoriums.map((aud) => (
                <option key={aud.auditorium_id} value={aud.auditorium_id}>
                  {aud.name} (Screen {aud.screen_number}) - Capacity: {aud.capacity}
                </option>
              ))}
            </TextField>

            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              required
              value={screeningForm.start_time}
              onChange={(e) => setScreeningForm({ ...screeningForm, start_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Ticket Price (₹)"
              type="number"
              fullWidth
              required
              value={screeningForm.base_ticket_price}
              onChange={(e) => setScreeningForm({ ...screeningForm, base_ticket_price: e.target.value })}
              placeholder="e.g., 200"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddScreeningOpen(false)}>Cancel</Button>
          <Button 
            onClick={async () => {
              try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:5000/api/screenings', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify(screeningForm),
                });

                if (response.ok) {
                  alert('Screening added successfully!');
                  setAddScreeningOpen(false);
                  setScreeningForm({
                    movie_id: '',
                    auditorium_id: '',
                    start_time: '',
                    base_ticket_price: '',
                  });
                } else {
                  const error = await response.json();
                  alert(`Error: ${error.message || 'Failed to add screening'}`);
                }
              } catch (error) {
                console.error('Failed to add screening:', error);
                alert('Failed to add screening. Please try again.');
              }
            }}
            variant="contained" 
            color="primary"
          >
            Add Screening
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
