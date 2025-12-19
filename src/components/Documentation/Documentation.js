import React from 'react';
import {
  Routes, // Switch replaced by Routes
  Route,
  Navigate,
  useLocation, // To track current URL
} from 'react-router-dom';

// ... styles and pages imports stay the same ...

const Documentation = () => {
  let layoutState = useLayoutState();
  const classes = useStyles();
  const location = useLocation(); // Replaces window.location.hash for v6 logic

  return (
    <div className={classes.root}>
      <Header />
      <Sidebar structure={structure} />
      <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
        <div className={classes.fakeToolbar} />
        
        {/* Breadcrumb Logic using location.pathname */}
        <Widget disableWidgetMenu inheritHeight className={classes.margin}>
          <Grid container direction='row' justifyContent='space-between' alignItems='center'>
            {structure.map((c) => {
              // Updated to check location.pathname instead of window.location.hash
              if (!c.children && location.pathname.includes(c.link) && c.link) {
                return (
                  <Box display='flex' alignItems='center' key={c.id}>
                    <Typography variant='h4'>{c.label}</Typography>
                  </Box>
                );
              } else if (c.children) {
                 const activeChild = c.children.find(child => location.pathname.includes(child.link));
                 if (activeChild) {
                   return (
                    <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} key={c.id}>
                      <Typography variant={'h6'}>{c.label}</Typography>
                      <Typography color='primary' variant={'h6'}>{activeChild.label}</Typography>
                    </Breadcrumbs>
                   );
                 }
              }
              return null;
            })}
          </Grid>
        </Widget>

        {/* Updated Routing Container */}
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="getting-started/quick-start" replace />} />
          
          {/* Documentation Routes (Relative to current path) */}
          <Route path="getting-started/quick-start" element={<Start />} />
          <Route path="components/typography" element={<TypographyPage />} />
          <Route path="components/header" element={<HeaderPage />} />
          <Route path="components/sidebar" element={<SidebarPage />} />
          <Route path="components/buttons" element={<ButtonsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Documentation; // Export directly without withRouter
