import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  bscTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Silens',
  projectId: `${process.env.NEXT_PUBLIC_PROJECT_ID}`,
  chains: [
    bscTestnet,
  ],
  ssr: true,
});
