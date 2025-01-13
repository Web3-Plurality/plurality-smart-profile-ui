import ItemLayout from './ItemLayout';

import Interests from './InterestPills';
import Scores from './UserScores';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


export const ProfileItems = (activeKey: string | string[] | undefined) => [
    {
        key: '1',
        label: 'Interests',
        children: (
            <ItemLayout>
                <Interests />
            </ItemLayout>
        ),
        bottomDivider: activeKey !== '1' && activeKey?.[0] !== '1',
    },
    {
        key: '2',
        label: 'Reputations',
        children: (
            <ItemLayout>
                {'No Reputations'}
            </ItemLayout>
        ),
        bottomDivider: activeKey !== '2' && activeKey?.[0] !== '2',
    },
    {
        key: '3',
        label: 'Scores',
        children: (
            <ItemLayout>
                <Scores />
            </ItemLayout>
        ),
        bottomDivider: activeKey !== '3' && activeKey?.[0] !== '3',
    },
    {
        key: '4',
        label: 'Other',
        children: (
            <ItemLayout>
                {text}
            </ItemLayout>
        ),
        bottomDivider: activeKey !== '4' && activeKey?.[0] !== '4',
    },
];
