import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const StatsCard = ({ title, value, icon, color, linkTo, linkText }) => {
  // Convert Bootstrap color to MUI color
  const getColor = (bsColor) => {
    const colorMap = {
      primary: 'primary',
      success: 'success',
      info: 'info',
      warning: 'warning',
      danger: 'error',
      secondary: 'secondary'
    };
    return colorMap[bsColor] || 'primary';
  };

  // Convert to hexadecimal color for icon
  const getIconColor = (bsColor) => {
    const colorMap = {
      primary: '#fc5223',  // Our primary orange
      success: '#5cb85c',
      info: '#5bc0de',
      warning: '#f0ad4e',
      danger: '#d9534f',
      secondary: '#6c757d'
    };
    return colorMap[bsColor] || '#fc5223';
  };

  const muiColor = getColor(color);
  const iconColor = getIconColor(color);

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderLeft: 4,
        borderColor: iconColor,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="overline" color={muiColor} sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 48, 
            height: 48, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(0,0,0,0.1)' 
          }}>
            <FontAwesomeIcon icon={icon} size="lg" style={{ color: iconColor }} />
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Button 
          component={Link} 
          to={linkTo} 
          variant="outlined" 
          color={muiColor}
          fullWidth
          size="small"
        >
          {linkText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatsCard;