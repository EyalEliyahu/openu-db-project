// @ts-nocheck
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const pages = [
  ['Words', ''],
  ['Files', 'files'],
  ['Labels & Expressions', 'labels_and_expressions'],
  ['Statistics', 'statistics'],
];

export const ResponsiveAppBar = () => {
  const ref = React.useRef<HTMLDivElement>();
  const exportData = async () => {
    const res = await fetch('http://localhost:8000/export_xml')
    const xmlText = await res.json();
    const element = document.createElement('a');
    const file = new Blob([xmlText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'export.xml';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        const xmlContent = evt?.target?.result as string;
        console.log(xmlContent);
        fetch('http://localhost:8000/import_xml', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: xmlContent,
          }),
        }).then(() => {
          window.location.reload();
        });
      }
    }
    
  }
  return (
    <AppBar position="static">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              ml: 4,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Concordance
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
          <div style={{ marginRight: 20, display: 'flex', gap: 20, }}>
            <Button onClick={() => {ref.current.click()}}>
              <div>
                <ArrowDownwardIcon sx={{ fontSize: 40, color: 'white', }}/>
                <p style={{ fontSize: 12, color: 'white', }}>Import</p>
              </div>
              
              <input ref={ref} type="file" hidden onChange={importData} accept=".xml"/>
            </Button>
            <Button onClick={exportData}>
              <div>
                <ArrowUpwardIcon sx={{ fontSize: 40, color: 'white', }}/>
                <p style={{ fontSize: 12, color: 'white', }}>Export</p>
              </div>
            </Button>
          </div>
        </Toolbar>
    </AppBar>
  );
};

