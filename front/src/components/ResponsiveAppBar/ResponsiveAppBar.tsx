import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const pages = [
	['Words', ''],
	['Files', 'files'],
	['Labels', 'labels'],
	['Statistics', 'statistics'],
];

export const ResponsiveAppBar = () => {
	return (
		<AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
	          variant="h6"
	          noWrap
	          component="a"
	          href="/"
	          sx={{
		          mr: 2,
		          display: { xs: 'none', md: 'flex' },
		          fontFamily: 'monospace',
		          fontWeight: 700,
		          letterSpacing: '.3rem',
		          color: 'inherit',
		          textDecoration: 'none',
	          }}
          >
            Words Search
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(([name, route]) => (
	            <Link key={name} to={`/${route}`} style={{ textDecoration: 'none' }}>
	              <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                      {name}
								</Button>
							</Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
	);
};
