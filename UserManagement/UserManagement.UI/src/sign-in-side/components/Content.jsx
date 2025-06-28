import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { SitemarkIcon } from './CustomIcons';

export default function Content() {
  const { t } = useTranslation();

  const items = [
    {
      icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
      title: t('roleBasedAccessControl'),
      description: t('roleBasedAccessControlDesc'),
    },
    {
      icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
      title: t('secureScalableArchitecture'),
      description: t('secureScalableArchitectureDesc'),
    },
    {
      icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
      title: t('manageUsersEfficiently'),
      description: t('manageUsersEfficientlyDesc'),
    },
    {
      icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
      title: t('designedForRealTeams'),
      description: t('designedForRealTeamsDesc'),
    },
  ];

  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        {/* <SitemarkIcon /> */}
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
