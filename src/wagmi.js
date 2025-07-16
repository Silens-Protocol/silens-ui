import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  scrollSepolia,
  bscTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Silens',
  projectId: `${process.env.NEXT_PUBLIC_PROJECT_ID}`,
  chains: [
    scrollSepolia,
    bscTestnet,
  ],
  ssr: true,
});
