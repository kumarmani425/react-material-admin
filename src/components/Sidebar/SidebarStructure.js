import React from 'react';
import {
  Home as HomeIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  BarChart as ChartIcon,
  Map as MapIcon,
  Apps as CoreIcon,
  Description as DescriptionIcon,
  ShoppingCart as ShoppingCartIcon,
  StarBorder as ExtraIcon,
  AddCircle as AddSectionIcon,
  FolderOpen as FolderIcon,
  Description as DocumentationIcon,
  Person as PersonIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import ViewCompactRoundedIcon from '@mui/icons-material/ViewCompactRounded';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import NaturePeopleOutlinedIcon from '@mui/icons-material/NaturePeopleOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import Person3Icon from '@mui/icons-material/Person3';
import FollowTheSignsOutlinedIcon from '@mui/icons-material/FollowTheSignsOutlined';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
// components
import Dot from './components/Dot';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import TimelineIcon from '@mui/icons-material/Timeline';
import HandshakeIcon from "@mui/icons-material/Handshake";

const structure = [


  { id: 1, label: 'Stock', link: '/app/stock', icon: <CategoryIcon /> },

  { id: 1, label: 'Dashboard', link: '/app/dashboard', icon: <HomeIcon /> },
  {
    id: 2,
    label: 'Dipositor',

    badgeColor: 'success',
    link: '/app/ecommerce',
    icon: <Person3Icon />,
    children: [
      {
        label: 'Create Dipositor',
        link: '/app/create/dipositor',
      },
      {
        label: 'Dipositor List',
        link: '/app/dipositorList',
      }

    ],
  }, {
    id: 2,
    label: 'Traders',
    badgeColor: 'success',
    link: '/app/ecommerce',
    icon: <SocialDistanceIcon />,
    children: [
      {
        label: 'Create Trader',
        link: '/app/createbns/trader?type=trader',

      },
      {
        label: 'Trader List',
        link: '/app/tradersList',
      }
    ],

  }, {
    id: 2,
    label: 'Buyer',
    badgeColor: 'success',
    link: '/app/ecommerce',
    icon: <ConnectWithoutContactIcon />,
    children: [
      {
        label: 'Create Buyer',
        link: '/app/createbns/buyer?type=buyer',

      },
      {
        label: 'Buyer List',
        link: '/app/buyersList',
      }
    ],

  }, {
    id: 2,
    label: 'Village',
    badgeColor: 'success',
    link: '/app/village',
    icon: <FollowTheSignsOutlinedIcon />,
    children: [

      {
        label: 'Create State',
        link: '/app/createState',

      },
      {
        label: 'Create District',
        link: '/app/createDistrict',


      },
      {
        label: 'Create Mandal',
        link: '/app/createMandal',


      }, {
        label: 'Create Village',
        link: '/app/createVillage',
      },
    ],
  },
  {
    id: 2,
    label: 'User',
    badgeColor: 'success',
    link: '/app/village',
    icon: <PeopleAltIcon />,
    children: [

      {
        label: 'Create User',
        link: '/app/create/user',

      },
      {
        label: 'User List',
        link: '/app/userList',
      },
    ],
  }, {
    id: 3,
    label: 'Scroll',
    link: '/app/scroll',
    icon: <DocumentationIcon />,
  }, {
    id: 3,
    label: 'Day Trading',
    link: '/app/dayTrading',
    icon: <TimelineIcon />,
  },
  {
    id: 2,
    label: 'Bns Person',
    badgeColor: 'success',
    link: '/app/ecommerce',
    icon: <AdminPanelSettingsIcon />,
    children: [
      {
        label: 'Create Bns Person',
        link: '/app/createbns/bnsPerson',

      },
      {
        label: 'Bns Person List',
        link: '/app/tradersList',
      }
    ],

  }, {
    id: 3,
    label: 'Person',
    badgeColor: 'success',
    link: '/app/ecommerce',
    icon: <PersonPinCircleIcon />,
    children: [
      {
        label: 'Create Person',
        link: '/app/createSeller',

      },
      {
        label: 'Person List',
        link: '/app/personList',
      },
    ],

  },
  {
    id: 2,
    label: 'Other',
    badgeColor: 'success',
    link: '/app/village',
    icon: <MovieFilterIcon />,
    children: [

      {
        label: 'Coconut Category',
        link: '/app/create/coconutCategory',
      },
      {
        label: 'Coconut Category',
        link: '/app/create/Dalal',
      },
    ],
  },
];

export default structure;
