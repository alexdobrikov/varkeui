import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircleIcon } from '../../icons';
import { Banner } from '../Banner';
import { Chip } from '../Chip';
import { Skeleton } from '../Skeleton';

const meta = {
  title: 'Examples/Feedback',
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;

export const Readme: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 460 }}>
      <Banner tone="warning" title="Storage almost full">
        Free up space to keep backing up photos.
      </Banner>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Chip selected>All</Chip>
        <Chip>Breakfast</Chip>
        <Chip>Dinner</Chip>
        <Chip onRemove={() => {}}>Vegetarian</Chip>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Skeleton variant="circle" width={48} animated={false} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="45%" animated={false} />
          <Skeleton variant="text" width="75%" animated={false} />
        </div>
      </div>
      <div
        className="vui-toast vui-toast--success"
        style={{ animation: 'none', alignSelf: 'center', width: 360 }}
      >
        <span className="vui-toast__icon">
          <CheckCircleIcon />
        </span>
        <div className="vui-toast__body">
          <div className="vui-toast__message">Playlist downloaded</div>
        </div>
      </div>
    </div>
  ),
};
