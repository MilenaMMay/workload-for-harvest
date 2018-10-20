import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import StackedBarChart from '../components/StackedBarChart'

storiesOf('StackedBarChart', module)
  .add('without data', () => <StackedBarChart />)
